// ==========================================================
// TECHSTORE PRO
// SETTINGS ROUTES
// ==========================================================

import express from "express";

import {
  getSettings,
  updateSettings,
} from "../controllers/settingsController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

// ==========================================================
// ROUTER
// ==========================================================

const router = express.Router();

// ==========================================================
// GET SETTINGS
// ==========================================================
// GET /api/settings
// Public
// ==========================================================

router.get(
  "/",
  getSettings
);

// ==========================================================
// UPDATE SETTINGS
// ==========================================================
// PATCH /api/settings
// Admin only
// ==========================================================

router.patch(
  "/",
  protect,
  adminOnly,
  updateSettings
);

// ==========================================================
// EXPORT
// ==========================================================

export default router;