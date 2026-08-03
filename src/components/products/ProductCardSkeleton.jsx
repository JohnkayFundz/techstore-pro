import Skeleton from "./Skeleton";

import "./ProductCardSkeleton.css";


function ProductCardSkeleton() {
  return (
    <article
      className="product-card skeleton-card"
      aria-hidden="true"
    >

      {/* PRODUCT IMAGE */}
      <div className="product-image-wrapper">

        <Skeleton
          width="100%"
          height="220px"
          borderRadius="18px"
        />

      </div>


      {/* PRODUCT CONTENT */}
      <div className="product-info">

        {/* Brand */}
        <Skeleton
          width="80px"
          height="14px"
          className="mb-12"
        />


        {/* Product Name */}
        <Skeleton
          width="100%"
          height="22px"
          className="mb-12"
        />


        <Skeleton
          width="75%"
          height="22px"
          className="mb-16"
        />


        {/* Rating */}
        <div className="product-rating">

          <Skeleton
            width="100px"
            height="18px"
            className="mb-16"
          />

        </div>


        {/* Price */}
        <Skeleton
          width="120px"
          height="26px"
          className="mb-20"
        />


        {/* Stock */}
        <Skeleton
          width="110px"
          height="16px"
          className="mb-20"
        />


        {/* Buttons */}
        <div className="product-actions">

          <Skeleton
            width="100%"
            height="44px"
            borderRadius="12px"
          />


          <Skeleton
            width="44px"
            height="44px"
            borderRadius="12px"
          />

        </div>

      </div>

    </article>
  );
}


export default ProductCardSkeleton;