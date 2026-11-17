# TechStore Pro — Dependency License Review Register

## Automated notice-collection update — 2026-11-17

The QA CI notice collector now recursively gathers package license/notice files and complete README license sections, with exact-version source handling recorded in `LICENSE_SOURCE_REGISTER.md`. Run #252 produced `THIRD-PARTY-NOTICES.md` with **296 production dependency entries and 0 unresolved collector entries**. The workflow uploaded review artifact ID `14354280618` (run #252).

This is a collection-completeness result for the production dependency scope, not proof that every license was legally interpreted or every attribution/source obligation satisfied. Human review of the collected texts, archive-specific applicability, the MPL-2.0/CC-BY/BlueOak/Unlicense/0BSD and compound-license obligations, and qualified legal review remain mandatory. The seller must still decide the exact archive contents. Do not describe the automated report as blanket commercial clearance.

The QA workflow also validates the root and server dependency trees separately. The root lockfile currently contains `picomatch@4.0.7` as a development dependency through Vite tooling; the server lockfile contains no picomatch entry. This is a security gate issue, not a license finding, and does not change this register's distribution HOLD.


**Review date:** 2026-11-17  
**Scope snapshot:** `qa/customer-e2e`, commit `3523faf5154dfb6f40f1e3b0b0210da5f2414f2c`  
**Inputs:** root `package-lock.json` (417 non-root package records), `server/package-lock.json` (165 non-root package records), and upstream license references listed below.  
**Decision:** PARTIAL REVIEW — DISTRIBUTION HOLD.

## 1. Lockfile inventory

The root lockfile records 417 non-root package entries and the backend lockfile records 165. The SPDX metadata inventory includes MIT, ISC, Apache-2.0, BSD-2-Clause, BSD-3-Clause, BlueOak-1.0.0, MPL-2.0, CC-BY-4.0, Unlicense, 0BSD, and the compound expression MIT AND ISC.

The backend lockfile omits modern SPDX metadata for `busboy@1.6.0` and `streamsearch@1.1.0`; their exact-version upstream MIT LICENSE texts are retained as:
- `licenses/busboy-1.6.0-LICENSE.txt`
- `licenses/streamsearch-1.1.0-LICENSE.txt`

No package is deemed legally cleared solely because a lockfile declares an SPDX expression.

## 2. Nonstandard and compound groups requiring special handling

| SPDX expression | Locked packages | Count |
|---|---|---:|
| MPL-2.0 | `lightningcss@1.33.0` and 11 platform packages at `1.33.0` | 12 |
| CC-BY-4.0 | `caniuse-lite@1.0.30001826` | 1 |
| BlueOak-1.0.0 | `@isaacs/nonrecursive-glob-match@1.1.0`, `chownr@3.0.0`, `glob@14.0.6`, `graceful-fs@4.2.12`, `minimatch@11.0.8`, `minipass@7.1.3`, `package-json-from-dist@1.0.1`, `path-scurry@3.0.0`, `path-scurry/node_modules/lru-cache@11.5.3`, `rimraf@6.1.4`, `tar@7.5.23`, `tar/node_modules/yallist@5.0.0` | 12 |
| Unlicense | `big-integer@1.6.52`, `stream-buffers@2.2.0` | 2 |
| 0BSD | root `tslib@2.8.1`; backend `tslib@2.9.1` | 2 |
| MIT AND ISC | `victory-vendor@37.3.6` | 1 |

All counts are lockfile records, not counts of files copied into a buyer archive. Platform-specific optional packages are listed because they are locked; actual installation and archive contents may differ.

## 3. Conditions and actions

### MPL-2.0 — Lightning CSS

Official text: https://www.mozilla.org/en-US/MPL/2.0/  
Upstream project: https://github.com/parcel-bundler/lightningcss

