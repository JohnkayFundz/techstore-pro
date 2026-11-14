# Third-Party Dependency License Review — Preliminary

**Status:** Preliminary metadata inventory only — NOT legal clearance.

This review was generated from the committed root and `server/` npm lockfiles on the product-preparation branch after the 2026-11-14 Capacitor reconciliation. Counts are lockfile package entries, excluding the root package itself. It records the license identifiers declared in package metadata. It does not replace inspection of each package's actual license text, notices, source-distribution obligations, trademark terms, or legal advice.

## Inventory

| Dependency tree | Locked package entries | Declared license metadata |
|---|---:|---|
| Frontend/root (after security updates) | 417 | MIT 328; ISC 32; Apache-2.0 18; BlueOak-1.0.0 12; MPL-2.0 12; BSD-2-Clause 6; BSD-3-Clause 4; Unlicense 2; CC-BY-4.0 1; 0BSD 1; MIT AND ISC 1 |
| Backend/server (after security updates) | 130 | MIT 113; Apache-2.0 5; ISC 5; BSD-3-Clause 3; BSD-2-Clause 2; license metadata unspecified for 2 |

## Items requiring attention

### Frontend
- `caniuse-lite` declares CC-BY-4.0.
- `lightningcss` and its platform packages declare MPL-2.0 (12 lockfile entries).
- `minimatch` declares BlueOak-1.0.0.
- `victory-vendor` declares the combined expression MIT AND ISC.
- The regenerated lockfile adds the Capacitor 8.6.2 CLI/core package entries and their dependency tree; the new dependency tree increases the root lockfile inventory from 324 to 408 entries.
- Two packages declare Unlicense in the regenerated lockfile; retain the exact license text/notices for those packages in any source archive.

### Backend
- `busboy@1.6.0` has no license identifier in the lockfile metadata.
- `streamsearch@1.1.0` has no license identifier in the lockfile metadata.
- `minimatch` declares BlueOak-1.0.0.

An unspecified lockfile license field does not prove that a package is unlicensed; its upstream package metadata and license files must be checked.

## Lockfile consistency finding

The earlier root lockfile mismatch was resolved on 2026-11-14. GitHub Actions Runs #128 and #129 regenerated the root lockfile with npm, verified that the root lockfile declarations match `package.json`, and passed `npm ci --ignore-scripts`. The backend manifest and lockfile declarations also match.

The two backend packages with absent modern SPDX `license` fields were checked against their exact upstream tags: `busboy@1.6.0` and `streamsearch@1.1.0` each include a legacy `licenses` array identifying MIT and an MIT-style `LICENSE` file. Preserve Brian White's copyright and the full permission/warranty text in the distributed third-party notices. The absence of a modern SPDX field is a metadata-format issue, not evidence that these packages are unlicensed.

## Redistribution checklist

Before publishing a paid source archive:

1. Inspect and retain applicable third-party license texts and notices for both dependency trees.
2. Resolve the two backend packages with unspecified lockfile license metadata.
3. Review MPL-2.0 distribution obligations for the exact Lightning CSS packages included in the delivered dependency tree; source-only delivery and shipping installed dependencies can have different implications.
4. Decide whether the product archive includes `node_modules`. Prefer delivering source plus lockfiles and having buyers install dependencies themselves; do not bundle installed dependencies without a complete notice review.
5. Reconcile the root package/lockfile mismatch and run clean installs, lint, build, and application-level checks in an actual Node environment.
6. Keep this inventory with the product and update it whenever dependencies change.

## Scope and ownership

The seller's commercial terms can cover only code and assets the seller is entitled to license. Third-party packages remain subject to their own licenses and terms. This inventory does not establish ownership of every image, font, icon, sample product asset, or other repository asset; those must be reviewed separately.

**Conclusion:** The repository can be prepared for a source-code product, but this metadata inventory is not sufficient to claim that all third-party redistribution obligations have been cleared.


## Follow-up verification — 2026-11-14

- Root lockfile consistency: **RESOLVED**; Capacitor declarations and resolved entries are now present in the committed lockfile.
- Root clean install: **PASS** in GitHub Actions Runs #128 and #129 using `npm ci --ignore-scripts`.
- Backend clean install: **PASS** in GitHub Actions Runs #128 and #129 using `npm ci`.
- `busboy@1.6.0`: upstream tag `v1.6.0` contains a legacy `licenses: [{ type: "MIT" }]` declaration and a full MIT-style `LICENSE` file.
- `streamsearch@1.1.0`: upstream tag `v1.1.0` contains a legacy `licenses: [{ type: "MIT" }]` declaration and a full MIT-style `LICENSE` file.

This resolves the two missing-license-metadata questions at the exact upstream versions reviewed. It does not constitute a complete audit of all dependency license texts, trademark terms, asset rights, or legal compliance. A consolidated notice file still needs to be included in the customer archive after the complete package/asset scope is finalized.


## Security verification update — 2026-11-14

GitHub Actions Run #142 passed `npm audit` for the complete root and backend dependency trees with **0 vulnerabilities** in each. Both clean installs passed. The committed lockfiles reflect the security updates. This is a point-in-time vulnerability scan, not a guarantee against future advisories, and it does not clear license obligations.
