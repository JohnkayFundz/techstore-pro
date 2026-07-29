import ProductCardSkeleton from "./ProductCardSkeleton";

function ProductGridSkeleton({
  count = 8,
}) {
  return (
    <section className="products-grid">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </section>
  );
}

export default ProductGridSkeleton;