import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  FiCheckCircle,
  FiXCircle,
  FiPackage,
  FiMapPin,
  FiCreditCard,
  FiArrowRight,
  FiShoppingBag,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";

import { getOrderById } from "../api/orderApi";

import "./OrderSuccess.css";
import "./OrderSuccessPremium.css";

function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadOrder = async () => {
      if (!id) {
        if (mounted) {
          setError("Order ID is missing.");
          setLoading(false);
        }
        return;
      }

      try {
        const response = await getOrderById(id);
        const payload = response?.data ?? response;
        const loadedOrder = payload?.order ?? payload?.data ?? null;

        if (!loadedOrder) {
          throw new Error(payload?.message || "Order could not be found.");
        }

        if (mounted) {
          setOrder(loadedOrder);
          setError("");
        }
      } catch (requestError) {
        if (mounted) {
          setError(
            requestError?.response?.data?.message ||
              requestError?.message ||
              "Unable to load your order."
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadOrder();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="order-success-page">
        <section className="order-success order-loading" aria-live="polite">
          <FiLoader className="loading-spinner" aria-hidden="true" />
          <h1>Loading your order</h1>
          <p>Please wait while we retrieve your order details.</p>
        </section>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="order-success-page">
        <section className="order-success order-error" role="alert">
          <FiAlertCircle className="order-status-icon error" aria-hidden="true" />
          <h1>Order unavailable</h1>
          <p>{error || "We could not find that order."}</p>
          <Link className="footer-cta__button" to="/products">
            Continue Shopping <FiArrowRight aria-hidden="true" />
          </Link>
        </section>
      </main>
    );
  }

  const status = String(order.status || "pending").toLowerCase();
  const cancelled = status === "cancelled";
  const delivered = status === "delivered";
  const statusClass = cancelled ? "cancelled" : delivered ? "delivered" : "success";
  const StatusIcon = cancelled ? FiXCircle : FiCheckCircle;
  const address = order.shippingAddress || {};
  const items = Array.isArray(order.items) ? order.items : [];
  const paymentMethod = String(order.paymentMethod || "cash");
  const paymentStatus = String(order.paymentStatus || "pending");

  return (
    <main className="order-success-page">
      <section className="order-success">
        <div className="success-card">
          <div className={`order-status-icon ${statusClass}`} aria-hidden="true">
            <StatusIcon />
          </div>
          <h1>{cancelled ? "Order Cancelled" : "Order Confirmed"}</h1>
          <p className="success-message">
            {cancelled
              ? "This order has been cancelled."
              : "Thank you for your purchase. Your order has been received."}
          </p>
          <p className="order-number">
            Order number: <strong>{order.orderNumber || order._id}</strong>
          </p>
        </div>

        <div className="order-details-grid">
          <div className="details-card">
            <div className="details-card-header">
              <FiPackage aria-hidden="true" />
              <h2>Order Details</h2>
            </div>
            <div className="details-list">
              <div className="detail-row"><span>Status</span><strong>{status}</strong></div>
              <div className="detail-row"><span>Total</span><strong>₦{Number(order.totalAmount || 0).toLocaleString()}</strong></div>
              <div className="detail-row"><span>Items</span><strong>{items.length}</strong></div>
            </div>
          </div>

          <div className="details-card">
            <div className="details-card-header">
              <FiCreditCard aria-hidden="true" />
              <h2>Payment</h2>
            </div>
            <div className="details-list">
              <div className="detail-row"><span>Method</span><strong>{paymentMethod}</strong></div>
              <div className="detail-row"><span>Status</span><strong>{paymentStatus}</strong></div>
            </div>
          </div>

          <div className="details-card">
            <div className="details-card-header">
              <FiMapPin aria-hidden="true" />
              <h2>Shipping</h2>
            </div>
            <div className="details-list">
              <div className="detail-row"><span>Name</span><strong>{address.fullName}</strong></div>
              <div className="detail-row"><span>Phone</span><strong>{address.phone}</strong></div>
              <div className="detail-row"><span>Location</span><strong>{[address.city, address.state].filter(Boolean).join(", ")}</strong></div>
            </div>
          </div>
        </div>

        <div className="details-card">
          <div className="details-card-header">
            <FiShoppingBag aria-hidden="true" />
            <h2>Items in Your Order</h2>
          </div>
          <div className="details-list">
            {items.map((item, index) => (
              <div className="detail-row" key={`${item.product || item.name}-${index}`}>
                <span>{item.name} × {item.quantity}</span>
                <strong>₦{Number(item.price || 0).toLocaleString()}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="order-actions">
          <Link className="footer-cta__button" to="/products">
            Continue Shopping <FiArrowRight aria-hidden="true" />
          </Link>
          <Link className="footer-cta__button" to="/my-orders">
            View My Orders
          </Link>
        </div>
      </section>
    </main>
  );
}

export default OrderSuccess;
