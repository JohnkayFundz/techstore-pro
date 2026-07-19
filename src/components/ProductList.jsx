// src/components/ProductList.jsx

import ProductCard from "./ProductCard";
import { products } from "../data/products";

function ProductList() {
  return (
    <section className="products-section">
      <h2>🛍️ Products</h2>

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}

export default ProductList;