// ==========================================================
// Wishlist.jsx
// ==========================================================

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useProduct } from "../context/ProductContext";

import "./WishlistPremium.css";

function getProductId(product) {
  if (!product) return "";
  return String(product._id ?? product.id ?? product.productId ?? "").trim();
}

function getProductImage(product) {
  if (!product) return "/placeholder-product.png";
  return product.image || product.images?.[0] || product.gallery?.[0] || "/placeholder-product.png";
}

function formatPrice(price, currency = "USD") {
  const amount = Number(price ?? 0);
  if (Number.isNaN(amount)) return currency === "NGN" ? "₦0" : "$0";
  return currency === "NGN"
    ? `₦${amount.toLocaleString("en-NG")}`
    : `$${amount.toLocaleString("en-US")}`;
}

function WishlistPage() {
  const { cart = [], dispatch } = useCart();
  const { wishlist = [], toggleWishlist, clearWishlist } = useWishlist();
  const { products = [], loading, error } = useProduct();

  const wishlistIds = wishlist
    .map((item) => {
      if (item === null || item === undefined) return "";
      if (typeof item === "string" || typeof item === "number") return String(item).trim();
      if (typeof item === "object") return String(item._id ?? item.id ?? item.productId ?? "").trim();
      return "";
    })
    .filter(Boolean);

  const uniqueWishlistIds = [...new Set(wishlistIds)];
  const wishlistItems = products.filter((product) => uniqueWishlistIds.includes(getProductId(product)));

  function handleAddToCart(product) {
    const productId = getProductId(product);
    if (!productId) {
      toast.error("Unable to add this product to cart.");
      return;
    }

    if (cart.some((item) => getProductId(item) === productId)) {
      toast("Product is already in your cart.");
      return;
    }

    dispatch({ type: "ADD_TO_CART", payload: product });
    toast.success(`${product.name || "Product"} added to cart.`);
  }

  function handleRemove(product) {
    const productId = getProductId(product);
    if (!productId) {
      toast.error("Unable to remove this product.");
      return;
    }

    toggleWishlist(productId);
    toast.success(`${product.name || "Product"} removed from wishlist.`);
  }

  function handleClearWishlist() {
    if (uniqueWishlistIds.length === 0) return;
    clearWishlist();
    toast.success("Wishlist cleared.");
  }

  if (loading) {
    return (
      <section className="wishlist-page container">
        <div className="wishlist-header">
          <div>
            <h1>My Wishlist</h1>
            <p>Loading wishlist...</p>
          </div>
        </div>
        <div className="wishlist-empty">
          <div className="wishlist-empty-icon" aria-hidden="true">♡</div>
          <h2>Loading your wishlist...</h2>
          <p>Please wait while we load your saved products.</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="wishlist-page container">
        <div className="wishlist-header">
          <div><h1>My Wishlist</h1></div>
        </div>
        <div className="wishlist-empty">
          <div className="wishlist-empty-icon" aria-hidden="true">!</div>
          <h2>Unable to load products.</h2>
          <p>{typeof error === "string" ? error : "Something went wrong while loading your products."}</p>
          <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="wishlist-page container">
      <div className="wishlist-header">
        <div>
          <h1>My Wishlist</h1>
          <p>{wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}</p>
        </div>

        {wishlistItems.length > 0 && (
          <button type="button" className="btn btn-danger" onClick={handleClearWishlist}>
            Clear Wishlist
          </button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="wishlist-empty">
          <div className="wishlist-empty-icon" aria-hidden="true">♡</div>
          <h2>Your wishlist is empty.</h2>
          <p>Save products you love and revisit them anytime.</p>
          <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((product) => {
            const productId = getProductId(product);
            const image = getProductImage(product);
            const price = Number(product?.price ?? 0);
            const oldPrice = Number(product?.oldPrice ?? 0);
            const hasOldPrice = oldPrice > price;
            const currency = product?.currency || "USD";

            return (
              <article key={productId} className="wishlist-card">
                <div className="wishlist-image">
                  <Link to={`/products/${productId}`} aria-label={`View ${product?.name || "product"}`}>
                    <img
                      src={image}
                      alt={product?.name || "Product"}
                      loading="lazy"
                      onError={(event) => {
                        if (!event.currentTarget.src.endsWith("/placeholder-product.png")) {
                          event.currentTarget.src = "/placeholder-product.png";
                        }
                      }}
                    />
                  </Link>
                </div>

                <div className="wishlist-content">
                  <h2>{product?.name || "Unnamed Product"}</h2>

                  {product?.brand && <p><strong>Brand:</strong> {product.brand}</p>}
                  {product?.category && <p><strong>Category:</strong> {product.category}</p>}

                  {product?.rating !== undefined && (
                    <p aria-label={`${product.rating} rating`}>
                      ★ {product.rating}
                      {product?.numReviews !== undefined && (
                        <> ({product.numReviews} {product.numReviews === 1 ? "review" : "reviews"})</>
                      )}
                    </p>
                  )}

                  <h3>{formatPrice(price, currency)}</h3>

                  {hasOldPrice && (
                    <p className="wishlist-old-price"><del>{formatPrice(oldPrice, currency)}</del></p>
                  )}

                  {Number(product?.discount) > 0 && (
                    <span className="wishlist-discount">{product.discount}% OFF</span>
                  )}

                  <div className="wishlist-item-actions">
                    <button type="button" className="btn btn-primary" onClick={() => handleAddToCart(product)}>
                      Add to Cart
                    </button>
                    <button type="button" className="btn btn-danger" onClick={() => handleRemove(product)}>
                      Remove
                    </button>
                  </div>

                  <Link to={`/products/${productId}`} className="btn btn-outline">
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

export default WishlistPage;
