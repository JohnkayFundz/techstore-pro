import Skeleton from "./Skeleton";

function ProductDetailsSkeleton() {
  return (
    <section
      className="product-details-skeleton"
      aria-label="Loading product details"
      aria-busy="true"
    >
      <div className="product-details-grid">
        <div className="product-image-skeleton">
          <Skeleton
            width="100%"
            height="420px"
            borderRadius="12px"
          />
        </div>

        <div className="product-info-skeleton">
          <Skeleton
            width="70%"
            height="36px"
            className="mb-20"
          />

          <Skeleton
            width="30%"
            height="24px"
            className="mb-20"
          />

          <Skeleton
            width="45%"
            height="28px"
            className="mb-24"
          />

          <Skeleton
            width="100%"
            height="18px"
            className="mb-12"
          />

          <Skeleton
            width="95%"
            height="18px"
            className="mb-12"
          />

          <Skeleton
            width="90%"
            height="18px"
            className="mb-24"
          />

          <div className="skeleton-actions">
            <Skeleton
              width="140px"
              height="48px"
            />

            <Skeleton
              width="180px"
              height="48px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetailsSkeleton;