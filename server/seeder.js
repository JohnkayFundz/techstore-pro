// ==========================================================
// TECHSTORE PRO
// PRODUCT SEEDER
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
// SEED PRODUCTS
//
// This version:
// ✅ Does NOT delete your products
// ✅ Updates products that already exist
// ✅ Creates products that don't exist
// ✅ Prevents duplicate products by name
// ==========================================================

const seedProducts = async () => {
  let createdCount = 0;
  let updatedCount = 0;

  try {
    await connectDB();

    console.log("");
    console.log("==========================================");
    console.log("       TECHSTORE PRO PRODUCT SEEDER");
    console.log("==========================================");
    console.log(`📦 Products received: ${products.length}`);
    console.log("");

    // --------------------------------------------------------
    // VALIDATE PRODUCT DATA
    // --------------------------------------------------------

    if (!Array.isArray(products)) {
      throw new Error(
        "server/data/products.js must export an array of products."
      );
    }

    // --------------------------------------------------------
    // PROCESS EACH PRODUCT
    // --------------------------------------------------------

    for (const product of products) {
      if (!product.name) {
        console.warn(
          "⚠️ Skipping product without a name:",
          product
        );

        continue;
      }

      // ------------------------------------------------------
      // FIND EXISTING PRODUCT
      // ------------------------------------------------------

      const existingProduct = await Product.findOne({
        name: product.name,
      });

      // ------------------------------------------------------
      // UPDATE EXISTING PRODUCT
      // ------------------------------------------------------

      if (existingProduct) {
        await Product.updateOne(
          {
            _id: existingProduct._id,
          },
          {
            $set: product,
          }
        );

        updatedCount++;

        console.log(`🔄 Updated: ${product.name}`);
      }

      // ------------------------------------------------------
      // CREATE NEW PRODUCT
      // ------------------------------------------------------

      else {
        await Product.create(product);

        createdCount++;

        console.log(`🆕 Created: ${product.name}`);
      }
    }

    // ========================================================
    // SEED SUMMARY
    // ========================================================

    console.log("");
    console.log("==========================================");
    console.log("          SEEDING COMPLETE");
    console.log("==========================================");
    console.log(`🆕 Products created : ${createdCount}`);
    console.log(`🔄 Products updated : ${updatedCount}`);
    console.log(`📦 Products total   : ${products.length}`);
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
    console.error(error);
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