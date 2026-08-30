// ==========================================================
// TECHSTORE PRO
// PRODUCT GRID COMPONENT
// ==========================================================

import PropTypes from "prop-types";

import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

import "./ProductGrid.css";

function ProductGrid({
  products = [],
  loading = false,
}) {
  /* ==========================================================
     LOADING STATE
  ========================================================== */

  if (loading) {
    return (
      <section
        className="product-grid"
        aria-label="Loading products"
        aria-busy="true"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton
            key={`product-skeleton-${index}`}
          />
        ))}
      </section>
    );
  }

  /* ==========================================================
     EMPTY STATE
  ========================================================== */

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div
        className="empty-products"
        role="status"
        aria-live="polite"
      >
        <div
          className="empty-icon"
          aria-hidden="true"
        >
          🔍
        </div>

        <h3>
          No Products Found
        </h3>

        <p>
          Try adjusting your search,
          category, or filters.
        </p>
      </div>
    );
  }

  /* ==========================================================
     PRODUCT GRID
  ========================================================== */

  return (
    <section
      className="product-grid"
      aria-label="Product list"
    >
      {products.map((product, index) => {
        const productKey =
          product?._id ||
          product?.id ||
          `product-${index}`;

        return (
          <ProductCard
            key={productKey}
            product={product}
          />
        );
      })}
    </section>
  );
}

/* ==========================================================
   PROP TYPES
========================================================== */

ProductGrid.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,

      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),

      name: PropTypes.string.isRequired,

      brand: PropTypes.string,

      category: PropTypes.string,

      image: PropTypes.string,

      price: PropTypes.number,

      oldPrice: PropTypes.number,

      discount: PropTypes.number,

      rating: PropTypes.number,

      reviews: PropTypes.number,

      stock: PropTypes.number,

      newArrival: PropTypes.bool,

      bestseller: PropTypes.bool,
    })
  ),

  loading: PropTypes.bool,
};

export default ProductGrid;