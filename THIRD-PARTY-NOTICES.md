# Third-Party Notices and Dependency License Inventory

**Status: SPDX metadata inventory; not yet a complete legal notice package. Do not represent this file as complete legal clearance or distribute bundled dependencies on its strength alone.**

This inventory is derived from the committed root and server npm lockfiles. It records each locked package/version and its declared SPDX license expression. Lockfile metadata does not replace inspection of exact upstream LICENSE/COPYING/NOTICE files, attribution, patent terms, source-distribution obligations, or trademark terms for the exact archive.

## Review required

- Preserve exact upstream license and NOTICE texts for every included dependency; do not collapse combined expressions such as MIT AND ISC.
- Review MIT, ISC, Apache-2.0, BSD-2-Clause, BSD-3-Clause, BlueOak-1.0.0, MPL-2.0, CC-BY-4.0, Unlicense and 0BSD packages against their exact upstream versions.
- Backend lockfile entries for busboy@1.6.0 and streamsearch@1.1.0 omit modern SPDX metadata; prior review found legacy MIT declarations, but exact license texts must still be retained in the final archive.
- Prefer source plus lockfiles and buyer-side dependency installation. Do not bundle node_modules without a complete package-specific notice review.
- Check MPL-2.0 source-distribution obligations against the precise archive contents.

The machine-readable lockfile inventory and exact upstream notice collection must be generated/reviewed before customer distribution. This document is a compliance workpaper, not legal advice.
