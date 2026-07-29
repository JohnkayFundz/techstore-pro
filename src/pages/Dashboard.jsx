import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Dashboard() {
  const { state } = useCart();
  const { wishlist } = useWishlist();

  let user = {
    name: "Guest User",
    email: "guest@example.com",
  };

  try {
    const storedUser = localStorage.getItem("techstore-user");
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Failed to load user:", error);
  }

  const totalItems = state.cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalSpent = state.cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <section className="dashboard-page">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>My Dashboard</h1>
            <p>Welcome back, {user.name || user.email} 👋</p>
          </div>

          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>

        {/* Statistics */}
        <div className="dashboard-stats">
          <div className="dashboard-card">
            <span className="dashboard-icon">🛒</span>
            <h2>{totalItems}</h2>
            <p>Cart Items</p>
          </div>

          <div className="dashboard-card">
            <span className="dashboard-icon">❤️</span>
            <h2>{wishlist.length}</h2>
            <p>Wishlist</p>
          </div>

          <div className="dashboard-card">
            <span className="dashboard-icon">💳</span>
            <h2>${totalSpent.toFixed(2)}</h2>
            <p>Cart Total</p>
          </div>

          <div className="dashboard-card">
            <span className="dashboard-icon">📦</span>
            <h2>0</h2>
            <p>Orders</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-grid">
          {/* Account Information */}
          <div className="dashboard-panel">
            <h3>Account Information</h3>

            <div className="profile-info">
              <div className="profile-row">
                <span>Name</span>
                <strong>{user.name || "Not provided"}</strong>
              </div>

              <div className="profile-row">
                <span>Email</span>
                <strong>{user.email}</strong>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-panel">
            <h3>Quick Actions</h3>

            <div className="dashboard-actions">
              <Link to="/products" className="dashboard-action">
                Browse Products
              </Link>

              <Link to="/wishlist" className="dashboard-action">
                View Wishlist
              </Link>

              <Link to="/cart" className="dashboard-action">
                Shopping Cart
              </Link>

              <Link to="/checkout" className="dashboard-action">
                Checkout
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-panel">
          <h3>Recent Activity</h3>

          {state.cart.length === 0 ? (
            <div className="empty-dashboard">
              <p>No recent shopping activity yet.</p>

              <Link to="/products" className="btn btn-primary">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="activity-list">
              {state.cart.map((item) => (
                <div className="activity-item" key={item.id}>
                  <img src={item.image} alt={item.name} />

                  <div>
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                  </div>

                  <strong>
                    ${(item.price * item.quantity).toFixed(2)}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;