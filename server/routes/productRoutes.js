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
---------------------------------------------------------- */

router.get(
  "/search",
  searchProducts
);


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
---------------------------------------------------------- */

router.get(
  "/:id",
  getProductById
);


/* ==========================================================
   ADMIN PRODUCT ROUTES
========================================================== */


/* ----------------------------------------------------------
   GET ALL PRODUCTS
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
   GET ADMIN PRODUCT BY ID
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

   IMAGE:
   FormData → Multer → Cloudinary
---------------------------------------------------------- */

router.post(
  "/",
  protect,
  adminOnly,
  upload,
  createProduct
);


/* ----------------------------------------------------------
   UPDATE PRODUCT
   PUT /api/products/:id
   PRIVATE / ADMIN

   IMAGE:
   FormData → Multer → Cloudinary

   IMPORTANT:
   The upload middleware is required here so that
   updateProduct() can access req.file.
---------------------------------------------------------- */

router.put(
  "/:id",
  protect,
  adminOnly,
  upload,
  updateProduct
);


/* ----------------------------------------------------------
   RESTORE PRODUCT
   PUT /api/products/:id/restore
   PRIVATE / ADMIN
---------------------------------------------------------- */

router.put(
  "/:id/restore",
  protect,
  adminOnly,
  restoreProduct
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


export default router;