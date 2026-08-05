import { memo } from "react";
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

const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/400x400?text=No+Image";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const {
    wishlist,
    toggleWishlist,
  } = useWishlist();

  const productId =
    product._id || product.id;

  const image =
    product.image ||
    product.images?.[0] ||
    PLACEHOLDER_IMAGE;

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

      <div className="product-image-wrapper">

        <Link to={`/products/${productId}`}>

          <img
            src={image}
            alt={product.name}
            className="product-image"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.src =
                PLACEHOLDER_IMAGE;
            }}
          />

        </Link>

        {/* BADGES */}

        <div className="product-badges">

          {product.newArrival && (
            <span className="badge new">
              New
            </span>
          )}

          {product.bestseller && (
            <span className="badge best">
              Best Seller
            </span>
          )}

          {(product.discount ?? 0) > 0 && (
            <span className="badge discount">
              -{product.discount}%
            </span>
          )}

        </div>

        {/* WISHLIST */}

        <button
          type="button"
          className={`wishlist-btn ${
            isWishlisted
              ? "active"
              : ""
          }`}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          onClick={() =>
            toggleWishlist(product)
          }
        >
          <FiHeart />
        </button>

      </div>

      {/* INFO */}

      <div className="product-info">

        <p className="product-brand">
          {product.brand ||
            "TechStore"}
        </p>

        <Link
          to={`/products/${productId}`}
          className="product-title"
        >
          {product.name}
        </Link>

        {/* RATING */}

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

        {/* PRICE */}

        <div className="product-price">

          <span className="current-price">
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

        {/* STOCK */}

        <p
          className={
            inStock
              ? "stock available"
              : "stock out"
          }
        >
          {inStock
            ? `${product.stock} in stock`
            : "Out of stock"}
        </p>

        {/* CART */}

        <button
          type="button"
          className="add-cart-btn"
          aria-label="Add product to cart"
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

    name: PropTypes.string
      .isRequired,

    brand: PropTypes.string,

    image: PropTypes.string,

    images:
      PropTypes.arrayOf(
        PropTypes.string
      ),

    price: PropTypes.number
      .isRequired,

    oldPrice: PropTypes.number,

    discount: PropTypes.number,

    rating: PropTypes.number,

    reviews: PropTypes.number,

    numReviews:
      PropTypes.number,

    stock: PropTypes.number,

    category:
      PropTypes.string,

    description:
      PropTypes.string,

    newArrival:
      PropTypes.bool,

    bestseller:
      PropTypes.bool,
  }).isRequired,
};

export default memo(
  ProductCard
);