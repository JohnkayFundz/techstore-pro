import api from "./axios";

/* ==========================================================
   DASHBOARD STATS
========================================================== */

export const getDashboardStats = async () => {
  try {
    const { data } = await api.get(
      "/admin/dashboard"
    );

    return data;
  } catch (error) {
    console.error(
      "Dashboard Error:",
      error
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to load dashboard.",
    };
  }
};


/* ==========================================================
   SALES ANALYTICS
========================================================== */

export const getSalesAnalytics = async () => {
  try {
    const { data } = await api.get(
      "/admin/sales"
    );

    return data;
  } catch (error) {
    console.error(
      "Sales Analytics Error:",
      error
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to load sales data.",
    };
  }
};


/* ==========================================================
   PRODUCTS
========================================================== */

/* ----------------------------------------------------------
   GET ALL ADMIN PRODUCTS
   GET /api/admin/products
---------------------------------------------------------- */

export const getAdminProducts = async () => {
  try {
    const { data } = await api.get(
      "/admin/products"
    );

    return data;
  } catch (error) {
    console.error(
      "Admin Products Error:",
      error
    );

    return {
      success: false,
      products: [],
      message:
        error.response?.data?.message ||
        "Failed to load products.",
    };
  }
};


/* ----------------------------------------------------------
   GET ADMIN PRODUCT BY ID
   GET /api/admin/products/:id
---------------------------------------------------------- */

export const getAdminProduct = async (id) => {
  try {
    const { data } = await api.get(
      `/admin/products/${id}`
    );

    return data;
  } catch (error) {
    console.error(
      "Get Admin Product Error:",
      error
    );

    return {
      success: false,
      product: null,
      message:
        error.response?.data?.message ||
        "Failed to load product.",
    };
  }
};


/* ----------------------------------------------------------
   CREATE PRODUCT
   POST /api/admin/products
---------------------------------------------------------- */

export const createAdminProduct = async (
  product
) => {
  try {
    const { data } = await api.post(
      "/admin/products",
      product
    );

    return data;
  } catch (error) {
    console.error(
      "Create Admin Product Error:",
      error
    );

    return {
      success: false,
      product: null,
      message:
        error.response?.data?.message ||
        "Failed to create product.",
    };
  }
};


/* ----------------------------------------------------------
   UPDATE PRODUCT
   PUT /api/admin/products/:id
---------------------------------------------------------- */

export const updateAdminProduct = async (
  id,
  product
) => {
  try {
    const { data } = await api.put(
      `/admin/products/${id}`,
      product
    );

    return data;
  } catch (error) {
    console.error(
      "Update Admin Product Error:",
      error
    );

    return {
      success: false,
      product: null,
      message:
        error.response?.data?.message ||
        "Failed to update product.",
    };
  }
};


/* ----------------------------------------------------------
   DELETE PRODUCT
   DELETE /api/admin/products/:id
   SOFT DELETE
---------------------------------------------------------- */

export const deleteAdminProduct = async (
  id
) => {
  try {
    const { data } = await api.delete(
      `/admin/products/${id}`
    );

    return data;
  } catch (error) {
    console.error(
      "Delete Admin Product Error:",
      error
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to delete product.",
    };
  }
};


/* ----------------------------------------------------------
   RESTORE PRODUCT
   PUT /api/admin/products/:id/restore
---------------------------------------------------------- */

export const restoreAdminProduct = async (
  id
) => {
  try {
    const { data } = await api.put(
      `/admin/products/${id}/restore`
    );

    return data;
  } catch (error) {
    console.error(
      "Restore Admin Product Error:",
      error
    );

    return {
      success: false,
      product: null,
      message:
        error.response?.data?.message ||
        "Failed to restore product.",
    };
  }
};


/* ==========================================================
   ORDERS
========================================================== */

/* ----------------------------------------------------------
   GET ALL ADMIN ORDERS
---------------------------------------------------------- */

export const getAdminOrders = async () => {
  try {
    const { data } = await api.get(
      "/admin/orders"
    );

    return data;
  } catch (error) {
    console.error(
      "Admin Orders Error:",
      error
    );

    return {
      success: false,
      orders: [],
      message:
        error.response?.data?.message ||
        "Failed to load orders.",
    };
  }
};


/* ----------------------------------------------------------
   UPDATE ORDER STATUS
   PUT /api/admin/orders/:id
---------------------------------------------------------- */

export const updateOrderStatus = async (
  id,
  status
) => {
  try {
    const { data } = await api.put(
      `/admin/orders/${id}`,
      {
        status,
      }
    );

    return data;
  } catch (error) {
    console.error(
      "Update Order Error:",
      error
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to update order.",
    };
  }
};


/* ----------------------------------------------------------
   DELETE ORDER
   DELETE /api/admin/orders/:id
---------------------------------------------------------- */

export const deleteAdminOrder = async (
  id
) => {
  try {
    const { data } = await api.delete(
      `/admin/orders/${id}`
    );

    return data;
  } catch (error) {
    console.error(
      "Delete Order Error:",
      error
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to delete order.",
    };
  }
};


/* ==========================================================
   USERS
========================================================== */

/* ----------------------------------------------------------
   GET USERS
   GET /api/admin/users
---------------------------------------------------------- */

export const getUsers = async () => {
  try {
    const { data } = await api.get(
      "/admin/users"
    );

    return data;
  } catch (error) {
    console.error(
      "Get Users Error:",
      error
    );

    return {
      success: false,
      users: [],
      message:
        error.response?.data?.message ||
        "Failed to load users.",
    };
  }
};


/* ----------------------------------------------------------
   UPDATE USER ROLE
   PUT /api/admin/users/:id/role
---------------------------------------------------------- */

export const updateUserRole = async (
  id,
  role
) => {
  try {
    const { data } = await api.put(
      `/admin/users/${id}/role`,
      {
        role,
      }
    );

    return data;
  } catch (error) {
    console.error(
      "Update User Role Error:",
      error
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to update role.",
    };
  }
};


/* ----------------------------------------------------------
   DELETE USER
   DELETE /api/admin/users/:id
---------------------------------------------------------- */

export const deleteUser = async (
  id
) => {
  try {
    const { data } = await api.delete(
      `/admin/users/${id}`
    );

    return data;
  } catch (error) {
    console.error(
      "Delete User Error:",
      error
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to delete user.",
    };
  }
};