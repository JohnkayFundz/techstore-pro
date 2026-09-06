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

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* ==========================================================
   PUBLIC PRODUCT ROUTES
========================================================== */

/* ----------------------------------------------------------
   SEARCH PRODUCTS

   GET /api/products/search

   PUBLIC

   IMPORTANT:
   Must come BEFORE /:id
---------------------------------------------------------- */

router.get("/search", searchProducts);


/* ==========================================================
   ADMIN PRODUCT ROUTES
========================================================== */

/* ----------------------------------------------------------
   GET ALL PRODUCTS — ADMIN

   GET /api/products/admin

   PRIVATE / ADMIN
---------------------------------------------------------- */

router.get(
  "/admin",
  protect,
  adminOnly,
  getAdminProducts
);


/* ----------------------------------------------------------
   GET SINGLE PRODUCT — ADMIN

   GET /api/products/admin/:id

   PRIVATE / ADMIN
---------------------------------------------------------- */

router.get(
  "/admin/:id",
  protect,
  adminOnly,
  getAdminProductById
);


/* ----------------------------------------------------------
   CREATE PRODUCT

   POST /api/products

   PRIVATE / ADMIN

   FormData
   ↓
   Multer
   ↓
   Cloudinary
---------------------------------------------------------- */

router.post(
  "/",
  protect,
  adminOnly,
  upload,
  createProduct
);


/* ----------------------------------------------------------
   RESTORE PRODUCT

   PUT /api/products/:id/restore

   PRIVATE / ADMIN

   IMPORTANT:
   Must come BEFORE /:id
---------------------------------------------------------- */

router.put(
  "/:id/restore",
  protect,
  adminOnly,
  restoreProduct
);


/* ----------------------------------------------------------
   UPDATE PRODUCT

   PUT /api/products/:id

   PRIVATE / ADMIN

   FormData
   ↓
   Multer
   ↓
   Cloudinary

   upload middleware is required because
   updateProduct() may access req.file.
---------------------------------------------------------- */

router.put(
  "/:id",
  protect,
  adminOnly,
  upload,
  updateProduct
);


/* ----------------------------------------------------------
   DELETE PRODUCT

   DELETE /api/products/:id

   PRIVATE / ADMIN

   SOFT DELETE
---------------------------------------------------------- */

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);


/* ==========================================================
   PUBLIC PRODUCT ROUTES
========================================================== */

/* ----------------------------------------------------------
   GET ALL ACTIVE PRODUCTS

   GET /api/products

   PUBLIC
---------------------------------------------------------- */

router.get(
  "/",
  getProducts
);


/* ----------------------------------------------------------
   GET SINGLE ACTIVE PRODUCT

   GET /api/products/:id

   PUBLIC

   IMPORTANT:
   This MUST remain the LAST GET route.
---------------------------------------------------------- */

router.get(
  "/:id",
  getProductById
);


/* ==========================================================
   EXPORT ROUTER
========================================================== */

export default router;