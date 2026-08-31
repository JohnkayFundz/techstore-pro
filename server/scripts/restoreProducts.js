// ==========================================================
// TECHSTORE PRO
// RESTORE PRODUCTS FROM BACKUP
// ==========================================================

import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import Product from "../models/Product.js";

// ==========================================================
// PATHS
// ==========================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverPath = path.resolve(
  __dirname,
  ".."
);

const envPath = path.join(
  serverPath,
  ".env"
);

const backupPath = path.join(
  serverPath,
  "data",
  "products-backup.json"
);

// ==========================================================
// LOAD SERVER/.ENV EXPLICITLY
// ==========================================================

const envResult = dotenv.config({
  path: envPath,
});

if (envResult.error) {
  console.error("");
  console.error("====================================");
  console.error("ENVIRONMENT LOAD FAILED");
  console.error("====================================");
  console.error("");
  console.error(
    `Could not load:\n${envPath}`
  );
  console.error("");
  console.error(envResult.error.message);
  process.exit(1);
}

// ==========================================================
// CONSTANTS
// ==========================================================

const PLACEHOLDER =
  "/placeholder-product.png";

// ==========================================================
// PRODUCTS TO RESTORE
// ==========================================================

const PRODUCT_NAMES = [
  "MacBook Pro M4 16-inch",
  "Dell XPS 15",
  "Samsung Galaxy S25",
  "iPhone 16 Pro",
  "Sony WH-1000XM6 Wireless Headphones",
  "Apple Watch Series 10",
  "AirPods Pro 2",
  "ASUS ROG Strix G16",
  "Logitech MX Master 3S",
  "iPad Pro M4",
  "Samsung Galaxy Watch 7",
  "Anker USB-C 7-in-1 Hub",
];

// ==========================================================
// SKU FALLBACKS
// ==========================================================

const SKU_MAP = {
  "MacBook Pro M4 16-inch":
    "APP-MBP-M4-16",

  "Dell XPS 15":
    "DEL-XPS15-001",

  "Samsung Galaxy S25":
    "SAM-S25-001",

  "iPhone 16 Pro":
    "APP-IP16P-001",

  "Sony WH-1000XM6 Wireless Headphones":
    "SON-WH1000XM6",

  "Apple Watch Series 10":
    "APP-WATCH10-001",

  "AirPods Pro 2":
    "APP-APP2-001",

  "ASUS ROG Strix G16":
    "ASU-ROG-G16",

  "Logitech MX Master 3S":
    "LOG-MX3S-001",

  "iPad Pro M4":
    "APP-IPAD-M4",

  "Samsung Galaxy Watch 7":
    "SAM-WATCH7-001",

  "Anker USB-C 7-in-1 Hub":
    "ANK-USBC7-001",
};

// ==========================================================
// HELPERS
// ==========================================================

const getSku = (product) => {
  const backupSku = String(
    product.sku || ""
  )
    .trim()
    .toUpperCase();

  if (backupSku) {
    return backupSku;
  }

  return SKU_MAP[product.name] || "";
};

// ==========================================================
// CATEGORY NORMALIZATION
// ==========================================================

const getCategory = (product) => {
  if (product.name === "iPad Pro M4") {
    return "Tablets";
  }

  return String(
    product.category || ""
  ).trim();
};

// ==========================================================
// NUMBER HELPER
// ==========================================================

const getNumber = (
  value,
  fallback = 0
) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};

// ==========================================================
// PRODUCT NORMALIZATION
// ==========================================================

