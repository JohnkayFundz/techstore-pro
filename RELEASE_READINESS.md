# CURRENT GOVERNANCE STATUS — 2026-11-19 (supersedes all historical status snapshots below)

**Decision: COMMERCIAL RELEASE HOLD**  
**Governance branch:** `qa/customer-e2e`  
**Latest verified strict CI evidence:** Run #307 — ID `44447820030` — commit `34f7a7ed52c024167aa566fac5088cef81fbfc6b` — success.  
**Current QA base after PR #13:** `5771e62a527931c889bbaf0d2d98e6e1c114df88`.  
**Main baseline:** `4713a3506ba64036b16768a3713bc4956d000fb4` — protected and unchanged.

## Current advisory and CI disposition

- GitHub withdrew `GHSA-fc5q-39xc-vjpf` / CVE-2026-112366 on 2026-11-18, determining that the report was not a security issue. This supersedes earlier historical statements in this file that treated this advisory as an active vulnerability blocker.
- CI Run #307 completed successfully on its exact commit. The final, enforced root and backend high-severity audit gate passed; both audits reported zero vulnerabilities. The preliminary audit steps are non-blocking, but the final strict gate is not configured with `continue-on-error`.
- The root lockfile remained unchanged at `picomatch@4.0.7`; no patch, override, downgrade, fork, or lockfile workaround was introduced. The zero-vulnerability audit result reflects the upstream advisory withdrawal, not a package patch.
- Run #307 verified lockfiles artifact: ID `14494785130`; ZIP SHA-256 `d4192c283003caa6e5a8ef5a3d8d8519de24c561e411737f928ccc54b32ed69d`. The root lockfile Git blob at the Run #307 commit matches the QA lockfile blob `67685edb4940344c258501aeaa6bc056b9365fc2`.
- PR #13 is merged into `qa/customer-e2e` (merge commit `5771e62a527931c889bbaf0d2d98e6e1c114df88)); its purpose was to include the QA branch in the pull-request CI trigger filter.
- PR #14 remains an unmerged documentation proposal. Its head predates PR #13's workflow-trigger change, and no GitHub Actions workflow run is registered for its current head. Vercel preview success is not CI validation. Do not merge PR #14 on the basis of Vercel status.

## Remaining commercial-release blockers

1. Qualified Nigerian legal counsel must review and approve the commercial license, consumer terms/refund wording, contracting identity, open-source obligations, and legally acceptable service/notice address. `COMMERCIAL_LICENSE_DRAFT.md` remains a draft; do not create or represent `COMMERCIAL_LICENSE.md` as approved before counsel sign-off.
2. Exact-version third-party license texts, notices, attributions, vendored code, and archive-specific applicability still require human/legal review. Automated notice collection is not legal clearance.
3. Independent buyer-machine archive extraction, clean installation, configuration, customer/admin smoke tests, and checksum verification remain unexecuted.
4. A genuine Cloudinary upload test remains outstanding and requires dedicated non-production credentials.
5. Seller/distribution eligibility and final content/identity decisions remain unverified.
6. No final buyer archive/checksum or marketplace listing may be generated or published while HOLD.

## Safety and scope

No merge to `main`, production deployment, production database/configuration mutation, live payment activation, release archive generation, or marketplace publication is authorized. Preserve the main baseline above. The withdrawal record resolves only the cited advisory status; it is not blanket security, legal, licensing, or commercial clearance.

**Historical note:** All dated status snapshots and security findings below this current-status section are retained as historical evidence. Where they describe GHSA-fc5q-39xc-vjpf as active, patched-version-unknown, or an unresolved high-severity blocker, those statements are superseded by the 2026-11-18 withdrawal and Run #307 evidence above.

---

# CURRENT STATUS OVERRIDE — 2026-11-18 (CI #288 exact-HEAD verification)

**Decision: FUNCTIONAL QA PASS / SECURITY + COMMERCIAL RELEASE HOLD**  
**QA branch:** `qa/customer-e2e`  
**Exact branch HEAD tested:** `7e02b6ec89df97d4ca6d36cec8bd05e98ae9747e`  
**CI run:** #288 — `44313800777` — completed with failure at the enforced high-severity security gate.  
**Main baseline:** `4713a3506ba64036b16768a3713bc4956d000fb4` — no merge or update performed.

