import express from "express";

import {
  getProducts,
  getProductById,
  getAdminProducts,
  getAdminProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
} from "../controllers/productController.js";

import { aiShoppingAssistant } from "../controllers/aiAssistantController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* ==========================================================
   AI SHOPPING ASSISTANT

   POST /api/products/ai/assistant

   PUBLIC

   Must remain before /:id.
========================================================== */

router.post(
  "/ai/assistant",
  aiShoppingAssistant
);

/* ==========================================================
   PUBLIC PRODUCT ROUTES
========================================================== */

router.get("/search", searchProducts);

/* ==========================================================
   ADMIN PRODUCT ROUTES
========================================================== */

router.get(
  "/admin",
  protect,
  adminOnly,
  getAdminProducts
);

router.get(
  "/admin/:id",
  protect,
  adminOnly,
  getAdminProductById
);

router.post(
  "/",
  protect,
  adminOnly,
  upload,
  createProduct
);

router.put(
  "/:id/restore",
  protect,
  adminOnly,
  restoreProduct
);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload,
  updateProduct
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

/* ==========================================================
   PUBLIC PRODUCT ROUTES
========================================================== */

router.get(
  "/",
  getProducts
);

router.get(
  "/:id",
  getProductById
);

export default router;
