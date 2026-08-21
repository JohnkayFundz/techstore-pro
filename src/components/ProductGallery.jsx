import {
  memo,
  useEffect,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
} from "react-icons/fi";

import { useWishlist } from "../../context/WishlistContext";

import "./ProductGallery.css";

/* ==========================================================
   LOCAL FALLBACK IMAGE

   File:
   public/placeholder-product.png
========================================================== */

const FALLBACK_IMAGE =
  "/placeholder-product.png";

/* ==========================================================
   GET PRODUCT ID
========================================================== */

const getProductId = (product) => {
  return (
    product?._id ||
    product?.id ||
    ""
  );
};

/* ==========================================================
   GET IMAGE URL

   Supports:
   - string
   - { url: "..." }
========================================================== */

const getImageUrl = (image) => {
  if (typeof image === "string") {
    return image.trim();
  }

  if (
    image &&
    typeof image === "object" &&
    typeof image.url === "string"
  ) {
    return image.url.trim();
  }

  return "";
};

/* ==========================================================
   BUILD PRODUCT IMAGES
========================================================== */

const getProductImages = (product) => {
  if (!product) {
    return [FALLBACK_IMAGE];
  }

  const candidates = [];

  /* Main image */

  if (product.image) {
    candidates.push(product.image);
  }

  /* images array */

  if (Array.isArray(product.images)) {
    candidates.push(...product.images);
  }

  /* gallery array */

  if (Array.isArray(product.gallery)) {
    candidates.push(...product.gallery);
  }

  /* imageUrl */

  if (product.imageUrl) {
    candidates.push(product.imageUrl);
  }

  /* Normalize */

  const normalized = candidates
    .map(getImageUrl)
    .filter(Boolean);

  /* Remove duplicates */

  const uniqueImages = [
    ...new Set(normalized),
  ];

  return uniqueImages.length > 0
    ? uniqueImages
    : [FALLBACK_IMAGE];
};

/* ==========================================================
   PRODUCT GALLERY
========================================================== */

