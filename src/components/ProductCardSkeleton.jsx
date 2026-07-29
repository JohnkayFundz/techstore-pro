import Skeleton from "./Skeleton";
import "./ProductCardSkeleton.css";

function ProductCardSkeleton() {
  return (
    <article className="product-card skeleton-card" aria-hidden="true">
      {/* IMAGE */}
      <div className="skeleton-image-wrapper">
        <Skeleton width="100%" height="220px" borderRadius="18px" />
      </div>

      {/* CONTENT */}
      <div className="product-info">
        <Skeleton width="80px" height="14px" className="mb-12" />
        <Skeleton width="100%" height="22px" className="mb-12" />
        <Skeleton width="70%" height="22px" className="mb-16" />

        {/* RATING */}
        <Skeleton width="100px" height="18px" className="mb-16" />

        {/* PRICE */}
        <Skeleton width="120px" height="26px" className="mb-20" />

        {/* STOCK */}
        <Skeleton width="110px" height="16px" className="mb-20" />

        {/* ACTIONS */}
        <div className="product-actions">
          <Skeleton width="100%" height="44px" borderRadius="12px" />
          <Skeleton width="44px" height="44px" borderRadius="12px" />
        </div>
      </div>
    </article>
  );
}

export default ProductCardSkeleton;