import { Link, useParams } from "react-router-dom";
import orders from "../data/orders";

function OrderDetails() {
  const { id } = useParams();

  const order = orders.find((item) => item.id === id);

  if (!order) {
    return (
      <section className="orders-page">
        <div className="container">

          <div className="empty-orders">

            <h2>Order Not Found</h2>

            <p>
              We couldn't find the order you're looking for.
            </p>

            <Link
              to="/orders"
              className="btn btn-primary"
            >
              Back to Orders
            </Link>

          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="order-details-page">
      <div className="container">

        <div className="order-header">

          <div>
            <h1>{order.id}</h1>
            <p>Placed on {order.date}</p>
          </div>

          <span
            className={`status ${order.status.toLowerCase()}`}
          >
            {order.status}
          </span>

        </div>

        <div className="order-summary-grid">

          <div className="summary-card">
            <h3>Payment</h3>
            <p>{order.payment}</p>
          </div>

          <div className="summary-card">
            <h3>Shipping</h3>
            <p>{order.shipping}</p>
          </div>

          <div className="summary-card">
            <h3>Tracking</h3>
            <p>{order.tracking}</p>
          </div>

          <div className="summary-card">
            <h3>Total</h3>
            <h2>${order.total.toFixed(2)}</h2>
          </div>

        </div>

        <div className="order-products">

          <h2>Items Ordered</h2>

          {order.items.map((item) => (

            <div
              className="ordered-product"
              key={item.id}
            >

              <img
                src={item.image}
                alt={item.name}
              />

              <div className="ordered-product-info">

                <h3>{item.name}</h3>

                <p>
                  Quantity: {item.quantity}
                </p>

              </div>

              <strong>
                ${(item.price * item.quantity).toFixed(2)}
              </strong>

            </div>

          ))}

        </div>

        <div className="order-actions">

          <button className="btn btn-primary">
            Download Invoice
          </button>

          <button className="btn btn-outline">
            Track Order
          </button>

          {(order.status === "Pending" ||
            order.status === "Processing") && (
            <button className="btn btn-danger">
              Cancel Order
            </button>
          )}

          <Link
            to="/products"
            className="btn btn-secondary"
          >
            Buy Again
          </Link>

        </div>

      </div>
    </section>
  );
}

export default OrderDetails;