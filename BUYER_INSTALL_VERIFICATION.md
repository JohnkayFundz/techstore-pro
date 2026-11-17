# TechStore Pro — Buyer Clean-Install Verification Protocol

**Status:** NOT YET EXECUTED — this document defines the acceptance procedure; it is not evidence of a successful buyer installation.
**Target:** a clean, separate customer-controlled machine and a source-only release candidate.

## Preconditions

- Complete archive-specific third-party license/notice review and obtain seller/legal approval before creating a distributable archive.
- Use a fresh archive generated from the approved QA commit. Record the full commit SHA and SHA-256 checksum.
- Do not use production credentials, customer data, or live payment credentials.
- Prepare a disposable MongoDB database and a dedicated non-production Cloudinary account if upload verification is in scope.
- The buyer must receive configuration instructions, not the seller's environment files or secrets.

## 1. Archive inspection

1. Confirm the archive contains only intended application source, manifests, lockfiles, documentation, and required license/notice materials.
2. Confirm it excludes environment files, private keys, tokens, credentials, node_modules, caches, logs, local databases, editor state, build leftovers, and unrelated repository history.
3. Scan filenames and file contents for secret patterns and personal data. Investigate every match; do not publish raw scans containing secrets.
4. Confirm all included media has documented provenance and redistribution permission. Confirm the dependency notice bundle matches the actual shipped scope.
5. Extract the archive into a new empty directory and verify its SHA-256 against the recorded value.

## 2. Fresh installation

1. Record OS, architecture, Node.js and npm versions.
2. Run npm ci at the repository root.
3. Run npm ci in server/.
4. Do not use npm install as a substitute for the lockfile-based clean install.
5. Run the documented lint, frontend build, backend tests, and syntax checks.
6. Record command, exit code, duration, and sanitized logs.

## 3. Configuration and startup

1. Copy documented example environment files into local, untracked environment files.
2. Set only buyer-owned, non-production values: disposable MongoDB URI, newly generated JWT secret, local client/API origins, and optional dedicated non-production Cloudinary values.
3. Never send secrets to the seller through chat, tickets, screenshots, or logs.
4. Start backend and frontend using documented commands.
5. Verify health/readiness endpoints and confirm the backend connects only to the disposable database.

## 4. Functional smoke tests

- Register a new test customer and sign in/out.
- Browse/search/filter the demo catalog.
- Add/remove items from cart and wishlist.
- Create a test order using the documented cash-on-delivery flow.
- Verify stock/order behavior and order history in the disposable database.
- Sign in with a separately created test admin and verify authorized product/order administration.
- Verify unauthorized requests are rejected and customer responses do not expose password hashes or secrets.
- If Cloudinary is configured, upload a harmless test image, verify the returned URL/public identifier, then delete the test asset.
- Confirm no card-payment UI or card-payment API path is represented as operational.

## 5. Acceptance record

The tester should record archive filename, source commit SHA, SHA-256, extraction result, machine OS/architecture, Node/npm versions, root/backend clean-install results, lint/build/test results and test counts, configuration key names only (never values), functional outcomes, sanitized errors, optional Cloudinary result, deviations, unresolved failures, tester, and date.

## Pass criteria

Pass only when a clean extraction on a separate machine installs from both lockfiles, all documented checks pass, the application starts with buyer-owned non-production configuration, core customer/admin flows pass against disposable services, archive inspection finds no secrets or uncleared assets, and archive-specific notices/terms are approved.

**CI clean installs do not substitute for this independent buyer-machine test.** A READY Vercel preview does not prove a buyer installation or a configured production system.