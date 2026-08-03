import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Loading from "../../components/Loading";

import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../../api/orderApi";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  useEffect(() => {
    loadOrders();
  }, []);

  /* ==========================================================
     LOAD ORDERS
  ========================================================== */

  const loadOrders = async () => {
    try {
      setLoading(true);

      const data = await getAllOrders();

      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     UPDATE STATUS
  ========================================================== */

  const handleStatusChange = async (
    orderId,
    status
  ) => {
    try {
      await updateOrderStatus(orderId, status);

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status,
              }
            : order
        )
      );
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to update status."
      );
    }
  };

  /* ==========================================================
     DELETE ORDER
  ========================================================== */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this order?"
    );

    if (!confirmed) return;

    try {
      await deleteOrder(id);

      setOrders((prev) =>
        prev.filter(
          (order) => order._id !== id
        )
      );
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to delete order."
      );
    }
  };

  /* ==========================================================
     FILTERED ORDERS
  ========================================================== */

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order._id
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        order.user?.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        order.user?.email
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all"
          ? true
          : order.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [orders, search, statusFilter]);

  if (loading) {
    return <Loading />;
  }  return (
    <section className="container admin-orders-page">

      {/* ==============================
          Page Header
      ============================== */}

      <div className="page-header">
        <div>
          <h1>📦 Admin Orders</h1>
          <p>
            Manage customer orders and update delivery status.
          </p>
        </div>

        <Link
          to="/admin"
          className="btn-secondary"
        >
          ← Dashboard
        </Link>
      </div>


      {/* ==============================
          Error Message
      ============================== */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {/* ==============================
          Statistics
      ============================== */}

      <div className="admin-stats">

        <div className="stat-card">
          <h3>Total Orders</h3>

          <span>
            {orders.length}
          </span>
        </div>

        <div className="stat-card">
          <h3>Pending</h3>

          <span>
            {
              orders.filter(
                (order) =>
                  order.status === "pending"
              ).length
            }
          </span>
        </div>

        <div className="stat-card">
          <h3>Processing</h3>

          <span>
            {
              orders.filter(
                (order) =>
                  order.status === "processing"
              ).length
            }
          </span>
        </div>

        <div className="stat-card">
          <h3>Delivered</h3>

          <span>
            {
              orders.filter(
                (order) =>
                  order.status === "delivered"
              ).length
            }
          </span>
        </div>

      </div>


      {/* ==============================
          Search + Filter
      ============================== */}

      <div className="admin-toolbar">

        <input
          type="text"
          placeholder="Search by Order ID, Customer or Email..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="all">
            All Status
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

      </div>


      {/* ==============================
          Orders Table
      ============================== */}

      {filteredOrders.length === 0 ? (

        <div className="empty-state">

          <h2>No Orders Found</h2>

          <p>
            No customer orders match your search.
          </p>

        </div>

      ) : (

        <div className="table-responsive">

          <table className="admin-table">

            <thead>

              <tr>

                <th>Order</th>

                <th>Customer</th>

                <th>Total</th>

                <th>Payment</th>

                <th>Status</th>

                <th>Date</th>

                <th>Actions</th>

              </tr>

            </thead>

            <tbody>              {filteredOrders.map((order) => (
                <tr key={order._id}>

                  {/* Order ID */}
                  <td>
                    <strong>
                      #{order._id.slice(-8).toUpperCase()}
                    </strong>
                  </td>

                  {/* Customer */}
                  <td>
                    <div className="customer-info">
                      <strong>
                        {order.user?.name || "Unknown User"}
                      </strong>

                      <br />

                      <small>
                        {order.user?.email || "-"}
                      </small>
                    </div>
                  </td>

                  {/* Total */}
                  <td>
                    ₦
                    {(
                      order.totalPrice ??
                      order.totalAmount ??
                      0
                    ).toLocaleString()}
                  </td>

                  {/* Payment */}
                  <td>
                    <span
                      className={
                        order.isPaid
                          ? "badge badge-success"
                          : "badge badge-warning"
                      }
                    >
                      {order.isPaid
                        ? "Paid"
                        : "Unpaid"}
                    </span>
                  </td>

                  {/* Status */}
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order._id,
                          e.target.value
                        )
                      }
                    >
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
                  </td>

                  {/* Date */}
                  <td>
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="table-actions">

                      <Link
                        to={`/orders/${order._id}`}
                        className="btn-small"
                      >
                        View
                      </Link>

                      <button
                        className="btn-small btn-danger"
                        onClick={() =>
                          handleDelete(order._id)
                        }
                      >
                        Delete
                      </button>

                    </div>
                  </td>

                </tr>
                            ))}

            </tbody>

          </table>

        </div>

      )}

    </section>
  );
}

export default AdminOrders;