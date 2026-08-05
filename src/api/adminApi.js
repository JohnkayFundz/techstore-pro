import api from "./axios";


/* ==========================================================
   ADMIN DASHBOARD
========================================================== */


/**
 * Get dashboard statistics
 * GET /api/admin/dashboard
 */
export const getDashboardStats = async () => {
  const { data } = await api.get(
    "/admin/dashboard"
  );

  return data;
};



/**
 * Get sales analytics
 * GET /api/admin/sales
 */
export const getSalesAnalytics = async () => {
  const { data } = await api.get(
    "/admin/sales"
  );

  return data;
};



/* ==========================================================
   USER MANAGEMENT
========================================================== */


/**
 * Get all users
 * GET /api/admin/users
 */
export const getUsers = async () => {
  const { data } = await api.get(
    "/admin/users"
  );

  return data;
};



/**
 * Update user role
 * PUT /api/admin/users/:id/role
 */
export const updateUserRole = async (
  userId,
  role
) => {
  const { data } = await api.put(
    `/admin/users/${userId}/role`,
    {
      role,
    }
  );

  return data;
};



/**
 * Delete user
 * DELETE /api/admin/users/:id
 */
export const deleteUser = async (
  userId
) => {
  const { data } = await api.delete(
    `/admin/users/${userId}`
  );

  return data;
};



/* ==========================================================
   ORDER MANAGEMENT
========================================================== */


/**
 * Get all orders
 * GET /api/admin/orders
 */
export const getAdminOrders = async () => {
  const { data } = await api.get(
    "/admin/orders"
  );

  return data;
};



/**
 * Update order status
 * PUT /api/admin/orders/:id
 */
export const updateOrderStatus = async (
  orderId,
  status
) => {
  const { data } = await api.put(
    `/admin/orders/${orderId}`,
    {
      status,
    }
  );

  return data;
};



/**
 * Delete order
 * DELETE /api/admin/orders/:id
 */
export const deleteAdminOrder = async (
  orderId
) => {
  const { data } = await api.delete(
    `/admin/orders/${orderId}`
  );

  return data;
};



/* ==========================================================
   PRODUCT MANAGEMENT
========================================================== */


/**
 * Get all products
 * GET /api/admin/products
 */
export const getAdminProducts = async () => {
  const { data } = await api.get(
    "/admin/products"
  );

  return data;
};



/**
 * Get single product
 * GET /api/admin/products/:id
 */
export const getAdminProductById = async (
  productId
) => {
  const { data } = await api.get(
    `/admin/products/${productId}`
  );

  return data;
};



/**
 * Create product
 * POST /api/admin/products
 */
export const createAdminProduct = async (
  productData
) => {
  const { data } = await api.post(
    "/admin/products",
    productData
  );

  return data;
};



/**
 * Update product
 * PUT /api/admin/products/:id
 */
export const updateAdminProduct = async (
  productId,
  productData
) => {
  const { data } = await api.put(
    `/admin/products/${productId}`,
    productData
  );

  return data;
};



/**
 * Delete product
 * DELETE /api/admin/products/:id
 */
export const deleteAdminProduct = async (
  productId
) => {
  const { data } = await api.delete(
    `/admin/products/${productId}`
  );

  return data;
};