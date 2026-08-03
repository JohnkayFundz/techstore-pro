import express from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();


/* ==========================================================
   PUBLIC PRODUCT ROUTES
========================================================== */

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get("/", getProducts);


// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get("/:id", getProductById);



/* ==========================================================
   ADMIN PRODUCT ROUTES
========================================================== */

// @route   POST /api/products
// @desc    Create new product
// @access  Private/Admin
router.post(
  "/",
  protect,
  adminOnly,
  createProduct
);


// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private/Admin
router.put(
  "/:id",
  protect,
  adminOnly,
  updateProduct
);


// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private/Admin
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);


export default router;