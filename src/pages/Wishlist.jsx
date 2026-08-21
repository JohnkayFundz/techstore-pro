// ==========================================================
// Wishlist.jsx
// ==========================================================

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useProduct } from "../context/ProductContext";

// ==========================================================
// HELPERS
// ==========================================================

function getProductId(product) {
  if (!product) {
    return "";
  }

  return String(
    product._id ??
      product.id ??
      product.productId ??
      ""
  ).trim();
}

// ==========================================================
// PRODUCT IMAGE
// ==========================================================

function getProductImage(product) {
  if (!product) {
    return "/placeholder-product.png";
  }

  return (
    product.image ||
    product.images?.[0] ||
    product.gallery?.[0] ||
    "/placeholder-product.png"
  );
}

// ==========================================================
// FORMAT PRICE
// ==========================================================

function formatPrice(price, currency = "USD") {
  const amount = Number(price ?? 0);

  if (Number.isNaN(amount)) {
    return currency === "NGN"
      ? "₦0"
      : "$0";
  }

  if (currency === "NGN") {
    return `₦${amount.toLocaleString("en-NG")}`;
  }

  return `$${amount.toLocaleString("en-US")}`;
}

// ==========================================================
// WISHLIST PAGE
// ==========================================================

function WishlistPage() {
  // ========================================================
  // CART
  // ========================================================

  const {
    cart = [],
    dispatch,
  } = useCart();

  // ========================================================
  // WISHLIST
  // ========================================================

  const {
    wishlist = [],
    toggleWishlist,
    clearWishlist,
  } = useWishlist();

  // ========================================================
  // PRODUCTS
  // ========================================================

  const {
    products = [],
    loading,
    error,
  } = useProduct();

  // ========================================================
  // NORMALIZE WISHLIST IDS
  // ========================================================

  const wishlistIds = wishlist
    .map((item) => {
      if (
        item === null ||
        item === undefined
      ) {
        return "";
      }

      if (
        typeof item === "string" ||
        typeof item === "number"
      ) {
        return String(item).trim();
      }

      if (typeof item === "object") {
        return String(
          item._id ??
            item.id ??
            item.productId ??
            ""
        ).trim();
      }

      return "";
    })
    .filter(Boolean);

  // ========================================================
  // REMOVE DUPLICATES
  // ========================================================

  const uniqueWishlistIds = [
    ...new Set(wishlistIds),
  ];

  // ========================================================
  // MATCH WISHLIST PRODUCTS
  // ========================================================

  const wishlistItems = products.filter(
    (product) => {
      const productId =
        getProductId(product);

      return (
        productId &&
        uniqueWishlistIds.includes(
          productId
        )
      );
    }
  );

  // ========================================================
  // ADD TO CART
  // ========================================================

  function handleAddToCart(product) {
    const productId =
      getProductId(product);

    if (!productId) {
      toast.error(
        "Unable to add this product to cart."
      );

      return;
    }

    // ------------------------------------------------------
    // CHECK IF ALREADY IN CART
    // ------------------------------------------------------

    const alreadyInCart = cart.some(
      (item) =>
        getProductId(item) === productId
    );

    if (alreadyInCart) {
      toast(
        "Product is already in your cart."
      );

      return;
    }

    // ------------------------------------------------------
    // ADD PRODUCT
    // ------------------------------------------------------

    dispatch({
      type: "ADD_TO_CART",
      payload: product,
    });

    toast.success(
      `${product.name || "Product"} added to cart.`
    );
  }

  // ========================================================
  // REMOVE FROM WISHLIST
  // ========================================================

  function handleRemove(product) {
    const productId =
      getProductId(product);

    if (!productId) {
      toast.error(
        "Unable to remove this product."
      );

      return;
    }

    toggleWishlist(productId);

    toast.success(
      `${product.name || "Product"} removed from wishlist.`
    );
  }

  // ========================================================
  // CLEAR WISHLIST
  // ========================================================

  function handleClearWishlist() {
    if (uniqueWishlistIds.length === 0) {
      return;
    }

    clearWishlist();

    toast.success(
      "Wishlist cleared."
    );
  }

  // ========================================================
  // LOADING STATE
  // ========================================================

  if (loading) {
    return (
      <section className="wishlist-page container">

        <div className="wishlist-header">

          <div>
            <h1>
              ❤️ My Wishlist
            </h1>

            <p>
              Loading wishlist...
            </p>
          </div>

        </div>

        <div className="wishlist-empty">

          <div className="wishlist-empty-icon">
            ❤️
          </div>

          <h2>
            Loading your wishlist...
          </h2>

          <p>
            Please wait while we load your
            saved products.
          </p>

        </div>

      </section>
    );
  }

  // ========================================================
  // ERROR STATE
  // ========================================================

  if (error) {
    return (
      <section className="wishlist-page container">

        <div className="wishlist-header">

          <div>
            <h1>
              ❤️ My Wishlist
            </h1>
          </div>

        </div>

        <div className="wishlist-empty">

          <div className="wishlist-empty-icon">
            ⚠️
          </div>

          <h2>
            Unable to load products.
          </h2>

          <p>
            {typeof error === "string"
              ? error
              : "Something went wrong while loading your products."}
          </p>

          <Link
            to="/products"
            className="btn btn-primary"
          >
            Continue Shopping
          </Link>

        </div>

      </section>
    );
  }

  // ========================================================
  // MAIN RENDER
  // ========================================================

  return (
    <section className="wishlist-page container">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="wishlist-header">

        <div>

          <h1>
            ❤️ My Wishlist
          </h1>

          <p>
            {wishlistItems.length}{" "}
            {wishlistItems.length === 1
              ? "item"
              : "items"}
          </p>

        </div>

        {/* CLEAR WISHLIST */}

        {wishlistItems.length > 0 && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={
              handleClearWishlist
            }
          >
            Clear Wishlist
          </button>
        )}

      </div>

      {/* ====================================================
          EMPTY WISHLIST
      ==================================================== */}

      {wishlistItems.length === 0 ? (

        <div className="wishlist-empty">

          <div className="wishlist-empty-icon">
            ❤️
          </div>

          <h2>
            Your wishlist is empty.
          </h2>

          <p>
            Save products you love and
            revisit them anytime.
          </p>

          <Link
            to="/products"
            className="btn btn-primary"
          >
            Continue Shopping
          </Link>

        </div>

      ) : (

        /* ==================================================
           WISHLIST GRID
        ================================================== */

        <div className="wishlist-grid">

          {wishlistItems.map(
            (product) => {

              const productId =
                getProductId(product);

              const image =
                getProductImage(product);

              const price =
                Number(
                  product?.price ?? 0
                );

              const oldPrice =
                Number(
                  product?.oldPrice ?? 0
                );

              const hasOldPrice =
                oldPrice > price;

              const currency =
                product?.currency ||
                "USD";

              return (
                <article
                  key={productId}
                  className="wishlist-card"
                >

                  {/* ========================================
                     PRODUCT IMAGE
                  ======================================== */}

                  <div className="wishlist-image">

                    <Link
                      to={`/products/${productId}`}
                    >

                      <img
                        src={image}
                        alt={
                          product?.name ||
                          "Product"
                        }
                        loading="lazy"
                        onError={(event) => {
                          if (
                            event.currentTarget
                              .src.endsWith(
                                "/placeholder-product.png"
                              )
                          ) {
                            return;
                          }

                          event.currentTarget.src =
                            "/placeholder-product.png";
                        }}
                      />

                    </Link>

                  </div>

                  {/* ========================================
                     PRODUCT CONTENT
                  ======================================== */}

                  <div className="wishlist-content">

                    {/* PRODUCT NAME */}

                    <h2>
                      {product?.name ||
                        "Unnamed Product"}
                    </h2>

                    {/* BRAND */}

                    {product?.brand && (
                      <p>
                        <strong>
                          Brand:
                        </strong>{" "}
                        {product.brand}
                      </p>
                    )}

                    {/* CATEGORY */}

                    {product?.category && (
                      <p>
                        <strong>
                          Category:
                        </strong>{" "}
                        {product.category}
                      </p>
                    )}

                    {/* RATING */}

                    {product?.rating !==
                      undefined && (
                      <p>
                        ⭐{" "}
                        {product.rating}

                        {product?.numReviews !==
                          undefined && (
                          <>
                            {" "}
                            (
                            {
                              product.numReviews
                            }{" "}
                            {product.numReviews ===
                            1
                              ? "review"
                              : "reviews"}
                            )
                          </>
                        )}
                      </p>
                    )}

                    {/* PRICE */}

                    <h3>
                      {formatPrice(
                        price,
                        currency
                      )}
                    </h3>

                    {/* OLD PRICE */}

                    {hasOldPrice && (
                      <p className="wishlist-old-price">

                        <del>
                          {formatPrice(
                            oldPrice,
                            currency
                          )}
                        </del>

                      </p>
                    )}

                    {/* DISCOUNT */}

                    {Number(
                      product?.discount
                    ) > 0 && (
                      <span className="wishlist-discount">
                        {product.discount}% OFF
                      </span>
                    )}

                    {/* ====================================
                       ACTION BUTTONS
                    ==================================== */}

                    <div className="wishlist-item-actions">

                      {/* ADD TO CART */}

                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                          handleAddToCart(
                            product
                          )
                        }
                      >
                        🛒 Add to Cart
                      </button>

                      {/* REMOVE */}

                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() =>
                          handleRemove(
                            product
                          )
                        }
                      >
                        Remove
                      </button>

                    </div>

                    {/* ====================================
                       VIEW DETAILS
                    ==================================== */}

                    <Link
                      to={`/products/${productId}`}
                      className="btn btn-outline"
                    >
                      View Details
                    </Link>

                  </div>

                </article>
              );
            }
          )}

        </div>
      )}

    </section>
  );
}

// ==========================================================
// EXPORT
// ==========================================================

export default WishlistPage;