function ProductGallery({ product }) {
  /* ========================================================
     PRODUCT ID
  ======================================================== */

  const productId =
    getProductId(product);

  /* ========================================================
     WISHLIST
  ======================================================== */

  const {
    isWishlisted,
    toggleWishlist,
  } = useWishlist();

  const liked =
    typeof isWishlisted === "function"
      ? isWishlisted(productId)
      : false;

  /* ========================================================
     BUILD GALLERY
  ======================================================== */

  const images = useMemo(
    () => getProductImages(product),
    [product]
  );

  /* ========================================================
     ACTIVE IMAGE
  ======================================================== */

  const [activeIndex, setActiveIndex] =
    useState(0);

  /* ========================================================
     RESET ACTIVE IMAGE WHEN PRODUCT CHANGES
  ======================================================== */

  useEffect(() => {
    setActiveIndex(0);
  }, [productId]);

  /* ========================================================
     SAFETY
  ======================================================== */

  const safeIndex =
    activeIndex >= 0 &&
    activeIndex < images.length
      ? activeIndex
      : 0;

  const activeImage =
    images[safeIndex] ||
    FALLBACK_IMAGE;

  /* ========================================================
     IMAGE ERROR HANDLER
  ======================================================== */

  const handleImageError = (event) => {
    if (
      event.currentTarget.src.endsWith(
        FALLBACK_IMAGE
      )
    ) {
      return;
    }

    event.currentTarget.src =
      FALLBACK_IMAGE;
  };

  /* ========================================================
     PREVIOUS IMAGE
  ======================================================== */

  const handlePrevious = () => {
    setActiveIndex((current) => {
      if (current <= 0) {
        return images.length - 1;
      }

      return current - 1;
    });
  };

  /* ========================================================
     NEXT IMAGE
  ======================================================== */

  const handleNext = () => {
    setActiveIndex((current) => {
      if (current >= images.length - 1) {
        return 0;
      }

      return current + 1;
    });
  };

  /* ========================================================
     THUMBNAIL
  ======================================================== */

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
  };

  /* ========================================================
     WISHLIST
  ======================================================== */

  const handleWishlist = () => {
    if (!productId) {
      console.warn(
        "⚠️ Cannot add product without ID."
      );

      return;
    }

    if (
      typeof toggleWishlist ===
      "function"
    ) {
      toggleWishlist(product);
    }
  };

  /* ========================================================
     NO PRODUCT
  ======================================================== */

  if (!product) {
    return (
      <section className="product-gallery">
        <div className="product-gallery__empty">
          Product not available.
        </div>
      </section>
    );
  }

  /* ========================================================
     RENDER
  ======================================================== */

  return (
    <section
      className="product-gallery"
      aria-label="Product images"
    >

      {/* ==================================================
          MAIN IMAGE
      ================================================== */}

      <div className="product-gallery__main">

        {/* BADGES */}

        <div className="product-gallery__badges">

          {Number(product.discount) > 0 && (
            <span className="product-gallery__discount">
              -{product.discount}%
            </span>
          )}

          {product.featured && (
            <span className="product-gallery__featured">
              Featured
            </span>
          )}

          {product.newArrival && (
            <span className="product-gallery__new">
              New
            </span>
          )}

          {product.bestseller && (
            <span className="product-gallery__bestseller">
              Best Seller
            </span>
          )}

        </div>

        {/* WISHLIST */}

        <button
          type="button"
          className={`product-gallery__wishlist ${
            liked
              ? "product-gallery__wishlist--active"
              : ""
          }`}
          onClick={handleWishlist}
          aria-label={
            liked
              ? `Remove ${
                  product.name || "product"
                } from wishlist`
              : `Add ${
                  product.name || "product"
                } to wishlist`
          }
          aria-pressed={liked}
        >
          <FiHeart
            size={22}
            fill={
              liked
                ? "currentColor"
                : "none"
            }
          />
        </button>

        {/* PREVIOUS */}

        {images.length > 1 && (
          <button
            type="button"
            className="product-gallery__nav product-gallery__nav--previous"
            onClick={handlePrevious}
            aria-label="Previous product image"
          >
            <FiChevronLeft
              size={24}
            />
          </button>
        )}

        {/* IMAGE */}

        <Link
          to={
            productId
              ? `/products/${productId}`
              : "#"
          }
          className="product-gallery__image-link"
          onClick={(event) => {
            if (!productId) {
              event.preventDefault();
            }
          }}
        >
          <img
            src={
              activeImage ||
              FALLBACK_IMAGE
            }
            alt={
              product.name ||
              "Product"
            }
            className="product-gallery__image"
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={handleImageError}
          />
        </Link>

        {/* NEXT */}

        {images.length > 1 && (
          <button
            type="button"
            className="product-gallery__nav product-gallery__nav--next"
            onClick={handleNext}
            aria-label="Next product image"
          >
            <FiChevronRight
              size={24}
            />
          </button>
        )}

      </div>

      {/* ==================================================
          THUMBNAILS
      ================================================== */}

      {images.length > 1 && (
        <div
          className="product-gallery__thumbnails"
          aria-label="Product image thumbnails"
        >

          {images.map(
            (image, index) => (
              <button
                type="button"
                key={`${image}-${index}`}
                className={`product-gallery__thumbnail ${
                  index === safeIndex
                    ? "product-gallery__thumbnail--active"
                    : ""
                }`}
                onClick={() =>
                  handleThumbnailClick(
                    index
                  )
                }
                aria-label={`View product image ${
                  index + 1
                }`}
                aria-current={
                  index === safeIndex
                    ? "true"
                    : undefined
                }
              >
                <img
                  src={
                    image ||
                    FALLBACK_IMAGE
                  }
                  alt=""
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={
                    handleImageError
                  }
                />
              </button>
            )
          )}

        </div>
      )}

      {/* ==================================================
          IMAGE COUNTER
      ================================================== */}

      {images.length > 1 && (
        <div className="product-gallery__counter">
          {safeIndex + 1} /{" "}
          {images.length}
        </div>
      )}

    </section>
  );
}

/* ==========================================================
   PROP TYPES
========================================================== */

ProductGallery.propTypes = {
  product:
    PropTypes.shape({
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

      images:
        PropTypes.arrayOf(
          PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
              url: PropTypes.string,
            }),
          ])
        ),

      gallery:
        PropTypes.arrayOf(
          PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
              url: PropTypes.string,
            }),
          ])
        ),

      discount:
        PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string,
        ]),

      featured: PropTypes.bool,

      newArrival: PropTypes.bool,

      bestseller: PropTypes.bool,
    }).isRequired,
};

/* ==========================================================
   EXPORT
========================================================== */

export default memo(ProductGallery);