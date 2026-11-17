# TechStore Pro — Asset Provenance Register

**Reviewed:** 2026-11-17  
**Branch:** `qa/customer-e2e`  
**Reviewed commit:** `f12dc977fb5cdc8b7df0427ff51a80c922844bae`  
**Decision:** PARTIAL INVENTORY — NOT DISTRIBUTION CLEARANCE

This register records repository evidence and current use where confirmed. File presence, a neutral appearance, or a successful build does not prove authorship, license, trademark permission, or redistribution rights.

## Active neutral artwork — replacement work completed

| Asset | Observed use | Current status |
|---|---|---|
| `public/techstore-hero.svg` | Referenced by `src/components/Hero.jsx` | Active local neutral hero replacement; authorship/redistribution should still be retained in project records |
| `public/techstore-mark.svg` | Referenced by `index.html` and `public/manifest.webmanifest`; service worker cache updated to this path | Active neutral app mark |
| `public/icons.svg` / `public/icons-neutral.svg` | Neutral symbol sprite replacement retained in public assets | Active neutral replacement documented; verify all runtime symbol references during final archive scan |

The earlier favicon and brand-mark sprite are retained at `public/reference-assets/favicon-original.svg` and `public/reference-assets/icons-original.svg`. Treat these as reference-only and exclude them from any customer archive unless separately cleared. Their retention is not permission to redistribute them.

## Remaining assets and content requiring review

| Asset/content | Evidence | Required action |
|---|---|---|
| `src/assets/hero.png` | Tracked PNG; no complete branch-wide import/reference proof recorded | Inspect visually and scan all references; exclude only after confirming no runtime/build dependency, or document rights |
| `src/assets/react.svg`, `src/assets/vite.svg` | Recognizable third-party project marks | Confirm exact source terms and whether retained; remove from deliverable if not needed and not cleared |
| `public/placeholder-product.png` | 68-byte placeholder referenced by both frontend and backend sample product data | Replace with buyer-owned product images during store setup; do not represent as a finished catalogue |
| `gifs/frame000.png`–`frame029.png` | 30 tracked frame PNGs; capture script writes them to `gifs/` | Trace script/build/runtime references and establish source/provenance before inclusion |
| `gifs/cart-b64.txt`, `gifs/cart-base64.txt` | Small text artifacts associated with frame capture | Trace references and origin; exclude from customer archive if confirmed non-runtime |
| Demo product catalogue | Frontend and backend seed data contain 12 sample electronics records, USD pricing, sample stock/discount/warranty/shipping/rating values | Clearly label as demo and replace with verified store-owner data |
| Testimonials and brand section | Source includes named sample testimonials, “Verified Buyer” wording, “Thousands” claim, and third-party brand names | Do not present as real social proof or affiliation; replace with owner-verified content before real-store use |
| Footer contact details | Source contains hard-coded support email and phone/WhatsApp details | Confirm the store owner's intended public contact details and replace before buyer deployment |

## Limits of this review

- The repository tree confirms tracked paths, not who created them.
- GitHub code search is not a complete branch-specific reference scan; a no-result search must not be treated as proof an asset is unused.
- This pass does not visually inspect every binary image or establish license/brand permissions.
- No assets were deleted by this register.
- The current CI pass does not close provenance or redistribution-rights questions.

## Distribution rule

Do not include uncertain or reference-only assets in a paid customer archive. The archive must be source-only unless a separate review clears every bundled asset and dependency. Exclude `node_modules`, populated environment files, secrets, local databases, logs, and personal machine artifacts. Verify the exact archive and its checksum after all blockers are resolved.

**Asset replacement requested for hero/app mark/social sprite: DONE. Full asset provenance and redistribution clearance: NOT DONE.**
