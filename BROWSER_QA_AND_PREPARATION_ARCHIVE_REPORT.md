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
- SHA-256: `ef916e4a3deb19db4e1b8d3fb78964bc0a4d5fcb3c05008c6494fe91a4497c92`
- Git metadata and installed `node_modules` are not included.
- Only environment templates (`.env.example`, `server/.env.example`) are included; no populated `.env` file was found in the archive.

This is a **preparation archive only**. It has not been released or supplied as a customer package. The archive still contains draft commercial licensing material and preliminary third-party notices, and it has not passed a complete asset-rights/licence review, customer extraction-and-install test with a configured backend, or final legal review. Do not sell or distribute it as a cleared commercial product.

## Remaining release gates

1. Browser E2E against a deployed, access-controlled preview with a disposable test backend/database; cover authentication, catalogue, search/filter, cart, checkout/COD, order management and admin workflows.
2. Resolve and test Cloudinary integration with isolated disposable credentials.
3. Complete provenance and redistribution-rights review for all images, GIFs, fonts, icons and brand/trademark references.
4. Complete third-party licence notices and verify the final package contents.
5. Finalize the owner-approved commercial licence and obtain qualified legal review.
6. Produce a customer archive only after the above gates, then perform clean extraction, setup, smoke and checksum verification.

**Release decision: HOLD.** No changes were made to `main`, production, payment configuration, or public release state.
