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

The inspected `src/components/Hero.jsx` contains the following sample marketing statements:

- "30+ Products" and "15+ Brands".
- "24/7 Support".
- "Rated 4.9/5" / "Customer Rating".
- "Free Shipping" and "UP TO 40% OFF".
- "Secure Payment" / "100% protected checkout".
- "nationwide delivery" and "Fast Delivery".

These are unverified sample claims, not evidence of actual inventory, customer ratings, support coverage, discount terms, shipping policies, or payment security. Replace them with buyer-confirmed information before a buyer deploys a real store or before screenshots are used to market the starter kit.

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
- Complete the clean install, lint, backend runtime, and functional test gates in `VERIFICATION_STATUS.md`.

## Decision

**Demo catalog identified: PASS (scope-limited).**  
**Artwork and trademark redistribution review: NOT CLEARED.**  
**Customer archive composition: NOT BUILT / NOT VERIFIED.**  
**Commercial publication: NOT AUTHORIZED.**
