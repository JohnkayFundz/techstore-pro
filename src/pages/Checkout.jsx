import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createOrder } from "../api/orderApi";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";

function Checkout() {
  const navigate = useNavigate();

  const {
    cart,
    cartTotal,
    clearCart,
  } = useCart();

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

  /* ==========================================================
     HANDLE INPUT
  ========================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* ==========================================================
     SUBMIT ORDER
  ========================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    /* --------------------------------------------------------
       CHECK CART
    -------------------------------------------------------- */

    if (!Array.isArray(cart) || cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    /* --------------------------------------------------------
       VALIDATE SHIPPING INFORMATION
    -------------------------------------------------------- */

    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.country.trim()
    ) {
      setError(
        "Please fill in all delivery information."
      );

      return;
    }

    /* --------------------------------------------------------
       PREPARE ORDER ITEMS

       Backend expects:

       {
         product: productId,
         quantity: number
       }
    -------------------------------------------------------- */

    const items = cart.map((item) => ({
      product: item._id || item.id,
      quantity: Number(item.quantity) || 1,
    }));

    /* --------------------------------------------------------
       CHECK PRODUCT IDS
    -------------------------------------------------------- */

    const invalidItem = items.find(
      (item) => !item.product
    );

    if (invalidItem) {
      setError(
        "One or more products in your cart are missing a product ID. Please remove the affected product and add it again."
      );

      return;
    }

    /* --------------------------------------------------------
       PREPARE ORDER DATA
    -------------------------------------------------------- */

    const orderData = {
      items,

      shippingAddress: {
        fullName:
          formData.fullName.trim(),

        phone:
          formData.phone.trim(),

        address:
          formData.address.trim(),

        city:
          formData.city.trim(),

        state:
          formData.state.trim(),

        country:
          formData.country.trim(),
      },

      paymentMethod:
        formData.paymentMethod,
    };

    console.log(
      "ORDER DATA:",
      orderData
    );

    /* --------------------------------------------------------
       CREATE ORDER
    -------------------------------------------------------- */

    try {
      setLoading(true);

      const response =
        await createOrder(orderData);

      console.log(
        "CREATE ORDER RESPONSE:",
        response.data
      );

      /* ------------------------------------------------------
         VERIFY RESPONSE
      ------------------------------------------------------ */

      if (
        !response.data ||
        !response.data.success ||
        !response.data.order
      ) {
        throw new Error(
          response.data?.message ||
            "Order was not created successfully."
        );
      }

      const createdOrder =
        response.data.order;

      console.log(
        "CREATED ORDER:",
        createdOrder
      );

      /* ------------------------------------------------------
         VERIFY ORDER ID
      ------------------------------------------------------ */

      if (!createdOrder._id) {
        throw new Error(
          "Order was created, but no order ID was returned."
        );
      }

      console.log(
        "ORDER ID:",
        createdOrder._id
      );

      /* ------------------------------------------------------
         CLEAR CART
      ------------------------------------------------------ */

      clearCart();

      /* ------------------------------------------------------
         NAVIGATE TO SUCCESS PAGE

         IMPORTANT:

         Backend response:

         response.data.order._id

         NOT:

         response.data._id
      ------------------------------------------------------ */

      navigate(
        `/order-success/${createdOrder._id}`
      );

    } catch (error) {
      console.error(
        "CREATE ORDER ERROR:",
        error
      );

      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to place your order. Please try again.";

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     EMPTY CART
  ========================================================== */

  if (!Array.isArray(cart) || cart.length === 0) {
    return (
      <div className="checkout-page">

        <div className="checkout-container">

          <div className="checkout-card">

            <h1>
              Checkout
            </h1>

            <p>
              Your cart is empty.
            </p>

            <button
              type="button"
              className="checkout-btn"
              onClick={() =>
                navigate("/products")
              }
            >
              Continue Shopping
            </button>

          </div>

        </div>

      </div>
    );
  }

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="checkout-page">

      <div className="checkout-container">

        <div className="checkout-header">

          <h1>
            Checkout
          </h1>

          <p>
            Complete your delivery information
            to place your order.
          </p>

        </div>

        {/* ====================================================
            ERROR MESSAGE
        ==================================================== */}

        {error && (
          <div className="checkout-error">
            {error}
          </div>
        )}

        <div className="checkout-content">

          {/* ==================================================
              DELIVERY FORM
          ================================================== */}

          <div className="checkout-form-card">

            <h2>
              Delivery Information
            </h2>

            <form onSubmit={handleSubmit}>

              {/* FULL NAME */}

              <div className="form-group">

                <label htmlFor="fullName">
                  Full Name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  disabled={loading}
                  required
                />

              </div>

              {/* PHONE */}

              <div className="form-group">

                <label htmlFor="phone">
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  disabled={loading}
                  required
                />

              </div>

              {/* ADDRESS */}

              <div className="form-group">

                <label htmlFor="address">
                  Delivery Address
                </label>

                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your delivery address"
                  rows="4"
                  disabled={loading}
                  required
                />

              </div>

              {/* CITY + STATE */}

              <div className="form-row">

                <div className="form-group">

                  <label htmlFor="city">
                    City
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    disabled={loading}
                    required
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="state">
                    State
                  </label>

                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    disabled={loading}
                    required
                  />

                </div>

              </div>

              {/* COUNTRY */}

              <div className="form-group">

                <label htmlFor="country">
                  Country
                </label>

                <input
                  id="country"
                  name="country"
                  type="text"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                  disabled={loading}
                  required
                />

              </div>

              {/* PAYMENT METHOD */}

              <div className="form-group">

                <label htmlFor="paymentMethod">
                  Payment Method
                </label>

                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  disabled={loading}
                >

                  <option value="cash">
                    Cash on Delivery
                  </option>

                  <option value="card">
                    Card Payment
                  </option>

                </select>

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="checkout-btn"
                disabled={loading}
              >

                {loading
                  ? "Placing Order..."
                  : "Place Order"}

              </button>

            </form>

          </div>

          {/* ==================================================
              ORDER SUMMARY
          ================================================== */}

          <div className="checkout-summary">

            <h2>
              Order Summary
            </h2>

            <div className="summary-items">

              {cart.map(
                (item, index) => (
                  <div
                    className="summary-item"
                    key={
                      item.cartId ||
                      item._id ||
                      item.id ||
                      index
                    }
                  >

                    {/* IMAGE */}

                    <div className="summary-item-image">

                      <img
                        src={
                          item.image ||
                          item.images?.[0] ||
                          "/placeholder-product.png"
                        }
                        alt={
                          item.name ||
                          "Product"
                        }
                      />

                    </div>

                    {/* DETAILS */}

                    <div className="summary-item-info">

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        Quantity:{" "}
                        {item.quantity}
                      </p>

                      <strong>
                        {formatPrice(
                          Number(
                            item.price
                          ) *
                            Number(
                              item.quantity
                            )
                        )}
                      </strong>

                    </div>

                  </div>
                )
              )}

            </div>

            {/* TOTAL */}

            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                {formatPrice(
                  cartTotal
                )}
              </strong>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;