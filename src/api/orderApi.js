import api from "./axios";

/* ==========================================================
   CREATE ORDER
========================================================== */

export const createOrder = async (orderData) => {
  const { data } = await api.post("/orders", orderData);
  return data;
};

/* ==========================================================
   GET MY ORDERS
========================================================== */

export const getMyOrders = async () => {
  const { data } = await api.get("/orders/my-orders");
  return data;
};

/* ==========================================================
   GET SINGLE ORDER
========================================================== */

export const getOrderById = async (orderId) => {
  const { data } = await api.get(`/orders/${orderId}`);
  return data;
};

/* ==========================================================
   GET ALL ORDERS (ADMIN)
========================================================== */

export const getAllOrders = async () => {
  const { data } = await api.get("/orders/admin/all");
  return data;
};

/* ==========================================================
   UPDATE ORDER STATUS
========================================================== */

export const updateOrderStatus = async (orderId, status) => {
  const { data } = await api.put(
    `/orders/${orderId}/status`,
    { status }
  );

  return data;
};

/* ==========================================================
   MARK ORDER AS PAID
========================================================== */

export const markOrderAsPaid = async (orderId) => {
  const { data } = await api.put(
    `/orders/${orderId}/pay`
  );

  return data;
};

/* ==========================================================
   DELETE ORDER
========================================================== */

export const deleteOrder = async (orderId) => {
  const { data } = await api.delete(
    `/orders/${orderId}`
  );

  return data;
};