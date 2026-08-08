import express from "express";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

import {
  // Dashboard
  getDashboardStats,
  getSalesAnalytics,

  // Users
  getUsers,
  updateUserRole,
  deleteUser,

  // Orders
  getOrders,
  updateOrderStatus,
  deleteOrder,

  // Products
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
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

// Get all products
router.get(
  "/products",
  protect,
  adminOnly,
  getProducts
);

// Get single product
router.get(
  "/products/:id",
  protect,
  adminOnly,
  getProduct
);

// Create product
router.post(
  "/products",
  protect,
  adminOnly,
  createProduct
);

// Update product
router.put(
  "/products/:id",
  protect,
  adminOnly,
  updateProduct
);

// Delete product
router.delete(
  "/products/:id",
  protect,
  adminOnly,
  deleteProduct
);

export default router;