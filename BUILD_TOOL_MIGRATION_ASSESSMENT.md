# Build-tool migration assessment — 2026-11-18

## Decision

**Do not migrate the production build tool as a response to the current picomatch advisory yet.** No replacement has been prototyped or validated against this application. This assessment is a scope and risk review, not evidence that another bundler is a drop-in replacement.

## Repository facts verified on `qa/customer-e2e`

- Root package scripts use Vite directly: `dev: vite`, `build: vite build`, and `preview: vite preview`.
- The current config is a minimal `vite.config.js` with `@vitejs/plugin-react`.
- Current root dev dependencies include `vite@^8.1.1` and `@vitejs/plugin-react@^6.0.3`.
- The React entry point `src/main.jsx` uses Vite's `import.meta.env.PROD` to conditionally register the service worker.
- ESLint config enables `eslint-plugin-react-refresh`'s `reactRefresh.configs.vite` preset.
- The root build is also called by the Capacitor sync script (`npm run cap:sync`), so a replacement must preserve the expected web output and native synchronization workflow.
- CI depends on `npm run build`, then runs Playwright browser tests against the resulting application. The release packager and notice generator also need to remain consistent with the replacement's output and dependency graph.

## Migration impact

A replacement must account for more than the single `vite.config.js` file:

1. Development server and preview behavior, including history fallback and asset base paths.
2. React JSX/refresh transforms and development experience.
3. `import.meta.env` semantics, production flags, and any other Vite-only APIs or asset handling in application code.
4. ESLint's Vite-specific React Refresh preset.
5. Output directory and static asset behavior consumed by the release packager, service worker, and Capacitor.
6. Playwright base URL/server startup and all existing customer-facing routes.
7. Complete root dependency audit and regenerated exact-version notices.
8. Clean install, lint, production build, all browser E2E tests, backend tests, package dry-run/inspection, and native sync validation.

## Candidate-selection rule

Do not select a replacement based only on marketing claims, superficial config similarity, or a successful hello-world build. A candidate must have an actively maintained official release, compatible React support, a supported production build and preview workflow, and a demonstrably clean dependency tree. The candidate must be prototyped on a separate experimental branch, never directly on `main` or the release QA branch.

## Required proof before adoption

- A written compatibility matrix against every item in the migration-impact list above.
- A minimal isolated prototype and then a repository-level migration proposal.
- Exact lockfile and package-manager reproducibility from a clean checkout.
- Zero high/critical audit findings in the root dependency tree (unless an explicitly approved policy says otherwise; no exception is currently approved).
- Passing lint, frontend build, all 4 existing Playwright E2E tests, backend audit, all 21 backend tests, and backend syntax checks.
- Verified release-packager output, static assets, service-worker behavior, and Capacitor web asset synchronization.
- Re-generated third-party notices and a package-specific license/provenance review for the new toolchain.

## Current disposition

The direct Vite dependency still constrains the vulnerable picomatch range, and no official patched picomatch release was verified in the upstream review recorded in `RELEASE_READINESS.md`. A forced Vite downgrade, unsupported override, unmerged fork, or unvalidated bundler migration is not an acceptable remediation.

**Release remains HOLD.** This assessment does not authorize a dependency change, merge, production deployment, buyer archive, or marketplace publication.
