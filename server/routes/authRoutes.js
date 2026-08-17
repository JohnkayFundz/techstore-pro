import express from "express";
import rateLimit from "express-rate-limit";

import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many login attempts. Please try again in 15 minutes.",
  },
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many registration attempts. Please try again later.",
  },
});

router.post(
  "/register",
  registerLimiter,
  registerUser
);

router.post(
  "/login",
  loginLimiter,
  loginUser
);

router.post(
  "/logout",
  logoutUser
);

router.get(
  "/me",
  protect,
  getCurrentUser
);

export default router;