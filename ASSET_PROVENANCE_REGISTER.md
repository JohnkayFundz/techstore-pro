# Asset Provenance Register

**Branch:** `qa/customer-e2e`  
**Reviewed source commit:** `7213dd34031aa12887da19856e9ab89681a3d4ab`  
**Scope:** QA branch only. This register describes files present at the reviewed source commit; it is not a blanket license or legal clearance.

## Current repository graphics

| Path | Purpose | Provenance recorded | Use / limitation |
|---|---|---|---|
| `public/techstore-hero.svg` | Hero illustration | Original neutral SVG markup authored for the QA cleanup | Placeholder artwork only |
| `public/techstore-mark.svg` | App mark | Original neutral SVG markup authored for the QA cleanup | Application icon/mark; not a third-party brand |
| `public/placeholder-product.svg` | Product fallback | Original neutral SVG markup authored for the QA cleanup | Placeholder only; not product photography |
| `public/icons.svg` | Symbol sprite | Original neutral SVG markup authored for the QA cleanup | Neutral interface symbols |
| `public/icons-neutral.svg` | Symbol sprite compatibility path | Original neutral SVG markup authored for the QA cleanup | Neutral interface symbols |

These entries document the stated origin of the replacement SVGs. They do not clear future seller uploads, third-party logos, fonts, photography, video, or promotional content.

### Limited current-head path spot-check

At QA commit `a58f33559ebb703584684958cf00e8e305bc8bd6`, each of the five SVG paths listed above was fetched successfully from the repository. `public/icons.svg` and `public/icons-neutral.svg` had the same Git blob (`5e87e9119f84e3fc4d063e5a93b22cfa07fd618c`) at that checked commit. This is a limited existence/content-identity check of the five registered paths only; it is not a full tracked-tree scan, reference scan, visual review, authorship verification, or legal clearance. Re-run the full tree/reference review against the release-candidate commit before packaging.

## Historical files removed from this branch

The following items were removed in the QA cleanup and are **not current repository assets**:

- `gifs/frame000.png` through `gifs/frame029.png` — unverified media sequence.
- `gifs/cart-b64.txt` and `gifs/cart-base64.txt` — encoded decorative media payloads.
- `src/assets/hero.png` — provenance not established.
- `src/assets/react.svg` and `src/assets/vite.svg` — unused framework starter marks.
- `public/favicon.svg` — removed during replacement.
- `public/reference-assets/favicon-original.svg` and `public/reference-assets/icons-original.svg` — removed; neither file is retained.
- `public/placeholder-product.png` — replaced by the authored SVG fallback.

This historical removal list is not a list of remaining review items.

## Remaining asset and release checks

- Verify the actual tracked tree and references at the current QA head before any release candidate is prepared.
- No external asset URL is approved by this register.
- Seller-provided product photos, logos, fonts, videos, testimonials, and promotional media require asset-specific rights evidence and provenance records before inclusion.
- Confirm any font or icon package against its upstream license and notice requirements; this register does not replace dependency-license review.
- Keep unverified media excluded until the relevant evidence is recorded.

## Status and limitations

The replacement SVGs are neutral placeholders, not product photography or proof of commercial asset clearance. This document records repository cleanup and provenance assertions only. It is not legal advice, does not grant rights, and does not clear third-party dependencies or future content. Commercial release remains blocked until the separate dependency-license, asset-rights, buyer-install, and release checks are completed.
