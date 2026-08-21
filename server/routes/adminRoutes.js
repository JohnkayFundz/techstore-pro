import express from "express";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

import {
  /* ========================================================
     DASHBOARD
  ======================================================== */

  getDashboardStats,
  getSalesAnalytics,

  /* ========================================================
     USERS
  ======================================================== */

  getUsers,
  updateUserRole,
  deleteUser,

  /* ========================================================
     ORDERS
  ======================================================== */

  getOrders,
  updateOrderStatus,
  deleteOrder,

  /* ========================================================
     PRODUCTS
  ======================================================== */

  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/adminController.js";


const router = express.Router();


/* ==========================================================
   ADMIN AUTHENTICATION
========================================================== */

/*
 * Every route in this file requires:
 *
 * 1. A valid authenticated user
 * 2. Admin privileges
 *
 * protect    → verifies JWT / authentication
 * adminOnly  → verifies user.role === "admin"
 *
 * The middleware is applied individually below so each
 * route is explicit and easy to debug.
 */


/* ==========================================================
   DASHBOARD
========================================================== */

/*
 * GET /api/admin/dashboard
 *
 * Returns:
 * - Total products
 * - Total users
 * - Total orders
 * - Active products
 * - Pending orders
 * - Total sales
 */

router.get(
  "/dashboard",
  protect,
  adminOnly,
  getDashboardStats
);


/*
 * GET /api/admin/sales
 *
 * Returns monthly sales analytics.
 */

router.get(
  "/sales",
  protect,
  adminOnly,
  getSalesAnalytics
);


/* ==========================================================
   USERS
========================================================== */

/*
 * GET /api/admin/users
 *
 * Get all registered users.
 */

router.get(
  "/users",
  protect,
  adminOnly,
  getUsers
);


/*
 * PUT /api/admin/users/:id/role
 *
 * Update a user's role.
 *
 * Body:
 * {
 *   "role": "user"
 * }
 *
 * or
 *
 * {
 *   "role": "admin"
 * }
 */

router.put(
  "/users/:id/role",
  protect,
  adminOnly,
  updateUserRole
);


/*
 * DELETE /api/admin/users/:id
 *
 * Delete a user.
 */

router.delete(
  "/users/:id",
  protect,
  adminOnly,
  deleteUser
);


/* ==========================================================
   ORDERS
========================================================== */

/*
 * GET /api/admin/orders
 *
 * Get all customer orders.
 */

router.get(
  "/orders",
  protect,
  adminOnly,
  getOrders
);


/*
 * PUT /api/admin/orders/:id
 *
 * Update order status.
 *
 * Body:
 * {
 *   "status": "processing"
 * }
 *
 * Allowed statuses:
 *
 * pending
 * processing
 * shipped
 * delivered
 * cancelled
 */

router.put(
  "/orders/:id",
  protect,
  adminOnly,
  updateOrderStatus
);


/*
 * DELETE /api/admin/orders/:id
 *
 * Delete an order.
 */

router.delete(
  "/orders/:id",
  protect,
  adminOnly,
  deleteOrder
);


/* ==========================================================
   PRODUCTS
========================================================== */

/*
 * GET /api/admin/products
 *
 * Get all products for the admin panel.
 */

router.get(
  "/products",
  protect,
  adminOnly,
  getProducts
);


/*
 * GET /api/admin/products/:id
 *
 * Get a single product.
 */

router.get(
  "/products/:id",
  protect,
  adminOnly,
  getProduct
);


/*
 * POST /api/admin/products
 *
 * Create a new product.
 *
 * Supports:
 * - JSON
 * - FormData
 * - Image uploads
 */

router.post(
  "/products",
  protect,
  adminOnly,
  createProduct
);


/*
 * PUT /api/admin/products/:id
 *
 * Update an existing product.
 *
 * Supports:
 * - JSON
 * - FormData
 * - Image uploads
 */

router.put(
  "/products/:id",
  protect,
  adminOnly,
  updateProduct
);


/*
 * DELETE /api/admin/products/:id
 *
 * Delete a product.
 */

router.delete(
  "/products/:id",
  protect,
  adminOnly,
  deleteProduct
);


/* ==========================================================
   EXPORT ROUTER
========================================================== */

export default router;