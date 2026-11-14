# Third-Party Dependency License Review — Preliminary

**Status:** Preliminary metadata inventory only — NOT legal clearance.

This review was generated from the committed root and `server/` npm lockfiles on the product-preparation branch. It records the license identifiers declared in package metadata. It does not replace inspection of each package's actual license text, notices, source-distribution obligations, trademark terms, or legal advice.

## Inventory

| Dependency tree | Locked package entries | Declared license metadata |
|---|---:|---|
| Frontend/root | 324 | MIT 257; Apache-2.0 16; ISC 25; BSD-3-Clause 4; BSD-2-Clause 6; CC-BY-4.0 1; MPL-2.0 12; BlueOak-1.0.0 1; 0BSD 1; MIT AND ISC 1 |
| Backend/server | 165 | MIT 143; ISC 9; Apache-2.0 5; BSD-3-Clause 3; BSD-2-Clause 2; BlueOak-1.0.0 1; license metadata unspecified for 2 |

## Items requiring attention

### Frontend
- `caniuse-lite` declares CC-BY-4.0.
- `lightningcss` and its platform packages declare MPL-2.0 (12 lockfile entries).
- `minimatch` declares BlueOak-1.0.0.
- `victory-vendor` declares the combined expression MIT AND ISC.

### Backend
- `busboy@1.6.0` has no license identifier in the lockfile metadata.
- `streamsearch@1.1.0` has no license identifier in the lockfile metadata.
- `minimatch` declares BlueOak-1.0.0.

An unspecified lockfile license field does not prove that a package is unlicensed; its upstream package metadata and license files must be checked.

## Lockfile consistency finding

The root `package.json` declares `@capacitor/core` and `@capacitor/cli`, but the root lockfile's root package entry does not include those dependencies. The backend package manifest and backend lockfile root dependency declarations match.

The root lockfile mismatch must be reconciled with npm before claiming reproducible `npm ci` installation. This connector review cannot run npm or regenerate a lockfile. Do not describe the current lockfile as verified.

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
