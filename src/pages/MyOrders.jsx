import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyOrders } from "../api/orderApi";
import { currency } from "../data/products";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const result = await getMyOrders();

      if (result.success) {
        setOrders(result.orders);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load your orders."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="container">
        <h2>Loading Orders...</h2>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container">
        <div className="error-message">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="container my-orders-page">
      <h1>📦 My Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <h2>No Orders Yet</h2>

          <p>
            You haven't placed any orders yet.
          </p>

          <Link
            to="/products"
            className="btn btn-primary"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div
              key={order._id}
              className="order-card"
            >
              <div className="order-header">
                <h3>
                  Order #
                  {order._id.slice(-8).toUpperCase()}
                </h3>

                <span
                  className={`status ${order.status}`}
                >
                  {order.status}
                </span>
              </div>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(
                  order.createdAt
                ).toLocaleDateString()}
              </p>

              <p>
                <strong>Items:</strong>{" "}
                {order.items.length}
              </p>

              <p>
                <strong>Total:</strong>{" "}
                {currency}
                {order.totalAmount.toLocaleString()}
              </p>

              <Link
                to={`/orders/${order._id}`}
                className="btn btn-secondary"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyOrders;