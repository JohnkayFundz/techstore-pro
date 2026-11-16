# Browser QA and Preparation Archive Report

**Date:** 2026-11-16  
**Branch:** `product/paid-starter-kit-preparation`  
**Tested commit:** `52422acc51ef688e26f58972f980bc46c69224a7`  
**Status:** PARTIAL — NOT RELEASE CLEARANCE

## CI verification

GitHub Actions Run #201 completed successfully:
- Run ID: `43916157947`
- Commit: `52422acc51ef688e26f58972f980bc46c69224a7`
- Result: `success`
- Job: `Clean install, security audit, lint, build and backend tests`
- All 20 job steps completed successfully, including root/backend clean installs, root/backend dependency audits, repository ESLint, frontend build, backend unit tests, backend syntax checks, lockfile artifact upload and lockfile commit step.
- Run: https://github.com/JohnkayFundz/techstore-pro/actions/runs/43916157947

## Browser QA performed

A clean root `npm ci` completed in an isolated Vercel sandbox (388 packages audited; 0 vulnerabilities). Playwright Chromium was installed in that disposable sandbox. The production Vite build completed successfully (2,262 modules transformed).

The built frontend was served locally with Vite Preview and opened in Chromium at:
- Desktop: 1440 × 1000
- Mobile: iPhone 13 emulation (390 px CSS viewport)
- Tablet: 820 × 1180

Observed on all three sizes:
- Frontend document returned HTTP 200.
- Expected page title and primary homepage heading rendered.
- No horizontal document overflow was detected.
- All discovered links had visible text or an accessible name.
- Search fields expose the accessible name `Search products`.
- No uncaught page-level JavaScript exception was observed.

### Known test limitation / failure

The local Vite Preview served only the frontend bundle. No backend API or MongoDB service was started in this isolated browser test, and `VITE_API_URL` was not configured. Consequently, settings and product API requests returned HTTP 404 and the page displayed its expected “Unable to load products” error state. This is an environment limitation, not evidence that live backend integration works or fails.

The deployed Vercel preview could be fetched through the authenticated Vercel connector (homepage and web manifest both HTTP 200), but direct Playwright navigation was redirected to Vercel's login/SSO screen. Therefore, this report does **not** claim browser E2E testing against the deployed preview, a live backend, authentication, cart/checkout, order lifecycle, or admin workflows.

## Preparation archive assembled and checked

A source-only archive was created from the tested commit using `git archive`:
- File: `techstore-pro-preparation.zip`
- Contents: 382 tracked files
- Uncompressed contents: 2,764,539 bytes
- ZIP integrity check: passed (`unzip -t`, no compressed-data errors)
- SHA-256: `ef916e4a3deb19db8d3fb78964bc0a4d5fcb3c05008c6494fe91a4497c92`
- Git metadata and installed `node_modules` are not included.
- Only environment templates (`.env.example`, `server/.env.example`) are included; no populated `.env` file was found in the archive.

This is a **preparation archive only**. It has not been released or supplied as a customer package. The archive still contains draft commercial licensing material and preliminary third-party notices, and it has not passed a complete asset-rights/licence review, customer extraction-and-install test with a configured backend, or final legal review. Do not sell or distribute it as a cleared commercial product.

## Remaining release gates

1. Complete browser E2E against the deployed, access-controlled preview with an isolated hosted test backend/database; cover order submission and lifecycle, admin workflows, and confirm parity with the isolated local tests below.
2. Resolve and test Cloudinary integration with isolated disposable credentials.
3. Complete provenance and redistribution-rights review for all images, GIFs, fonts, icons and brand/trademark references.
4. Complete third-party licence notices and verify the final package contents.
5. Finalize the owner-approved commercial licence and obtain qualified legal review.
6. Produce a customer archive only after the above gates, then perform clean extraction, setup, smoke and checksum verification.

## Verification addendum — latest branch HEAD

The preparation branch advanced to `564a300abbe7c498e65058492b236cff8dbefa3d` (documentation-only report commit). GitHub Actions Run #202 then completed successfully against that exact HEAD:
- Run ID: `43917596780`; run number: #202; event: push; result: `success`.
- Job: `Clean install, security audit, lint, build and backend tests`.
- All job steps passed, including clean installs, root and backend dependency audits, ESLint, frontend build, backend tests and backend syntax validation.
- Run: https://github.com/JohnkayFundz/techstore-pro/actions/runs/43917596780

A separate rerun of the backend test suite inside the disposable Vercel sandbox also passed: 17 tests, 17 passed, 0 failed, 0 skipped. Coverage included Cloudinary upload-helper behavior (mocked, not a live Cloudinary account), order transactions/stock handling against an in-memory replica-set test database, authentication, and cash-on-delivery payment lifecycle rules. No Docker executable was available in that sandbox, and no disposable deployed backend/database credentials were configured, so this did not close the browser E2E or live Cloudinary gates.

