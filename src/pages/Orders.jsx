import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { getMyOrders } from "../api/orderApi";
import { currency } from "../data/products";

import "./Orders.css";


function Orders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("Newest");


  /*
  ==========================================================
  FETCH ORDERS
  ==========================================================
  */

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getMyOrders();

        if (result?.success) {
          setOrders(
            Array.isArray(result.orders)
              ? result.orders
              : []
          );
        } else {
          setError(
            result?.message ||
              "Failed to load orders."
          );
        }
      } catch (err) {
        console.error("Orders Error:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to fetch orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);


  /*
  ==========================================================
  HELPER FUNCTIONS
  ==========================================================
  */

  const getOrderTotal = (order) => {
    const total =
      order?.totalPrice ??
      order?.totalAmount ??
      order?.total ??
      0;

    const numericTotal = Number(total);

    return Number.isFinite(numericTotal)
      ? numericTotal
      : 0;
  };


  const getOrderItems = (order) => {
    if (Array.isArray(order?.orderItems)) {
      return order.orderItems;
    }

    if (Array.isArray(order?.items)) {
      return order.items;
    }

    return [];
  };


  const getOrderStatus = (order) => {
    return String(
      order?.status || "pending"
    ).toLowerCase();
  };


  /*
  ==========================================================
  FILTER + SEARCH + SORT
  ==========================================================
  */

  const filteredOrders = useMemo(() => {
    let result = [...orders];


    /*
    SEARCH
    */

    if (search.trim()) {
      const searchValue =
        search.trim().toLowerCase();

      result = result.filter((order) => {
        const orderId =
          String(order?._id || "")
            .toLowerCase();

        const orderNumber =
          String(order?.orderNumber || "")
            .toLowerCase();

        return (
          orderId.includes(searchValue) ||
          orderNumber.includes(searchValue)
        );
      });
    }


    /*
    STATUS FILTER
    */

    if (status !== "All") {
      result = result.filter(
        (order) =>
          getOrderStatus(order) ===
          status.toLowerCase()
      );
    }


    /*
    SORT BY DATE
    */

    result.sort((a, b) => {
      const first =
        new Date(a?.createdAt || 0).getTime();

      const second =
        new Date(b?.createdAt || 0).getTime();

      return sort === "Newest"
        ? second - first
        : first - second;
    });


    return result;
  }, [
    orders,
    search,
    status,
    sort,
  ]);


  /*
  ==========================================================
  STATISTICS
  ==========================================================
  */

  const stats = useMemo(() => {
    return {
      total: orders.length,

      pending: orders.filter(
        (order) =>
          getOrderStatus(order) === "pending"
      ).length,

      processing: orders.filter(
        (order) =>
          getOrderStatus(order) === "processing"
      ).length,

      shipped: orders.filter(
        (order) =>
          getOrderStatus(order) === "shipped"
      ).length,

      delivered: orders.filter(
        (order) =>
          getOrderStatus(order) === "delivered"
      ).length,

      cancelled: orders.filter(
        (order) =>
          getOrderStatus(order) === "cancelled"
      ).length,
    };
  }, [orders]);


  /*
  ==========================================================
  LOADING STATE
  ==========================================================
  */

  if (loading) {
    return (
      <section className="container">
        <div className="loading-state">
          <h2>Loading orders...</h2>
          <p>
            Please wait while we retrieve your
            orders.
          </p>
        </div>
      </section>
    );
  }


  /*
  ==========================================================
  PAGE
  ==========================================================
  */

  return (
    <section className="orders-page">
      <div className="container">

        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <div className="page-header">
          <h1>
            📦 My Orders
          </h1>

          <p>
            Track and manage your purchases.
          </p>
        </div>


        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* ==================================================
            ORDER STATISTICS
        ================================================== */}

        <div className="orders-stats">

          <div className="orders-stat">
            <h2>{stats.total}</h2>
            <p>Total</p>
          </div>


          <div className="orders-stat">
            <h2>{stats.pending}</h2>
            <p>Pending</p>
          </div>


          <div className="orders-stat">
            <h2>{stats.processing}</h2>
            <p>Processing</p>
          </div>


          <div className="orders-stat">
            <h2>{stats.shipped}</h2>
            <p>Shipped</p>
          </div>


          <div className="orders-stat">
            <h2>{stats.delivered}</h2>
            <p>Delivered</p>
          </div>


          <div className="orders-stat">
            <h2>{stats.cancelled}</h2>
            <p>Cancelled</p>
          </div>

        </div>


        {/* ==================================================
            TOOLBAR
        ================================================== */}

        <div className="orders-toolbar">

          {/* SEARCH */}

          <input
            type="search"
            placeholder="Search Order ID..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            aria-label="Search orders"
          />


          {/* STATUS */}

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            aria-label="Filter orders by status"
          >
            <option value="All">
              All
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="processing">
              Processing
            </option>

            <option value="shipped">
              Shipped
            </option>

            <option value="delivered">
              Delivered
            </option>

            <option value="cancelled">
              Cancelled
            </option>
          </select>


          {/* SORT */}

          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
            aria-label="Sort orders"
          >
            <option value="Newest">
              Newest
            </option>

            <option value="Oldest">
              Oldest
            </option>
          </select>

        </div>


        {/* ==================================================
            ORDERS LIST
        ================================================== */}

        <div className="orders-list">

          {filteredOrders.length === 0 ? (

            /* ==================================================
               EMPTY STATE
            ================================================== */

            <div className="empty-orders">

              <h2>
                No Orders Found
              </h2>

              <p>
                {orders.length === 0
                  ? "You have not placed any orders yet."
                  : "No orders match your current search or filter."}
              </p>

              <Link
                to="/products"
                className="btn btn-primary"
              >
                Shop Now
              </Link>

            </div>

          ) : (

            /* ==================================================
               ORDER CARDS
            ================================================== */

            filteredOrders.map((order) => {
              const orderTotal =
                getOrderTotal(order);

              const orderItems =
                getOrderItems(order);

              const orderStatus =
                getOrderStatus(order);

              const orderId =
                String(order?._id || "");

              const displayOrderNumber =
                order?.orderNumber ||
                orderId.slice(-8);


              return (
                <div
                  key={orderId}
                  className="order-card"
                >

                  {/* ==========================================
                      ORDER TOP
                  ========================================== */}

                  <div className="order-top">

                    <div>

                      <h3>
                        Order #
                        {displayOrderNumber}
                      </h3>


                      <p>
                        {order?.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : "Date unavailable"}
                      </p>

                    </div>


                    <span
                      className={`status ${orderStatus}`}
                    >
                      {orderStatus
                        .charAt(0)
                        .toUpperCase() +
                        orderStatus.slice(1)}
                    </span>

                  </div>


                  {/* ==========================================
                      ORDER MIDDLE
                  ========================================== */}

                  <div className="order-middle">

                    {/* TOTAL */}

                    <div>
                      <strong>
                        Total
                      </strong>

                      <p>
                        {currency}
                        {orderTotal.toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </p>
                    </div>


                    {/* PAYMENT */}

                    <div>
                      <strong>
                        Payment
                      </strong>

                      <p>
                        {order?.paymentMethod ||
                          "Not specified"}
                      </p>
                    </div>


                    {/* ITEMS */}

                    <div>
                      <strong>
                        Items
                      </strong>

                      <p>
                        {orderItems.length}{" "}
                        {orderItems.length === 1
                          ? "product"
                          : "products"}
                      </p>
                    </div>

                  </div>


                  {/* ==========================================
                      ORDER BOTTOM
                  ========================================== */}

                  <div className="order-bottom">

                    <Link
                      to={`/orders/${orderId}`}
                      className="btn btn-primary"
                    >
                      View Details
                    </Link>

                  </div>

                </div>
              );
            })
          )}

        </div>

      </div>
    </section>
  );
}


export default Orders;