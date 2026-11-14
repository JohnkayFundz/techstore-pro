# TechStore Pro — Marketplace Listing Draft

**Listing status:** Draft only. Do not publish until the release checks and commercial license are finalized.

## Product title

TechStore Pro — MERN E-commerce Starter Kit (React 19, Vite, Express & MongoDB)

## Short description

A full-stack JavaScript e-commerce starter project with a React storefront, Express API, MongoDB data models, customer authentication, product management, cart and wishlist flows, order workflows, and an admin area. Supplied as source code for developers who want a codebase to study, customize, and extend.

## Full description

Build on an existing MERN e-commerce codebase instead of starting from an empty folder.

TechStore Pro includes:

- React 19 and Vite frontend.
- Node.js and Express API.
- MongoDB and Mongoose models.
- Customer registration, login, and protected account routes.
- Product browsing, search, and category/product data.
- Cart and wishlist flows.
- Checkout and order creation workflow.
- Customer order history and cancellation workflow.
- Admin-protected product, order, and user management routes.
- Dashboard and sales analytics endpoints.
- Cloudinary image-upload integration (requires your own account and credentials).
- Optional AI shopping assistant configuration (requires your own supported API key/model and may incur provider charges).
- Buyer setup guide and environment templates.

## Important limitations — read before purchase

- **No payment gateway is integrated.** Checkout creates an order workflow; it does not charge a card or verify a provider payment. The backend includes a manual cash-payment recording workflow for an administrator. A real payment provider must be integrated and tested separately.
- This is source code, not a hosted store, domain, hosting plan, MongoDB account, Cloudinary subscription, AI subscription, or managed service.
- Buyers must configure their own database, environment variables, hosting, and external services.
- GitHub Actions Run #122 on the preparation branch passed repository-wide ESLint, the frontend production build, and the workflow's backend dependency/syntax validation. This is not a fresh clean-install or end-to-end verification on a separate machine. Do not advertise the project as production-ready or fully tested until those checks are completed.
- The root npm lockfile was regenerated on 2026-11-14 to include the declared Capacitor dependencies. GitHub Actions Runs #128 and #129 passed clean root `npm ci --ignore-scripts`, repository-wide lint, and frontend build. This is not a substitute for backend runtime/database or end-to-end testing.
- The third-party dependency license inventory is preliminary, not legal clearance. Review `THIRD_PARTY_LICENSE_REVIEW.md` and all applicable package notices before distributing the final archive.
- Product images, sample catalog content, fonts, and other non-code assets must be checked for redistribution rights before release.

## Intended buyer

- JavaScript / React developers.
- MERN-stack learners.
- Freelancers who want a codebase to customize for a client after completing their own review and required integrations.
- Developers building a portfolio or learning project.

## What the buyer receives

Planned delivery:
- TechStore Pro source archive.
- `README.md`.
- `BUYER_SETUP.md`.
- Final commercial license and third-party notices, once reviewed.

Do not promise a support period, installation service, updates, or client-use rights until those terms are explicitly set in the final license.

## Pricing hypothesis — not market-validated

- Nigeria: ₦15,000 introductory price.
- International: US$19 introductory price.

These are starting hypotheses only. Validate marketplace fees, payout eligibility, taxes, buyer demand, and platform rules before publishing or treating the amounts as net earnings.

## FAQ

### Does it accept online card payments?
No. A payment gateway is not integrated. The checkout/order workflow is present, but card payments and provider-side verification must be implemented separately.

### Is hosting included?
No. Buyers supply their own hosting, domain, database, and any paid external services.

### Do I need MongoDB?
Yes. The backend uses MongoDB through Mongoose.

### Are Cloudinary and AI services included?
No. Their integrations require the buyer's own credentials and may involve third-party charges.

### Can I use it for a real client store?
Only after you review and adapt the code, secure the deployment, add and verify a payment provider if required, test all critical flows, and confirm that your purchase license permits the intended use.

### Is this a guaranteed production-ready solution?
No. It is a developer starter project. A clean installation, full functional verification, security review, and production configuration remain the buyer's responsibility until the seller completes and documents those checks.

## Pre-publication checklist

- [x] Reconcile root `package.json` and `package-lock.json` using npm; clean root `npm ci --ignore-scripts` passed in GitHub Actions Runs #128 and #129.
- [x] Root clean install (`npm ci --ignore-scripts`) and backend `npm ci` passed in GitHub Actions Runs #128 and #129. A separate buyer-machine install remains advisable.
- [x] Run repository-wide lint and frontend production build in GitHub Actions (Run #122, commit `92a6d36c138d2a5ea4f55cdecb4856b10ae984b9`).
- [ ] Repeat lint/build after clean, reproducible installs.
- [ ] Run backend/API and frontend integration checks against disposable test data.
- [ ] Verify all advertised UI flows and correct screenshots.
- [ ] Review every image/font/icon/sample asset for redistribution rights.
- [ ] Resolve dependency-license items and include required notices.
- [ ] Finalize the commercial license.
- [ ] Prepare and inspect the exact customer archive.
- [ ] Confirm marketplace seller verification, payout method, fees, and supported country.
- [ ] Publish only after all material limitations are disclosed.
