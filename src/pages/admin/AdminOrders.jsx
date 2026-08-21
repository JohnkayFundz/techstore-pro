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


function AdminOrders() {

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [deleting, setDeleting] = useState(null);

  const [updating, setUpdating] = useState(null);


  // ==========================================================
  // LOAD ORDERS
  // ==========================================================

  const loadOrders = async () => {

    try {

      setLoading(true);

      setError("");


      const response = await getAdminOrders();


      const orderList =
        response?.data?.orders ||
        response?.orders ||
        response ||
        [];


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


      setError(
        error.response?.data?.message ||
        "Failed to load orders."
      );


    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadOrders();

  }, []);


  // ==========================================================
  // FORMAT STATUS
  // ==========================================================

  const formatStatus = (status) => {

    if (!status) {
      return "Pending";
    }


    return (
      String(status)
        .charAt(0)
        .toUpperCase() +
      String(status)
        .slice(1)
        .toLowerCase()
    );

  };


  // ==========================================================
  // GET ORDER TOTAL
  // ==========================================================

  const getOrderTotal = (order) => {

    const possibleTotal =
      order?.totalAmount ??
      order?.totalPrice ??
      order?.total ??
      order?.amount ??
      0;


    const numericTotal =
      Number(possibleTotal);


    return Number.isFinite(numericTotal)
      ? numericTotal
      : 0;

  };


  // ==========================================================
  // GET ORDER ITEMS
  // ==========================================================

  const getOrderItems = (order) => {

    if (
      Array.isArray(order?.orderItems)
    ) {

      return order.orderItems;

    }


    if (
      Array.isArray(order?.items)
    ) {

      return order.items;

    }


    return [];

  };


  // ==========================================================
  // UPDATE STATUS
  // ==========================================================

  const handleStatusChange = async (
    orderId,
    status
  ) => {

    try {

      setUpdating(orderId);


      const newStatus =
        status.toLowerCase();


      await updateOrderStatus(
        orderId,
        newStatus
      );


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
        error.response?.data?.message ||
        "Failed to update status."
      );


    } finally {

      setUpdating(null);

    }

  };


  // ==========================================================
  // DELETE ORDER
  // ==========================================================

  const handleDelete = async (
    orderId
  ) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this order?"
      );


    if (!confirmDelete) {
      return;
    }


    try {

      setDeleting(orderId);


      await deleteAdminOrder(
        orderId
      );


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
        error.response?.data?.message ||
        "Failed to delete order."
      );


    } finally {

      setDeleting(null);

    }

  };


  // ==========================================================
  // FILTER ORDERS
  // ==========================================================

  const filteredOrders = useMemo(() => {

    const keyword =
      search.trim().toLowerCase();


    return orders.filter((order) => {

      const customer =
        order?.user?.name
          ?.toLowerCase() || "";


      const email =
        order?.user?.email
          ?.toLowerCase() || "";


      const orderId =
        order?._id
          ?.toLowerCase() || "";


      const matchesSearch =
        !keyword ||
        customer.includes(keyword) ||
        email.includes(keyword) ||
        orderId.includes(keyword);


      const formattedStatus =
        formatStatus(order?.status);


      const matchesStatus =
        statusFilter === "All" ||
        formattedStatus === statusFilter;


      return (
        matchesSearch &&
        matchesStatus
      );

    });

  }, [
    orders,
    search,
    statusFilter,
  ]);


  // ==========================================================
  // SUMMARY
  // ==========================================================

  const totalOrders =
    orders.length;


  const pendingOrders =
    orders.filter(
      (order) =>
        formatStatus(
          order.status
        ) === "Pending"
    ).length;


  const processingOrders =
    orders.filter(
      (order) =>
        formatStatus(
          order.status
        ) === "Processing"
    ).length;


  const shippedOrders =
    orders.filter(
      (order) =>
        formatStatus(
          order.status
        ) === "Shipped"
    ).length;


  const deliveredOrders =
    orders.filter(
      (order) =>
        formatStatus(
          order.status
        ) === "Delivered"
    ).length;


  const cancelledOrders =
    orders.filter(
      (order) =>
        formatStatus(
          order.status
        ) === "Cancelled"
    ).length;


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (

      <section className="admin-orders-page">

        <div className="admin-loading">

          Loading orders...

        </div>

      </section>

    );

  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {

    return (

      <section className="admin-orders-page">

        <div className="error-message">

          {error}

        </div>

      </section>

    );

  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <section className="admin-orders-page">

      <div className="page-header">

        <h1>
          Orders Management
        </h1>


        <p>
          Manage customer orders and delivery status.
        </p>

      </div>


      {/* ======================================================
          SUMMARY
      ====================================================== */}

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


      {/* ======================================================
          TOOLBAR
      ====================================================== */}

      <div className="orders-toolbar">

        <input
          type="search"
          placeholder="Search customer, email or order ID..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
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


      {/* ======================================================
          ORDERS LIST
      ====================================================== */}

      <div className="admin-orders-list">

        {filteredOrders.length === 0 ? (

          <div className="empty-orders">

            <h2>
              No Orders Found
            </h2>

            <p>
              No orders match your current search or filter.
            </p>

          </div>

        ) : (

          filteredOrders.map((order) => {

            const status =
              formatStatus(
                order?.status
              );


            const orderItems =
              getOrderItems(order);


            const orderTotal =
              getOrderTotal(order);


            return (

              <div
                className="admin-order-card"
                key={order._id}
              >

                {/* ==================================================
                    ORDER HEADER
                ================================================== */}

                <div className="order-top">

                  <div>

                    <h3>

                      Order #

                      {String(
                        order._id
                      ).slice(-8)}

                    </h3>


                    <p>

                      Customer:

                      {" "}

                      <strong>
                        {order?.user?.name ||
                          "Guest"}
                      </strong>

                    </p>


                    <p>

                      {order?.user?.email ||
                        "No email"}

                    </p>


                    <p>

                      Payment:

                      {" "}

                      {order?.paymentMethod ||
                        "N/A"}

                    </p>


                    <p>

                      Paid:

                      {" "}

                      {order?.isPaid
                        ? "Yes"
                        : "No"}

                    </p>

                  </div>


                  {/* STATUS */}

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


                {/* ==================================================
                    SHIPPING INFORMATION
                ================================================== */}

                <div className="shipping-info">

                  <h4>
                    Shipping Information
                  </h4>


                  <p>

                    <strong>
                      Address:
                    </strong>

                    {" "}

                    {order
                      ?.shippingAddress
                      ?.address ||
                      "No address"}

                  </p>


                  <p>

                    <strong>
                      City:
                    </strong>

                    {" "}

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
                      </strong>

                      {" "}

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
                      </strong>

                      {" "}

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
                      </strong>

                      {" "}

                      {
                        order
                          .shippingAddress
                          .phone
                      }

                    </p>

                  )}

                </div>


                {/* ==================================================
                    ORDER ITEMS
                ================================================== */}

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
                      (item, index) => (

                        <div
                          className="admin-order-item"
                          key={
                            item?._id ||
                            item?.product ||
                            index
                          }
                        >

                          <img
                            src={
                              item?.image ||
                              item?.product?.image ||
                              "/images/product-placeholder.png"
                            }
                            alt={
                              item?.name ||
                              item?.product?.name ||
                              "Product"
                            }
                            onError={(e) => {

                              e.currentTarget.src =
                                "/images/product-placeholder.png";

                            }}
                          />


                          <div>

                            <strong>

                              {item?.name ||
                                item?.product?.name ||
                                "Product"}

                            </strong>


                            <p>

                              Quantity:

                              {" "}

                              {Number(
                                item?.quantity
                              ) || 0}

                            </p>


                            {item?.price !==
                              undefined && (

                              <p>

                                Price:

                                {" "}

                                {formatPrice(
                                  Number(
                                    item.price
                                  ) || 0
                                )}

                              </p>

                            )}

                          </div>

                        </div>

                      )
                    )

                  )}

                </div>


                {/* ==================================================
                    ORDER FOOTER
                ================================================== */}

                <div className="admin-order-footer">

                  <div>

                    <strong>

                      Total:

                      {" "}

                      {formatPrice(
                        orderTotal
                      )}

                    </strong>


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
                        : "No date"}

                    </p>


                    <span
                      className={
                        `status-badge ${status.toLowerCase()}`
                      }
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

          })

        )}

      </div>

    </section>

  );

}


export default AdminOrders;