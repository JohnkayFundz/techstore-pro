import api from "./axios";

/* ==========================================================
   GET ALL ORDERS
========================================================== */

export const getOrders = async (params = {}) => {
  try {
    console.log(
      "📦 ADMIN ORDERS - Loading all orders..."
    );

    const { data } = await api.get(
      "/orders",
      {
        params,
      }
    );

    console.log(
      "📦 ADMIN ORDERS - API response:",
      data
    );

    return data;
  } catch (error) {
    console.error(
      "❌ Get Orders Error:",
      error
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to load orders.",
      orders: [],
    };
  }
};


/* ==========================================================
   GET SINGLE ORDER
========================================================== */

export const getOrder = async (id) => {
  try {
    if (!id) {
      throw new Error(
        "Order ID is required."
      );
    }

    console.log(
      "🔎 ADMIN ORDERS - Loading order:",
      id
    );

    const { data } = await api.get(
      `/orders/${id}`
    );

    console.log(
      "📋 ADMIN ORDERS - Order response:",
      data
    );

    return data;
  } catch (error) {
    console.error(
      "❌ Get Order Error:",
      error
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to load order.",
      order: null,
    };
  }
};


/* ==========================================================
   UPDATE ORDER STATUS
========================================================== */

export const updateOrderStatus = async (
  id,
  status
) => {
  try {
    if (!id) {
      throw new Error(
        "Order ID is required."
      );
    }

    if (!status) {
      throw new Error(
        "Order status is required."
      );
    }

    console.log(
      "🔄 ADMIN ORDERS - Updating order status:",
      {
        id,
        status,
      }
    );

    const { data } = await api.put(
      `/orders/${id}/status`,
      {
        status,
      }
    );

    console.log(
      "✅ ADMIN ORDERS - Status updated:",
      data
    );

    return data;
  } catch (error) {
    console.error(
      "❌ Update Order Error:",
      error
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to update order.",
    };
  }
};


/* ==========================================================
   CANCEL ORDER
========================================================== */

export const cancelOrder = async (
  id
) => {
  try {
    if (!id) {
      throw new Error(
        "Order ID is required."
      );
    }

    console.log(
      "🚫 ADMIN ORDERS - Cancelling order:",
      id
    );

    const { data } = await api.patch(
      `/orders/${id}/cancel`
    );

    console.log(
      "✅ ADMIN ORDERS - Order cancelled:",
      data
    );

    return data;
  } catch (error) {
    console.error(
      "❌ Cancel Order Error:",
      error
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to cancel order.",
    };
  }
};


/* ==========================================================
   DELETE ORDER
========================================================== */

export const deleteOrder = async (
  id
) => {
  try {
    if (!id) {
      throw new Error(
        "Order ID is required."
      );
    }

    console.log(
      "🗑️ ADMIN ORDERS - Deleting order:",
      id
    );

    const { data } = await api.delete(
      `/orders/${id}`
    );

    console.log(
      "✅ ADMIN ORDERS - Order deleted:",
      data
    );

    return data;
  } catch (error) {
    console.error(
      "❌ Delete Order Error:",
      error
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to delete order.",
    };
  }
};


/* ==========================================================
   GET ORDERS BY STATUS
========================================================== */

export const getOrdersByStatus = async (
  status
) => {
  try {
    if (!status) {
      throw new Error(
        "Order status is required."
      );
    }

    console.log(
      "🔎 ADMIN ORDERS - Filtering by status:",
      status
    );

    const { data } = await api.get(
      "/orders",
      {
        params: {
          status,
        },
      }
    );

    return data;
  } catch (error) {
    console.error(
      "❌ Get Orders By Status Error:",
      error
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to filter orders.",
      orders: [],
    };
  }
};


/* ==========================================================
   EXPORT DEFAULT
========================================================== */

export default {
  getOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  getOrdersByStatus,
};