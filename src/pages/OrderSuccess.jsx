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

/* ==========================================================
   CONSTANTS
========================================================== */

const FALLBACK_IMAGE = "/placeholder-product.png";

/* ==========================================================
   FORMAT PRICE
========================================================== */

const formatPrice = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "$0.00";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/* ==========================================================
   FORMAT DATE
========================================================== */

const formatDate = (date) => {
  if (!date) {
    return "N/A";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

/* ==========================================================
   FORMAT TEXT
========================================================== */

const formatText = (value) => {
  if (!value) {
    return "N/A";
  }

  return String(value)
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

/* ==========================================================
   API ERROR
========================================================== */

const getErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  if (error?.message) {
    return error.message;
  }

  return "Failed to load order details.";
};

/* ==========================================================
   EXTRACT ORDER
========================================================== */

const extractOrder = (response) => {
  const payload = response?.data ?? response;

  if (!payload) {
    return null;
  }

  if (payload.order) {
    return payload.order;
  }

  if (
    payload._id ||
    payload.id ||
    payload.orderNumber
  ) {
    return payload;
  }

  return null;
};

/* ==========================================================
   GET ORDER ID
========================================================== */

const getOrderId = (order, fallbackId) => {
  return (
    order?.orderNumber ||
    order?.orderNo ||
    order?.orderCode ||
    order?._id ||
    order?.id ||
    fallbackId ||
    "N/A"
  );
};

/* ==========================================================
   GET ORDER TOTAL
========================================================== */

const getOrderTotal = (order) => {
  const possibleTotals = [
    order?.totalAmount,
    order?.total,
    order?.grandTotal,
    order?.amount,
  ];

  const validTotal = possibleTotals.find(
    (value) =>
      value !== undefined &&
      value !== null &&
      Number.isFinite(Number(value))
  );

  return Number(validTotal) || 0;
};

/* ==========================================================
   GET SHIPPING ADDRESS
========================================================== */

const getShippingAddress = (order) => {
  return (
    order?.shippingAddress ||
    order?.shippingDetails ||
    order?.deliveryAddress ||
    {}
  );
};

/* ==========================================================
   VALID IMAGE
========================================================== */

const isValidImage = (value) => {
  if (typeof value !== "string") {
    return false;
  }

  const image = value.trim();

  if (!image) {
    return false;
  }

  /*
    Never use the old external placeholder.
  */

  if (
    image.includes("via.placeholder.com") ||
    image.includes("placeholder.com")
  ) {
    return false;
  }

  return true;
};

/* ==========================================================
   GET ITEM IMAGE
========================================================== */

const getItemImage = (item) => {
  const product = item?.product;

  const candidates = [
    item?.image,
    item?.imageUrl,
    item?.productImage,
    item?.productImageUrl,
    item?.thumbnail,

    ...(Array.isArray(item?.images)
      ? item.images
      : []),

    product?.image,
    product?.imageUrl,
    product?.imageURL,
    product?.thumbnail,

    ...(Array.isArray(product?.images)
      ? product.images
      : []),
  ];

  const validImage = candidates.find(isValidImage);

  return validImage || FALLBACK_IMAGE;
};

/* ==========================================================
   GET ITEM NAME
========================================================== */

const getItemName = (item) => {
  return (
    item?.name ||
    item?.productName ||
    item?.title ||
    item?.product?.name ||
    item?.product?.title ||
    "Product"
  );
};

/* ==========================================================
   GET ITEM PRICE
========================================================== */

const getItemPrice = (item) => {
  const prices = [
    item?.price,
    item?.unitPrice,
    item?.salePrice,
    item?.product?.price,
  ];

  const validPrice = prices.find(
    (value) =>
      value !== undefined &&
      value !== null &&
      Number.isFinite(Number(value))
  );

  return Number(validPrice) || 0;
};

/* ==========================================================
   GET ITEM QUANTITY
========================================================== */

const getItemQuantity = (item) => {
  const quantity = Number(item?.quantity);

  if (!Number.isFinite(quantity) || quantity < 1) {
    return 1;
  }

  return quantity;
};

/* ==========================================================
   ORDER SUCCESS
========================================================== */

function OrderSuccess() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ========================================================
     FETCH ORDER
  ======================================================== */

  useEffect(() => {
    let mounted = true;

    const fetchOrder = async () => {
      try {
        if (!id) {
          throw new Error("Order ID is missing.");
        }

        setLoading(true);
        setError("");
        setOrder(null);

        console.log("🔎 Fetching order:", id);

        const response = await getOrderById(id);

        console.log(
          "📦 Order API response:",
          response
        );

        const payload = response?.data ?? response;

        console.log(
          "📋 Order API payload:",
          payload
        );

        if (payload?.success === false) {
          throw new Error(
            payload?.message ||
              "Order could not be found."
          );
        }

        const fetchedOrder =
          extractOrder(response);

        if (!fetchedOrder) {
          throw new Error(
            payload?.message ||
              "Order could not be found."
          );
        }

        console.log(
          "✅ Order loaded:",
          fetchedOrder
        );

        if (mounted) {
          setOrder(fetchedOrder);
        }
      } catch (err) {
        console.error(
          "❌ Get Order Error:",
          err
        );

        if (mounted) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchOrder();

    return () => {
      mounted = false;
    };
  }, [id]);

  /* ========================================================
     LOADING
  ======================================================== */

  if (loading) {
    return (
      <section className="order-success-page">
        <div className="order-success">
          <div className="order-loading">
            <FiLoader
              className="loading-spinner"
              aria-hidden="true"
            />

            <h2>Loading your order...</h2>

            <p>
              Please wait while we retrieve
              your order details.
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* ========================================================
     ERROR
  ======================================================== */

  if (error || !order) {
    return (
      <section className="order-success-page">
        <div className="order-success">
          <div className="order-error">
            <FiAlertCircle
              className="error-icon"
              aria-hidden="true"
            />

            <h1>Unable to Load Order</h1>

            <p>
              {error ||
                "We could not find this order."}
            </p>

            <div className="order-actions">
              <Link
                to="/my-orders"
                className="btn btn-secondary"
              >
                View My Orders
              </Link>

              <Link
                to="/products"
                className="continue-btn"
              >
                Continue Shopping

                <FiArrowRight
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ========================================================
     NORMALIZE ORDER
  ======================================================== */

  const status = String(
    order?.status || "pending"
  ).toLowerCase();

  const paymentStatus = String(
    order?.paymentStatus ||
      order?.payment?.status ||
      "pending"
  ).toLowerCase();

  const paymentMethod =
    order?.paymentMethod ||
    order?.payment?.method ||
    order?.paymentType ||
    "N/A";

  const items = Array.isArray(order?.items)
    ? order.items
    : [];

  const shippingAddress =
    getShippingAddress(order);

  const totalAmount =
    getOrderTotal(order);

  const orderNumber =
    getOrderId(order, id);

  /* ========================================================
     STATUS
  ======================================================== */

  const isCancelled =
    status === "cancelled" ||
    status === "canceled";

  const isDelivered =
    status === "delivered";

  const isShipped =
    status === "shipped";

  const isProcessing =
    status === "processing" ||
    status === "confirmed";

  const isPending =
    status === "pending";

  const isCompleted =
    status === "completed";

  const StatusIcon = isCancelled
    ? FiXCircle
    : FiCheckCircle;

  /* ========================================================
     STATUS TEXT
  ======================================================== */

  let statusTitle = "Order Confirmed";

  let statusMessage =
    "Your order has been placed successfully.";

  if (isCancelled) {
    statusTitle = "Order Cancelled";

    statusMessage =
      "This order has been cancelled.";
  } else if (isDelivered) {
    statusTitle = "Order Delivered";

    statusMessage =
      "Your order has been delivered successfully.";
  } else if (isShipped) {
    statusTitle = "Order Shipped";

    statusMessage =
      "Your order has been shipped and is on its way.";
  } else if (isProcessing) {
    statusTitle = "Order Processing";

    statusMessage =
      "Your order is currently being processed.";
  } else if (isPending) {
    statusTitle = "Order Pending";

    statusMessage =
      "Your order has been received and is awaiting processing.";
  } else if (isCompleted) {
    statusTitle = "Order Completed";

    statusMessage =
      "Your order has been completed successfully.";
  }

  /* ========================================================
     STATUS CLASS
  ======================================================== */

  const statusClass = isCancelled
    ? "cancelled"
    : isDelivered
    ? "delivered"
    : isShipped
    ? "shipped"
    : isProcessing
    ? "processing"
    : isPending
    ? "pending"
    : isCompleted
    ? "completed"
    : "success";

  /* ========================================================
     RENDER
  ======================================================== */

  return (
    <section className="order-success-page">
      <div className="order-success">

        {/* ==================================================
            SUCCESS HEADER
        ================================================== */}

        <section className="success-card">

          <div
            className={`order-status-icon ${statusClass}`}
            aria-hidden="true"
          >
            <StatusIcon />
          </div>

          <h1>{statusTitle}</h1>

          <p className="success-message">
            {statusMessage}
          </p>

          <div className="order-number">
            <span>Order Number</span>

            <strong>
              #{orderNumber}
            </strong>
          </div>

        </section>

        {/* ==================================================
            DETAILS GRID
        ================================================== */}

        <div className="order-details-grid">

          {/* ==================================================
              ORDER INFORMATION
          ================================================== */}

          <section className="details-card">

            <div className="details-card-header">
              <FiPackage />

              <h2>
                Order Information
              </h2>
            </div>

            <div className="details-list">

              <div className="detail-row">
                <span>Order Number</span>

                <strong>
                  #{orderNumber}
                </strong>
              </div>

              <div className="detail-row">
                <span>Order Date</span>

                <strong>
                  {formatDate(
                    order?.createdAt ||
                      order?.date ||
                      order?.orderDate
                  )}
                </strong>
              </div>

              <div className="detail-row">
                <span>Order Status</span>

                <span
                  className={`status ${status}`}
                >
                  {formatText(status)}
                </span>
              </div>

              <div className="detail-row">
                <span>Total Amount</span>

                <strong className="order-total">
                  {formatPrice(
                    totalAmount
                  )}
                </strong>
              </div>

            </div>
          </section>

          {/* ==================================================
              PAYMENT
          ================================================== */}

          <section className="details-card">

            <div className="details-card-header">
              <FiCreditCard />

              <h2>Payment</h2>
            </div>

            <div className="details-list">

              <div className="detail-row">
                <span>
                  Payment Method
                </span>

                <strong>
                  {formatText(
                    paymentMethod
                  )}
                </strong>
              </div>

              <div className="detail-row">
                <span>
                  Payment Status
                </span>

                <span
                  className={`status ${paymentStatus}`}
                >
                  {formatText(
                    paymentStatus
                  )}
                </span>
              </div>

            </div>
          </section>

          {/* ==================================================
              SHIPPING
          ================================================== */}

          <section className="details-card">

            <div className="details-card-header">
              <FiMapPin />

              <h2>
                Shipping Address
              </h2>
            </div>

            <div className="address-details">

              <strong>
                {shippingAddress?.fullName ||
                  shippingAddress?.name ||
                  "N/A"}
              </strong>

              {shippingAddress?.phone && (
                <p>
                  {shippingAddress.phone}
                </p>
              )}

              {shippingAddress?.address && (
                <p>
                  {shippingAddress.address}
                </p>
              )}

              {shippingAddress?.street && (
                <p>
                  {shippingAddress.street}
                </p>
              )}

              {(shippingAddress?.city ||
                shippingAddress?.state) && (
                <p>
                  {[
                    shippingAddress.city,
                    shippingAddress.state,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}

              {shippingAddress?.postalCode && (
                <p>
                  {shippingAddress.postalCode}
                </p>
              )}

              {shippingAddress?.country && (
                <p>
                  {shippingAddress.country}
                </p>
              )}

            </div>
          </section>

        </div>

        {/* ==================================================
            ORDER ITEMS
        ================================================== */}

        <section className="items-card">

          <div className="items-card-header">

            <div className="details-card-header">

              <FiShoppingBag />

              <h2>
                Order Items
              </h2>

            </div>

            <span>
              {items.length}{" "}
              {items.length === 1
                ? "item"
                : "items"}
            </span>

          </div>

          <div className="order-items">

            {items.length === 0 ? (
              <div className="empty-order-items">

                <FiShoppingBag />

                <p>
                  No items found for this order.
                </p>

              </div>
            ) : (
              items.map((item, index) => {

                const quantity =
                  getItemQuantity(item);

                const price =
                  getItemPrice(item);

                const itemTotal =
                  price * quantity;

                const image =
                  getItemImage(item);

                const productName =
                  getItemName(item);

                const productId =
                  item?._id ||
                  item?.product?._id ||
                  item?.product?.id ||
                  `order-item-${index}`;

                return (
                  <div
                    className="order-item"
                    key={`${productId}-${index}`}
                  >

                    {/* IMAGE */}

                    <div className="item-image">

                      <img
                        src={image}
                        alt={productName}
                        loading="eager"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={(event) => {
                          if (
                            event.currentTarget.src.includes(
                              FALLBACK_IMAGE
                            )
                          ) {
                            return;
                          }

                          event.currentTarget.src =
                            FALLBACK_IMAGE;
                        }}
                      />

                    </div>

                    {/* INFORMATION */}

                    <div className="item-info">

                      <h3>
                        {productName}
                      </h3>

                      <p>
                        Quantity: {quantity}
                      </p>

                      <p>
                        Price:{" "}
                        {formatPrice(price)}
                      </p>

                    </div>

                    {/* TOTAL */}

                    <div className="item-total">

                      <strong>
                        {formatPrice(
                          itemTotal
                        )}
                      </strong>

                    </div>

                  </div>
                );
              })
            )}

          </div>

          {/* ==================================================
              TOTAL
          ================================================== */}

          <div className="order-summary-total">

            <span>Total</span>

            <strong>
              {formatPrice(
                totalAmount
              )}
            </strong>

          </div>

        </section>

        {/* ==================================================
            ACTIONS
        ================================================== */}

        <div className="order-actions">

          <Link
            to="/my-orders"
            className="btn btn-secondary"
          >
            <FiPackage />

            View My Orders
          </Link>

          <Link
            to="/products"
            className="continue-btn"
          >
            Continue Shopping

            <FiArrowRight />
          </Link>

        </div>

      </div>
    </section>
  );
}

export default OrderSuccess;