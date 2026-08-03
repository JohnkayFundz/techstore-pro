import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import { createOrder } from "../api/orderApi";
import { formatPrice } from "../utils/formatPrice";

function Checkout() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const { cart, cartTotal, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    country: user?.country || "Nigeria",
  });

  /* ==========================================
     SHIPPING / TAX
  ========================================== */

  const shippingPrice = 0;
  const taxPrice = 0;

  const totalPrice = useMemo(() => {
    return cartTotal + shippingPrice + taxPrice;
  }, [cartTotal, shippingPrice, taxPrice]);

  /* ==========================================
     HANDLE INPUT CHANGE
  ========================================== */

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ==========================================
     VALIDATE FORM
  ========================================== */

  const validateForm = () => {
    if (!form.name.trim()) return "Full name is required.";

    if (!form.email.trim()) return "Email address is required.";

    if (!/\S+@\S+\.\S+/.test(form.email))
      return "Please enter a valid email address.";

    if (!form.phone.trim()) return "Phone number is required.";

    if (form.phone.trim().length < 10)
      return "Please enter a valid phone number.";

    if (!form.address.trim()) return "Shipping address is required.";

    if (!form.city.trim()) return "City is required.";

    return null;
  };

  /* ==========================================
     PLACE ORDER
  ========================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const orderData = {
        orderItems: cart.map((item) => ({
          product:
            item.product?._id ||
            item.product?.id ||
            item._id ||
            item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),

        shippingAddress: {
          address: form.address,
          city: form.city,
          state: form.state,
          country: form.country,
        },

        paymentMethod: "Cash on Delivery",

        itemsPrice: cartTotal,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      const response = await createOrder(orderData);

      clearCart();
      setOrdered(true);

      setTimeout(() => {
        navigate(`/orders/${response?._id || response?.order?._id || ""}`);
      }, 1500);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to place your order."
      );
    } finally {
      setLoading(false);
    }
  };

  if (ordered) {
    return (
      <div className="container py-5">
        <div className="card shadow-sm border-0 text-center p-5">
          <h2 className="text-success mb-3">🎉 Order Placed Successfully!</h2>

          <p>Thank you for shopping with TechStore Pro.</p>

          <p>You will be redirected shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* Checkout Form */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Checkout</h3>
            </div>

            <div className="card-body">
              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">
                      Full Name
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Email
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Phone
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      State
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">
                      Address
                    </label>

                    <textarea
                      rows="3"
                      className="form-control"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      City
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Country
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <button
                  className="btn btn-primary mt-4"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-header">
              <h4 className="mb-0">Order Summary</h4>
            </div>

            <div className="card-body">
              {cart.map((item) => (
                <div
                  key={item._id || item.id}
                  className="d-flex justify-content-between mb-3"
                >
                  <div>
                    <div className="fw-semibold">
                      {item.name}
                    </div>

                    <small className="text-muted">
                      Qty: {item.quantity}
                    </small>
                  </div>

                  <div>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}

              <hr />

              <div className="d-flex justify-content-between">
                <span>Items</span>
                <strong>{formatPrice(cartTotal)}</strong>
              </div>

              <div className="d-flex justify-content-between">
                <span>Shipping</span>
                <strong>{formatPrice(shippingPrice)}</strong>
              </div>

              <div className="d-flex justify-content-between">
                <span>Tax</span>
                <strong>{formatPrice(taxPrice)}</strong>
              </div>

              <hr />

              <div className="d-flex justify-content-between fs-5">
                <strong>Total</strong>

                <strong className="text-primary">
                  {formatPrice(totalPrice)}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;