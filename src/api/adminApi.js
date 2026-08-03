import api from "./axios";


/* ==========================================================
   ADMIN DASHBOARD
========================================================== */


/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {

  const { data } = await api.get(
    "/admin/dashboard"
  );

  return data;

};



/**
 * Get sales analytics
 */
export const getSalesAnalytics = async () => {

  const { data } = await api.get(
    "/admin/analytics"
  );

  return data;

};




/* ==========================================================
   USER MANAGEMENT
========================================================== */


/**
 * Get all users
 */
export const getUsers = async () => {

  const { data } = await api.get(
    "/admin/users"
  );

  return data;

};




/**
 * Update user role
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
 */
export const getAdminOrders = async () => {

  const { data } = await api.get(
    "/admin/orders"
  );

  return data;

};




/**
 * Update order status
 */
export const updateAdminOrderStatus = async (
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





/* ==========================================================
   PRODUCT MANAGEMENT
========================================================== */


/**
 * Get all products
 */
export const getAdminProducts = async () => {

  const { data } = await api.get(
    "/admin/products"
  );

  return data;

};




/**
 * Get single product
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
 */
export const deleteAdminProduct = async (
  productId
) => {

  const { data } = await api.delete(

    `/admin/products/${productId}`

  );


  return data;

};