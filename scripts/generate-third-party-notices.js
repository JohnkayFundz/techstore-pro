#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scopes = [
  { name: "root", base: root, lock: path.join(root, "package-lock.json") },
  { name: "backend", base: path.join(root, "server"), lock: path.join(root, "server", "package-lock.json") },
];
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const isLicenseFile = (name) => /(^|[-_.])(licen[cs]e|copying|notice|copyright)([-_.]|$)/i.test(name);
const findLicenseFiles = (dir, relative = "", depth = 0) => {
  if (depth > 10) return [];
  const found = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (item.isSymbolicLink() || item.name === "node_modules" || item.name === ".git") continue;
    const rel = path.join(relative, item.name);
    const absolute = path.join(dir, item.name);
    if (item.isFile() && isLicenseFile(item.name)) found.push({ absolute, relative: rel });
    else if (item.isDirectory()) found.push(...findLicenseFiles(absolute, rel, depth + 1));
  }
  return found.sort((a, b) => a.relative.localeCompare(b.relative));
};
const entries = [];
const unresolved = [];

for (const scope of scopes) {
  const lock = readJson(scope.lock);
  for (const [lockPath, locked] of Object.entries(lock.packages || {})) {
    if (!lockPath || locked.dev === true) continue;
    const packageDir = path.resolve(scope.base, lockPath);
    const manifestPath = path.join(packageDir, "package.json");
    if (!fs.existsSync(manifestPath)) {
      unresolved.push(`${scope.name}:${lockPath}: installed package missing`);
      continue;
    }
    const manifest = readJson(manifestPath);
    if (manifest.version !== locked.version) {
      unresolved.push(`${scope.name}:${lockPath}: expected ${locked.version}, found ${manifest.version}`);
      continue;
    }
    const files = findLicenseFiles(packageDir);
    const texts = files.map(({ absolute, relative }) => ({ file: relative.split(path.sep).join("/"), rootLevel: !relative.includes(path.sep), text: fs.readFileSync(absolute, "utf8").trim() })).filter((x) => x.text);
    const rootTexts = texts.filter((x) => x.rootLevel);
    const copyright = [...new Set([
      ...(manifest.author ? [typeof manifest.author === "string" ? manifest.author : JSON.stringify(manifest.author)] : []),
      ...texts.flatMap(({ text }) => text.split(/\r?\n/).slice(0, 12).filter((line) => /copyright/i.test(line))),
    ])];
    if (!rootTexts.length) unresolved.push(`${scope.name}:${lockPath}: no package-root LICENSE/COPYING/NOTICE file found (nested notices, if any, are included for review)`);
    entries.push({
      scope: scope.name,
      name: manifest.name || lockPath.split("node_modules/").pop(),
      version: manifest.version,
      spdx: typeof locked.license === "string" ? locked.license : "UNKNOWN",
      copyright,
      texts,
      digest: texts.map((x) => crypto.createHash("sha256").update(x.text).digest("hex")),
    });
  }
}

const lines = [
  "# TechStore Pro — Third-Party Notices",
  "",
  unresolved.length ? "**STATUS: INCOMPLETE — DO NOT DISTRIBUTE.**" : "**STATUS: COMPLETE COLLECTION — human/legal review still required.**",
  "",
  "Generated from the exact root and backend npm lockfiles and matching installed package contents. License/notice files are recursively collected within each package, while a missing package-root license remains unresolved. Nested vendor notices do not replace the package own-license requirement. This collection is not legal advice or a legal clearance opinion.",
  "",
  `Production package entries: ${entries.length}. Unresolved entries: ${unresolved.length}.`,
  "",
  "## Package register",
  "",
  "| Scope | Package | Version | SPDX expression | Copyright / notice header |",
  "|---|---|---:|---|---|",
  ...entries.map((entry) => `| ${entry.scope} | \`${entry.name}\` | \`${entry.version}\` | \`${entry.spdx}\` | ${entry.copyright.length ? entry.copyright.map((x) => x.replaceAll("|", "\\\\|")).join("<br>") : "Not stated in package metadata/license header"} |`),
  "",
  "## Full upstream license and notice texts",
  "",
];
const emitted = new Set();
for (const entry of entries) {
  for (const item of entry.texts) {
    const digest = crypto.createHash("sha256").update(item.text).digest("hex");
    if (emitted.has(digest)) continue;
    emitted.add(digest);
    lines.push(`### ${entry.name}@${entry.version} — ${item.file}`, "", "```text", item.text, "```", "");
  }
}
if (unresolved.length) {
  lines.push("## Unresolved — exact package content required", "", ...unresolved.map((x) => `- ${x}`), "");
} else {
  lines.push("<!-- RELEASE-NOTICES-COMPLETE -->", "");
}
fs.writeFileSync(path.join(root, "THIRD-PARTY-NOTICES.md"), lines.join("\n"), "utf8");
console.log(`Wrote THIRD-PARTY-NOTICES.md: ${entries.length} production package entries; ${unresolved.length} unresolved.`);
if (unresolved.length) process.exitCode = 2;
