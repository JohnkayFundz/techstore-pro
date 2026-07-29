import { memo, useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import RatingStars from "./RatingStars";

import "./ProductCard.css";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/500x500?text=TechStore+Pro";

function ProductCard({ product }) {
  const { dispatch } = useCart();

  const { toggleWishlist, isWishlisted } = useWishlist();

  const [added, setAdded] = useState(false);

  const liked = isWishlisted(product.id);

  /* ===========================================
     AUTO RESET ADD BUTTON
  =========================================== */

  useEffect(() => {
    if (!added) return;

    const timer = setTimeout(() => {
      setAdded(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [added]);

  /* ===========================================
     PRICE FORMATTER
  =========================================== */

  const formatPrice = (value) => {
    const currency =
      typeof product.currency === "string"
        ? product.currency.toUpperCase()
        : "USD";

    const validCurrencies = [
      "USD",
      "NGN",
      "EUR",
      "GBP",
      "CAD",
      "AUD",
      "JPY",
    ];

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: validCurrencies.includes(currency)
        ? currency
        : "USD",
    }).format(value);
  };

  const formattedPrice = useMemo(
    () => formatPrice(product.price),
    [product.price, product.currency]
  );

  const formattedOldPrice = useMemo(() => {
    if (!product.oldPrice) return null;
    return formatPrice(product.oldPrice);
  }, [product.oldPrice, product.currency]);

  /* ===========================================
     SHORT DESCRIPTION
  =========================================== */

  const shortDescription = (text = "") => {
    if (text.length <= 90) return text;
    return `${text.slice(0, 90)}...`;
  };

  /* ===========================================
     ADD TO CART
  =========================================== */

  const addToCart = () => {
    if (product.stock <= 0) {
      toast.error("Product is currently out of stock");
      return;
    }

    if (added) return;

    dispatch({
      type: "ADD_TO_CART",
      payload: product,
    });

    setAdded(true);

    toast.success(`${product.name} added to cart 🛒`);
  };

  /* ===========================================
     TOGGLE WISHLIST
  =========================================== */

  const handleWishlist = () => {
    toggleWishlist(product);

    toast.success(
      liked
        ? `${product.name} removed from wishlist`
        : `${product.name} added to wishlist ❤️`
    );
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