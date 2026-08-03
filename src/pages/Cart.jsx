import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { currency } from "../data/products";

function CartPage() {
  const {
    cart = [],
    lastAddedId,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

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
      <h1>🛒 Shopping Cart</h1>

      <div className="cart-layout">
        {/* Cart Items */}
        <div className="cart-items">
          {cart.map((item) => (
            <article
              key={item.cartId}
              className={
                item.cartId === lastAddedId
                  ? "cart-item highlight"
                  : "cart-item"
              }
            >
              <div className="cart-product">
                <div className="cart-image">
                  <img
                    src={item.image}
                    alt={item.name}
                  />
                </div>

                <div>
                  <h2>{item.name}</h2>

                  <p>{item.brand}</p>

                  <strong>
                    {currency}
                    {Number(item.price).toLocaleString()}
                  </strong>
                </div>
              </div>

              <div className="cart-actions">
                <div className="quantity-controls">
                  <button
                    onClick={() =>
                      decreaseQuantity(
                        item.cartId
                      )
                    }
                  >
                    −
                  </button>

                  <span>
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      increaseQuantity(
                        item.cartId
                      )
                    }
                  >
                    +
                  </button>
                </div>

                <p>
                  Subtotal:

                  <strong>
                    {currency}
                    {(
                      Number(item.price) *
                      item.quantity
                    ).toLocaleString()}
                  </strong>
                </p>

                <button
                  className="remove-btn"
                  onClick={() =>
                    removeFromCart(
                      item.cartId
                    )
                  }
                >
                  🗑 Remove
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Summary */}
        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Items</span>

            <span>{cart.length}</span>
          </div>

          <div className="summary-row">
            <span>Total</span>

            <strong>
              {currency}
              {cartTotal.toLocaleString()}
            </strong>
          </div>

          <button className="btn-primary">
            💳 Checkout
          </button>

          <button
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