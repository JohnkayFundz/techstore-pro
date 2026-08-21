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


const router = express.Router();


/* ==========================================================
   PUBLIC PRODUCT ROUTES
========================================================== */


/* ----------------------------------------------------------
   SEARCH PRODUCTS
   GET /api/products/search
---------------------------------------------------------- */

router.get(
  "/search",
  searchProducts
);


/* ----------------------------------------------------------
   GET ALL PRODUCTS
   GET /api/products
---------------------------------------------------------- */

router.get(
  "/",
  getProducts
);


/* ----------------------------------------------------------
   GET SINGLE PRODUCT
   GET /api/products/:id
---------------------------------------------------------- */

router.get(
  "/:id",
  getProductById
);


/* ==========================================================
   ADMIN PRODUCT ROUTES
========================================================== */


/* ----------------------------------------------------------
   GET ALL ADMIN PRODUCTS
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
---------------------------------------------------------- */

router.post(
  "/",
  protect,
  adminOnly,
  createProduct
);


/* ----------------------------------------------------------
   UPDATE PRODUCT
   PUT /api/products/:id
   PRIVATE / ADMIN
---------------------------------------------------------- */

router.put(
  "/:id",
  protect,
  adminOnly,
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