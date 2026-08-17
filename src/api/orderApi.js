import api from "./axios";

/* ==========================================================
   USER - CREATE ORDER

   POST /api/orders
========================================================== */

export const createOrder = async (orderData) => {
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

  return response;
};


/* ==========================================================
   USER - GET SINGLE ORDER

   GET /api/orders/:id
========================================================== */

export const getOrderById = async (id) => {
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
  const response = await api.patch(
    `/orders/${id}/cancel`
  );

  return response;
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
  const response = await api.delete(
    `/admin/orders/${id}`
  );

  return response;
};