MPL-2.0 has file-level source-form and executable-form conditions. For the exact buyer archive, determine whether Lightning CSS source files, modified covered files, or executable-form covered software are actually redistributed. Preserve existing license notices; do not assume that a lockfile entry by itself proves which MPL files are shipped. If covered source form is distributed, recipients must be informed that it is under MPL-2.0 and how to obtain the license. If executable form is distributed, apply the corresponding source-availability requirements. No blanket conclusion is made for the current app bundle.

### CC-BY-4.0 — caniuse-lite

Official legal code: https://creativecommons.org/licenses/by/4.0/legalcode  
Upstream project: https://github.com/browserslist/caniuse-lite

The caniuse data project requests attribution to **caniuse.com**. Determine whether relevant data is included in the final source archive or generated output. Where shared, retain the required attribution, license reference, and modification indication if modified. Do not imply endorsement by the licensor.

### BlueOak-1.0.0

Official license: https://blueoakcouncil.org/license/1.0.0

The license requires recipients who receive a copy of any part of the licensed software to also receive the license text or a link to it. Include the canonical reference in the delivered notices and verify package-specific upstream files for the locked versions.

### Unlicense and 0BSD

Official references:
- https://unlicense.org/
- https://spdx.org/licenses/0BSD.html

Verify exact package-version license files and preserve any package copyright/provenance notices. Do not infer the contents of package LICENSE files from the SPDX label alone.

### MIT AND ISC — victory-vendor

Exact package: https://unpkg.com/victory-vendor@37.3.6/package.json  
Upstream project: https://github.com/FormidableLabs/victory

The package lockfile declares the compound expression `MIT AND ISC`. Separately, `LICENSE_SOURCE_REGISTER.md` records an additional `BSD-3-Clause` obligation for vendored components based on its upstream review. These statements are not necessarily contradictory, but the archive-specific package metadata, actual vendored component files, and retained notices must be reconciled so that the final notice set covers every applicable component license. Do not collapse this to MIT-only or assume the lockfile expression captures every vendored component obligation.

## 4. Documentation reconciliation required

- [ ] For `victory-vendor@37.3.6`, reconcile the package metadata expression `MIT AND ISC` with the additional `BSD-3-Clause` vendored-component obligation recorded in `LICENSE_SOURCE_REGISTER.md`; inspect the exact package contents and confirm all applicable texts/attributions are present in the final archive-specific notices.
- [ ] Inspect CI notice-collection artifact `14354280618` from run #252 and reconcile it with the current tracked dependency lockfiles and the exact buyer archive. The reported 296 production entries / 0 unresolved collector entries is collection evidence only, not human or legal clearance.
- [ ] Reconcile the `THIRD-PARTY-NOTICES.md` summary against the collected artifact; do not treat the summary's pending copyright-header column as proof that the collector failed, or the collector's zero-unresolved result as proof that human review passed.
- [ ] Recheck `ASSET_PROVENANCE_REGISTER.md` against the current QA branch tree before packaging; its reviewed source commit is an earlier snapshot and the register itself requires a current-head verification.

## 5. Remaining work before distribution

- [ ] Retrieve and compare exact-version upstream LICENSE/COPYING/NOTICE files for all 582 lockfile records, including MIT, ISC, Apache-2.0, BSD-2-Clause and BSD-3-Clause packages.
- [ ] Resolve package-level notices and copyright holders for vendored or bundled code, especially `victory-vendor`.
- [ ] Determine which dependencies and generated artifacts are actually included in the final source-only archive and which are installed by the buyer.
- [ ] Inspect the final archive and production build file-by-file for embedded third-party code, license headers, notices, and source-form obligations.
- [ ] Generate a final archive-specific notices bundle and verify that every included dependency is represented.
- [ ] Have the final distribution terms reviewed by qualified counsel.

## 6. Release gate

This register is an engineering compliance aid, not legal advice or a legal opinion. The lockfile SPDX inventory plus the two retained MIT texts do not establish complete legal clearance. **Commercial release remains HOLD.** Do not merge to `main`, deploy production, publish a paid listing, or distribute a buyer archive while the archive-specific notice review and other release gates remain open.
