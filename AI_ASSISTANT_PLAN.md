# TechStore Pro AI Shopping Assistant

Implementation plan for the AI shopping assistant. This feature is isolated from checkout, authentication, orders, and admin functionality.

## Scope
- Customer-facing chat UI in the storefront.
- Server-side AI endpoint so the API key is never exposed to the browser.
- Product-aware recommendations using active TechStore products.
- Clear recommendation reasons and links to product detail pages.
- Mobile-first UI consistent with the existing TechStore Pro design.

## Safety / compatibility
- Do not change checkout, order, authentication, admin, or existing product CRUD behavior.
- Do not expose OPENAI_API_KEY to Vite/client code.
- Keep production branches untouched until the feature is reviewed and tested.
- Require a production environment variable for the OpenAI key.

## Proposed flow
React assistant -> Express /api/ai/assistant -> MongoDB active products -> OpenAI -> structured recommendation response -> React UI.
