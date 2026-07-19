import { useCart } from "../context/CartContext";

function Checkout() {
  const { state } = useCart();

  const total = state.cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = () => {
    alert("🎉 Order placed successfully!");
  };

  return (
    <div className="container">
      <h1>💳 Checkout</h1>

      <div className="checkout-container">
        <div className="checkout-form">
          <input
            type="text"
            placeholder="Full Name"
          />

          <input
            type="email"
            placeholder="Email Address"
          />

          <input
            type="text"
            placeholder="Phone Number"
          />

          <textarea
            placeholder="Shipping Address"
            rows="4"
          ></textarea>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>

          {state.cart.map((item) => (
            <div
              key={item.id}
              className="summary-item"
            >
              <span>
                {item.name} × {item.quantity}
              </span>

              <span>
                ${item.price * item.quantity}
              </span>
            </div>
          ))}

          <hr />

          <h2>Total: ${total}</h2>

          <button
            className="checkout-btn"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;