// ==========================================================
// TECHSTORE PRO
// PRODUCT CARD COMPONENT
// ==========================================================

import {
  memo,
  useEffect,
  useState,
} from "react";

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

/* ==========================================================
   CONSTANTS
========================================================== */

const PLACEHOLDER_IMAGE =
  "/placeholder-product.png";

/* ==========================================================
   SAFE IMAGE URL
========================================================== */

const getSafeImageUrl = (value) => {
  if (typeof value !== "string") {
    return null;
  }

  const image = value.trim();

  if (!image) {
    return null;
  }

  // Reject old external placeholder URLs.
  if (image.includes("via.placeholder.com")) {
    return null;
  }

  // Reject unsafe image sources.
  if (
    image.startsWith("javascript:") ||
    image.startsWith("data:") ||
    image.startsWith("blob:")
  ) {
    return null;
  }

  return image;
};

/* ==========================================================
   GET PRODUCT IMAGE
========================================================== */

const getProductImage = (product) => {
  if (!product) {
    return PLACEHOLDER_IMAGE;
  }

  /* --------------------------------------------------------
     1. Main image
  -------------------------------------------------------- */

  const mainImage = getSafeImageUrl(
    product.image
  );

  if (mainImage) {
    return mainImage;
  }

  /* --------------------------------------------------------
     2. imageUrl
  -------------------------------------------------------- */

  const imageUrl = getSafeImageUrl(
    product.imageUrl
  );

  if (imageUrl) {
    return imageUrl;
  }

  /* --------------------------------------------------------
     3. Images array
  -------------------------------------------------------- */

  if (Array.isArray(product.images)) {
    for (const image of product.images) {
      // String image
      if (typeof image === "string") {
        const safeImage =
          getSafeImageUrl(image);

        if (safeImage) {
          return safeImage;
        }
      }

      // Object image
      if (
        image &&
        typeof image === "object"
      ) {
        const safeImage =
          getSafeImageUrl(image.url);

        if (safeImage) {
          return safeImage;
        }
      }
    }
  }

  /* --------------------------------------------------------
     4. Local fallback
  -------------------------------------------------------- */

  return PLACEHOLDER_IMAGE;
};

/* ==========================================================
   PRODUCT CARD
========================================================== */

