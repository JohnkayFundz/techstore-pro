# TechStore Pro — Release Readiness Gate

**Current decision: TECHNICAL CI PASS / COMMERCIAL RELEASE HOLD.**  
**Branch:** `product/paid-starter-kit-preparation`  
**Main branch:** unchanged; no merge or production deployment has been performed.

This file is the release-control summary. A successful CI workflow is necessary but does not establish commercial, legal, or production readiness.

## Completed preparation

- [x] Root and backend lockfiles reconciled and clean-install checks pass in GitHub Actions.
- [x] Full root and backend dependency audits pass with zero reported vulnerabilities in the latest verified run.
- [x] Repository-wide ESLint passes without the earlier lint-rule weakening approach.
- [x] Frontend production build passes.
- [x] Backend unit/integration suite passes: 17 tests covering auth/JWT, MongoDB replica-set order transactions, cash-only payment restrictions, and Cloudinary upload-helper behavior.
- [x] Backend JavaScript syntax checks pass.
- [x] Checkout is explicitly cash-on-delivery only; card orders are rejected. No payment gateway is represented as integrated.
- [x] Buyer setup guide and README now recommend lockfile-based `npm ci` installs.
- [x] Hero, favicon/app mark, and active social icon sprite replaced with neutral local SVG artwork; original favicon and icon sprite preserved under `public/reference-assets/`.
- [x] Marketplace listing and asset review documents updated to disclose current limitations.

## Blocking gates before a paid customer archive

1. **Third-party notices:** `THIRD_PARTY_LICENSE_REVIEW.md` is a preliminary metadata inventory. `THIRD_PARTY_NOTICES_PARTIAL.md` is explicitly partial. Exact license texts/attribution obligations for all packages in the final dependency scope—including MPL-2.0, BlueOak, CC-BY, Unlicense, 0BSD and combined license expressions—must be reviewed and assembled. Do not ship `node_modules` without a complete review.
2. **Remaining asset provenance:** `src/assets/hero.png`, React/Vite marks, placeholder/product/demo imagery, the 30 GIF frame PNGs, GIF-related text files, and any other non-code media have not all been proven seller-owned or redistributable. A complete source-reference scan and visual review are not available through the current connected GitHub code-search index; empty search results are not proof of unused files.
3. **Commercial license:** `COMMERCIAL_LICENSE_DRAFT.md` remains a draft. The seller must confirm contracting identity, scope of the one-end-product grant, contractor access, support/update/refund terms, and seek qualified legal review for governing law, consumer rights, disclaimers, liability and enforceability. Do not present the draft as a final license.
4. **Functional verification:** browser-based frontend/backend end-to-end flows have not been run. Live Cloudinary upload verification and a fresh buyer-machine installation have not been performed. CI unit/integration tests do not replace these checks.
5. **Payment capability:** online card/payment-provider processing is not implemented. If the commercial listing implies online payments, implement and test provider integration with server-side verification and webhooks first. Otherwise keep the cash-only limitation prominently disclosed.
6. **Customer archive:** no customer ZIP has been built or inspected. Only after the preceding gates are closed should a source-only archive be assembled, excluding `node_modules`, secrets, local data, reference-only assets, and any asset without a documented redistribution basis. Inspect the exact archive and its notices.
7. **Distribution channel:** marketplace seller verification, Nigeria payout eligibility, fees, taxes, and payout setup remain unverified. Do not publish or make income claims before these are confirmed.

## Release prohibitions while HOLD remains

- Do not merge this branch into `main`.
- Do not deploy to production.
- Do not publish a marketplace listing or paid download.
- Do not distribute a customer archive.
- Do not claim legal clearance, full end-to-end testing, or production readiness.
- Do not enable card payments or collect card details.

## Current technical evidence

GitHub Actions Run #185 (2026-11-14) passed root/backend clean installs, dependency audits, repository-wide lint, frontend build, all 17 backend tests, backend syntax checks, and lockfile verification/commit. See the linked workflow in the project verification record. Later documentation-only commits are being revalidated by their own GitHub Actions runs; always check the latest run before describing the branch as currently CI-green.

**Final state:** the preparation work is materially advanced, but the commercial product is not yet cleared for sale. The remaining gates require package-specific license review, asset provenance, owner/legal decisions, application-level testing, and final archive inspection—not merely another CI run.
