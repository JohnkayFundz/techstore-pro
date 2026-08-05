import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
} from "../controllers/orderController.js";


import {
  protect,
} from "../middleware/authMiddleware.js";



const router = express.Router();





/* ==========================================================
   USER ORDER ROUTES
========================================================== */



// Create order
// POST /api/orders

router.post(
  "/",
  protect,
  createOrder
);






// Get logged-in user orders
// GET /api/orders/my-orders

router.get(
  "/my-orders",
  protect,
  getMyOrders
);







// Get single order
// GET /api/orders/:id

router.get(
  "/:id",
  protect,
  getOrderById
);






export default router;