The application-code HEAD covered by Run #202 is `564a300abbe7c498e65058492b236cff8dbefa3d`. The subsequent commits `41ccab75da836840e54cdf0744c61f238d9bb532` and `e259342aa2f113987857518965e659d94945a59a` update this report only; they do not change application code. Run #205 (ID `43919063713`) completed successfully against final documentation commit `26fb8a36d482e02b1e35a5b088d5986b3b337870`; all job steps passed, including lint, build, audits, backend tests and syntax checks. Run: https://github.com/JohnkayFundz/techstore-pro/actions/runs/43919063713.

**Release decision: HOLD.** No changes were made to `main`, production, payment configuration, or public release state.


## Isolated full-stack browser QA addendum — 2026-11-16

An isolated, disposable full-stack test environment was assembled inside the Vercel sandbox. This is additional test evidence and does not change the release decision.

### Test environment

- Backend: the repository's Express application, running locally in the sandbox.
- Database: a one-node `MongoMemoryReplSet` replica set; ephemeral and discarded with the sandbox process.
- Seed data: 12 repository sample products.
- Frontend: a fresh Vite production build with `VITE_API_URL` pointed to the isolated local API at `/api`.
- Browser: Playwright Chromium.
- Test-only JWT secret and test customer accounts were created inside the disposable sandbox. No production credentials, external database, Cloudinary credentials, or live payment services were used.

### Browser results

The integrated frontend and API were exercised at desktop (1440 px), tablet (820 px), and mobile (390 px) widths.

All three viewports:
- Homepage returned HTTP 200 and rendered the expected title and heading.
- Product catalogue rendered 10 product cards.
- Product and settings API requests returned HTTP 200.
- No horizontal overflow was detected.
- No uncaught browser page errors or failed network requests were observed.
- No product-loading, network, route-not-found, or connection-error state appeared.

The initial `GET /api/auth/me` returned HTTP 401 while the browser was unauthenticated; this is the expected guest response, not a failed catalogue request.

### Functional paths verified

- Test customer registration returned HTTP 201; authenticated customer identity appeared in the site header after reload.
- Product list API returned HTTP 200 with 12 seeded products.
- Product search for `iPad` returned HTTP 200 and the matching `iPad Pro M4` item.
- Category filtering for `Laptops` returned HTTP 200 and matching laptop records.
- The `iPad Pro M4` product detail route rendered the expected product details.
- Adding the product to the cart updated the cart; the cart page displayed one item and the expected total.
- The checkout page rendered the delivery form fields (full name, phone, address, city, state, country) and the supported Cash on Delivery option.

The browser test intentionally stopped before submitting an order. It did not create an order, charge money, or change any external system. Existing backend automated tests separately exercise order transaction/stock handling and cash-on-delivery lifecycle behavior. This browser run does not claim full order submission, customer order-history, or admin-workflow E2E coverage.

### Remaining integration limitations

- The deployed Vercel preview is still only verified for successful HTTP delivery of the homepage and web manifest. Its protected browser route redirects direct Playwright navigation to Vercel authentication, so the deployed preview has not received full browser E2E coverage.
- Cloudinary credentials were absent in the isolated environment; the application logged the expected missing-configuration warning. Live upload integration remains unverified.
- No real payment gateway is integrated; the available checkout method remains Cash on Delivery.
- Full asset provenance, redistribution rights, third-party licence notices, and legal review remain open.

The isolated browser QA is a meaningful improvement over the earlier frontend-only smoke test: the local frontend now ran against a working disposable backend/database, and the guest, registration, catalogue, search, product detail, cart, and checkout-form paths were exercised. It does not close the remaining hosted integration, Cloudinary, legal, or release-package gates.

**Release decision: HOLD.** No application code was changed by this addendum. No changes were made to `main`, production, payment configuration, or public release state.


### CI and preview verification for this addendum

- GitHub Actions Run #207 (ID `43921863672`) completed successfully against this addendum's source commit `9588607e4c25d4d6e2b7e080eb2059edb4c21334`.
- All workflow steps passed: root/backend clean installation, dependency audits, ESLint, frontend build, backend tests, syntax validation, lockfile artifact upload, and lockfile commit step.
- Run: https://github.com/JohnkayFundz/techstore-pro/actions/runs/43921863672
- Vercel deployment for commit `9588607e4c25d4d6e2b7e080eb2059edb4c21334` reached `READY`; its homepage and web manifest both returned HTTP 200 through the authenticated Vercel fetch.
- This preview deployment is delivery verification only; protected browser E2E against the deployed preview remains open.