## CI #288 exact results

- Root dependency reconciliation and clean installation passed.
- Frontend lint and production build passed.
- Chromium installation and all 4 isolated browser E2E tests passed.
- Backend clean installation, backend audit (0 vulnerabilities), all 21 backend unit tests, and JavaScript syntax checks passed.
- Exact-version production dependency notice collection passed in the isolated QA job; the notice review bundle uploaded successfully.
- Verified lockfiles artifact upload passed. The lockfile commit step was skipped because the enforced security gate failed.
- Root audit reported **5 high-severity vulnerabilities** through `picomatch@4.0.7`, reached through `vite` / `tinyglobby` / `fdir`. The final gate reported root status 1 and backend status 0.
- The suggested `npm audit fix --force` would install Vite 6.2.7, a breaking downgrade. It was not run. No audit suppression, unmerged patch, override, or gate bypass was applied.

## Upstream release recheck — 2026-11-18

The official `micromatch/picomatch` GitHub Releases endpoint was checked after CI #288. The newest published release returned is still **4.0.7** (published 2026-08-24); the release list contains no later patched release. The current GitHub advisory still lists patched versions as unknown. Accordingly, no official upstream remediation is available to adopt, and the dependency graph remains unchanged. This is a release-metadata check, not evidence that the vulnerable code path is safe.

Run #288: https://github.com/JohnkayFundz/techstore-pro/actions/runs/44313800777

## Decision and remaining blockers

The root build-tool dependency security finding remains unresolved. Do not alter the dependency graph until an official compatible fix or a separately validated toolchain migration is available. Functional CI success does not override the security gate.

Other open release blockers remain: human/legal review of exact-version third-party notices and archive applicability; qualified legal review and approval of the commercial license; independent buyer-machine archive extraction, installation, configuration, and customer/admin smoke tests; and genuine Cloudinary upload verification using dedicated non-production credentials.

No final buyer archive/checksum or marketplace listing may be produced while HOLD. No merge/update to `main`, production deployment, production database/configuration mutation, live payment activation, buyer archive generation/distribution, or marketplace publication has occurred.

---

# CURRENT STATUS OVERRIDE — 2026-11-18 (CI #287 exact-HEAD verification)

**Decision: FUNCTIONAL QA PASS / SECURITY + COMMERCIAL RELEASE HOLD**  
**QA branch:** `qa/customer-e2e`  
**Exact branch HEAD tested:** `c7b70b6455401ac8f8586d31944efc3bebbd016c`  
**CI run:** #287 — `44313465882` — completed with failure only at the enforced high-severity security gate.  
**Main baseline:** `4713a3506ba64036b16768a3713bc4956d000fb4` — no merge or update performed.

## CI #287 exact results

- Root dependency reconciliation and clean install passed.
- Root full audit step completed successfully as a command, but the enforced final security gate correctly failed because the audit still returns a non-zero status for high-severity findings.
- Lint, frontend production build, Chromium setup, and all 4 isolated browser E2E tests passed.
- Backend clean install, backend audit (0 vulnerabilities), all 21 backend unit tests, and JavaScript syntax checks passed.
- Exact-version production dependency notice collection passed; its isolated job committed the regenerated notice register and uploaded the review bundle.
- Verified lockfiles artifact upload passed. The lockfile commit step was skipped because the enforced security gate failed.
- No test or audit failure was suppressed; no gate was bypassed.

## Refreshed upstream advisory check — 2026-11-18

The primary GitHub advisory [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf) / CVE-2026-112366 still identifies picomatch through 4.0.7 as affected and lists the patched version as unknown. The npm registry still lists 4.0.7 as the latest published version. A same-day independent upstream issue also reports no patched release and describes the issue as affecting development tooling; that observation does not clear TechStore Pro's enforced root audit or establish a safe remediation. The exact project dependency graph remains unchanged.

**Decision:** no dependency override, unmerged fork, forced Vite downgrade, audit exception, or security-gate bypass. Keep the release on HOLD until an official compatible fix or a separately validated toolchain migration is available.

