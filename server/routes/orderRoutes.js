import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  markOrderAsPaid,
  deleteOrder,
} from "../controllers/orderController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ==========================================================
   USER ROUTES
========================================================== */

// Create Order
router.post(
  "/",
  protect,
  createOrder
);

// Get Logged-in User Orders
router.get(
  "/my-orders",
  protect,
  getMyOrders
);

// Get Single Order
router.get(
  "/:id",
  protect,
  getOrderById
);

/* ==========================================================
   ADMIN ROUTES
========================================================== */

// Get All Orders
router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllOrders
);

// Update Order Status
router.put(
  "/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);

// Mark Order as Paid
router.put(
  "/:id/pay",
  protect,
  adminOnly,
  markOrderAsPaid
);

// Delete Order
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteOrder
);

export default router;