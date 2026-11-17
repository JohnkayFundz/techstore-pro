# TechStore Pro — Release Readiness Gate

**Decision: TECHNICAL CI PASS / COMMERCIAL RELEASE HOLD**  
**Reviewed:** 2026-11-17  
**Working branch:** `qa/customer-e2e`  
**Verified commit:** `f12dc977fb5cdc8b7df0427ff51a80c922844bae`  
**CI:** Run #222, ID `44120966797`, completed successfully.

This is a source-code preparation project, not a hosted store or cleared commercial download. Passing CI does not establish asset ownership, legal clearance, live-service integration, buyer installation, or production readiness.

## Verified technical work

- [x] Root and backend clean dependency installation.
- [x] Root and backend dependency audits: zero reported vulnerabilities in Run #222.
- [x] Repository lint and frontend production build.
- [x] Chromium installed and isolated Playwright suite passed: 4/4 tests.
- [x] Backend test suite passed: 21/21 tests.
- [x] Backend JavaScript syntax checks passed.
- [x] Checkout is cash-on-delivery only; unsupported card orders are rejected.
- [x] Neutral local hero artwork, app mark, and icon sprite are active; original favicon and social icon sprite copies are retained under `public/reference-assets/`.
- [x] Service worker app-shell cache now includes the active `/techstore-mark.svg` icon.
- [x] Customer API integration tests and isolated browser tests are present on the QA branch.

Run #222: https://github.com/JohnkayFundz/techstore-pro/actions/runs/44120966797

## Release blockers — do not bypass

1. **Asset provenance and distribution rights — OPEN.** The neutral active hero/app mark/icon replacements are in place, but this does not clear all repository media. `src/assets/hero.png`, React/Vite marks, reference-only original icons, GIF frames and text files, and any other non-placeholder media still require a complete reference and provenance review. The tiny `public/placeholder-product.png` is not a finished product-photo set. The 12-product catalogue is demonstration data.
2. **Third-party notices — OPEN.** `THIRD_PARTY_LICENSE_REVIEW.md` is a preliminary lockfile metadata inventory. `THIRD_PARTY_NOTICES_PARTIAL.md` is explicitly partial. Exact notices and obligations for the final dependency scope—including MPL-2.0, BlueOak, CC-BY, Unlicense, 0BSD, and combined license expressions—must be assembled and reviewed. Do not bundle `node_modules` without a complete review.
3. **Commercial license — OPEN.** `COMMERCIAL_LICENSE_DRAFT.md` is not a final contract. The seller must decide the contracting identity, one-end-product grant, contractor access, support/update/refund terms, and obtain qualified legal review for applicable law and enforceability.
4. **Hosted integration — OPEN.** Live Cloudinary upload has not been verified with disposable credentials. Protected Vercel preview access has prevented full browser testing against the deployed preview. The successful browser tests use isolated local/mock API conditions; backend integration tests use disposable test infrastructure.
5. **Buyer installation — OPEN.** No fresh customer-machine extraction, configuration, installation, smoke test, or final checksum verification has been completed.
6. **Payment scope — LIMITED.** Only Cash on Delivery is supported. No payment gateway, card processing, or server-side payment verification is integrated. Keep this limitation prominent; do not collect card details or claim online card payments.
7. **Demo/business content — OPEN.** Product names/specifications, USD prices, stock, discounts, warranties, shipping, ratings, testimonials, brand references, support email/phone, and store identity require owner verification or replacement before a real store is used. Do not present sample testimonials, ratings, availability, or claims as real customer evidence.
8. **Distribution channel — OPEN.** Marketplace seller verification, Nigeria payout eligibility, fees, tax obligations, and payout setup have not been verified.

## Prohibited while HOLD remains

- Do not merge this QA branch into `main`.
- Do not deploy to production or change production data/configuration.
- Do not publish a marketplace listing or paid download.
- Do not distribute a customer ZIP.
- Do not claim legal clearance, full hosted end-to-end coverage, or buyer readiness.
- Do not enable card payments or imply that they are available.

## Safe next sequence

1. Complete a full reference scan and visual/source review of every retained asset; replace or exclude uncertain assets only after confirming references and preserving originals where appropriate.
2. Finalize the exact source-only dependency scope and complete the package-specific third-party notices.
3. Resolve seller-approved commercial terms and qualified legal review.
4. Verify Cloudinary using disposable credentials and perform a fresh buyer-machine installation using a disposable database.
5. Build and inspect the exact source-only archive, verify its notices and checksum, then repeat CI on the final archive commit.
6. Reassess distribution eligibility and obtain explicit release authorization.

**Current result: technical QA on the isolated branch is green; commercial release remains HOLD.** No production deployment, payment change, marketplace publication, or merge to `main` was performed.
