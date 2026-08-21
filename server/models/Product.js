// ==========================================================
// TECHSTORE PRO
// PRODUCT MODEL
// ==========================================================

import mongoose from "mongoose";

// ==========================================================
// PRODUCT SCHEMA
// ==========================================================

const productSchema = new mongoose.Schema(
  {
    /* ==========================================================
       BASIC PRODUCT INFORMATION
    ========================================================== */

    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    /* ==========================================================
       PRICING
    ========================================================== */

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    oldPrice: {
      type: Number,
      default: 0,
      min: [0, "Old price cannot be negative"],
    },

    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100"],
    },

    currency: {
      type: String,
      default: "USD",
      trim: true,
      uppercase: true,
    },

    /* ==========================================================
       PRODUCT CLASSIFICATION
    ========================================================== */

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    brand: {
      type: String,
      default: "TechStore Pro",
      trim: true,
    },

    sku: {
      type: String,
      required: [true, "SKU is required"],
      trim: true,
      uppercase: true,
      unique: true,
    },

    /* ==========================================================
       PRODUCT IMAGES
    ========================================================== */

    // Primary product image
    image: {
      type: String,
      default: "",
      trim: true,
    },

    // Additional product images
    images: {
      type: [String],
      default: [],
    },

    /* ==========================================================
       PRODUCT FEATURES
    ========================================================== */

    features: {
      type: [String],
      default: [],
    },

    /* ==========================================================
       INVENTORY
    ========================================================== */

    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },

    /* ==========================================================
       SHIPPING
    ========================================================== */

    shipping: {
      type: String,
      default: "Free shipping",
      trim: true,
    },

    /* ==========================================================
       REVIEWS / RATING
    ========================================================== */

    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be below 0"],
      max: [5, "Rating cannot exceed 5"],
    },

    numReviews: {
      type: Number,
      default: 0,
      min: [0, "Number of reviews cannot be negative"],
    },

    /* ==========================================================
       WARRANTY
    ========================================================== */

    warranty: {
      type: String,
      default: "No warranty",
      trim: true,
    },

    /* ==========================================================
       PRODUCT FLAGS
    ========================================================== */

    featured: {
      type: Boolean,
      default: false,
    },

    bestseller: {
      type: Boolean,
      default: false,
    },

    newArrival: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    /* ==========================================================
       PRODUCT OWNER / CREATOR
    ========================================================== */

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

// ==========================================================
// TEXT SEARCH INDEX
// ==========================================================

productSchema.index({
  name: "text",
  description: "text",
  brand: "text",
  category: "text",
});

// ==========================================================
// PRODUCT MODEL
// ==========================================================

const Product = mongoose.model(
  "Product",
  productSchema
);

export default Product;