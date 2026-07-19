import ProductGrid from "../components/ProductGrid";
import products from "../data/products";

function Products() {
  return (
    <div className="container">
      <h1>Products</h1>
      <ProductGrid products={products} />
    </div>
  );
}

export default Products;