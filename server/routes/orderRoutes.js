import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} from "../controllers/orderController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();


/* ==========================================================
   USER ORDER ROUTES
========================================================== */


/* ----------------------------------------------------------
   CREATE ORDER

   POST /api/orders
---------------------------------------------------------- */

router.post(
  "/",
  protect,
  createOrder
);


/* ----------------------------------------------------------
   GET LOGGED-IN USER ORDERS

   GET /api/orders/my-orders
---------------------------------------------------------- */

router.get(
  "/my-orders",
  protect,
  getMyOrders
);


/* ----------------------------------------------------------
   CANCEL MY ORDER

   PATCH /api/orders/:id/cancel
---------------------------------------------------------- */

router.patch(
  "/:id/cancel",
  protect,
  cancelOrder
);


/* ----------------------------------------------------------
   GET SINGLE ORDER

   GET /api/orders/:id
---------------------------------------------------------- */

router.get(
  "/:id",
  protect,
  getOrderById
);


export default router;