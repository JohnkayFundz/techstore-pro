// ==========================================================
// TECHSTORE PRO
// PRODUCT RESET SEEDER
// ==========================================================

import dotenv from "dotenv";
import mongoose from "mongoose";

import Product from "./models/Product.js";
import products from "./data/products.js";

// ==========================================================
// LOAD ENVIRONMENT VARIABLES
// ==========================================================

dotenv.config();

// ==========================================================
// MONGODB CONFIGURATION
// ==========================================================

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in .env");
  process.exit(1);
}

// ==========================================================
// CONNECT TO DATABASE
// ==========================================================

const connectDB = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URI);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);

    process.exit(1);
  }
};

// ==========================================================
// VALIDATE PRODUCT DATA
// ==========================================================

const validateProducts = () => {
  if (!Array.isArray(products)) {
    throw new Error(
      "server/data/products.js must export an array of products."
    );
  }

  if (products.length === 0) {
    throw new Error("Product seed data is empty.");
  }

  const skus = new Set();
  const names = new Set();

  for (const product of products) {
    if (!product.name) {
      throw new Error("Every product must have a name.");
    }

    if (!product.sku) {
      throw new Error(
        `Product "${product.name}" is missing a SKU.`
      );
    }

    // Check duplicate SKU
    if (skus.has(product.sku)) {
      throw new Error(
        `Duplicate SKU found: ${product.sku}`
      );
    }

    skus.add(product.sku);

    // Check duplicate product name
    if (names.has(product.name)) {
      throw new Error(
        `Duplicate product name found: ${product.name}`
      );
    }

    names.add(product.name);
  }

  console.log("✅ Product data validation passed");
};

// ==========================================================
// SEED PRODUCTS
//
// WARNING:
// This deletes ALL existing products before inserting
// the products from server/data/products.js.
//
// Use this during development only.
// ==========================================================

const seedProducts = async () => {
  try {
    await connectDB();

    console.log("");
    console.log("==========================================");
    console.log("       TECHSTORE PRO PRODUCT SEEDER");
    console.log("==========================================");
    console.log("");

    // --------------------------------------------------------
    // VALIDATE SEED DATA
    // --------------------------------------------------------

    validateProducts();

    console.log(`📦 Products to insert: ${products.length}`);
    console.log("");

    // --------------------------------------------------------
    // DELETE EXISTING PRODUCTS
    // --------------------------------------------------------

    console.log("🗑️ Removing existing products...");

    const deleteResult = await Product.deleteMany({});

    console.log(
      `🗑️ Products removed: ${deleteResult.deletedCount}`
    );

    console.log("");

    // --------------------------------------------------------
    // INSERT CLEAN PRODUCT DATA
    // --------------------------------------------------------

    console.log("📥 Inserting clean product data...");

    const insertedProducts = await Product.insertMany(products);

    console.log(
      `✅ Products inserted: ${insertedProducts.length}`
    );

    // --------------------------------------------------------
    // DISPLAY INSERTED PRODUCTS
    // --------------------------------------------------------

    console.log("");

    insertedProducts.forEach((product, index) => {
      console.log(
        `${index + 1}. ${product.name} | ${product.sku}`
      );
    });

    // ========================================================
    // SEED SUMMARY
    // ========================================================

    console.log("");
    console.log("==========================================");
    console.log("          SEEDING COMPLETE");
    console.log("==========================================");
    console.log(
      `🗑️ Products removed : ${deleteResult.deletedCount}`
    );
    console.log(
      `🆕 Products inserted: ${insertedProducts.length}`
    );
    console.log(
      `📦 Database total   : ${insertedProducts.length}`
    );
    console.log("==========================================");
    console.log("");

    // ========================================================
    // CLOSE DATABASE
    // ========================================================

    await mongoose.connection.close();

    console.log("🔌 MongoDB connection closed");
    console.log("✅ Seeder finished successfully");

    process.exit(0);
  } catch (error) {
    console.error("");
    console.error("==========================================");
    console.error("          ❌ SEEDER ERROR");
    console.error("==========================================");
    console.error(error.message);
    console.error("==========================================");

    // --------------------------------------------------------
    // CLOSE DATABASE AFTER ERROR
    // --------------------------------------------------------

    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
      }
    } catch (closeError) {
      console.error(
        "❌ Error closing MongoDB connection:",
        closeError.message
      );
    }

    process.exit(1);
  }
};

// ==========================================================
// RUN SEEDER
// ==========================================================

seedProducts();