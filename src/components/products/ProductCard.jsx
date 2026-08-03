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
  const { wishlist, toggleWishlist } = useWishlist();

  // Support both MongoDB (_id) and local data (id)
  const productId = product._id || product.id;

  const isWishlisted = wishlist.some(
    (item) => (item._id || item.id) === productId
  );

  const productImage =
    product.image ||
    product.images?.[0] ||
    PLACEHOLDER_IMAGE;

  const inStock = (product.stock ?? 0) > 0;

  return (
    <article className="product-card">

      {/* =========================
          PRODUCT IMAGE
      ========================== */}

      <div className="product-image-wrapper">

        <Link to={`/products/${productId}`}>
          <img
            src={productImage}
            alt={product.name}
            className="product-image"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER_IMAGE;
            }}
          />
        </Link>

        {/* Product Badges */}

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

          {product.discount > 0 && (
            <span className="badge discount">
              -{product.discount}%
            </span>
          )}

        </div>

        {/* Wishlist Button */}

        <button
          type="button"
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className={`wishlist-btn ${
            isWishlisted ? "active" : ""
          }`}
          onClick={() => toggleWishlist(product)}
        >
          <FiHeart />
        </button>

      </div>      {/* =========================
          PRODUCT INFO
      ========================== */}

      <div className="product-info">

        <p className="product-brand">
          {product.brand || "TechStore"}
        </p>

        <Link
          to={`/products/${productId}`}
          className="product-title"
        >
          {product.name}
        </Link>

        {/* Rating */}

        <div className="product-rating">
          <FiStar />

          {product.reviews > 0 ? (
            <>
              <span>{product.rating}</span>
              <small>({product.reviews})</small>
            </>
          ) : (
            <small>No reviews</small>
          )}
        </div>

        {/* Price */}

        <div className="product-price">

          <span className="current-price">
            {formatPrice(product.price)}
          </span>

          {product.oldPrice && (
            <span className="old-price">
              {formatPrice(product.oldPrice)}
            </span>
          )}

        </div>

        {/* Stock */}

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

        {/* Add to Cart */}

        <button
          type="button"
          aria-label="Add product to cart"
          className="add-cart-btn"
          disabled={!inStock}
          onClick={() => addToCart(product)}
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

    name: PropTypes.string.isRequired,

    brand: PropTypes.string,

    image: PropTypes.string,

    images: PropTypes.arrayOf(
      PropTypes.string
    ),

    price: PropTypes.number.isRequired,

    oldPrice: PropTypes.number,

    discount: PropTypes.number,

    rating: PropTypes.number,

    reviews: PropTypes.number,

    stock: PropTypes.number,

    category: PropTypes.string,

    description: PropTypes.string,

    newArrival: PropTypes.bool,

    bestseller: PropTypes.bool,
  }).isRequired,
};

export default memo(ProductCard);