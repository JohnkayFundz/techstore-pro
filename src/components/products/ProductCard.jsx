import { memo, useEffect, useState } from "react";
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
   LOCAL PLACEHOLDER IMAGE

   File location:
   public/placeholder-product.png

   Browser URL:
   http://localhost:5173/placeholder-product.png
========================================================== */

const PLACEHOLDER_IMAGE = "/placeholder-product.png";

/* ==========================================================
   PRODUCT CARD
========================================================== */

const ProductCard = ({ product }) => {
  /* ========================================================
     SAFETY CHECK
  ======================================================== */

  if (!product) {
    return null;
  }

  /* ========================================================
     DEBUG
  ======================================================== */

  console.log("PRODUCT CARD DATA:", product);

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
    product._id || product.id;

  /* ========================================================
     PRODUCT IMAGE

     Support both:
     product.image
     product.images[0]
  ======================================================== */

  const getProductImage = () => {
    if (
      typeof product.image === "string" &&
      product.image.trim() !== ""
    ) {
      return product.image;
    }

    if (
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      const firstImage = product.images[0];

      if (typeof firstImage === "string") {
        return firstImage;
      }

      if (
        firstImage &&
        typeof firstImage.url === "string"
      ) {
        return firstImage.url;
      }
    }

    return PLACEHOLDER_IMAGE;
  };

  const initialImage = getProductImage();

  /* ========================================================
     IMAGE STATE
  ======================================================== */

  const [imageSrc, setImageSrc] =
    useState(initialImage);

  /* ========================================================
     IMAGE ERROR STATE
  ======================================================== */

  const [imageError, setImageError] =
    useState(false);

  /* ========================================================
     RESET IMAGE WHEN PRODUCT CHANGES
  ======================================================== */

  useEffect(() => {
    const nextImage = getProductImage();

    setImageSrc(nextImage);
    setImageError(false);
  }, [
    product._id,
    product.id,
    product.image,
    product.images,
  ]);

  /* ========================================================
     IMAGE ERROR HANDLER

     If the actual product image fails:
     → use local placeholder

     If the placeholder itself fails:
     → do not create an infinite error loop
  ======================================================== */

  const handleImageError = () => {
    console.warn(
      "Product image failed:",
      imageSrc
    );

    if (imageSrc !== PLACEHOLDER_IMAGE) {
      setImageError(true);
      setImageSrc(PLACEHOLDER_IMAGE);
      return;
    }

    /*
      Placeholder itself failed.

      Do not keep changing state because that
      can create an infinite image error loop.
    */

    setImageError(true);
  };

  /* ========================================================
     PRODUCT INFORMATION
  ======================================================== */

  const productName =
    product.name || "Unnamed Product";

  const productPrice =
    Number(product.price) || 0;

  const productOldPrice =
    Number(product.oldPrice) || 0;

  const productRating =
    Number(product.rating) || 0;

  const productReviews =
    Number(
      product.numReviews ??
      product.reviewsCount ??
      0
    );

  const productStock =
    Number(product.stock ?? 0);

  const productCategory =
    product.category || "Tech";

  const productBrand =
    product.brand || "";

  /* ========================================================
     DISCOUNT

     Use backend discount if available.
     Otherwise calculate from oldPrice and price.
  ======================================================== */

  const discount =
    Number(product.discount) ||
    (
      productOldPrice > productPrice
        ? Math.round(
            (
              (productOldPrice - productPrice) /
              productOldPrice
            ) * 100
          )
        : 0
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
    typeof isInWishlist === "function"
      ? isInWishlist(productId)
      : false;

  /* ========================================================
     ADD TO CART
  ======================================================== */

  const handleAddToCart = (event) => {
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

  const handleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (
      typeof toggleWishlist === "function"
    ) {
      toggleWishlist(product);
    }
  };

  /* ========================================================
     RENDER
  ======================================================== */

  return (
    <article className="product-card">

      {/* ====================================================
          IMAGE SECTION
      ==================================================== */}

      <div className="product-card__image-wrapper">

        {/* DISCOUNT */}

        {discount > 0 && (
          <span className="product-card__discount">
            -{discount}%
          </span>
        )}

        {/* WISHLIST BUTTON */}

        <button
          type="button"
          className={`product-card__wishlist ${
            wishlistActive
              ? "product-card__wishlist--active"
              : ""
          }`}
          onClick={handleWishlist}
          aria-label={
            wishlistActive
              ? `Remove ${productName} from wishlist`
              : `Add ${productName} to wishlist`
          }
        >
          <FiHeart
            size={19}
            fill={
              wishlistActive
                ? "currentColor"
                : "none"
            }
          />
        </button>

        {/* PRODUCT IMAGE */}

        <Link
          to={`/products/${productId}`}
          className="product-card__image-link"
        >
          <img
            src={imageSrc || PLACEHOLDER_IMAGE}
            alt={productName}
            className={`product-card__image ${
              imageError
                ? "product-card__image--fallback"
                : ""
            }`}
            loading="eager"
            decoding="async"
            onError={handleImageError}
          />
        </Link>

        {/* OUT OF STOCK */}

        {isOutOfStock && (
          <span className="product-card__stock-badge">
            Out of Stock
          </span>
        )}
      </div>

      {/* ====================================================
          PRODUCT CONTENT
      ==================================================== */}

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
          <Link to={`/products/${productId}`}>
            {productName}
          </Link>
        </h3>

        {/* ==================================================
            RATING
        ================================================== */}

        <div className="product-card__rating">

          <div className="product-card__stars">

            {[1, 2, 3, 4, 5].map(
              (star) => (
                <FiStar
                  key={star}
                  size={14}
                  fill={
                    star <= productRating
                      ? "currentColor"
                      : "none"
                  }
                />
              )
            )}

          </div>

          <span className="product-card__reviews">
            ({productReviews})
          </span>

        </div>

        {/* ==================================================
            PRICE
        ================================================== */}

        <div className="product-card__price-wrapper">

          <span className="product-card__price">
            {formatPrice(productPrice)}
          </span>

          {productOldPrice >
            productPrice && (
            <span className="product-card__old-price">
              {formatPrice(productOldPrice)}
            </span>
          )}

        </div>

        {/* ==================================================
            ADD TO CART
        ================================================== */}

        <button
          type="button"
          className="product-card__cart-btn"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          <FiShoppingCart size={18} />

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

    stock: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    inStock: PropTypes.bool,

    category: PropTypes.string,

    brand: PropTypes.string,
  }),
};

/* ==========================================================
   EXPORT
========================================================== */

export default memo(ProductCard);