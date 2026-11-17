# Exact-version license source register

This register records source evidence used to supplement the package notice collector. It is not legal advice or a legal clearance opinion.

victory-vendor@37.3.6:
- Exact upstream FormidableLabs/victory tag v37.3.6, file LICENSE.txt; Git blob 4d33f1aba85636b665016cabb1b991209177c606.
- The published package omits its package-root license. The exact-tag MIT text is supplied as a narrowly scoped upstream override.
- Nested lib-vendor/*/LICENSE files are collected from the installed exact package.
- Effective expression is recorded as MIT AND ISC AND BSD-3-Clause based on the vendored components and upstream issue #3089: https://github.com/FormidableLabs/victory/issues/3089.

cookie-signature@1.0.6 and agent-base@6.0.2:
- Their exact upstream tagged README files contain complete MIT license sections; the collector extracts the full section from the installed package README (case-insensitive filename matching).

https-proxy-agent@5.0.1:
- The collector extracts a full license section from the installed package README only if the full license grant is present; otherwise the package remains unresolved.