## Remaining release blockers

1. Root high-severity dependency audit remains unresolved.
2. Human review of exact-version license texts, notices, vendored code, and archive-specific applicability remains open; automated collection is not legal clearance.
3. Commercial license remains an unapproved draft and requires qualified legal review.
4. Independent buyer-machine archive extraction, clean installation, configuration, and customer/admin smoke tests remain unexecuted.
5. Cloudinary upload verification requires a dedicated non-production account and securely configured credentials.
6. No final buyer archive/checksum or marketplace listing may be produced while HOLD.

## Safety disposition

No merge/update to `main`, production deployment, production database/configuration mutation, live payment activation, buyer archive generation/distribution, or marketplace publication. Keep release on HOLD.

---

# CURRENT STATUS OVERRIDE — 2026-11-18 (CI #285 and compatible-remediation investigation)

**Decision: FUNCTIONAL QA PASS / SECURITY + COMMERCIAL RELEASE HOLD**  
**Branch:** `qa/customer-e2e`  
**Branch HEAD reviewed:** `85012290b67a68e2c7dc713bd2b17ed4d008872f`  
**CI run:** #285 — `44312738919` — completed with failure at the enforced high-severity security gate.  
**Main baseline:** `4713a3506ba64036b16768a3713bc4956d000fb4` — no merge or update performed.

## CI #285 exact results

- Root clean install, dependency reconciliation, lint, frontend production build, Chromium setup, and all 4 browser E2E tests passed.
- Backend clean install, audit (0 vulnerabilities), 21 unit tests, and JavaScript syntax checks passed.
- Third-party notice collection and both review-artifact uploads passed.
- Root full audit still reports 5 high-severity findings associated with `picomatch@4.0.7`.
- The final enforced root/backend security gate failed as expected (root status 1; backend status 0). Verified lockfiles were not committed because the gate failed.
- No test, audit, or security-gate failure was suppressed.

## Compatible-remediation investigation — no safe candidate established

The exact QA lockfile graph was re-read. It confirms both direct and transitive dependency edges:
- `vite@8.3.8` directly depends on `picomatch@^4.0.7`.
- `vite@8.3.8` also depends on `tinyglobby@^0.2.17`, which depends on `picomatch@^4.0.4` and `fdir@^6.5.0`; `fdir` accepts picomatch 3 or 4 as a peer.
- The React Vite plugin is `@vitejs/plugin-react@6.0.3`, with a Vite `^8.0.0` peer requirement.

This matters because replacing only `tinyglobby` or `fdir` would not remove Vite's direct vulnerable picomatch dependency. A package override to an earlier 4.x release would violate Vite's declared `^4.0.7` range and would not be a verified remediation. A downgrade to Vite 6.2.7 is the breaking `npm audit fix --force` proposal and is not acceptable. A build-tool migration (for example, to a different bundler) would be a substantial toolchain change, not a narrow compatible dependency fix; no candidate has yet been proven against this repository's React plugin, build output, lint, browser tests, package workflow, and security audit.

Fresh upstream checks on 2026-11-18:
- GitHub's primary advisory GHSA-fc5q-39xc-vjpf / CVE-2026-112366 still describes the ReDoS issue through picomatch 4.0.7 and lists patched versions as unknown.
- The latest published picomatch version remains 4.0.7; no official patched release was found.
- Vite 8.3.8 remains the current stable Vite 8 release in the checked release information; its resolved dependency graph still includes picomatch 4.0.7.
- The proposed picomatch PR #235 remains closed/unmerged and is not a released upstream package. PR #194 is unrelated to this specific advisory.

**Conclusion:** There is currently no safe, compatible, evidence-backed package substitution to apply. Do not change manifests or lockfiles speculatively. Do not use an unmerged fork, manual package override, forced Vite downgrade, audit exception, or gate bypass.

## Next safe technical action

Keep the dependency graph unchanged and the release on HOLD. Reassess when either (a) picomatch publishes an official version outside the advisory's affected range and Vite's declared range can resolve it, or (b) a separately reviewed bundler/toolchain migration is proposed with a compatibility matrix and full exact-commit CI evidence. Any eventual candidate must pass root and backend audits, clean installs, lint, production build, all 4 browser tests, backend tests, syntax checks, and package/notice verification before it can be considered resolved.

