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

- Trace the provenance and license/brand permissions for `hero.png`, `favicon.svg`, `icons.svg`, and all non-placeholder media.
- Confirm whether the `gifs/` and `scripts/capture-frames.cjs` files are referenced by the application.
- Verify that frontend and backend seed records remain consistent and that all seeded catalog values are clearly identified as examples.
- Complete the clean install, lint, backend runtime, and functional test gates in `VERIFICATION_STATUS.md`.

## Decision

**Demo catalog identified: PASS (scope-limited).**  
**Artwork and trademark redistribution review: NOT CLEARED.**  
**Customer archive composition: NOT BUILT / NOT VERIFIED.**  
**Commercial publication: NOT AUTHORIZED.**
