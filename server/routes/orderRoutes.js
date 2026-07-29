import express from "express";

import {
  createOrder,
  getMyOrders,
  getAllOrders,
} from "../controllers/orderController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";


const router = express.Router();



router.post(
  "/",
  protect,
  createOrder
);


router.get(
  "/my-orders",
  protect,
  getMyOrders
);


router.get(
  "/",
  protect,
  adminOnly,
  getAllOrders
);



export default router;