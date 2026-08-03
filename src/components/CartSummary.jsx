import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "../../context/CartContext";

function CartSummary() {
  const { state } = useCart();

  const totalItems = state.cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = state.cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="dashboard-panel">
      <div className="panel-header">
        <h3>Cart Summary</h3>

        <Link to="/cart" className="view-all">
          View Cart
        </Link>
      </div>

      {state.cart.length === 0 ? (
        <div className="empty-dashboard">
          <FiShoppingCart size={40} />

          <h4>Your cart is empty</h4>

          <p>Add products to your cart to see them here.</p>

          <Link to="/products" className="btn btn-primary">
            Shop Now
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-summary">
            <div className="summary-row">
              <span>Total Items</span>
              <strong>{totalItems}</strong>
            </div>

            <div className="summary-row">
              <span>Total Amount</span>
              <strong>${totalPrice.toFixed(2)}</strong>
            </div>
          </div>

          <Link to="/checkout" className="btn btn-primary">
            Proceed to Checkout
          </Link>
        </>
      )}
    </div>
  );
}

export default CartSummary;