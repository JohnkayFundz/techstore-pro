import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FiPackage,
  FiEye,
  FiXCircle,
  FiShoppingBag,
  FiArrowRight,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";

import {
  getMyOrders,
  cancelOrder,
} from "../api/orderApi";

import { formatPrice } from "../utils/formatPrice";

import "./MyOrders.css";


/* ==========================================================
   HELPERS
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


const getOrderNumber = (order) => {
  return (
    order?.orderNumber ||
    order?.orderNo ||
    order?.number ||
    order?.orderCode ||
    `TS-${String(order?._id || "")
      .slice(-8)
      .toUpperCase()}`
  );
};


const getOrderTotal = (order) => {
  const possibleTotals = [
    order?.totalAmount,
    order?.totalPrice,
    order?.grandTotal,
    order?.total,
    order?.amount,
  ];

  const total = possibleTotals.find(
    (value) =>
      value !== undefined &&
      value !== null &&
      Number.isFinite(Number(value))
  );

  return Number(total) || 0;
};


const getOrderStatus = (order) => {
  return String(
    order?.status || "pending"
  ).toLowerCase();
};


const getItemCount = (order) => {
  if (!Array.isArray(order?.items)) {
    return 0;
  }

  return order.items.reduce(
    (total, item) => {
      const quantity =
        Number(item?.quantity);

      return (
        total +
        (Number.isFinite(quantity)
          ? quantity
          : 1)
      );
    },
    0
  );
};


const formatOrderDate = (date) => {
  if (!date) {
    return "N/A";
  }

  const parsedDate = new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
};


/* ==========================================================
   MY ORDERS
========================================================== */

function MyOrders() {
  const [orders, setOrders] =
    useState([]);

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

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        console.log(
          "📦 MY ORDERS - Loading orders..."
        );

        const response =
          await getMyOrders();

        console.log(
          "📦 MY ORDERS - API response:",
          response
        );

        if (!mounted) {
          return;
        }

        const payload =
          response?.data ?? response;

        if (
          payload?.success === false
        ) {
          throw new Error(
            payload?.message ||
              "Failed to load orders."
          );
        }

        const orderList =
          Array.isArray(
            payload?.orders
          )
            ? payload.orders
            : [];

        console.log(
          "📦 MY ORDERS - Orders:",
          orderList
        );

        setOrders(orderList);

      } catch (err) {
        console.error(
          "❌ MY ORDERS - Load error:",
          err
        );

        if (!mounted) {
          return;
        }

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load your orders."
        );

      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      mounted = false;
    };
  }, []);


  /* ========================================================
     CANCEL ORDER
  ======================================================== */

  const handleCancelOrder =
    async (orderId) => {
      if (!orderId) {
        return;
      }

      const confirmed =
        window.confirm(
          "Are you sure you want to cancel this order?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setCancellingId(orderId);
        setError("");

        console.log(
          "🚫 MY ORDERS - Cancelling order:",
          orderId
        );

        const response =
          await cancelOrder(orderId);

        console.log(
          "🚫 MY ORDERS - Cancel response:",
          response
        );

        const payload =
          response?.data ?? response;

        if (!payload?.success) {
          throw new Error(
            payload?.message ||
              "Failed to cancel order."
          );
        }

        setOrders(
          (currentOrders) =>
            currentOrders.map(
              (order) =>
                String(order?._id) ===
                String(orderId)
                  ? {
                      ...order,
                      status:
                        "cancelled",
                    }
                  : order
            )
        );

      } catch (err) {
        console.error(
          "❌ MY ORDERS - Cancel error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to cancel order."
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
      <section className="container my-orders-page">

        <div className="orders-loading">

          <FiLoader
            className="loading-spinner"
            aria-hidden="true"
          />

          <h2>
            Loading Orders...
          </h2>

          <p>
            Please wait while we retrieve
            your orders.
          </p>

        </div>

      </section>
    );
  }


  /* ========================================================
     PAGE
  ======================================================== */

  return (
    <section className="container my-orders-page">


      {/* ====================================================
          PAGE HEADER
      ==================================================== */}

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
            View and manage your recent orders.
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


      {/* ====================================================
          ERROR MESSAGE
      ==================================================== */}

      {error && (
        <div
          className="error-message"
          role="alert"
        >

          <FiAlertCircle
            aria-hidden="true"
          />

          <span>
            {error}
          </span>

        </div>
      )}


      {/* ====================================================
          EMPTY ORDERS
      ==================================================== */}

      {orders.length === 0 ? (

        <div className="empty-orders">

          <div className="empty-orders-icon">
            <FiShoppingBag
              aria-hidden="true"
            />
          </div>

          <h2>
            No Orders Yet
          </h2>

          <p>
            You haven't placed any orders yet.
            Start shopping and your orders will
            appear here.
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

      ) : (

        <div className="orders-list">

          {orders.map((order) => {

            const orderId =
              order?._id;

            const status =
              getOrderStatus(order);

            const orderNumber =
              getOrderNumber(order);

            const itemCount =
              getItemCount(order);

            const total =
              getOrderTotal(order);

            const orderDate =
              order?.createdAt ||
              order?.orderDate ||
              order?.date;

            const isCancelled =
              status === "cancelled" ||
              status === "canceled";

            const canCancel =
              status === "pending";

            const isCancelling =
              cancellingId === orderId;


            return (
              <article
                key={
                  orderId ||
                  orderNumber
                }
                className={`order-card ${
                  isCancelled
                    ? "cancelled"
                    : ""
                }`}
              >


                {/* ========================================
                    ORDER HEADER
                ======================================== */}

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
                    {formatStatus(status)}
                  </span>

                </div>


                {/* ========================================
                    ORDER INFORMATION
                ======================================== */}

                <div className="order-info">

                  <div className="order-info-item">

                    <span>
                      Date
                    </span>

                    <strong>
                      {formatOrderDate(
                        orderDate
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
                      {formatPrice(total)}
                    </strong>

                  </div>

                </div>


                {/* ========================================
                    ACTIONS
                ======================================== */}

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


                  {canCancel && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() =>
                        handleCancelOrder(
                          orderId
                        )
                      }
                      disabled={
                        isCancelling
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
          })}

        </div>

      )}

    </section>
  );
}


export default MyOrders;