import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { currency } from "../data/products";

function CartPage() {
  const navigate = useNavigate();

  const {
    cart = [],
    lastAddedId,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <section className="empty-cart container">
        <h1>🛒 Shopping Cart</h1>

        <p>Your cart is empty.</p>

        <Link
          to="/products"
          className="btn-primary"
        >
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="cart-page container">
      <div className="section-header">
        <h1>🛒 Shopping Cart</h1>

        <button
          type="button"
          className="clear-btn"
          onClick={clearCart}
        >
          Clear Cart
        </button>
      </div>

      <div className="cart-layout">

        {/* =====================================================
            CART ITEMS
        ====================================================== */}

        <div className="cart-items">
          {cart.map((item, index) => {
            const itemId =
              item.cartId ||
              item.id ||
              item._id ||
              `${item.name}-${index}`;

            return (
              <article
                key={itemId}
                className={
                  item.cartId === lastAddedId
                    ? "cart-item highlight"
                    : "cart-item"
                }
              >
                {/* PRODUCT */}

                <div className="cart-product">
                  <div className="cart-image">
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  </div>

                  <div className="cart-details">
                    <h2>{item.name}</h2>

                    <p>{item.brand}</p>

                    <strong>
                      {currency}
                      {Number(item.price).toLocaleString()}
                    </strong>
                  </div>
                </div>

                {/* ACTIONS */}

                <div className="cart-actions">

                  {/* QUANTITY */}

                  <div className="quantity-controls">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.name}`}
                      onClick={() =>
                        decreaseQuantity(itemId)
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.name}`}
                      onClick={() =>
                        increaseQuantity(itemId)
                      }
                    >
                      +
                    </button>
                  </div>

                  {/* SUBTOTAL */}

                  <p className="cart-subtotal">
                    <span>Subtotal:</span>

                    <strong>
                      {currency}
                      {(
                        Number(item.price) *
                        Number(item.quantity || 0)
                      ).toLocaleString()}
                    </strong>
                  </p>

                  {/* REMOVE */}

                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() =>
                      removeFromCart(itemId)
                    }
                  >
                    🗑 Remove
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* =====================================================
            ORDER SUMMARY
        ====================================================== */}

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Total Items</span>

            <strong>
              {cart.reduce(
                (total, item) =>
                  total + Number(item.quantity || 0),
                0
              )}
            </strong>
          </div>

          <div className="summary-row total">
            <span>Total</span>

            <strong>
              {currency}
              {Number(cartTotal).toLocaleString()}
            </strong>
          </div>

          {/* CHECKOUT */}

          <button
            type="button"
            className="btn-primary checkout-btn"
            onClick={handleCheckout}
          >
            💳 Proceed to Checkout
          </button>

          {/* CONTINUE SHOPPING */}

          <Link
            to="/products"
            className="continue-shopping"
          >
            Continue Shopping
          </Link>

          {/* CLEAR CART */}

          <button
            type="button"
            className="clear-btn"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        </aside>
      </div>
    </section>
  );
}

export default CartPage;