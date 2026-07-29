import { useMemo, useState } from "react";
import PropTypes from "prop-types";

import "./ProductGallery.css";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/700x700?text=TechStore+Pro";

function ProductGallery({ product }) {
  /* ===========================================
     BUILD GALLERY
  =========================================== */

  const images = useMemo(() => {
    if (
      Array.isArray(product.gallery) &&
      product.gallery.length > 0
    ) {
      return product.gallery;
    }

    return [product.image || FALLBACK_IMAGE];
  }, [product]);

  /* ===========================================
     ACTIVE IMAGE
  =========================================== */

  const [activeImage, setActiveImage] = useState(images[0]);

  /* ===========================================
     CHANGE IMAGE
  =========================================== */

  const changeImage = (image) => {
    setActiveImage(image);
  };

  return (    <article className="product-card">

      {/* ===========================================
          IMAGE SECTION
      =========================================== */}

      <div className="product-image-container">

        {/* Product Badges */}
        <div className="product-badges">

          {product.discount > 0 && (
            <span className="discount-badge">
              -{product.discount}%
            </span>
          )}

          {product.featured && (
            <span className="featured-badge">
              FEATURED
            </span>
          )}

          {product.newArrival && (
            <span className="new-badge">
              NEW
            </span>
          )}

          {product.bestseller && (
            <span className="best-badge">
              BEST SELLER
            </span>
          )}

        </div>

        {/* Wishlist Button */}

        <button
          type="button"
          className={`wishlist-btn ${liked ? "active" : ""}`}
          onClick={handleWishlist}
          aria-label="Toggle Wishlist"
          aria-pressed={liked}
        >
          {liked ? "❤" : "♡"}
        </button>

        {/* Product Image */}

        <Link
          to={`/products/${product.id}`}
          className="product-image-link"
        >
          <img
            src={product.image || FALLBACK_IMAGE}
            alt={product.name}
            className="product-image"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
        </Link>

        {/* Quick View */}

        <Link
          to={`/products/${product.id}`}
          className="quick-view"
        >
          Quick View
        </Link>

      </div>

      {/* ===========================================
          PRODUCT INFO
      =========================================== */}

      <div className="product-info">        {/* ===========================================
            PRODUCT META
        =========================================== */}

        <div className="product-meta">
          <span className="product-brand">
            {product.brand}
          </span>

          <span className="product-category">
            {product.category}
          </span>
        </div>

        {product.sku && (
          <span className="product-sku">
            SKU: {product.sku}
          </span>
        )}

        {/* ===========================================
            PRODUCT NAME
        =========================================== */}

        <Link
          to={`/products/${product.id}`}
          className="product-name"
        >
          {product.name}
        </Link>

        {/* ===========================================
            RATING
        =========================================== */}

        <RatingStars
          rating={product.rating}
          reviews={product.reviews}
        />

        {/* ===========================================
            DESCRIPTION
        =========================================== */}

        <p className="product-description">
          {shortDescription(product.description)}
        </p>

        {/* ===========================================
            PRICE
        =========================================== */}

        <div className="price-box">

          <span className="price">
            {formattedPrice}
          </span>

          {formattedOldPrice && (
            <span className="old-price">
              {formattedOldPrice}
            </span>
          )}

        </div>

        {/* ===========================================
            STOCK STATUS
        =========================================== */}

        <div
          className={`stock ${
            product.stock > 0
              ? "in-stock"
              : "out-stock"
          }`}
        >
          {product.stock > 0
            ? "✔ In Stock"
            : "✖ Out of Stock"}
        </div>

        {/* ===========================================
            SHIPPING
        =========================================== */}

        {product.shipping && (
          <div className="shipping">
            🚚 {product.shipping}
          </div>
        )}

        {/* ===========================================
            WARRANTY
        =========================================== */}

        {product.warranty && (
          <div className="warranty">
            🛡 {product.warranty}
          </div>
        )}

        {/* Push buttons to the bottom */}
        <div className="product-spacer" />

        {/* ===========================================
            ACTION BUTTONS
        =========================================== */}

        <div className="product-actions">

          <button
            type="button"
            className={`cart-btn ${
              added ? "added" : ""
            }`}
            onClick={addToCart}
            disabled={product.stock <= 0}
          >
            {added
              ? "✓ Added"
              : "Add To Cart"}
          </button>

          <Link
            to={`/products/${product.id}`}
            className="details-btn"
          >
            View Details
          </Link>

        </div>

      </div>    </article>
  );
}

/* ===========================================
   PROP TYPES
=========================================== */

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,

    name: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,

    sku: PropTypes.string,
    description: PropTypes.string,

    image: PropTypes.string,

    price: PropTypes.number.isRequired,
    oldPrice: PropTypes.number,

    discount: PropTypes.number,

    currency: PropTypes.string,

    rating: PropTypes.number,
    reviews: PropTypes.number,

    stock: PropTypes.number.isRequired,

    shipping: PropTypes.string,
    warranty: PropTypes.string,

    featured: PropTypes.bool,
    newArrival: PropTypes.bool,
    bestseller: PropTypes.bool,
  }).isRequired,
};

export default memo(ProductCard);