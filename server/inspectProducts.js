// ==========================================================
// TECHSTORE PRO
// PRODUCT INSPECTOR
// ==========================================================

import dotenv from "dotenv";
import mongoose from "mongoose";

import Product from "./models/Product.js";

// ==========================================================
// LOAD ENVIRONMENT VARIABLES
// ==========================================================

dotenv.config({
  path: "./server/.env",
});

// ==========================================================
// MONGODB CONFIGURATION
// ==========================================================

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(
    "ERROR: MONGODB_URI is not defined in server/.env"
  );
  process.exit(1);
}

// ==========================================================
// INSPECT PRODUCTS
// ==========================================================

const inspectProducts = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB Connected");
    console.log("");

    const products = await Product.find({})
      .sort({ createdAt: 1 })
      .lean();

    console.log("==========================================");
    console.log("       TECHSTORE PRO PRODUCT INSPECTOR");
    console.log("==========================================");
    console.log(`Total products: ${products.length}`);
    console.log("");

    products.forEach((product, index) => {
      console.log(`--- Product ${index + 1} ---`);
      console.log(`Name       : ${product.name}`);
      console.log(`SKU        : ${product.sku}`);
      console.log(`Category   : ${product.category}`);
      console.log(`Brand      : ${product.brand || "N/A"}`);
      console.log(`Price      : ${product.price}`);
      console.log(`Stock      : ${product.stock}`);
      console.log(`Images     : ${product.images?.length || 0}`);

      console.log("Primary Image:");
      console.log(`  ${product.image || "NONE"}`);

      if (
        Array.isArray(product.images) &&
        product.images.length > 0
      ) {
        product.images.forEach((image, imageIndex) => {
          console.log(`  Image ${imageIndex + 1}:`);
          console.log(`    ${image}`);
        });
      } else {
        console.log("  No image collection");
      }

      console.log("");
    });

    console.log("==========================================");
    console.log("           INSPECTION COMPLETE");
    console.log("==========================================");
    console.log(`Total products inspected: ${products.length}`);
    console.log("");
  } catch (error) {
    console.error("");
    console.error("Inspection failed:");
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    console.log("MongoDB connection closed");
  }
};

// ==========================================================
// RUN INSPECTOR
// ==========================================================

inspectProducts();