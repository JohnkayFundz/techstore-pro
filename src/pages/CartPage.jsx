import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { currency } from "../data/products";

function CartPage() {
  const {
    state,
    dispatch,
    cartTotal,
  } = useCart();

  const {
    success,
    warning,
    info,
  } = useToast();

  const { cart } = state;

  const increaseQuantity = (id, name) => {
    dispatch({
      type: "INCREASE",
      payload: id,
    });

    info(
      "Quantity Updated",
      `${name} quantity increased.`
    );
  };

  const decreaseQuantity = (id, name) => {
    dispatch({
      type: "DECREASE",
      payload: id,
    });

    info(
      "Quantity Updated",
      `${name} quantity decreased.`
    );
  };

  const removeItem = (id, name) => {
    dispatch({
      type: "REMOVE",
      payload: id,
    });

    warning(
      "Item Removed",
      `${name} has been removed from your cart.`
    );
  };

  const clearCart = () => {
    dispatch({
      type: "CLEAR_CART",
    });

    warning(
      "Cart Cleared",
      "All items have been removed from your cart."
    );
  };

  const handleCheckout = () => {
    success(
      "Ready to Checkout",
      "Proceed to checkout to complete your purchase."
    );
  };

  if (cart.length === 0) {
    return (
      <section className="cart-page">
        <div className="empty-cart">
          <h2>Your Cart is Empty</h2>

          <p>
            Looks like you haven't added any products yet.
          </p>

          <Link
            to="/products"
            className="btn-primary"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="section-header">
        <h1>Shopping Cart</h1>

        <button
          className="btn-danger"
          onClick={clearCart}
        >
          Clear Cart
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <article
              key={item.id}
              className="cart-item"
            >
              <img
                src={item.image}
                alt={item.name}
                className="cart-image"
              />

              <div className="cart-details">
                <h3>{item.name}</h3>

                <p>{item.brand}</p>

                <strong>
                  {currency}
                  {item.price.toLocaleString()}
                </strong>
              </div>

              <div className="cart-quantity">
                <button
                  onClick={() =>
                    decreaseQuantity(
                      item.id,
                      item.name
                    )
                  }
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    increaseQuantity(
                      item.id,
                      item.name
                    )
                  }
                >
                  +
                </button>
              </div>

              <div className="cart-subtotal">
                <strong>
                  {currency}
                  {(
                    item.price * item.quantity
                  ).toLocaleString()}
                </strong>
              </div>

              <button
                className="remove-btn"
                onClick={() =>
                  removeItem(
                    item.id,
                    item.name
                  )
                }
              >
                Remove
              </button>
            </article>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Total Items</span>

            <strong>
              {cart.reduce(
                (total, item) =>
                  total + item.quantity,
                0
              )}
            </strong>
          </div>

          <div className="summary-row total">
            <span>Total</span>

            <strong>
              {currency}
              {cartTotal.toLocaleString()}
            </strong>
          </div>

          <button
            className="btn-primary checkout-btn"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>

          <Link
            to="/products"
            className="continue-shopping"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </section>
  );
}
export default CartPage;