## Other release blockers remain

1. Human review of exact-version license texts, package notices, vendored code, and archive-specific applicability; the automated 296-entry collector is not legal clearance.
2. Commercial license draft remains unapproved and requires qualified legal review.
3. Independent buyer-machine archive extraction, clean install, configuration, and customer/admin smoke tests remain unexecuted.
4. Cloudinary upload verification requires a dedicated non-production account and securely configured credentials.
5. No final buyer archive/checksum or marketplace listing may be produced while HOLD.

## Safety disposition

No merge/update to `main`, production deployment, production database/configuration mutation, live payment activation, buyer archive, or marketplace publication. Keep release on HOLD.

---

# CURRENT STATUS OVERRIDE — 2026-11-18 (security investigation after CI run #284)

**Decision: FUNCTIONAL QA CHECKS PASS / SECURITY + COMMERCIAL RELEASE HOLD**  
**Branch:** `qa/customer-e2e`  
**Investigated commit:** `78f377d975934a07f5780f2b06da4250c97f5383` (CI run #284: `44310664302`)  
**Current branch head before this documentation update:** `0f78da27c91768e0c62094a4982e219c5225b11b`  
**Main baseline:** `4713a3506ba64036b16768a3713bc4956d000fb4` — no merge/update performed.

## Security investigation result — no safe upstream package fix available

CI run #284 confirms the blocker precisely:
- Root dependency reconciliation and the compatible, non-forced `npm audit fix --package-lock-only` step completed, but the final full root audit still reported **5 high-severity findings**.
- The affected path is `vite@8.3.8` → `tinyglobby` / `fdir` → `picomatch@4.0.7`. The root manifest declares Vite `^8.1.1`; the installed lockfile resolves Vite `8.3.8`.
- The backend full audit reports **0 vulnerabilities**.
- The suggested `npm audit fix --force` would downgrade Vite to `6.2.7`, outside the declared Vite 8 line and a breaking change. It was not run.
- The gate correctly remains enforced and fails with root status 1 / backend status 0. No audit suppression, override, fork, force downgrade, or gate bypass was applied.

Current upstream evidence checked 2026-11-18:
- GitHub Advisory [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf) / CVE-2026-112366 describes ReDoS in picomatch versions through 4.0.7 and still lists patched versions as unknown.
- The npm package page still identifies `4.0.7` as the latest published version.
- The proposed upstream security PR [micromatch/picomatch#235](https://github.com/micromatch/picomatch/pull/235) is **closed and not merged**; its head is a fork, not an official release.
- Upstream PR #194 is open but addresses an unrelated extglob parsing issue; it is not a remediation for this advisory.
- Therefore, there is no verified official patched release to install. The prior assumption that an upstream PR might soon resolve the issue is not sufficient release evidence.

## Decision and next safe action

**No dependency change is justified at this time.** Retain the current compatible Vite 8 toolchain, preserve the full audit gate, and keep the release on HOLD. Reassess only when an official picomatch release outside the affected range is published, or when a separately reviewed dependency replacement can be demonstrated to remove the vulnerable code path without weakening the gate. Then update the lockfile and run the complete CI suite on the exact resulting QA commit.

## Other release blockers remain

1. Third-party notice collection is automated and complete (296 production entries, zero unresolved collector entries), but package-specific human/legal review and archive-specific obligations remain open.
2. Commercial license is an unapproved draft; qualified legal review remains required.
3. Independent buyer-machine archive extraction, clean installation, configuration, and customer/admin smoke tests remain unexecuted.
4. Cloudinary upload verification still requires a dedicated non-production account and credentials configured securely outside chat.
5. No final buyer archive/checksum exists; do not package or distribute while HOLD.

## Safety disposition

No merge, main update, production deployment, production data/configuration mutation, buyer archive, marketplace publication, or live payment activation has occurred. Keep release on HOLD.

---

# CURRENT STATUS OVERRIDE — 2026-11-17 (latest QA verification; supersedes prior snapshot below)

**Decision: FUNCTIONAL QA PASS / SECURITY + COMMERCIAL RELEASE HOLD**  
**QA branch:** `qa/customer-e2e`  
**QA HEAD:** `f0d4636f0ead852237006b87fb4d32b8f3454cc9`  
**Latest workflow run:** `44140848291` — completed with failure at the enforced root high-severity security gate.  
**Vercel preview:** READY for this exact QA commit; preview-only (`target: null`): https://techstore-jdryzm3md-deejayjohnkay-1047s-projects.vercel.app  
**Main baseline recorded by prior verification:** `4713a3506ba64036b16768a3713bc4956d000fb4`; no merge or production deployment was performed.

## Latest exact-HEAD CI results

- Root clean install, dependency reconciliation, lint, frontend production build, Chromium setup, and all 4 Playwright E2E tests passed.
- Backend clean install, backend audit (0 vulnerabilities), syntax checks, and all 21 backend tests passed.
- Isolated third-party notice collection succeeded and uploaded its review bundle.
- Verified lockfiles artifact uploaded: `techstore-pro-verified-lockfiles`, artifact ID `14354950838`.
- The final enforced security step failed because root `npm audit --audit-level=high` reports **5 high-severity findings** through `picomatch@4.0.7` → `fdir` / `tinyglobby` / `vite`. Backend audit remains clean. CI correctly did not commit the verified lockfiles after the root gate failed.

## Security disposition

GitHub Advisory GHSA-fc5q-39xc-vjpf / CVE-2026-112366 describes high-severity ReDoS in picomatch through 4.0.7; GitHub still lists affected and patched versions as unknown. The upstream proposed fix is not an official released package. Do not use an unmerged patch, force-downgrade Vite, suppress the audit, or bypass the gate. Keep the security HOLD until a supported remediation is available and validated in this repository. See the current primary advisory: https://github.com/advisories/GHSA-fc5q-39xc-vjpf.

## Remaining release blockers

1. Root build-tool dependency audit remains red (5 high findings).
2. Automated third-party notice collection is complete, but human/legal review and package-specific obligations remain open.
3. Commercial license remains an unapproved draft; seller decisions and qualified legal review are required.
4. Independent buyer-machine archive extraction, clean installation, configuration, and customer/admin smoke tests remain unexecuted.
5. Genuine Cloudinary upload verification still requires a dedicated non-production account and credentials configured securely outside chat.
6. No final buyer archive/checksum exists; seller identity, catalogue, policies, and distribution decisions remain outstanding.

## Safety disposition

No merge, main update, production deployment, production data/configuration mutation, buyer archive, marketplace publication, or live payment activation has occurred. Cash on delivery remains the only verified payment method. **Keep release on HOLD.**

---

# CURRENT STATUS OVERRIDE — 2026-11-17 (supersedes historical snapshot below)

**Decision: QA FUNCTIONAL CHECKS PASS / RELEASE HOLD**  
**QA branch head:** `84d1f549b818f21055850b12ebbced2326869786`  
**Latest CI run:** #254 — `44140014181` — failed at the enforced root high-severity security gate.  
**Main baseline:** `4713a3506ba64036b16768a3713bc4956d000fb4` — verified unchanged.

## Latest CI evidence

Run #254 confirms:
- Root clean installation, lint, frontend production build, Chromium setup, and all 4 browser E2E tests passed.
- Backend clean installation, backend audit (0 vulnerabilities), and all 21 backend tests passed.
- The separate notice-collection job passed and uploaded its review bundle.
- Root audit still fails with 5 high findings associated with the installed `picomatch@4.0.7` package path. The CI step that reconciles the lockfile cannot remediate it; the final security enforcement step correctly fails.
- The workflow skipped committing its verified lockfile changes because the root security gate failed.

The earlier statement that the root `picomatch` path was development-only was based on the lockfile's `dev` metadata. The audit output also traverses `fdir`, `tinyglobby`, and `vite`. This is the frontend build-tool chain; the backend runtime lockfile has no picomatch and its audit is clean. Do not interpret that distinction as clearance of the root build environment or as permission to bypass the root audit.

## Upstream remediation status — refreshed 2026-11-17

GitHub's primary advisory GHSA-fc5q-39xc-vjpf / CVE-2026-112366 still lists affected and patched versions as unknown. The upstream picomatch PR #237 proposes a targeted fix for single-branch repeated extglobs and reports 1,999 upstream tests passing, but GitHub currently shows the PR as **OPEN and NOT MERGED**. It is not a released package, and its reported test result is upstream PR evidence, not a test result for this repository. Do not install an unmerged branch, use an unreviewed fork, or claim the vulnerability fixed.

The advisory describes a high-severity ReDoS affecting picomatch through 4.0.7. The published npm latest tag remains 4.0.7. No official patched release was found in this review. The npm force-fix recommendation is not acceptable because it proposes a breaking Vite downgrade. No forced downgrade, audit suppression, vulnerable-code override, or security-gate bypass was applied.

## Remaining release blockers

1. Root build-tool dependency audit: 5 high picomatch findings remain. Wait for an official fixed release or independently review and test a maintainable remediation without weakening the security gate.
2. Third-party notices: automated collection is complete (296 production entries, zero unresolved collector entries), but full human/legal review and archive-specific obligations remain open.
3. Commercial license: draft remains unapproved; seller decisions and qualified legal review are required.
4. Buyer installation: independent archive extraction, clean installation, configuration, and customer/admin smoke tests have not been executed.
5. Cloudinary upload: requires a dedicated non-production account and credentials configured securely outside chat.
6. No buyer archive/checksum exists; seller content, identity, and distribution decisions remain outstanding.

## Safety disposition

No merge, main update, production deployment, production data/configuration mutation, buyer archive, marketplace publication, or live payment activation has occurred. Cash on delivery remains the only verified payment method. Keep this project on HOLD.

---

# CURRENT STATUS OVERRIDE — 2026-11-17 (supersedes the historical snapshot below)

**Decision: QA FUNCTIONAL CHECKS PASS / SECURITY AND COMMERCIAL RELEASE HOLD**  
**QA branch head reviewed:** `a4e05234edd6bfd383053ac2389725248f61d21f`  
**Latest CI:** Run #252 — `44138866044` — overall FAILED only at the enforced root high-severity security gate.  
**Main baseline:** `4713a3506ba64036b16768a3713bc4956d000fb4` — verified unchanged.

## Current verified results

- Root clean install, lint, Vite production build, Chromium installation and all 4 Playwright browser tests passed.
- Backend clean install, backend security audit (0 vulnerabilities), syntax checks and all 21 backend tests passed.
- Independent third-party notice collection completed: 296 production package entries, 0 unresolved collector entries. This is a completed automated collection, not human/legal clearance.
- Vercel deployment for this exact QA commit is READY as a preview (`target: null`); it is not a production deployment.
- The only failing CI gate is the root dependency audit: 5 high-severity audit findings are reported against one installed `picomatch@4.0.7` package path.

## Security investigation — picomatch

The current root lockfile places `picomatch@4.0.7` under development dependencies. Its recorded dependency path is `vite` / `tinyglobby` / `fdir`; the backend `server/package-lock.json` contains no picomatch package. This reduces exposure in the shipped application runtime but does not make the build-tool vulnerability disappear or justify suppressing the security gate.

The advisory is GHSA-fc5q-39xc-vjpf / CVE-2026-112366 (ReDoS via single-branch repeated extglobs). GitHub's advisory still reports affected and patched version ranges as unknown. The upstream proposed fix, picomatch PR #237, is still OPEN and unmerged as of this review; it has no released fixed package version. An earlier PR #240 was closed without merge. The upstream PR #237 is therefore evidence of active remediation work, not a released dependency that this project can safely claim to have installed.

CI's suggested `npm audit fix --force` would replace the declared Vite 8 line with Vite 6.2.7, a breaking downgrade. It was not applied. No vulnerable-code override, audit suppression, gate bypass, or unverified fork patch has been introduced. Keep the final security gate enforced until an official fixed release or a fully reviewed, tested, maintainable remediation is available.

## Remaining release blockers

1. Root build-tool security finding remains open; obtain and validate an official fixed picomatch release or a separately reviewed safe dependency path.
2. Automated third-party notices are collected, but package-specific legal review and archive-specific obligations remain open.
3. `COMMERCIAL_LICENSE_DRAFT.md` remains unapproved; seller decisions and qualified legal review are required.
4. Independent buyer-machine archive extraction, clean installation, configuration and customer/admin smoke testing have not been executed.
5. Genuine Cloudinary upload verification requires a dedicated non-production account and securely configured test credentials.
6. No final customer archive or checksum has been created; catalogue, identity, content and distribution decisions still require seller confirmation.

## Safety disposition

No merge, main update, production deployment, production data/configuration mutation, buyer archive, marketplace publication, or live payment activation has occurred. Cash on delivery remains the only verified payment method. Keep this project on HOLD.

---

# TechStore Pro — Current Release Readiness

**Decision: TECHNICAL QA PASS / COMMERCIAL RELEASE HOLD**  
**Reviewed:** 2026-11-17  
**Branch:** `qa/customer-e2e`  
**Latest QA branch commit at this review:** `e27c092b97de873e86fdb2b7d4efd0786e3deab5`
**Latest completed CI:** Run #238 — `44131874383` — SUCCESS on exact QA HEAD `e27c092`  
**GitHub Actions:** Run #238 — `44131874383` — SUCCESS on `e27c092`  
**Production/main baseline:** `4713a3506ba64036b16768a3713bc4956d000fb4` (unchanged)

This record supersedes earlier stale status summaries in this file. Historical notes elsewhere in the repository are retained as history and must not be treated as current state.

## Verified on the current QA commit (Run #238)

- [x] Latest exact-HEAD CI Run #238 completed successfully on `e27c092b97de873e86fdb2b7d4efd0786e3deab5`. All 39 workflow steps completed successfully, including root/backend clean installs, high-severity audits, lint, frontend build, Chromium installation, four Playwright tests, backend tests, syntax checks, lockfile artifact upload, and lockfile commit step.

## Verified on the QA preparation line (revalidated by Run #237)

- [x] Root dependency lockfile reconciled with the manifest; committed `package-lock.json` contains `@playwright/test@1.65.1`, satisfying the declared `^1.61.1` range.
- [x] Backend lockfile reconciliation completed; CI confirmed no backend lockfile changes were needed.
- [x] Clean root and backend `npm ci` installations.
- [x] Root and backend high-severity dependency audits passed.
- [x] Repository lint passed.
- [x] Frontend Vite production build passed.
- [x] Chromium installation and isolated Playwright browser suite passed (4 tests).
- [x] Backend tests passed: 21/21, including auth/JWT, order/stock transaction, Cloudinary helper, and cash-payment lifecycle safeguards.
- [x] Backend JavaScript syntax checks passed.
- [x] Verified lockfile artifact uploaded; CI confirmed lockfiles already match manifests and audit fixes.
- [x] QA Vercel preview for this exact commit is READY; target is preview (`target: null`), not production.
- [x] Main branch remains unchanged at `4713a3506ba64036b16768a3713bc4956d000fb4`.

Run #238: https://github.com/JohnkayFundz/techstore-pro/actions/runs/44131874383

Run #237: https://github.com/JohnkayFundz/techstore-pro/actions/runs/44131455385

Run #236: https://github.com/JohnkayFundz/techstore-pro/actions/runs/44131168536

Run #235: https://github.com/JohnkayFundz/techstore-pro/actions/runs/44129232519

Run #233: https://github.com/JohnkayFundz/techstore-pro/actions/runs/44127942696

Run #232 also passed on `ae44d1e00e707f0ee98152e1bf5b1661587b0542`.

## Asset and demo-content status

- The authorized cleanup removed the unverified raster/GIF/video media and original starter artwork identified in the QA inventory.
- The current tracked media scan found no PNG/JPG/JPEG/GIF/WebP/AVIF/MP4/WebM assets.
- Replacement SVG artwork is neutral placeholder/demo art. The provenance register describes its asserted origin and does not grant rights to future seller uploads, fonts, logos, or other third-party material.
- Demo product data is reduced to a generic zero-stock sample. No fictional metrics, reviews, personal contact defaults, or unverified business claims should be presented as real.
- The provenance register is an inventory, not a legal opinion or blanket clearance of all possible repository rights.

## Third-party license status

- `THIRD-PARTY-NOTICES.md` records lockfile SPDX metadata for the root and backend dependency trees.
- `LICENSE_REVIEW.md` now records the focused nonstandard/compound license inventory and key obligations: 12 MPL-2.0 entries, one CC-BY-4.0 entry, 12 BlueOak entries, two Unlicense entries, two 0BSD entries, and one MIT AND ISC entry. This is a partial review, not final legal clearance.
- The exact-version upstream MIT license texts for `busboy@1.6.0` and `streamsearch@1.1.0` were verified against their upstream tags and retained in `licenses/`.
- This resolves those two missing-modern-SPDX-metadata cases only. The focused review register now records special handling for the nonstandard/compound groups, but exact-version notices and file-level applicability remain outstanding for the complete dependency set.
- Exact upstream notices and package-specific obligations for the complete dependency set are not yet collated/reviewed. Particular attention remains due for MPL-2.0 Lightning CSS packages, CC-BY-4.0 `caniuse-lite`, BlueOak, Unlicense, 0BSD, compound expressions, and any package-specific notices/attributions.
- Prefer a source-plus-lockfiles delivery with buyer-side dependency installation. Do not include `node_modules` until its exact contents and all required notices/source obligations are verified.
- A metadata table and two retained license texts are not a complete legal notice package.

## Functional and hosted integration limitations

- Payment is cash on delivery only. No card gateway or server-side online payment verification is integrated. Do not accept card details or imply card payment support.
- Backend tests exercise Cloudinary helper behavior with test conditions; they do not establish a real Cloudinary upload.
- Vercel project environment inspection showed no Cloudinary configuration keys. The available `VITE_API_URL` entries are not Cloudinary credentials; do not expose their values.
- The Vercel QA deployment is SSO-protected and preview-only. Its READY build does not prove the complete deployed application works against a configured API/database.
- MongoDB transaction tests use disposable CI infrastructure, not a buyer's configured database.

## Buyer installation protocol

`BUYER_INSTALL_VERIFICATION.md` now defines the independent archive inspection, fresh extraction, clean install, non-production configuration, customer/admin smoke tests, optional isolated Cloudinary upload, and evidence record. The protocol has **not** been executed; a separate buyer-controlled machine and test services are still required.

## Remaining release blockers

1. **Complete dependency notices:** verify and retain exact upstream LICENSE/COPYING/NOTICE texts and attributions for the final delivered dependency scope; review MPL-2.0 and all other non-MIT obligations.
2. **Commercial terms:** `COMMERCIAL_LICENSE_DRAFT.md` remains draft only. Seller must confirm legal contracting identity, support/update terms, refund policy, jurisdiction and final wording; qualified legal review is required.
3. **Buyer clean install:** no independent customer-machine extraction, configuration, installation, startup, smoke test, and final archive checksum verification has been completed. CI clean installs are not a substitute for that buyer test.
4. **Cloudinary:** a dedicated non-production test account/configuration and disposable environment are required for a genuine upload test. Do not use production credentials or expose secrets in chat.
5. **Final package:** the exact source-only customer archive has not been assembled, inspected, checksum-verified and extraction-tested. Confirm it excludes unlicensed media, secrets, local env files, caches, and unintended files.
6. **Seller/content decisions:** all catalogue copy, prices, stock, policies, store identity, testimonials, contact details and branding must be owner-confirmed for the intended distribution.
7. **Distribution eligibility:** marketplace seller verification, payout eligibility, fees and tax obligations remain unverified.

## Prohibited while HOLD remains

- Do not merge `qa/customer-e2e` into `main`.
- Do not deploy this work to production or mutate production data/configuration.
- Do not publish a paid marketplace listing or distribute a buyer ZIP.
- Do not activate card payments or claim payment-provider support.
- Do not claim full legal clearance, a complete third-party notice package, live Cloudinary verification, or buyer readiness.

**Current outcome:** isolated QA technical checks are green on the verified commit. Commercial release remains **HOLD** until the blockers above are closed and the exact deliverable is reviewed. No production deployment, merge, marketplace publication, or payment activation has been performed.
