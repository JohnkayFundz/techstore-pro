# Security Advisory Withdrawal Record

**Status:** Recorded for QA audit trail; not a release approval  
**Recorded:** 2026-11-19  
**Target governance branch:** `qa/customer-e2e`

## Advisory disposition

GitHub Advisory Database record [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf) was withdrawn by GitHub on **2026-11-18**. The current official advisory record identifies the withdrawal and indicates that the report was withdrawn because it was determined not to be a security issue.

This is an upstream advisory-status change. It is **not** a package patch, a dependency upgrade, or evidence that a new `picomatch` release was installed. No npm override, downgrade, fork, or lockfile workaround was introduced to address this withdrawn advisory.

## CI evidence

GitHub Actions CI Run **#307**:

- Run ID: `44447820030`
- Commit: `34f7a7ed52c024167aa566fac5088cef81fbfc6b`
- Event: `pull_request`
- Result: **success**
- Run: https://github.com/JohnkayFundz/techstore-pro/actions/runs/44447820030
- Validation job ID: `135304152501`

The run's final strict security gate completed successfully. Its logs report:

- Root dependency audit: `found 0 vulnerabilities`
- Backend dependency audit: `found 0 vulnerabilities`
- Final root and backend `npm audit --audit-level=high` checks both returned success.

The preliminary audit steps are configured with `continue-on-error: true`; the final combined high-severity gate is not. The final gate is therefore the relevant pass/fail control.

## Dependency and lockfile evidence

The verified-lockfiles workflow artifact from Run #307 was uploaded as:

- Artifact ID: `14494785130`
- Name: `techstore-pro-verified-lockfiles.zip`
- ZIP SHA-256 recorded in the CI log: `d4192c283003caa6e5a8ef5a3d8d8519de24c561e411737f928ccc54b32ed69d`

The root lockfile at the Run #307 commit and the current `qa/customer-e2e` branch has the same Git blob SHA:

`67685edb4940344c258501aeaa6bc056b9365fc2`

Both inspected lockfile copies are lockfile version 3 and resolve:

- Package: `picomatch`
- Version: `4.0.7`
- Registry tarball: `https://registry.npmjs.org/picomatch/-/picomatch-4.0.7.tgz`
- Integrity: `sha512-qcJu88Q2IWqJsDD529JKMdwGm/dvInW4HvQnRwiH9JtihJvzGOscDtHE3x1pBKeUOTysQ8kVmLnJ2kJu7yhcGA==`

The QA lockfile and the lockfile at the Run #307 commit are byte-for-byte equivalent at the Git blob level. This record preserves the artifact ZIP checksum as the CI provenance value; it does not represent the ZIP checksum as an individual lockfile checksum.

## Interpretation and limits

The Run #307 zero-vulnerability result is consistent with GitHub's withdrawal of the cited advisory while `picomatch@4.0.7` remains unchanged. It must not be described as a picomatch security patch or as proof that all security risks have been eliminated.

This record resolves only the audit-trail question concerning `GHSA-fc5q-39xc-vjpf`. It does not provide legal, licensing, privacy, product-security, or commercial-release clearance.

## Remaining governance controls

- PR #13 has been squash-merged into `qa/customer-e2e` (merge commit `5771e62a527931c889bbaf0d2d98e6e1c114df88`); the QA pull-request trigger change is now part of the governance base.
- Preserve the external Nigerian legal and licensing review as an open blocker.
- Keep the commercial release decision at **HOLD**.
- Do not merge to `main`, deploy production, generate a release archive, or publish a commercial package on the basis of this record.
