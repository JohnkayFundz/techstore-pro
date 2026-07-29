import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

import products, { currency } from "../data/products";

function WishlistPage() {
  const { cart, dispatch } = useCart();

  const { wishlist, toggleWishlist } = useWishlist();

  const wishlistItems = products.filter((product) =>
    wishlist.includes(product.id)
  );

  function handleAddToCart(product) {
    const alreadyInCart = cart.some(
      (item) => item.id === product.id
    );

    if (alreadyInCart) {
      toast("Product is already in your cart.");
      return;
    }

    dispatch({
      type: "ADD_TO_CART",
      payload: product,
    });

    toast.success(`${product.name} added to cart.`);
  }

  function handleRemove(product) {
    toggleWishlist(product.id);
    toast.success(`${product.name} removed from wishlist.`);
  }

  return (
    <section className="wishlist-page container">
      <div className="wishlist-header">
        <h1>❤️ My Wishlist</h1>

        <p>
          {wishlistItems.length}{" "}
          {wishlistItems.length === 1
            ? "item"
            : "items"}
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="wishlist-empty">
          <h2>Your wishlist is empty.</h2>

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
        <div className="wishlist-grid">
          {wishlistItems.map((product) => (
            <article
              key={product.id}
              className="wishlist-card"
            >
              <div className="wishlist-image">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                />
              </div>

              <div className="wishlist-content">
                <h2>{product.name}</h2>

                <p>
                  <strong>Brand:</strong>{" "}
                  {product.brand}
                </p>

                <p>
                  <strong>Category:</strong>{" "}
                  {product.category}
                </p>

                <p>
                  ⭐ {product.rating} (
                  {product.reviews} reviews)
                </p>

                <h3>
                  {currency}
                  {product.price.toLocaleString()}
                </h3>

                <div className="wishlist-item-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      handleAddToCart(product)
                    }
                  >
                    🛒 Add to Cart
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      handleRemove(product)
                    }
                  >
                    Remove
                  </button>
                </div>

                <Link
                  to={`/products/${product.id}`}
                  className="btn btn-outline"
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default WishlistPage;