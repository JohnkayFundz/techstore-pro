# TechStore Pro — Customer Package and Demo Asset Review

**Review date:** 2026-11-14  
**Branch:** `product/paid-starter-kit-preparation`  
**Status:** Preliminary review; commercial release remains on HOLD.

## 1. Product catalog is demonstration data

The frontend catalog in `src/data/products.js` and backend seed catalog in `server/data/products.js` contain 12 example electronics products. The inspected records use `/placeholder-product.png` for product imagery. The catalog is priced in USD and includes example stock, discount, shipping, warranty, ratings, and merchandising flags.

Before a buyer uses this as a real store:
- Replace example prices, inventory, shipping, warranty, ratings, and product descriptions with verified business data.
- Do not present the sample stock, ratings, discounts, or warranty statements as real-world claims.
- Upload product photographs that the store owner has rights to use.
- Confirm local currency, tax, delivery, and returns policies.

The sample product names include third-party brand and model names (for example Apple, Samsung, Dell, Sony, and Anker). They are descriptive demo catalogue entries, not an endorsement, affiliation, or authorization from those manufacturers.

## 2. Image and icon provenance

The repository currently contains:
- `public/placeholder-product.png` — a tiny placeholder image file.
- `src/assets/hero.png` — provenance and redistribution rights not established in this review.
- `src/assets/react.svg` and `src/assets/vite.svg` — third-party project marks; retain applicable notices and follow their usage terms.
- `public/favicon.svg` — source/provenance not established in this review.
- `public/icons.svg` — includes recognizable Bluesky, Discord, GitHub, and X brand marks alongside custom-looking symbols. Verify each mark's source and applicable brand guidelines before redistribution or promotional use.

This is not a legal clearance. Do not describe all artwork, logos, or catalog images as seller-created until their provenance is verified.


## 2A. Storefront demo claims and remotely hosted hero media

The inspected `src/components/Hero.jsx` previously contained unverified sample marketing claims. These were replaced on 2026-11-14 with explicit demo-store copy:

- The hero now identifies the page as a demo storefront and tells buyers to replace sample catalog, pricing, delivery, payment, and support details.
- Promotional and rating cards are labelled as demo content.
- Delivery and payment feature text directs the buyer to configure real shipping terms and connect/verify a payment provider.

The sample text still needs buyer-specific customization before deployment. Do not use demo content as a factual claim about a real business.

The same hero component hotlinks a technology photograph from Unsplash (`images.unsplash.com/photo-1518770660439-4636190af475`). It is not a locally bundled image. Do not promise that this external image will remain available; verify its applicable use terms and replace it with buyer-owned media for a real store.

The inspected `index.html` references `/favicon.svg`, and `public/manifest.webmanifest` also references that favicon. Its provenance remains unresolved. `src/components/Hero.jsx` uses a remote image rather than directly importing `src/assets/hero.png`; this limited inspection does not prove that `hero.png` is unused elsewhere. Do not exclude or redistribute it until a complete reference and provenance check is done.

## 3. Non-runtime/demo artifacts to assess for exclusion

The repository includes a `gifs/` directory containing numbered frame PNGs and two small base64-named text files, plus `scripts/capture-frames.cjs`. The capture script hard-codes a Windows Chrome executable path and navigates to `http://localhost:5175/`.

These appear to be development/demo capture artifacts rather than required application runtime assets. Confirm they are not imported or linked by the application before excluding them from the customer archive. This review does not delete them.

## 4. Customer archive rules

For the first commercial archive:
- Include source code, manifests, lockfiles, environment examples, setup guide, and applicable third-party notices.
- Exclude `node_modules`, secrets, real environment files, local databases, logs, and personal machine artifacts.
- Do not silently bundle third-party product photography, logos, or other assets without a documented redistribution basis.
- If asset rights remain unclear, replace the asset with a seller-created placeholder or leave it out, and explain how the buyer can add their own.
- Keep demo data clearly labelled and make it easy for buyers to replace it.
- Verify the archive itself after it is built; a GitHub source tree or Vercel preview is not the final customer ZIP.