const ProductCard = ({ product }) => {
  /* ========================================================
     CONTEXTS
  ======================================================== */

  const { addToCart } = useCart();

  const {
    isInWishlist,
    toggleWishlist,
  } = useWishlist();

  /* ========================================================
     PRODUCT ID
  ======================================================== */

  const productId =
    product?._id ??
    product?.id ??
    null;

  /* ========================================================
     IMAGE STATE
  ======================================================== */

  const [imageSrc, setImageSrc] =
    useState(
      getProductImage(product)
    );

  const [imageError, setImageError] =
    useState(false);

  /* ========================================================
     RESET IMAGE WHEN PRODUCT CHANGES
  ======================================================== */

  useEffect(() => {
    setImageSrc(
      getProductImage(product)
    );

    setImageError(false);
  }, [
    product?._id,
    product?.id,
    product?.image,
    product?.imageUrl,
    product?.images,
  ]);

  /* ========================================================
     SAFETY CHECK
  ======================================================== */

  if (!product || !productId) {
    return null;
  }

  /* ========================================================
     IMAGE ERROR HANDLER
  ======================================================== */

  const handleImageError = () => {
    /*
      Prevent a fallback loop.
    */

    if (
      imageSrc ===
      PLACEHOLDER_IMAGE
    ) {
      setImageError(true);
      return;
    }

    setImageSrc(
      PLACEHOLDER_IMAGE
    );

    setImageError(true);
  };

  /* ========================================================
     PRODUCT INFORMATION
  ======================================================== */

  const productName =
    product.name ||
    "Unnamed Product";

  const productPrice =
    Number(product.price) || 0;

  const productOldPrice =
    Number(product.oldPrice) || 0;

  const productRating = Math.min(
    5,
    Math.max(
      0,
      Number(product.rating) || 0
    )
  );

  const productReviews =
    Number(
      product.numReviews ??
        product.reviewsCount ??
        product.reviews ??
        0
    );

  const productStock =
    Number(product.stock ?? 0);

  const productCategory =
    product.category ||
    "Tech";

  const productBrand =
    product.brand || "";

  /* ========================================================
     DISCOUNT
  ======================================================== */

  const calculatedDiscount =
    productOldPrice > productPrice
      ? Math.round(
          (
            (productOldPrice -
              productPrice) /
            productOldPrice
          ) * 100
        )
      : 0;

  const discount = Math.min(
    100,
    Math.max(
      0,
      Number(product.discount) ||
        calculatedDiscount
    )
  );

  /* ========================================================
     STOCK STATUS
  ======================================================== */

  const isOutOfStock =
    product.inStock === false ||
    productStock <= 0;

  /* ========================================================
     WISHLIST STATUS
  ======================================================== */

  const wishlistActive =
    typeof isInWishlist ===
    "function"
      ? isInWishlist(productId)
      : false;

  /* ========================================================
     ADD TO CART
  ======================================================== */

  const handleAddToCart = (
    event
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (isOutOfStock) {
      return;
    }

    addToCart(product, 1);
  };

  /* ========================================================
     WISHLIST
  ======================================================== */

  const handleWishlist = (
    event
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (
      typeof toggleWishlist ===
      "function"
    ) {
      toggleWishlist(product);
    }
  };

  /* ========================================================
     RENDER
  ======================================================== */

  return (
    <article
      className="product-card"
      aria-label={productName}
    >
      {/* ==================================================
          IMAGE SECTION
      ================================================== */}

      <div className="product-card__image-wrapper">

        {/* DISCOUNT */}

        {discount > 0 && (
          <span
            className="product-card__discount"
            aria-label={`${discount}% discount`}
          >
            -{discount}%
          </span>
        )}

        {/* WISHLIST */}

        <button
          type="button"
          className={`product-card__wishlist ${
            wishlistActive
              ? "product-card__wishlist--active"
              : ""
          }`}
          onClick={
            handleWishlist
          }
          aria-label={
            wishlistActive
              ? `Remove ${productName} from wishlist`
              : `Add ${productName} to wishlist`
          }
          aria-pressed={
            wishlistActive
          }
        >
          <FiHeart
            size={19}
            fill={
              wishlistActive
                ? "currentColor"
                : "none"
            }
            aria-hidden="true"
          />
        </button>

        {/* PRODUCT IMAGE */}

        <Link
          to={`/products/${productId}`}
          className="product-card__image-link"
          aria-label={`View ${productName}`}
        >
          <img
            src={
              imageSrc ||
              PLACEHOLDER_IMAGE
            }
            alt={productName}
            className={`product-card__image ${
              imageError
                ? "product-card__image--fallback"
                : ""
            }`}
            loading="lazy"
            decoding="async"
            onError={
              handleImageError
            }
          />
        </Link>

        {/* OUT OF STOCK */}

        {isOutOfStock && (
          <span
            className="product-card__stock-badge"
            role="status"
          >
            Out of Stock
          </span>
        )}

      </div>

      {/* ==================================================
          PRODUCT CONTENT
      ================================================== */}

      <div className="product-card__content">

        {/* CATEGORY */}

        <span className="product-card__category">
          {productCategory}
        </span>

        {/* BRAND */}

        {productBrand && (
          <span className="product-card__brand">
            {productBrand}
          </span>
        )}

        {/* PRODUCT NAME */}

        <h3 className="product-card__title">
          <Link
            to={`/products/${productId}`}
          >
            {productName}
          </Link>
        </h3>

        {/* RATING */}

        <div
          className="product-card__rating"
          aria-label={`Rated ${productRating} out of 5 stars`}
        >
          <div
            className="product-card__stars"
            aria-hidden="true"
          >
            {[1, 2, 3, 4, 5].map(
              (star) => (
                <FiStar
                  key={star}
                  size={14}
                  fill={
                    star <=
                    productRating
                      ? "currentColor"
                      : "none"
                  }
                  strokeWidth={1.8}
                />
              )
            )}
          </div>

          <span className="product-card__reviews">
            ({productReviews})
          </span>
        </div>

        {/* PRICE */}

        <div className="product-card__price-wrapper">

          <span className="product-card__price">
            {formatPrice(
              productPrice
            )}
          </span>

          {productOldPrice >
            productPrice && (
            <span
              className="product-card__old-price"
              aria-label={`Original price ${formatPrice(
                productOldPrice
              )}`}
            >
              {formatPrice(
                productOldPrice
              )}
            </span>
          )}

        </div>

        {/* ADD TO CART */}

        <button
          type="button"
          className="product-card__cart-btn"
          onClick={
            handleAddToCart
          }
          disabled={
            isOutOfStock
          }
          aria-label={
            isOutOfStock
              ? `${productName} is out of stock`
              : `Add ${productName} to cart`
          }
        >
          <FiShoppingCart
            size={18}
            aria-hidden="true"
          />

          <span>
            {isOutOfStock
              ? "Out of Stock"
              : "Add to Cart"}
          </span>
        </button>

      </div>
    </article>
  );
};

/* ==========================================================
   PROP TYPES
========================================================== */

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    name: PropTypes.string,

    image: PropTypes.string,

    imageUrl: PropTypes.string,

    images: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,

        PropTypes.shape({
          url: PropTypes.string,
        }),
      ])
    ),

    price: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    oldPrice: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    discount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    rating: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    numReviews: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    reviewsCount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    reviews: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    stock: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    inStock: PropTypes.bool,

    category: PropTypes.string,

    brand: PropTypes.string,
  }),
};

export default memo(ProductCard);