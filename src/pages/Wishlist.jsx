// ==========================================================
// Wishlist.jsx
// ==========================================================

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useProduct } from "../context/ProductContext";


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
  } = useWishlist();


  // ========================================================
  // PRODUCTS FROM MONGODB / API
  // ========================================================

  const {
    products = [],
    loading,
    error,
  } = useProduct();


  // ========================================================
  // MATCH WISHLIST IDS WITH MONGODB PRODUCTS
  // ========================================================

  const wishlistItems = products.filter((product) => {
    const productId = String(
      product?._id ?? product?.id ?? ""
    ).trim();

    return wishlist.some(
      (wishlistId) =>
        String(wishlistId).trim() === productId
    );
  });


  // ========================================================
  // ADD TO CART
  // ========================================================

  function handleAddToCart(product) {
    const productId = String(
      product?._id ?? product?.id ?? ""
    ).trim();


    if (!productId) {
      toast.error("Unable to add this product to cart.");
      return;
    }


    // Check whether product already exists in cart

    const alreadyInCart = cart.some((item) => {
      const cartProductId = String(
        item?._id ?? item?.id ?? ""
      ).trim();

      return cartProductId === productId;
    });


    if (alreadyInCart) {
      toast("Product is already in your cart.");
      return;
    }


    // Add MongoDB product to cart

    dispatch({
      type: "ADD_TO_CART",
      payload: product,
    });


    toast.success(
      `${product.name} added to cart.`
    );
  }


  // ========================================================
  // REMOVE FROM WISHLIST
  // ========================================================

  function handleRemove(product) {
    const productId = String(
      product?._id ?? product?.id ?? ""
    ).trim();


    if (!productId) {
      toast.error(
        "Unable to remove this product."
      );

      return;
    }


    toggleWishlist(productId);


    toast.success(
      `${product.name} removed from wishlist.`
    );
  }


  // ========================================================
  // LOADING STATE
  // ========================================================

  if (loading) {
    return (
      <section className="wishlist-page container">

        <div className="wishlist-header">
          <h1>❤️ My Wishlist</h1>

          <p>
            Loading wishlist...
          </p>
        </div>


        <div className="wishlist-empty">
          <h2>
            Loading your wishlist...
          </h2>

          <p>
            Please wait while we load your products.
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
          <h1>❤️ My Wishlist</h1>
        </div>


        <div className="wishlist-empty">

          <h2>
            Unable to load products.
          </h2>

          <p>
            {typeof error === "string"
              ? error
              : "Something went wrong while loading your wishlist."}
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
  // RENDER
  // ========================================================

  return (
    <section className="wishlist-page container">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="wishlist-header">

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


      {/* ====================================================
          EMPTY WISHLIST
      ==================================================== */}

      {wishlistItems.length === 0 ? (

        <div className="wishlist-empty">

          <h2>
            Your wishlist is empty.
          </h2>


          <p>
            Save products you love and revisit
            them anytime.
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

          {wishlistItems.map((product) => {

            const productId = String(
              product?._id ??
              product?.id ??
              ""
            ).trim();


            return (

              <article
                key={productId}
                className="wishlist-card"
              >

                {/* ==========================================
                   PRODUCT IMAGE
                ========================================== */}

                <div className="wishlist-image">

                  <Link
                    to={`/products/${productId}`}
                  >

                    <img
                      src={
                        product.image ||
                        product.images?.[0] ||
                        product.gallery?.[0] ||
                        "/placeholder-product.png"
                      }
                      alt={product.name}
                      loading="lazy"
                    />

                  </Link>

                </div>


                {/* ==========================================
                   PRODUCT CONTENT
                ========================================== */}

                <div className="wishlist-content">

                  <h2>
                    {product.name}
                  </h2>


                  {/* BRAND */}

                  {product.brand && (
                    <p>
                      <strong>
                        Brand:
                      </strong>{" "}
                      {product.brand}
                    </p>
                  )}


                  {/* CATEGORY */}

                  {product.category && (
                    <p>
                      <strong>
                        Category:
                      </strong>{" "}
                      {product.category}
                    </p>
                  )}


                  {/* RATING */}

                  {product.rating !== undefined && (
                    <p>
                      ⭐ {product.rating}

                      {product.reviews !== undefined && (
                        <>
                          {" "}
                          (
                          {product.reviews}{" "}
                          {product.reviews === 1
                            ? "review"
                            : "reviews"}
                          )
                        </>
                      )}

                    </p>
                  )}


                  {/* PRICE */}

                  <h3>

                    {product.currency === "NGN"
                      ? "₦"
                      : "$"}

                    {Number(
                      product.price || 0
                    ).toLocaleString()}

                  </h3>


                  {/* OLD PRICE */}

                  {product.oldPrice &&
                    Number(product.oldPrice) >
                      Number(product.price) && (

                    <p className="wishlist-old-price">

                      <del>
                        {product.currency === "NGN"
                          ? "₦"
                          : "$"}

                        {Number(
                          product.oldPrice
                        ).toLocaleString()}
                      </del>

                    </p>

                  )}


                  {/* ========================================
                     ACTIONS
                  ======================================== */}

                  <div className="wishlist-item-actions">

                    {/* ADD TO CART */}

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() =>
                        handleAddToCart(product)
                      }
                    >
                      🛒 Add to Cart
                    </button>


                    {/* REMOVE */}

                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() =>
                        handleRemove(product)
                      }
                    >
                      Remove
                    </button>

                  </div>


                  {/* VIEW DETAILS */}

                  <Link
                    to={`/products/${productId}`}
                    className="btn btn-outline"
                  >
                    View Details
                  </Link>

                </div>

              </article>

            );
          })}

        </div>

      )}

    </section>
  );
}


// ==========================================================
// EXPORT
// ==========================================================

export default WishlistPage;