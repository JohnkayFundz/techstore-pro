# Demo catalog setup

The bundled catalog contains one zero-stock item labelled **Sample Product — Demo Catalog Item**. It is not a real product offer, price, stock claim, review, warranty or shipping promise.

1. Replace server/data/products.js with products you are authorized to sell and media you are authorized to use.
2. Set accurate currency, price, stock, SKU, shipping, warranty and product details.
3. Run npm run seed from server/ to add/update the seed SKU. The normal seeder does not delete manually-created products.
4. Run npm run seed -- --clear-demo from server/ to explicitly delete only records whose SKU starts with DEMO-. This does not delete other products.
5. Update src/data/products.js to match the deployment catalog source.

Review the target database connection and take an appropriate backup before running any seeder against production.
