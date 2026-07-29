import "./OrderCard.css";

function OrderCard({ order }) {
  const {
    id,
    date,
    status,
    total,
    payment,
    shipping,
    tracking,
    items,
  } = order;

  const firstItem = items[0];

  return (
    <div className="order-card">
      <div className="order-image">
        <img src={firstItem.image} alt={firstItem.name} />
      </div>

      <div className="order-content">
        <div className="order-header">
          <h3>{id}</h3>

          <span
            className={`order-status ${status.toLowerCase()}`}
          >
            {status}
          </span>
        </div>

        <p>
          <strong>Date:</strong> {date}
        </p>

        <p>
          <strong>Product:</strong> {firstItem.name}
        </p>

        <p>
          <strong>Items:</strong> {items.length}
        </p>

        <p>
          <strong>Payment:</strong> {payment}
        </p>

        <p>
          <strong>Shipping:</strong> {shipping}
        </p>

        <p>
          <strong>Tracking:</strong> {tracking}
        </p>

        <div className="order-footer">
          <h2>${total.toLocaleString()}</h2>

          <button className="btn-primary">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderCard;