# TechStore Pro — Current Release Readiness

**Decision: TECHNICAL QA PASS / COMMERCIAL RELEASE HOLD**  
**Reviewed:** 2026-11-17  
**Branch:** `qa/customer-e2e`  
**Latest QA branch commit:** `ae44d1e00e707f0ee98152e1bf5b1661587b0542` (license-review documentation only)\n**Latest completed technical CI commit:** `3523faf5154dfb6f40f1e3b0b0210da5f2414f2c`  
**GitHub Actions:** Run #231 — `44127313661` — SUCCESS on `3523faf`; no new workflow run was triggered for documentation-only commit `ae44d1e`  
**Production/main baseline:** `4713a3506ba64036b16768a3713bc4956d000fb4` (unchanged)

This record supersedes earlier stale status summaries in this file. Historical notes elsewhere in the repository are retained as history and must not be treated as current state.

## Verified on the current QA commit

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

Run #231: https://github.com/JohnkayFundz/techstore-pro/actions/runs/44127313661\n\nThe follow-up license-review documentation commit is on the QA branch, but its own workflow status is not yet verified. The successful CI result above applies to its parent code commit.

## Asset and demo-content status

- The authorized cleanup removed the unverified raster/GIF/video media and original starter artwork identified in the QA inventory.
- The current tracked media scan found no PNG/JPG/JPEG/GIF/WebP/AVIF/MP4/WebM assets.
- Replacement SVG artwork is neutral placeholder/demo art. The provenance register describes its asserted origin and does not grant rights to future seller uploads, fonts, logos, or other third-party material.
- Demo product data is reduced to a generic zero-stock sample. No fictional metrics, reviews, personal contact defaults, or unverified business claims should be presented as real.
- The provenance register is an inventory, not a legal opinion or blanket clearance of all possible repository rights.

## Third-party license status

- `THIRD-PARTY-NOTICES.md` records lockfile SPDX metadata for the root and backend dependency trees.\n- `LICENSE_REVIEW.md` now records the focused nonstandard/compound license inventory and key obligations: 12 MPL-2.0 entries, one CC-BY-4.0 entry, 12 BlueOak entries, two Unlicense entries, two 0BSD entries, and one MIT AND ISC entry. This is a partial review, not final legal clearance.
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
