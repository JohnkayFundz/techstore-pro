import ProductCard from "./ProductCard";

function ProductGrid({ products }) {
  return (
    <div className="products-grid">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}

export default ProductGrid;