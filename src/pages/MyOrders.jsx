import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FiPackage,
  FiEye,
  FiXCircle,
  FiArrowRight,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";

import {
  getMyOrders,
  cancelOrder,
} from "../api/orderApi";

import "./MyOrders.css";

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

  return parsedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

/* ==========================================================
   FORMAT STATUS
========================================================== */

const formatStatus = (status) => {
  if (!status) {
    return "Unknown";
  }

  return String(status)
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
};

/* ==========================================================
   GET ERROR MESSAGE
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

  return "Something went wrong. Please try again.";
};

/* ==========================================================
   EXTRACT ORDERS
========================================================== */

const extractOrders = (response) => {
  const payload =
    response?.data ?? response;

  if (!payload) {
    return [];
  }

  if (Array.isArray(payload.orders)) {
    return payload.orders;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  return [];
};

/* ==========================================================
   GET ORDER ID
========================================================== */

const getOrderId = (order) => {
  return (
    order?._id ||
    order?.id ||
    null
  );
};

/* ==========================================================
   GET ORDER NUMBER
========================================================== */

const getOrderNumber = (order) => {
  return (
    order?.orderNumber ||
    order?.orderNo ||
    order?.orderCode ||
    getOrderId(order) ||
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

  const validTotal =
    possibleTotals.find((value) => {
      return (
        value !== undefined &&
        value !== null &&
        Number.isFinite(Number(value))
      );
    });

  return Number(validTotal) || 0;
};

/* ==========================================================
   GET ITEM COUNT
========================================================== */

const getItemCount = (order) => {
  if (!Array.isArray(order?.items)) {
    return 0;
  }

  return order.items.reduce(
    (total, item) => {
      const quantity =
        Number(item?.quantity);

      if (
        Number.isFinite(quantity) &&
        quantity > 0
      ) {
        return total + quantity;
      }

      return total + 1;
    },
    0
  );
};

/* ==========================================================
   CAN CANCEL ORDER
========================================================== */

const canCancelOrder = (order) => {
  const status = String(
    order?.status || ""
  ).toLowerCase();

  /*
    Backend currently allows cancellation
    only when the order is pending.
  */

  return status === "pending";
};

/* ==========================================================
   MY ORDERS
========================================================== */

function MyOrders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [cancellingId, setCancellingId] =
    useState(null);

  /* ========================================================
     LOAD ORDERS
  ======================================================== */

  useEffect(() => {
    let mounted = true;

    const fetchOrders = async () => {
      try {
        console.log(
          "📦 MY ORDERS - Loading orders..."
        );

        setLoading(true);
        setError("");

        const response =
          await getMyOrders();

        console.log(
          "📦 MY ORDERS - API response:",
          response
        );

        const payload =
          response?.data ?? response;

        console.log(
          "📋 MY ORDERS - API payload:",
          payload
        );

        if (
          payload?.success === false
        ) {
          throw new Error(
            payload?.message ||
              "Unable to load orders."
          );
        }

        const fetchedOrders =
          extractOrders(response);

        console.log(
          "📦 MY ORDERS - Orders:",
          fetchedOrders
        );

        console.log(
          "🛒 MY ORDERS - First Item:",
          fetchedOrders?.[0]?.items?.[0]
        );

        console.log(
          "🛒 MY ORDERS - All Items:",
          fetchedOrders?.[0]?.items
        );

        if (mounted) {
          setOrders(fetchedOrders);
        }
      } catch (err) {
        console.error(
          "❌ MY ORDERS - Error:",
          err
        );

        if (mounted) {
          setError(
            getErrorMessage(err)
          );

          setOrders([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      mounted = false;
    };
  }, []);

  /* ========================================================
     CANCEL ORDER
  ======================================================== */

  const handleCancelOrder = async (
    order
  ) => {
    const orderId =
      getOrderId(order);

    if (!orderId) {
      console.error(
        "❌ Cannot cancel order: ID missing."
      );

      window.alert(
        "Unable to cancel this order because the order ID is missing."
      );

      return;
    }

    /*
      Double-check status before
      sending the request.
    */

    if (!canCancelOrder(order)) {
      window.alert(
        "Only pending orders can be cancelled."
      );

      return;
    }

    const orderNumber =
      getOrderNumber(order);

    const confirmed =
      window.confirm(
        `Are you sure you want to cancel order #${orderNumber}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(orderId);

      console.log(
        "🚫 Cancelling order:",
        orderId
      );

      const response =
        await cancelOrder(orderId);

      console.log(
        "🚫 Cancel order response:",
        response
      );

      /*
        IMPORTANT:
        Do not update the UI until
        the backend confirms success.
      */

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Failed to cancel order."
        );
      }

      const cancelledOrder =
        response?.order;

      /*
        Update the order locally.
      */

      setOrders((currentOrders) =>
        currentOrders.map(
          (currentOrder) => {
            const currentId =
              getOrderId(
                currentOrder
              );

            if (
              currentId !== orderId
            ) {
              return currentOrder;
            }

            return {
              ...currentOrder,

              status:
                cancelledOrder?.status ||
                "cancelled",
            };
          }
        )
      );

      console.log(
        "✅ Order cancelled successfully:",
        orderId
      );
    } catch (err) {
      console.error(
        "❌ Cancel Order Error:",
        err
      );

      window.alert(
        getErrorMessage(err)
      );
    } finally {
      setCancellingId(null);
    }
  };

  /* ========================================================
     LOADING STATE
  ======================================================== */

  if (loading) {
    return (
      <section className="my-orders-page">
        <div className="orders-loading">
          <FiLoader
            className="loading-spinner"
            aria-hidden="true"
          />

          <h2>
            Loading your orders...
          </h2>

          <p>
            Please wait while we retrieve
            your order history.
          </p>
        </div>
      </section>
    );
  }

  /* ========================================================
     ERROR STATE
  ======================================================== */

  if (error) {
    return (
      <section className="my-orders-page">
        <div className="orders-error">
          <FiAlertCircle
            className="error-icon"
            aria-hidden="true"
          />

          <h1>
            Unable to Load Orders
          </h1>

          <p>
            {error}
          </p>

          <Link
            to="/products"
            className="continue-shopping-link"
          >
            Continue Shopping

            <FiArrowRight
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>
    );
  }

  /* ========================================================
     EMPTY STATE
  ======================================================== */

  if (orders.length === 0) {
    return (
      <section className="my-orders-page">
        <div className="my-orders-header">
          <div>
            <div className="page-title-icon">
              <FiPackage
                aria-hidden="true"
              />
            </div>

            <h1>
              My Orders
            </h1>

            <p>
              View and manage your recent
              orders.
            </p>
          </div>

          <Link
            to="/products"
            className="continue-shopping-link"
          >
            Continue Shopping

            <FiArrowRight
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="empty-orders">
          <FiPackage
            className="empty-orders-icon"
            aria-hidden="true"
          />

          <h2>
            No Orders Yet
          </h2>

          <p>
            You haven't placed any orders
            yet.
          </p>

          <Link
            to="/products"
            className="btn btn-primary"
          >
            Start Shopping

            <FiArrowRight
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>
    );
  }

  /* ========================================================
     NORMAL PAGE
  ======================================================== */

  return (
    <section className="my-orders-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="my-orders-header">
        <div>
          <div className="page-title-icon">
            <FiPackage
              aria-hidden="true"
            />
          </div>

          <h1>
            My Orders
          </h1>

          <p>
            View and manage your recent
            orders.
          </p>
        </div>

        <Link
          to="/products"
          className="continue-shopping-link"
        >
          Continue Shopping

          <FiArrowRight
            aria-hidden="true"
          />
        </Link>
      </div>

      {/* ==================================================
          ORDERS LIST
      ================================================== */}

      <div className="orders-list">

        {orders.map(
          (order, index) => {
            const orderId =
              getOrderId(order) ||
              `order-${index}`;

            const orderNumber =
              getOrderNumber(order);

            const status =
              String(
                order?.status ||
                  "pending"
              ).toLowerCase();

            const totalAmount =
              getOrderTotal(order);

            const itemCount =
              getItemCount(order);

            const isCancelling =
              cancellingId ===
              orderId;

            return (
              <article
                className={`order-card ${
                  status === "cancelled" ||
                  status === "canceled"
                    ? "cancelled"
                    : ""
                }`}
                key={orderId}
              >

                {/* ======================================
                    ORDER HEADER
                ====================================== */}

                <div className="order-header">

                  <div className="order-header-left">

                    <div className="order-icon">
                      <FiPackage
                        aria-hidden="true"
                      />
                    </div>

                    <div>
                      <span className="order-label">
                        Order Number
                      </span>

                      <h2>
                        #{orderNumber}
                      </h2>
                    </div>

                  </div>

                  <span
                    className={`status ${status}`}
                  >
                    {formatStatus(
                      status
                    )}
                  </span>

                </div>

                {/* ======================================
                    ORDER INFORMATION
                ====================================== */}

                <div className="order-info">

                  <div className="order-info-item">
                    <span>
                      Date
                    </span>

                    <strong>
                      {formatDate(
                        order?.createdAt ||
                          order?.date ||
                          order?.orderDate
                      )}
                    </strong>
                  </div>

                  <div className="order-info-item">
                    <span>
                      Items
                    </span>

                    <strong>
                      {itemCount}{" "}
                      {itemCount === 1
                        ? "item"
                        : "items"}
                    </strong>
                  </div>

                  <div className="order-info-item">
                    <span>
                      Total
                    </span>

                    <strong className="order-total">
                      {formatPrice(
                        totalAmount
                      )}
                    </strong>
                  </div>

                </div>

                {/* ======================================
                    ACTIONS
                ====================================== */}

                <div className="order-actions">

                  <Link
                    to={`/order-success/${orderId}`}
                    className="btn btn-secondary"
                  >
                    <FiEye
                      aria-hidden="true"
                    />

                    View Details
                  </Link>

                  {canCancelOrder(
                    order
                  ) && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      disabled={
                        isCancelling
                      }
                      onClick={() =>
                        handleCancelOrder(
                          order
                        )
                      }
                    >

                      {isCancelling ? (
                        <>
                          <FiLoader
                            className="button-spinner"
                            aria-hidden="true"
                          />

                          Cancelling...
                        </>
                      ) : (
                        <>
                          <FiXCircle
                            aria-hidden="true"
                          />

                          Cancel Order
                        </>
                      )}

                    </button>
                  )}

                </div>

              </article>
            );
          }
        )}

      </div>

    </section>
  );
}

export default MyOrders;