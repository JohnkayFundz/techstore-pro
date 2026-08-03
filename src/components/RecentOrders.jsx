import { Link } from "react-router-dom";
import { FiPackage } from "react-icons/fi";

function RecentOrders() {
  // Temporary data until backend integration
  const orders = [];

  return (
    <div className="dashboard-panel">
      <div className="panel-header">
        <h3>Recent Orders</h3>

        <Link to="/orders" className="view-all">
          View All
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="empty-dashboard">
          <FiPackage size={40} />

          <h4>No Orders Yet</h4>

          <p>You haven't placed any orders yet.</p>

          <Link to="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-item" key={order._id}>
              <div>
                <h4>Order #{order.orderNumber}</h4>
                <p>{order.date}</p>
              </div>

              <strong>${order.total.toFixed(2)}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentOrders;