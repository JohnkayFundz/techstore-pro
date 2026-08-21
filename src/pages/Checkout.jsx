import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createOrder } from "../api/orderApi";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";

import "./Checkout.css";

/* ==========================================================
   CONSTANTS
========================================================== */

const FALLBACK_IMAGE = "/placeholder-product.png";

/* ==========================================================
   IMAGE HELPERS
========================================================== */

/**
 * Check whether an image URL is usable.
 */
const isValidImage = (value) => {
  if (
    typeof value !== "string" ||
    value.trim() === ""
  ) {
    return false;
  }

  const cleanValue = value.trim();

  // Reject the old external placeholder.
  if (
    cleanValue.includes(
      "via.placeholder.com"
    )
  ) {
    return false;
  }

  return true;
};

/**
 * Safely get a product image from a cart item.
 */
const getItemImage = (item) => {
  if (!item) {
    return FALLBACK_IMAGE;
  }

  const candidates = [
    item.image,
    item.productImage,
    item.thumbnail,

    ...(Array.isArray(item.images)
      ? item.images
      : []),

    item.product?.image,
    item.product?.imageUrl,

    ...(Array.isArray(item.product?.images)
      ? item.product.images
      : []),
  ];

  const validImage = candidates.find(
    (candidate) => {
      if (typeof candidate === "string") {
        return isValidImage(candidate);
      }

      if (
        candidate &&
        typeof candidate.url === "string"
      ) {
        return isValidImage(candidate.url);
      }

      return false;
    }
  );

  if (typeof validImage === "string") {
    return validImage;
  }

  if (
    validImage &&
    typeof validImage.url === "string"
  ) {
    return validImage.url;
  }

  return FALLBACK_IMAGE;
};

/* ==========================================================
   CHECKOUT COMPONENT
========================================================== */

function Checkout() {
  const navigate = useNavigate();

  const {
    cart,
    cartTotal,
    clearCart,
  } = useCart();

  /* ========================================================
     FORM STATE
  ======================================================== */

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
    paymentMethod: "cash",
  });

  /* ========================================================
     UI STATE
  ======================================================== */

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ========================================================
     HANDLE INPUT
  ======================================================== */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Clear previous error while the user edits.
    if (error) {
      setError("");
    }
  };

  /* ========================================================
     HANDLE IMAGE ERROR
  ======================================================== */

  const handleImageError = (event) => {
    const imageElement =
      event.currentTarget;

    const fallbackAlreadyUsed =
      imageElement.src.endsWith(
        FALLBACK_IMAGE
      );

    if (!fallbackAlreadyUsed) {
      imageElement.src =
        FALLBACK_IMAGE;
    }
  };

  /* ========================================================
     SUBMIT ORDER
  ======================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    /* ------------------------------------------------------
       PREVENT DUPLICATE SUBMISSION
    ------------------------------------------------------ */

    if (loading) {
      return;
    }

    /* ------------------------------------------------------
       CHECK CART
    ------------------------------------------------------ */

    if (
      !Array.isArray(cart) ||
      cart.length === 0
    ) {
      setError(
        "Your cart is empty."
      );

      return;
    }

    /* ------------------------------------------------------
       VALIDATE DELIVERY INFORMATION
    ------------------------------------------------------ */

    const requiredFields = [
      formData.fullName,
      formData.phone,
      formData.address,
      formData.city,
      formData.state,
      formData.country,
    ];

    const hasEmptyField =
      requiredFields.some(
        (value) =>
          !String(value || "").trim()
      );

    if (hasEmptyField) {
      setError(
        "Please fill in all delivery information."
      );

      return;
    }

    /* ------------------------------------------------------
       PREPARE ORDER ITEMS

       Backend expects:

       {
         product: productId,
         quantity: number
       }
    ------------------------------------------------------ */

    const items = cart.map(
      (item) => ({
        product:
          item?._id ||
          item?.id ||
          item?.product?._id ||
          item?.product?.id,

        quantity:
          Number(item?.quantity) || 1,
      })
    );

    /* ------------------------------------------------------
       CHECK PRODUCT IDS
    ------------------------------------------------------ */

    const invalidItem =
      items.find(
        (item) => !item.product
      );

    if (invalidItem) {
      setError(
        "One or more products in your cart are missing a product ID. Please remove the affected product and add it again."
      );

      return;
    }

    /* ------------------------------------------------------
       PREPARE ORDER DATA
    ------------------------------------------------------ */

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
      "🛒 ORDER DATA:",
      orderData
    );

    /* ------------------------------------------------------
       CREATE ORDER
    ------------------------------------------------------ */

    try {
      setLoading(true);

      const response =
        await createOrder(
          orderData
        );

      console.log(
        "📦 CREATE ORDER RESPONSE:",
        response?.data
      );

      /* ----------------------------------------------------
         GET API PAYLOAD
      ---------------------------------------------------- */

      const payload =
        response?.data ?? response;

      /* ----------------------------------------------------
         VERIFY RESPONSE
      ---------------------------------------------------- */

      if (
        !payload ||
        payload.success === false
      ) {
        throw new Error(
          payload?.message ||
            "Order was not created successfully."
        );
      }

      /* ----------------------------------------------------
         EXTRACT CREATED ORDER
      ---------------------------------------------------- */

      const createdOrder =
        payload?.order ||
        payload?.data?.order ||
        payload?.data;

      if (!createdOrder) {
        throw new Error(
          "Order was created, but the server did not return the order details."
        );
      }

      console.log(
        "✅ CREATED ORDER:",
        createdOrder
      );

      /* ----------------------------------------------------
         VERIFY ORDER ID
      ---------------------------------------------------- */

      const orderId =
        createdOrder?._id ||
        createdOrder?.id;

      if (!orderId) {
        throw new Error(
          "Order was created, but no order ID was returned."
        );
      }

      console.log(
        "🆔 ORDER ID:",
        orderId
      );

      /* ----------------------------------------------------
         CLEAR CART
      ---------------------------------------------------- */

      clearCart();

      /* ----------------------------------------------------
         NAVIGATE TO ORDER SUCCESS
      ---------------------------------------------------- */

      navigate(
        `/order-success/${orderId}`
      );
    } catch (error) {
      console.error(
        "❌ CREATE ORDER ERROR:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unable to place your order. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /* ========================================================
     EMPTY CART
  ======================================================== */

  if (
    !Array.isArray(cart) ||
    cart.length === 0
  ) {
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
                navigate(
                  "/products"
                )
              }
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ========================================================
     RENDER
  ======================================================== */

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="checkout-header">
          <h1>
            Checkout
          </h1>

          <p>
            Complete your delivery
            information to place
            your order.
          </p>
        </div>

        {/* ==================================================
            ERROR MESSAGE
        ================================================== */}

        {error && (
          <div
            className="checkout-error"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* ==================================================
            CONTENT
        ================================================== */}

        <div className="checkout-content">

          {/* ================================================
              DELIVERY FORM
          ================================================ */}

          <div className="checkout-form-card">

            <h2>
              Delivery Information
            </h2>

            <form
              onSubmit={
                handleSubmit
              }
              noValidate
            >

              {/* ============================================
                  FULL NAME
              ============================================ */}

              <div className="form-group">
                <label
                  htmlFor="fullName"
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={
                    formData.fullName
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter your full name"
                  autoComplete="name"
                  disabled={loading}
                  required
                />
              </div>

              {/* ============================================
                  PHONE
              ============================================ */}

              <div className="form-group">
                <label
                  htmlFor="phone"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={
                    formData.phone
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                  disabled={loading}
                  required
                />
              </div>

              {/* ============================================
                  ADDRESS
              ============================================ */}

              <div className="form-group">
                <label
                  htmlFor="address"
                >
                  Delivery Address
                </label>

                <textarea
                  id="address"
                  name="address"
                  value={
                    formData.address
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter your delivery address"
                  autoComplete="street-address"
                  rows="4"
                  disabled={loading}
                  required
                />
              </div>

              {/* ============================================
                  CITY + STATE
              ============================================ */}

              <div className="form-row">

                <div className="form-group">
                  <label
                    htmlFor="city"
                  >
                    City
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={
                      formData.city
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="City"
                    autoComplete="address-level2"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label
                    htmlFor="state"
                  >
                    State
                  </label>

                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={
                      formData.state
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="State"
                    autoComplete="address-level1"
                    disabled={loading}
                    required
                  />
                </div>

              </div>

              {/* ============================================
                  COUNTRY
              ============================================ */}

              <div className="form-group">
                <label
                  htmlFor="country"
                >
                  Country
                </label>

                <input
                  id="country"
                  name="country"
                  type="text"
                  value={
                    formData.country
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Country"
                  autoComplete="country-name"
                  disabled={loading}
                  required
                />
              </div>

              {/* ============================================
                  PAYMENT METHOD
              ============================================ */}

              <div className="form-group">
                <label
                  htmlFor="paymentMethod"
                >
                  Payment Method
                </label>

                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={
                    formData.paymentMethod
                  }
                  onChange={
                    handleChange
                  }
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

              {/* ============================================
                  SUBMIT
              ============================================ */}

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

          {/* ================================================
              ORDER SUMMARY
          ================================================ */}

          <div className="checkout-summary">

            <h2>
              Order Summary
            </h2>

            <div className="summary-items">

              {cart.map(
                (item, index) => {
                  const image =
                    getItemImage(
                      item
                    );

                  const productName =
                    item?.name ||
                    item?.product?.name ||
                    "Product";

                  const quantity =
                    Number(
                      item?.quantity
                    ) || 1;

                  const price =
                    Number(
                      item?.price ??
                      item?.product
                        ?.price ??
                      0
                    ) || 0;

                  const itemTotal =
                    price *
                    quantity;

                  const itemKey =
                    item?.cartId ||
                    item?._id ||
                    item?.id ||
                    item?.product?._id ||
                    `checkout-item-${index}`;

                  return (
                    <div
                      className="summary-item"
                      key={itemKey}
                    >

                      {/* ==================================
                          IMAGE
                      ================================== */}

                      <div className="summary-item-image">

                        <img
                          src={
                            image ||
                            FALLBACK_IMAGE
                          }
                          alt={
                            productName
                          }
                          loading="eager"
                          decoding="async"
                          onError={
                            handleImageError
                          }
                        />

                      </div>

                      {/* ==================================
                          DETAILS
                      ================================== */}

                      <div className="summary-item-info">

                        <h3>
                          {productName}
                        </h3>

                        <p>
                          Quantity:{" "}
                          {quantity}
                        </p>

                        <strong>
                          {formatPrice(
                            itemTotal
                          )}
                        </strong>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

            {/* ==============================================
                TOTAL
            ============================================== */}

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