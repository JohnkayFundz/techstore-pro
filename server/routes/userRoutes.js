import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getDashboard } from "../controllers/userController.js";

const router = express.Router();

// User Profile
router.get("/profile", protect, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// Dashboard
router.get("/dashboard", protect, getDashboard);

export default router;