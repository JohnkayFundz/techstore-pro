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
  restoreProduct,
} from "../controllers/adminController.js";


const router = express.Router();


/* ==========================================================
   DASHBOARD
========================================================== */

router.get(
  "/dashboard",
  protect,
  adminOnly,
  getDashboardStats
);


router.get(
  "/sales",
  protect,
  adminOnly,
  getSalesAnalytics
);


/* ==========================================================
   USERS
========================================================== */

router.get(
  "/users",
  protect,
  adminOnly,
  getUsers
);


router.put(
  "/users/:id/role",
  protect,
  adminOnly,
  updateUserRole
);


router.delete(
  "/users/:id",
  protect,
  adminOnly,
  deleteUser
);


/* ==========================================================
   ORDERS
========================================================== */

router.get(
  "/orders",
  protect,
  adminOnly,
  getOrders
);


router.put(
  "/orders/:id",
  protect,
  adminOnly,
  updateOrderStatus
);


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
 * GET ALL PRODUCTS
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
 * PUT /api/admin/products/:id/restore
 */

router.put(
  "/products/:id/restore",
  protect,
  adminOnly,
  restoreProduct
);


/* ==========================================================
   EXPORT ROUTER
========================================================== */

export default router;