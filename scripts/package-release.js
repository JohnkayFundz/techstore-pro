#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { spawn, spawnSync } from "node:child_process";
import { pipeline } from "node:stream/promises";
import { createWriteStream } from "node:fs";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const staging = path.join(root, ".release-staging");
const artifacts = path.join(root, "release-artifacts");
const releaseName = "techstore-pro-release";
const run = (command, args, cwd = root) => new Promise((resolve, reject) => {
  const child = spawn(command, args, { cwd, stdio: "inherit", shell: false });
  child.once("error", reject);
  child.once("exit", (code) => code === 0 ? resolve() : reject(new Error(`${command} exited with ${code}`)));
});
const copy = (from, to) => fs.cpSync(from, to, { recursive: true, force: true, filter: (source) => {
  const name = path.basename(source);
  return name !== "node_modules" && name !== ".git" && name !== ".env" && !name.startsWith(".env.");
}});
const fail = (message) => { console.error(`RELEASE BLOCKED: ${message}`); process.exit(1); };

try {
  if (!fs.existsSync(path.join(root, "package-lock.json")) || !fs.existsSync(path.join(root, "server", "package-lock.json"))) fail("Both committed npm lockfiles are required.");
  if (!fs.existsSync(path.join(root, "COMMERCIAL_LICENSE.md"))) fail("Reviewed buyer-facing COMMERCIAL_LICENSE.md is missing. The draft is not substituted.");
  await run("npm", ["run", "build"]);
  await run("node", ["scripts/generate-third-party-notices.js"]);
  const notices = fs.readFileSync(path.join(root, "THIRD-PARTY-NOTICES.md"), "utf8");
  if (!notices.includes("<!-- RELEASE-NOTICES-COMPLETE -->")) fail("Third-party notice collection is incomplete; no archive will be produced.");
  const dist = path.join(root, "dist");
  if (!fs.existsSync(path.join(dist, "index.html"))) fail("Frontend build did not produce dist/index.html.");
  fs.rmSync(staging, { recursive: true, force: true });
  fs.mkdirSync(staging, { recursive: true });
  copy(dist, path.join(staging, "dist"));

  const backend = path.join(staging, "backend");
  fs.mkdirSync(backend, { recursive: true });
  for (const dir of ["config", "controllers", "middleware", "models", "routes", "utils"]) {
    const source = path.join(root, "server", dir);
    if (fs.existsSync(source)) copy(source, path.join(backend, dir));
  }
  for (const file of ["app.js", "server.js", "package.json", "package-lock.json"]) {
    const source = path.join(root, "server", file);
    if (!fs.existsSync(source)) fail(`Backend runtime file missing: ${file}`);
    copy(source, path.join(backend, file));
  }

  const manifestPath = path.join(backend, "package.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (!manifest.dependencies || Object.keys(manifest.dependencies).length === 0) fail("Backend production dependencies are not declared.");
  delete manifest.devDependencies;
  delete manifest.scripts?.dev;
  delete manifest.scripts?.test;
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\\n");

  const tempInstall = await fs.promises.mkdtemp(path.join(os.tmpdir(), "techstore-backend-check-"));
  try {
    await fs.promises.cp(backend, tempInstall, { recursive: true });
    await run("npm", ["ci", "--omit=dev", "--no-audit", "--no-fund"], tempInstall);
    const runtimeFiles = [];
    const walk = (dir) => { for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      if (item.name === "node_modules") continue;
      const full = path.join(dir, item.name);
      if (item.isDirectory()) walk(full); else if (full.endsWith(".js")) runtimeFiles.push(full);
    }};
    walk(backend);
    for (const file of runtimeFiles) {
      const check = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
      if (check.status !== 0) throw new Error(`Backend syntax check failed: ${file}\\n${check.stderr}`);
    }
  } finally {
    await fs.promises.rm(tempInstall, { recursive: true, force: true });
  }

  fs.copyFileSync(path.join(root, "THIRD-PARTY-NOTICES.md"), path.join(staging, "THIRD-PARTY-NOTICES.md"));
  fs.copyFileSync(path.join(root, "COMMERCIAL_LICENSE.md"), path.join(staging, "COMMERCIAL_LICENSE.md"));
  const forbidden = [];
  const inspect = (dir) => { for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (["node_modules", "__tests__", "tests", "test", ".git"].includes(item.name)) forbidden.push(full);
      else inspect(full);
    } else if (/^\\.env($|\\.)/i.test(item.name) || /\\.(test|spec)\\.[cm]?js$/i.test(item.name)) forbidden.push(full);
  }};
  inspect(staging);
  if (forbidden.length) fail(`Forbidden development artifacts found: ${forbidden.join(", ")}`);

  fs.mkdirSync(artifacts, { recursive: true });
  const archive = path.join(artifacts, `${releaseName}.tar.gz`);
  const tar = spawn("tar", ["--sort=name", "--mtime=UTC 1970-01-01", "--owner=0", "--group=0", "--numeric-owner", "-cf", "-", "-C", staging, "."], { stdio: ["ignore", "pipe", "inherit"] });
  const gzip = spawn("gzip", ["-n", "-9"], { stdio: ["pipe", "pipe", "inherit"] });
  tar.stdout.pipe(gzip.stdin);
  const out = createWriteStream(archive);
  await pipeline(gzip.stdout, out);
  const [tarCode, gzipCode] = await Promise.all([
    new Promise((resolve) => tar.once("close", resolve)),
    new Promise((resolve) => gzip.once("close", resolve)),
  ]);
  if (tarCode !== 0 || gzipCode !== 0) fail("Deterministic tar/gzip process failed. GNU tar and gzip are required.");
  const hash = crypto.createHash("sha256").update(fs.readFileSync(archive)).digest("hex");
  fs.writeFileSync(`${archive}.sha256`, `${hash}  ${path.basename(archive)}\\n`);
  console.log(`Archive: ${archive}`);
  console.log(`SHA-256: ${hash}`);
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}