## 5. Outstanding checks

- Trace the provenance and license/brand permissions for `hero.png`, `favicon.svg`, `icons.svg`, and all non-placeholder media. Replace unverified hero claims and confirm the remote Unsplash image terms/availability.
- Confirm whether the `gifs/` and `scripts/capture-frames.cjs` files are referenced by the application.
- Verify that frontend and backend seed records remain consistent and that all seeded catalog values are clearly identified as examples.
- Clean root/backend installs, full dependency audits, repository lint, frontend build, backend syntax, and four upload-helper unit tests passed in Run #147 (with documentation-only follow-up runs #148–#150 also passing). Backend runtime, MongoDB/API integration, and end-to-end functional tests remain outstanding.

## Decision

**Demo catalog identified: PASS (scope-limited).**  
**Artwork and trademark redistribution review: NOT CLEARED.**  
**Customer archive composition: NOT BUILT / NOT VERIFIED.**  
**Commercial publication: NOT AUTHORIZED.**


## Latest technical verification — 2026-11-14

GitHub Actions Run #147 ([43624153579](https://github.com/JohnkayFundz/techstore-pro/actions/runs/43624153579)) completed successfully on commit `e00dd776f8cc3f6d6e8d81dadbdd7cff5a8e05c8`. Root and backend clean installs, both dependency audits, repository-wide lint, frontend build, backend unit tests (4/4), backend syntax checks, and verified lockfile upload/commit all passed. This does not change the asset-rights findings above: the image/icon/trademark redistribution review remains **NOT CLEARED**, and the customer archive remains **NOT BUILT / NOT VERIFIED**.


## Additional static asset inventory — 2026-11-14

The branch tree contains the following image/vector assets: `gifs/frame000.png` through `gifs/frame029.png`, `public/favicon.svg`, `public/icons.svg`, `public/placeholder-product.png`, `src/assets/hero.png`, `src/assets/react.svg`, and `src/assets/vite.svg`.

A content inspection of the SVG files confirms:
- `public/icons.svg` contains recognizable Bluesky, Discord, GitHub, and X brand marks, plus other icon paths. The origin and permission basis for each copied brand mark is not recorded here.
- `src/assets/react.svg` and `src/assets/vite.svg` are recognizable React/Vite project marks. Their presence in the source tree is not proof that their brand artwork is cleared for resale as part of a template.
- `public/favicon.svg` is a custom-looking purple lightning/bolt illustration, but no creation record or provenance was found in the repository review.
- `src/assets/hero.png` remains unverified. Its usage was not assumed absent merely because the reviewed Hero component hotlinks an Unsplash image.
- The 30 GIF frame PNGs were enumerated but not individually provenance-cleared or proven unused.

No assets were deleted or replaced during this pass. A text-only repository-tree inventory cannot establish authorship, license, trademark permissions, or complete source-code references. The package remains blocked from commercial redistribution until those are verified or the uncertain assets are removed/replaced through a separately reviewed change and CI passes.


## Follow-up scope and reference limitations — 2026-11-14

The Git tree at preparation commit `846bdf6622417826658c66f753657f0ad26c51a0` confirms the tracked asset paths listed above and also contains `gifs/cart-b64.txt` and `gifs/cart-base64.txt` (23 and 24 bytes respectively). The tree is evidence of tracked paths only; it does not establish who created an asset or whether it can be redistributed.

A GitHub code-search attempt for the literal filenames `hero.png`, `icons.svg`, and `favicon.svg` returned no indexed matches. Because GitHub code search reported incomplete results, this is **not** proof that the files are unused. No asset was removed, replaced, or declared cleared on that basis. A complete local reference scan and visual/provenance review are still required before archive composition.

Run #151 and #152 passed after the dependency metadata and static-asset inventory documentation updates. These are documentation-only checks and do not close any licensing or asset-rights gate.
