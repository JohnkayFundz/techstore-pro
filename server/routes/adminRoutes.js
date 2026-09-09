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

  /* ========================================================
     PRODUCTS
  ======================================================== */

  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
} from "../controllers/adminController.js";

import {
  updateOrderStatusSafely,
  deleteOrderSafely,
} from "../controllers/adminOrderLifecycleController.js";

const router = express.Router();

/* ==========================================================
   DASHBOARD
========================================================== */

/*
 * GET /api/admin/dashboard
 */

router.get(
  "/dashboard",
  protect,
  adminOnly,
  getDashboardStats
);


/* ==========================================================
   SALES ANALYTICS
========================================================== */

/*
 * GET /api/admin/analytics
 *
 * Main endpoint used by AdminAnalytics.jsx
 */

router.get(
  "/analytics",
  protect,
  adminOnly,
  getSalesAnalytics
);


/*
 * GET /api/admin/sales
 *
 * Backward-compatible alias.
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
 * GET ALL USERS
 *
 * GET /api/admin/users
 */

router.get(
  "/users",
  protect,
  adminOnly,
  getUsers
);


/*
 * UPDATE USER ROLE
 *
 * PUT /api/admin/users/:id/role
 */

router.put(
  "/users/:id/role",
  protect,
  adminOnly,
  updateUserRole
);


/*
 * DELETE USER
 *
 * DELETE /api/admin/users/:id
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
 * GET ALL ORDERS
 *
 * GET /api/admin/orders
 */

router.get(
  "/orders",
  protect,
  adminOnly,
  getOrders
);


/*
 * UPDATE ORDER STATUS
 *
 * PUT /api/admin/orders/:id
 *
 * Inventory-safe lifecycle handler.
 */

router.put(
  "/orders/:id",
  protect,
  adminOnly,
  updateOrderStatusSafely
);


/*
 * DELETE ORDER
 *
 * DELETE /api/admin/orders/:id
 *
 * Only cancelled orders may be permanently deleted.
 */

router.delete(
  "/orders/:id",
  protect,
  adminOnly,
  deleteOrderSafely
);


/* ==========================================================
   PRODUCTS
========================================================== */

/*
 * GET ALL PRODUCTS
 *
 * GET /api/admin/products
 */

router.get(
  "/products",
  protect,
  adminOnly,
  getProducts
);


/*
 * GET SINGLE PRODUCT
 *
 * GET /api/admin/products/:id
 */

router.get(
  "/products/:id",
  protect,
  adminOnly,
  getProduct
);


/*
 * CREATE PRODUCT
 *
 * POST /api/admin/products
 */

router.post(
  "/products",
  protect,
  adminOnly,
  createProduct
);


/*
 * UPDATE PRODUCT
 *
 * PUT /api/admin/products/:id
 */

router.put(
  "/products/:id",
  protect,
  adminOnly,
  updateProduct
);


/*
 * DELETE PRODUCT
 *
 * DELETE /api/admin/products/:id
 *
 * Soft delete
 */

router.delete(
  "/products/:id",
  protect,
  adminOnly,
  deleteProduct
);


/*
 * RESTORE PRODUCT
 *
 * PUT /api/admin/products/:id/restore
 */

router.put(
  "/products/:id/restore",
  protect,
  adminOnly,
  restoreProduct
);


/* ==========================================================
   EXPORT
========================================================== */

export default router;