const normalizeProduct = (product) => {
  return {
    // ------------------------------------------------------
    // BASIC INFORMATION
    // ------------------------------------------------------

    name: String(
      product.name || ""
    ).trim(),

    description: String(
      product.description || ""
    ).trim(),

    // ------------------------------------------------------
    // PRICING
    // ------------------------------------------------------

    price: getNumber(product.price),

    oldPrice: getNumber(
      product.oldPrice
    ),

    discount: getNumber(
      product.discount
    ),

    currency: String(
      product.currency || "USD"
    )
      .trim()
      .toUpperCase(),

    // ------------------------------------------------------
    // CLASSIFICATION
    // ------------------------------------------------------

    category: getCategory(product),

    brand: String(
      product.brand || "TechStore Pro"
    ).trim(),

    sku: getSku(product),

    // ------------------------------------------------------
    // IMAGES
    // ------------------------------------------------------

    // Do NOT restore old Cloudinary URLs.
    // Every restored product starts with the
    // placeholder image.

    image: PLACEHOLDER,

    images: [
      PLACEHOLDER,
    ],

    // ------------------------------------------------------
    // FEATURES
    // ------------------------------------------------------

    features: Array.isArray(
      product.features
    )
      ? product.features.filter(
          (feature) =>
            typeof feature ===
              "string" &&
            feature.trim()
        )
      : [],

    // ------------------------------------------------------
    // INVENTORY
    // ------------------------------------------------------

    stock: getNumber(
      product.stock
    ),

    // ------------------------------------------------------
    // SHIPPING
    // ------------------------------------------------------

    shipping: String(
      product.shipping ||
        "Free shipping"
    ).trim(),

    // ------------------------------------------------------
    // REVIEWS
    // ------------------------------------------------------

    rating: getNumber(
      product.rating
    ),

    numReviews: getNumber(
      product.numReviews
    ),

    // ------------------------------------------------------
    // WARRANTY
    // ------------------------------------------------------

    warranty: String(
      product.warranty ||
        "No warranty"
    ).trim(),

    // ------------------------------------------------------
    // FLAGS
    // ------------------------------------------------------

    featured: Boolean(
      product.featured
    ),

    bestseller: Boolean(
      product.bestseller
    ),

    newArrival: Boolean(
      product.newArrival
    ),

    isActive:
      product.isActive === undefined
        ? true
        : Boolean(product.isActive),

    // ------------------------------------------------------
    // CREATOR
    // ------------------------------------------------------

    createdBy:
      product.createdBy &&
      mongoose.Types.ObjectId.isValid(
        product.createdBy
      )
        ? product.createdBy
        : null,
  };
};

// ==========================================================
// VALIDATE PRODUCT
// ==========================================================

const validateProduct = (
  product
) => {
  const errors = [];

  if (!product.name) {
    errors.push("name");
  }

  if (!product.description) {
    errors.push("description");
  }

  if (!product.category) {
    errors.push("category");
  }

  if (!product.sku) {
    errors.push("sku");
  }

  if (
    !Number.isFinite(product.price) ||
    product.price < 0
  ) {
    errors.push("price");
  }

  if (
    !Number.isFinite(product.stock) ||
    product.stock < 0
  ) {
    errors.push("stock");
  }

  return errors;
};

// ==========================================================
// MAIN RESTORE
// ==========================================================

