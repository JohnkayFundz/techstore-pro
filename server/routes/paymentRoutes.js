import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  initializePayment,
  verifyPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/init", protect, initializePayment);
router.get("/verify/:reference", protect, verifyPayment);

export default router;
