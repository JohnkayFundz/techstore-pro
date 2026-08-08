import { memo, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  FiHeart,
  FiShoppingCart,
  FiStar,
} from "react-icons/fi";

import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { formatPrice } from "../../utils/formatPrice";

import "./ProductCard.css";

const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/400x400?text=No+Image";

/**
 * Cleans image URLs.
 * Supports:
 * - Plain URL
 * - Markdown links
 */
function cleanImageUrl(url) {
  if (!url) return PLACEHOLDER_IMAGE;

  const markdown = url.match(/\((https?:\/\/[^)]+)\)/);

  if (markdown) {
    return markdown[1];
  }

  return url.trim();
}

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } =
    useWishlist();

  const [imageError, setImageError] =
    useState(false);

  const productId =
    product._id || product.id;

  const image = imageError
    ? PLACEHOLDER_IMAGE
    : cleanImageUrl(
        product.image ||
          product.images?.[0] ||
          PLACEHOLDER_IMAGE
      );

  const reviews =
    product.numReviews ??
    product.reviews ??
    0;

  const rating =
    product.rating ?? 0;

  const inStock =
    (product.stock ?? 0) > 0;

  const isWishlisted =
    wishlist.some(
      (item) =>
        (item._id || item.id) ===
        productId
    );

  return (
    <article className="product-card">
      {/* IMAGE */}

      <div className="product-image-container">
        <Link
          to={`/products/${productId}`}
          className="product-image-link"
        >
          <img
            src={image}
            alt={product.name}
            className="product-image"
            loading="lazy"
            decoding="async"
            onError={() =>
              setImageError(true)
            }
          />
        </Link>

        <div className="product-badges">
          {product.newArrival && (
            <span className="new-badge">
              New
            </span>
          )}

          {product.bestseller && (
            <span className="best-badge">
              Best Seller
            </span>
          )}

          {(product.discount ?? 0) >
            0 && (
            <span className="discount-badge">
              -{product.discount}%
            </span>
          )}
        </div>

        <button
          type="button"
          className={`wishlist-btn ${
            isWishlisted
              ? "active"
              : ""
          }`}
          onClick={() =>
            toggleWishlist(product)
          }
          aria-label={
            isWishlisted
              ? "Remove from Wishlist"
              : "Add to Wishlist"
          }
        >
          <FiHeart />
        </button>
      </div>

      {/* PRODUCT INFO */}

      <div className="product-info">
        <div className="product-meta">
          <span className="product-brand">
            {product.brand ||
              "TechStore"}
          </span>

          {product.category && (
            <span className="product-category">
              {product.category}
            </span>
          )}
        </div>

        <Link
          to={`/products/${productId}`}
          className="product-name"
        >
          {product.name}
        </Link>

        <div className="product-rating">
          <FiStar />

          {reviews > 0 ? (
            <>
              <span>
                {rating.toFixed(1)}
              </span>

              <small>
                ({reviews})
              </small>
            </>
          ) : (
            <small>
              No reviews
            </small>
          )}
        </div>

        <div className="price-box">
          <span className="price">
            {formatPrice(
              product.price
            )}
          </span>

          {(product.oldPrice ?? 0) >
            product.price && (
            <span className="old-price">
              {formatPrice(
                product.oldPrice
              )}
            </span>
          )}
        </div>

        <p
          className={`stock ${
            inStock
              ? "in-stock"
              : "out-stock"
          }`}
        >
          {inStock
            ? `${product.stock} in stock`
            : "Out of stock"}
        </p>

        <div className="product-spacer" />

        <div className="product-actions">
          <button
            type="button"
            className="cart-btn"
            disabled={!inStock}
            onClick={() =>
              addToCart(product)
            }
          >
            <FiShoppingCart />

            {inStock
              ? "Add to Cart"
              : "Unavailable"}
          </button>

          <Link
            to={`/products/${productId}`}
            className="details-btn"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    name:
      PropTypes.string.isRequired,
    brand: PropTypes.string,
    category: PropTypes.string,
    image: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.string
    ),
    price:
      PropTypes.number.isRequired,
    oldPrice: PropTypes.number,
    discount: PropTypes.number,
    rating: PropTypes.number,
    reviews: PropTypes.number,
    numReviews:
      PropTypes.number,
    stock: PropTypes.number,
    description:
      PropTypes.string,
    newArrival:
      PropTypes.bool,
    bestseller:
      PropTypes.bool,
  }).isRequired,
};

export default memo(ProductCard);