const restoreProducts = async () => {
  let connected = false;

  try {
    console.log("");
    console.log(
      "===================================="
    );
    console.log(
      "TECHSTORE PRO - PRODUCT RESTORE"
    );
    console.log(
      "===================================="
    );
    console.log("");

    // ======================================================
    // ENVIRONMENT
    // ======================================================

    console.log("Environment:");
    console.log(envPath);
    console.log("");

    // ------------------------------------------------------
    // IMPORTANT:
    // The project uses MONGODB_URI, not MONGO_URI.
    // ------------------------------------------------------

    const mongoUri =
      process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error(
        "MONGODB_URI is not defined in server/.env"
      );
    }

    console.log(
      "MONGODB_URI detected."
    );

    console.log("");

    // ======================================================
    // BACKUP CHECK
    // ======================================================

    console.log("Backup:");
    console.log(backupPath);
    console.log("");

    if (!fs.existsSync(backupPath)) {
      throw new Error(
        `Backup file not found:\n${backupPath}`
      );
    }

    // ======================================================
    // READ BACKUP
    // ======================================================

    let backupText =
      fs.readFileSync(
        backupPath,
        "utf8"
      );

    // Remove UTF-8 BOM.

    backupText =
      backupText.replace(
        /^\uFEFF/,
        ""
      );

    let backupData;

    try {
      backupData =
        JSON.parse(backupText);
    } catch (error) {
      throw new Error(
        `Invalid JSON in products-backup.json: ${error.message}`
      );
    }

    if (
      !Array.isArray(backupData)
    ) {
      throw new Error(
        "products-backup.json must contain an array."
      );
    }

    console.log(
      `Backup records found: ${backupData.length}`
    );

    // ======================================================
    // SELECT THE 12 PRODUCTS
    // ======================================================

    const selectedProducts =
      PRODUCT_NAMES.map(
        (name) =>
          backupData.find(
            (product) =>
              String(
                product.name || ""
              ).trim() === name
          )
      );

    const missingProducts =
      PRODUCT_NAMES.filter(
        (_, index) =>
          !selectedProducts[index]
      );

    if (
      missingProducts.length > 0
    ) {
      console.log("");

      console.error(
        "Missing products in backup:"
      );

      missingProducts.forEach(
        (name) => {
          console.error(
            `- ${name}`
          );
        }
      );

      throw new Error(
        "Restore stopped because required products are missing."
      );
    }

    console.log(
      `Products selected for restore: ${selectedProducts.length}`
    );

    // ======================================================
    // NORMALIZE
    // ======================================================

    const productsToRestore =
      selectedProducts.map(
        normalizeProduct
      );

    // ======================================================
    // VALIDATE
    // ======================================================

    const invalidProducts =
      productsToRestore
        .map((product) => ({
          product,
          errors:
            validateProduct(
              product
            ),
        }))
        .filter(
          ({ errors }) =>
            errors.length > 0
        );

    if (
      invalidProducts.length > 0
    ) {
      console.log("");

      console.error(
        "Invalid products:"
      );

      invalidProducts.forEach(
        ({ product, errors }) => {
          console.error(
            `- ${product.name || "Unnamed product"}`
          );

          console.error(
            `  Invalid fields: ${errors.join(", ")}`
          );
        }
      );

      throw new Error(
        "Restore stopped because product validation failed."
      );
    }

    // ======================================================
    // CHECK DUPLICATE SKUS
    // ======================================================

    const skuSet = new Set();
    const duplicateSkus = [];

    for (
      const product of
        productsToRestore
    ) {
      if (
        skuSet.has(product.sku)
      ) {
        duplicateSkus.push(
          product.sku
        );
      }

      skuSet.add(product.sku);
    }

    if (
      duplicateSkus.length > 0
    ) {
      throw new Error(
        `Duplicate SKU detected: ${[
          ...new Set(
            duplicateSkus
          ),
        ].join(", ")}`
      );
    }

    // ======================================================
    // CONNECT MONGODB
    // ======================================================

    console.log(
      "Connecting to MongoDB..."
    );

    await mongoose.connect(
      mongoUri
    );

    connected = true;

    console.log(
      "MongoDB Connected"
    );

    console.log("");

    // ======================================================
    // RESTORE PLAN
    // ======================================================

    console.log(
      "===================================="
    );

    console.log(
      "PRODUCTS PREPARED FOR RESTORE"
    );

    console.log(
      "===================================="
    );

    console.log("");

    productsToRestore.forEach(
      (product, index) => {
        console.log(
          `${index + 1}. ${product.name}`
        );

        console.log(
          `   SKU: ${product.sku}`
        );

        console.log(
          `   Category: ${product.category}`
        );

        console.log(
          `   Brand: ${product.brand}`
        );

        console.log(
          `   Price: ${product.price} ${product.currency}`
        );

        console.log(
          `   Stock: ${product.stock}`
        );

        console.log(
          `   Image: ${product.image}`
        );

        console.log("");
      }
    );

    // ======================================================
    // DELETE CURRENT PRODUCTS
    // ======================================================

    console.log(
      "Removing existing products..."
    );

    const deleteResult =
      await Product.deleteMany({});

    console.log(
      `Existing products removed: ${deleteResult.deletedCount}`
    );

    console.log("");

    // ======================================================
    // INSERT CLEAN PRODUCTS
    // ======================================================

    console.log(
      "Inserting restored products..."
    );

    const insertedProducts =
      await Product.insertMany(
        productsToRestore
      );

    console.log(
      `Products restored: ${insertedProducts.length}`
    );

    console.log("");

    // ======================================================
    // VERIFY DATABASE
    // ======================================================

    const restoredProducts =
      await Product.find({})
        .sort({ name: 1 })
        .lean();

    console.log(
      "===================================="
    );

    console.log(
      "RESTORE VERIFICATION"
    );

    console.log(
      "===================================="
    );

    console.log("");

    console.log(
      `Total products: ${restoredProducts.length}`
    );

    // ======================================================
    // IMAGE COUNTS
    // ======================================================

    const placeholderCount =
      restoredProducts.filter(
        (product) =>
          product.image ===
          PLACEHOLDER
      ).length;

    const cloudinaryCount =
      restoredProducts.filter(
        (product) =>
          typeof product.image ===
            "string" &&
          product.image.includes(
            "res.cloudinary.com"
          )
      ).length;

    const localProductImageCount =
      restoredProducts.filter(
        (product) =>
          typeof product.image ===
            "string" &&
          product.image.startsWith(
            "/products/"
          )
      ).length;

    const emptyImageCount =
      restoredProducts.filter(
        (product) =>
          !product.image
      ).length;

    console.log(
      `Placeholder images: ${placeholderCount}`
    );

    console.log(
      `Cloudinary images: ${cloudinaryCount}`
    );

    console.log(
      `Local /products images: ${localProductImageCount}`
    );

    console.log(
      `Empty images: ${emptyImageCount}`
    );

    console.log("");

    // ======================================================
    // PRODUCT VERIFICATION
    // ======================================================

    restoredProducts.forEach(
      (product, index) => {
        console.log(
          `${index + 1}. ${product.name}`
        );

        console.log(
          `   SKU: ${product.sku}`
        );

        console.log(
          `   Category: ${product.category}`
        );

        console.log(
          `   Price: ${product.price} ${product.currency}`
        );

        console.log(
          `   Stock: ${product.stock}`
        );

        console.log(
          `   Image: ${product.image}`
        );

        console.log(
          `   Images: ${JSON.stringify(
            product.images
          )}`
        );

        console.log("");
      }
    );

    // ======================================================
    // FINAL SAFETY CHECKS
    // ======================================================

    if (
      restoredProducts.length !==
      12
    ) {
      throw new Error(
        `Expected 12 products but found ${restoredProducts.length}.`
      );
    }

    if (
      placeholderCount !== 12
    ) {
      throw new Error(
        `Expected 12 placeholder images but found ${placeholderCount}.`
      );
    }

    if (
      cloudinaryCount !== 0
    ) {
      throw new Error(
        "Cloudinary images were unexpectedly restored."
      );
    }

    if (
      localProductImageCount !==
      0
    ) {
      throw new Error(
        "Local product images were unexpectedly restored."
      );
    }

    if (
      emptyImageCount !== 0
    ) {
      throw new Error(
        "One or more products have an empty image."
      );
    }

    // ======================================================
    // SUCCESS
    // ======================================================

    console.log(
      "===================================="
    );

    console.log(
      "PRODUCT RESTORE COMPLETE"
    );

    console.log(
      "===================================="
    );

    console.log("");

    console.log(
      "Database now contains exactly 12 products."
    );

    console.log(
      "All 12 products use /placeholder-product.png."
    );

    console.log(
      "No old Cloudinary images were restored."
    );

    console.log(
      "Old test products were excluded."
    );

    console.log(
      "Missing SKUs were generated."
    );

    console.log(
      "iPad Pro M4 was moved to the Tablets category."
    );

    console.log(
      "You can now upload real product images individually."
    );

    console.log("");
  } catch (error) {
    console.log("");

    console.error(
      "===================================="
    );

    console.error(
      "PRODUCT RESTORE FAILED"
    );

    console.error(
      "===================================="
    );

    console.log("");

    console.error(
      error?.message ||
        "Unknown restore error."
    );

    console.log("");
    
    process.exitCode = 1;
  } finally {
    if (connected) {
      await mongoose.disconnect();

      console.log(
        "MongoDB Disconnected"
      );
    }
  }
};

// ==========================================================
// RUN
// ==========================================================

restoreProducts();