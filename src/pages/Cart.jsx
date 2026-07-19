import { useCart } from "../context/CartContext";

function CartPage() {
  const { state, dispatch } = useCart();

  const total = state.cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (state.cart.length === 0) {
    return (
      <div className="container">
        <h1>🛒 Shopping Cart</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>🛒 Shopping Cart</h1>

      {state.cart.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px",
            marginBottom: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            background: "#fff",
          }}
        >
          <div>
            <h2>
              {item.image} {item.name}
            </h2>

            <p>
              <strong>Category:</strong> {item.category}
            </p>

            <p>
              <strong>Price:</strong> ${item.price}
            </p>

            <p>
              <strong>Subtotal:</strong> $
              {item.price * item.quantity}
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                marginBottom: "15px",
              }}
            >
              <button
                onClick={() =>
                  dispatch({
                    type: "DECREASE",
                    payload: item.id,
                  })
                }
              >
                −
              </button>

              <strong>{item.quantity}</strong>

              <button
                onClick={() =>
                  dispatch({
                    type: "INCREASE",
                    payload: item.id,
                  })
                }
              >
                +
              </button>
            </div>

            <button
              onClick={() =>
                dispatch({
                  type: "REMOVE",
                  payload: item.id,
                })
              }
            >
              🗑 Remove
            </button>
          </div>
        </div>
      ))}

      <hr />

      <h2>Total: ${total}</h2>

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        <button
          onClick={() =>
            dispatch({
              type: "CLEAR_CART",
            })
          }
        >
          🗑 Clear Cart
        </button>

        <button>
          💳 Checkout
        </button>
      </div>
    </div>
  );
}

export default CartPage;