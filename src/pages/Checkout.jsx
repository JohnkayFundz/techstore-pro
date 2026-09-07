import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createOrder } from "../api/orderApi";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";

import "./Checkout.css";
import "./CheckoutPremium.css";

const FALLBACK_IMAGE = "/placeholder-product.png";

const isValidImage = (value) => {
  if (typeof value !== "string" || !value.trim()) return false;
  return !value.trim().includes("via.placeholder.com");
};

const getItemImage = (item) => {
  if (!item) return FALLBACK_IMAGE;

  const candidates = [
    item.image,
    item.productImage,
    item.thumbnail,
    ...(Array.isArray(item.images) ? item.images : []),
    item.product?.image,
    item.product?.imageUrl,
    ...(Array.isArray(item.product?.images) ? item.product.images : []),
  ];

  const valid = candidates.find((candidate) => {
    if (typeof candidate === "string") return isValidImage(candidate);
    return Boolean(candidate && typeof candidate.url === "string" && isValidImage(candidate.url));
  });

  if (typeof valid === "string") return valid;
  if (valid?.url) return valid.url;
  return FALLBACK_IMAGE;
};

function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
    paymentMethod: "cash",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    if (error) setError("");
  };

  const handleImageError = (event) => {
    if (!event.currentTarget.src.endsWith(FALLBACK_IMAGE)) {
      event.currentTarget.src = FALLBACK_IMAGE;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    setError("");

    if (!Array.isArray(cart) || cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const requiredFields = [
      formData.fullName,
      formData.phone,
      formData.address,
      formData.city,
      formData.state,
      formData.country,
    ];

    if (requiredFields.some((value) => !String(value || "").trim())) {
      setError("Please fill in all delivery information.");
      return;
    }

    const items = cart.map((item) => ({
      product: item?._id || item?.id || item?.product?._id || item?.product?.id,
      quantity: Number(item?.quantity) || 1,
    }));

    if (items.some((item) => !item.product)) {
      setError("One or more products in your cart are missing a product ID. Please remove the affected product and add it again.");
      return;
    }

    const orderData = {
      items,
      shippingAddress: {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        country: formData.country.trim(),
      },
      paymentMethod: formData.paymentMethod,
    };

    try {
      setLoading(true);
      const response = await createOrder(orderData);
      const payload = response?.data ?? response;

      if (!payload || payload.success === false) {
        throw new Error(payload?.message || "Order was not created successfully.");
      }

      const createdOrder = payload?.order || payload?.data?.order || payload?.data;
      const orderId = createdOrder?._id || createdOrder?.id;

      if (!orderId) {
        throw new Error("Order was created, but no order ID was returned.");
      }

      clearCart();
      navigate(`/order-success/${orderId}`);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Unable to place your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!Array.isArray(cart) || cart.length === 0) {
    return (
      <main className="checkout-page" id="main-content">
        <div className="checkout-container">
          <div className="checkout-card">
            <h1>Checkout</h1>
            <p>Your cart is empty.</p>
            <button type="button" className="checkout-btn" onClick={() => navigate("/products")}>
              Continue Shopping
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page" id="main-content">
      <div className="checkout-container">
        <header className="checkout-header">
          <span className="checkout-eyebrow">SECURE CHECKOUT</span>
          <h1>Checkout</h1>
          <p>Complete your delivery information to place your order.</p>
        </header>

        {error && <div className="checkout-error" role="alert">{error}</div>}

        <div className="checkout-content">
          <section className="checkout-form-card" aria-labelledby="delivery-heading">
            <h2 id="delivery-heading">Delivery Information</h2>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" autoComplete="name" disabled={loading} required />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" autoComplete="tel" disabled={loading} required />
              </div>

              <div className="form-group">
                <label htmlFor="address">Delivery Address</label>
                <textarea id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Enter your delivery address" autoComplete="street-address" rows="4" disabled={loading} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input id="city" name="city" type="text" value={formData.city} onChange={handleChange} placeholder="City" autoComplete="address-level2" disabled={loading} required />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input id="state" name="state" type="text" value={formData.state} onChange={handleChange} placeholder="State" autoComplete="address-level1" disabled={loading} required />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input id="country" name="country" type="text" value={formData.country} onChange={handleChange} placeholder="Country" autoComplete="country-name" disabled={loading} required />
              </div>

              <div className="form-group">
                <label htmlFor="paymentMethod">Payment Method</label>
                <select id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} disabled={loading}>
                  <option value="cash">Cash on Delivery</option>
                  <option value="card">Card Payment</option>
                </select>
              </div>

              <button type="submit" className="checkout-btn" disabled={loading}>
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </section>

          <aside className="checkout-summary" aria-labelledby="summary-heading">
            <h2 id="summary-heading">Order Summary</h2>
            <div className="summary-items">
              {cart.map((item, index) => {
                const productName = item?.name || item?.product?.name || "Product";
                const quantity = Number(item?.quantity) || 1;
                const price = Number(item?.price ?? item?.product?.price ?? 0) || 0;
                const itemKey = item?.cartId || item?._id || item?.id || item?.product?._id || `checkout-item-${index}`;

                return (
                  <div className="summary-item" key={itemKey}>
                    <div className="summary-item-image">
                      <img src={getItemImage(item)} alt={productName} loading="eager" decoding="async" onError={handleImageError} />
                    </div>
                    <div className="summary-item-info">
                      <h3>{productName}</h3>
                      <p>Quantity: {quantity}</p>
                      <strong>{formatPrice(price * quantity)}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="summary-total">
              <span>Total</span>
              <strong>{formatPrice(cartTotal)}</strong>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Checkout;
