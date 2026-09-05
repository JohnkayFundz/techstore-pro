// ==========================================================
// TECHSTORE PRO
// ADMIN ORDERS
// ==========================================================

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAdminOrders,
  updateOrderStatus,
  deleteAdminOrder,
} from "../../api/adminApi";

import {
  formatPrice,
} from "../../utils/formatPrice";

import "./AdminOrders.css";

// ==========================================================
// COMPONENT
// ==========================================================

function AdminOrders() {
  // ========================================================
  // STATE
  // ========================================================

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [deleting, setDeleting] =
    useState(null);

  const [updating, setUpdating] =
    useState(null);

  // ========================================================
  // LOAD ORDERS
  // ========================================================

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAdminOrders();

      // Backend response:
      //
      // {
      //   success: true,
      //   orders: [...],
      //   count: orders.length
      // }

      if (
        !response ||
        response.success === false
      ) {
        setOrders([]);

        setError(
          response?.message ||
            "Failed to load orders."
        );

        return;
      }

      // IMPORTANT:
      // The backend returns the orders array
      // under "orders", not "data".
      const orderList =
        response?.orders;

      setOrders(
        Array.isArray(orderList)
          ? orderList
          : []
      );
    } catch (error) {
      console.error(
        "Load Orders Error:",
        error
      );

      setOrders([]);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================================
  // LOAD ON MOUNT
  // ========================================================

  useEffect(() => {
    loadOrders();
  }, []);

  // ========================================================
  // FORMAT STATUS
  // ========================================================

  const formatStatus = (status) => {
    if (!status) {
      return "Pending";
    }

    const normalized =
      String(status)
        .trim()
        .toLowerCase();

    return (
      normalized
        .charAt(0)
        .toUpperCase() +
      normalized.slice(1)
    );
  };

  // ========================================================
  // GET ORDER TOTAL
  // ========================================================

  const getOrderTotal = (order) => {
    const possibleTotal =
      order?.totalAmount ??
      order?.totalPrice ??
      order?.total ??
      order?.amount ??
      0;

    const numericTotal =
      Number(possibleTotal);

    return Number.isFinite(
      numericTotal
    )
      ? numericTotal
      : 0;
  };

  // ========================================================
  // GET ORDER ITEMS
  // ========================================================

  const getOrderItems = (order) => {
    if (
      Array.isArray(order?.items)
    ) {
      return order.items;
    }

    if (
      Array.isArray(
        order?.orderItems
      )
    ) {
      return order.orderItems;
    }

    return [];
  };

  // ========================================================
  // GET PRODUCT IMAGE
  // ========================================================

  const getProductImage = (item) => {
    return (
      item?.image ||
      item?.product?.image ||
      "/images/product-placeholder.png"
    );
  };

  // ========================================================
  // GET PRODUCT NAME
  // ========================================================

  const getProductName = (item) => {
    return (
      item?.name ||
      item?.product?.name ||
      "Product"
    );
  };

  // ========================================================
  // GET ORDER NUMBER
  // ========================================================

  const getOrderNumber = (order) => {
    if (order?.orderNumber) {
      return order.orderNumber;
    }

    if (order?._id) {
      return String(
        order._id
      ).slice(-8);
    }

    return "Unknown";
  };

  // ========================================================
  // GET PAYMENT STATUS
  // ========================================================

  const getPaymentStatus = (order) => {
    const paymentStatus =
      String(
        order?.paymentStatus ||
          "pending"
      )
        .trim()
        .toLowerCase();

    return (
      paymentStatus
        .charAt(0)
        .toUpperCase() +
      paymentStatus.slice(1)
    );
  };

  // ========================================================
  // UPDATE ORDER STATUS
  // ========================================================

  const handleStatusChange = async (
    orderId,
    status
  ) => {
    if (!orderId) {
      return;
    }

    try {
      setUpdating(orderId);

      const newStatus =
        String(status)
          .toLowerCase()
          .trim();

      const response =
        await updateOrderStatus(
          orderId,
          newStatus
        );

      if (
        !response ||
        response.success === false
      ) {
        throw new Error(
          response?.message ||
            "Failed to update order status."
        );
      }

      setOrders((previous) =>
        previous.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );
    } catch (error) {
      console.error(
        "Update Order Status Error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update status."
      );
    } finally {
      setUpdating(null);
    }
  };

  // ========================================================
  // DELETE ORDER
  // ========================================================

  const handleDelete = async (
    orderId
  ) => {
    if (!orderId) {
      return;
    }

    const confirmDelete =
      window.confirm(
        "Are you sure you want to permanently delete this order?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeleting(orderId);

      const response =
        await deleteAdminOrder(
          orderId
        );

      if (
        !response ||
        response.success === false
      ) {
        throw new Error(
          response?.message ||
            "Failed to delete order."
        );
      }

      setOrders((previous) =>
        previous.filter(
          (order) =>
            order._id !== orderId
        )
      );
    } catch (error) {
      console.error(
        "Delete Order Error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete order."
      );
    } finally {
      setDeleting(null);
    }
  };

  // ========================================================
  // FILTER ORDERS
  // ========================================================

  const filteredOrders = useMemo(() => {
    const keyword =
      search
        .trim()
        .toLowerCase();

    return orders.filter(
      (order) => {
        const customer =
          order?.user?.name
            ?.toLowerCase() || "";

        const email =
          order?.user?.email
            ?.toLowerCase() || "";

        const orderId =
          order?._id
            ?.toLowerCase() || "";

        const orderNumber =
          order?.orderNumber
            ?.toLowerCase() || "";

        const matchesSearch =
          !keyword ||
          customer.includes(
            keyword
          ) ||
          email.includes(
            keyword
          ) ||
          orderId.includes(
            keyword
          ) ||
          orderNumber.includes(
            keyword
          );

        const formattedStatus =
          formatStatus(
            order?.status
          );

        const matchesStatus =
          statusFilter ===
            "All" ||
          formattedStatus ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    orders,
    search,
    statusFilter,
  ]);

  // ========================================================
  // SUMMARY
  // ========================================================

  const totalOrders =
    orders.length;

  const pendingOrders =
    orders.filter(
      (order) =>
        String(
          order?.status
        ).toLowerCase() ===
        "pending"
    ).length;

  const processingOrders =
    orders.filter(
      (order) =>
        String(
          order?.status
        ).toLowerCase() ===
        "processing"
    ).length;

  const shippedOrders =
    orders.filter(
      (order) =>
        String(
          order?.status
        ).toLowerCase() ===
        "shipped"
    ).length;

  const deliveredOrders =
    orders.filter(
      (order) =>
        String(
          order?.status
        ).toLowerCase() ===
        "delivered"
    ).length;

  const cancelledOrders =
    orders.filter(
      (order) =>
        String(
          order?.status
        ).toLowerCase() ===
        "cancelled"
    ).length;

  // ========================================================
  // LOADING
  // ========================================================

  if (loading) {
    return (
      <section className="admin-orders-page">
        <div className="admin-loading">
          Loading orders...
        </div>
      </section>
    );
  }

  // ========================================================
  // ERROR
  // ========================================================

  if (error) {
    return (
      <section className="admin-orders-page">
        <div className="error-message">

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={loadOrders}
          >
            Try Again
          </button>

        </div>
      </section>
    );
  }

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <section className="admin-orders-page">

      {/* ====================================================
          PAGE HEADER
      ==================================================== */}

      <div className="page-header">

        <div>
          <h1>
            Orders Management
          </h1>

          <p>
            Manage customer orders
            and delivery status.
          </p>
        </div>

        <button
          type="button"
          className="refresh-btn"
          onClick={loadOrders}
          disabled={loading}
        >
          {loading
            ? "Refreshing..."
            : "Refresh Orders"}
        </button>

      </div>

      {/* ====================================================
          SUMMARY
      ==================================================== */}

      <div className="orders-summary">

        <div className="summary-card">
          <h3>
            {totalOrders}
          </h3>

          <span>
            Total Orders
          </span>
        </div>

        <div className="summary-card">
          <h3>
            {pendingOrders}
          </h3>

          <span>
            Pending
          </span>
        </div>

        <div className="summary-card">
          <h3>
            {processingOrders}
          </h3>

          <span>
            Processing
          </span>
        </div>

        <div className="summary-card">
          <h3>
            {shippedOrders}
          </h3>

          <span>
            Shipped
          </span>
        </div>

        <div className="summary-card">
          <h3>
            {deliveredOrders}
          </h3>

          <span>
            Delivered
          </span>
        </div>

        <div className="summary-card">
          <h3>
            {cancelledOrders}
          </h3>

          <span>
            Cancelled
          </span>
        </div>

      </div>

      {/* ====================================================
          TOOLBAR
      ==================================================== */}

      <div className="orders-toolbar">

        <input
          type="search"
          placeholder="Search customer, email or order ID..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
        >

          <option value="All">
            All
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Processing">
            Processing
          </option>

          <option value="Shipped">
            Shipped
          </option>

          <option value="Delivered">
            Delivered
          </option>

          <option value="Cancelled">
            Cancelled
          </option>

        </select>

      </div>

      {/* ====================================================
          ORDERS LIST
      ==================================================== */}

      <div className="admin-orders-list">

        {filteredOrders.length === 0 ? (

          <div className="empty-orders">

            <h2>
              No Orders Found
            </h2>

            <p>
              No orders match your
              current search or
              filter.
            </p>

          </div>

        ) : (

          filteredOrders.map(
            (order) => {

              const status =
                formatStatus(
                  order?.status
                );

              const orderItems =
                getOrderItems(
                  order
                );

              const orderTotal =
                getOrderTotal(
                  order
                );

              const paymentStatus =
                getPaymentStatus(
                  order
                );

              return (
                <div
                  className="admin-order-card"
                  key={order._id}
                >

                  {/* ==========================================
                      ORDER HEADER
                  ========================================== */}

                  <div className="order-top">

                    <div>

                      <h3>
                        Order #
                        {getOrderNumber(
                          order
                        )}
                      </h3>

                      <p>
                        Customer:{" "}
                        <strong>
                          {order
                            ?.user
                            ?.name ||
                            "Guest"}
                        </strong>
                      </p>

                      <p>
                        Email:{" "}
                        {order
                          ?.user
                          ?.email ||
                          "No email"}
                      </p>

                      <p>
                        Payment Method:{" "}
                        <strong>
                          {order
                            ?.paymentMethod ||
                            "N/A"}
                        </strong>
                      </p>

                      <p>
                        Payment Status:{" "}
                        <strong
                          className={`payment-status ${paymentStatus.toLowerCase()}`}
                        >
                          {paymentStatus}
                        </strong>
                      </p>

                    </div>

                    {/* ========================================
                        ORDER STATUS
                    ======================================== */}

                    <select
                      value={status}
                      disabled={
                        updating ===
                        order._id
                      }
                      onChange={(e) =>
                        handleStatusChange(
                          order._id,
                          e.target.value
                        )
                      }
                    >

                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Processing">
                        Processing
                      </option>

                      <option value="Shipped">
                        Shipped
                      </option>

                      <option value="Delivered">
                        Delivered
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>

                    </select>

                  </div>

                  {/* ==========================================
                      SHIPPING INFORMATION
                  ========================================== */}

                  <div className="shipping-info">

                    <h4>
                      Shipping Information
                    </h4>

                    <p>
                      <strong>
                        Full Name:
                      </strong>{" "}
                      {order
                        ?.shippingAddress
                        ?.fullName ||
                        order
                          ?.user
                          ?.name ||
                        "N/A"}
                    </p>

                    <p>
                      <strong>
                        Address:
                      </strong>{" "}
                      {order
                        ?.shippingAddress
                        ?.address ||
                        "No address"}
                    </p>

                    <p>
                      <strong>
                        City:
                      </strong>{" "}
                      {order
                        ?.shippingAddress
                        ?.city ||
                        "No city"}
                    </p>

                    {order
                      ?.shippingAddress
                      ?.state && (

                      <p>
                        <strong>
                          State:
                        </strong>{" "}
                        {
                          order
                            .shippingAddress
                            .state
                        }
                      </p>

                    )}

                    {order
                      ?.shippingAddress
                      ?.country && (

                      <p>
                        <strong>
                          Country:
                        </strong>{" "}
                        {
                          order
                            .shippingAddress
                            .country
                        }
                      </p>

                    )}

                    {order
                      ?.shippingAddress
                      ?.phone && (

                      <p>
                        <strong>
                          Phone:
                        </strong>{" "}
                        {
                          order
                            .shippingAddress
                            .phone
                        }
                      </p>

                    )}

                  </div>

                  {/* ==========================================
                      ORDER ITEMS
                  ========================================== */}

                  <div className="order-items">

                    <h4>
                      Products
                    </h4>

                    {orderItems.length === 0 ? (

                      <p>
                        No products found.
                      </p>

                    ) : (

                      orderItems.map(
                        (
                          item,
                          index
                        ) => (

                          <div
                            className="admin-order-item"
                            key={
                              item?._id ||
                              item?.product?._id ||
                              item?.product ||
                              index
                            }
                          >

                            <img
                              src={getProductImage(
                                item
                              )}
                              alt={getProductName(
                                item
                              )}
                              onError={(
                                e
                              ) => {

                                if (
                                  e
                                    .currentTarget
                                    .src.endsWith(
                                      "product-placeholder.png"
                                    )
                                ) {
                                  return;
                                }

                                e.currentTarget.src =
                                  "/images/product-placeholder.png";

                              }}
                            />

                            <div>

                              <strong>
                                {getProductName(
                                  item
                                )}
                              </strong>

                              <p>
                                Quantity:{" "}
                                {Number(
                                  item?.quantity
                                ) || 0}
                              </p>

                              {item?.price !==
                                undefined && (

                                <p>
                                  Price:{" "}
                                  {formatPrice(
                                    Number(
                                      item.price
                                    ) || 0
                                  )}
                                </p>

                              )}

                              {item?.price !==
                                undefined &&
                                item?.quantity !==
                                  undefined && (

                                <p>
                                  Subtotal:{" "}
                                  {formatPrice(
                                    (
                                      Number(
                                        item.price
                                      ) || 0
                                    ) *
                                      (
                                        Number(
                                          item.quantity
                                        ) || 0
                                      )
                                  )}
                                </p>

                              )}

                            </div>

                          </div>

                        )
                      )

                    )}

                  </div>

                  {/* ==========================================
                      ORDER FOOTER
                  ========================================== */}

                  <div className="admin-order-footer">

                    <div>

                      <strong>
                        Total:{" "}
                        {formatPrice(
                          orderTotal
                        )}
                      </strong>

                      <p>
                        {order
                          ?.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month:
                                  "short",
                                day: "numeric",
                              }
                            )
                          : "No date"}
                      </p>

                      <span
                        className={`status-badge ${status.toLowerCase()}`}
                      >
                        {status}
                      </span>

                    </div>

                    <button
                      type="button"
                      className="delete-btn"
                      disabled={
                        deleting ===
                        order._id
                      }
                      onClick={() =>
                        handleDelete(
                          order._id
                        )
                      }
                    >
                      {deleting ===
                      order._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                  </div>

                </div>
              );
            }
          )

        )}

      </div>

    </section>
  );
}

// ==========================================================
// EXPORT
// ==========================================================

export default AdminOrders;