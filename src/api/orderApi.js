import api from "./axios";

/* ==========================================================
   ORDER API
   TechStore Pro
========================================================== */


/* ==========================================================
   USER - CREATE ORDER

   POST /api/orders
========================================================== */

export const createOrder = async (orderData) => {
  if (!orderData) {
    throw new Error("Order data is required.");
  }

  const response = await api.post(
    "/orders",
    orderData
  );

  return response;
};


/* ==========================================================
   USER - GET MY ORDERS

   GET /api/orders/my-orders
========================================================== */

export const getMyOrders = async () => {
  const response = await api.get(
    "/orders/my-orders"
  );

  // Return the API payload so consumers can work
  // directly with success/orders fields instead of
  // depending on Axios response internals.
  return response?.data ?? response;
};


/* ==========================================================
   USER - GET SINGLE ORDER

   GET /api/orders/:id
========================================================== */

export const getOrderById = async (id) => {
  if (!id) {
    throw new Error("Order ID is required.");
  }

  const response = await api.get(
    `/orders/${id}`
  );

  return response;
};


/* ==========================================================
   USER - CANCEL ORDER

   PATCH /api/orders/:id/cancel
========================================================== */

export const cancelOrder = async (id) => {
  if (!id) {
    throw new Error("Order ID is required.");
  }

  const response = await api.patch(
    `/orders/${id}/cancel`
  );

  // Return the API payload to match MyOrders' success/order handling.
  return response?.data ?? response;
};


/* ==========================================================
   ADMIN - GET ALL ORDERS

   GET /api/admin/orders
========================================================== */

export const getAllOrders = async () => {
  const response = await api.get(
    "/admin/orders"
  );

  return response;
};


/* ==========================================================
   ADMIN - UPDATE ORDER STATUS

   PUT /api/admin/orders/:id
========================================================== */

export const updateOrderStatus = async (
  id,
  data
) => {
  if (!id) {
    throw new Error("Order ID is required.");
  }

  if (!data) {
    throw new Error("Update data is required.");
  }

  const response = await api.put(
    `/admin/orders/${id}`,
    data
  );

  return response;
};


/* ==========================================================
   ADMIN - DELETE ORDER

   DELETE /api/admin/orders/:id
========================================================== */

export const deleteOrder = async (id) => {
  if (!id) {
    throw new Error("Order ID is required.");
  }

  const response = await api.delete(
    `/admin/orders/${id}`
  );

  return response;
};