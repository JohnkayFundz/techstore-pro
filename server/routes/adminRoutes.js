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
   USER MANAGEMENT
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
   ORDER MANAGEMENT
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
   PRODUCT MANAGEMENT
========================================================== */

router.get(
  "/products",
  protect,
  adminOnly,
  getProducts
);

router.get(
  "/products/:id",
  protect,
  adminOnly,
  getProduct
);

router.post(
  "/products",
  protect,
  adminOnly,
  createProduct
);

router.put(
  "/products/:id",
  protect,
  adminOnly,
  updateProduct
);

router.delete(
  "/products/:id",
  protect,
  adminOnly,
  deleteProduct
);

export default router;