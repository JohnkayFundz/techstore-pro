import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  initializePayment,
  verifyPayment,
  paystackWebhook,
} from "../controllers/paymentController.js";

const router = express.Router();

// The webhook is authenticated by its Paystack HMAC signature, not a user JWT.
router.post("/webhook", paystackWebhook);
router.post("/init", protect, initializePayment);
router.get("/verify/:reference", protect, verifyPayment);

export default router;
