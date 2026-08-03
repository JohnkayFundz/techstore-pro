import api from "./axios";

/* ==========================================================
   GET ALL ORDERS
========================================================== */
export const getOrders = async (params = {}) => {
  try {
    const { data } = await api.get("/orders", {
      params,
    });

    return data;
  } catch (error) {
    console.error("Get Orders Error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
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
    const { data } = await api.get(`/orders/${id}`);

    return data;
  } catch (error) {
    console.error("Get Order Error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
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
    const { data } = await api.put(
      `/orders/${id}/status`,
      { status }
    );

    return data;
  } catch (error) {
    console.error("Update Order Error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to update order.",
    };
  }
};