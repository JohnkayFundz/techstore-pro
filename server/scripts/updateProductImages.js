import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";

// ==========================================================
// LOAD SERVER ENVIRONMENT VARIABLES
// ==========================================================

dotenv.config({ path: "./server/.env" });

// ==========================================================
// TECHSTORE PRO
// UPDATE EXISTING PRODUCT IMAGES
// ==========================================================

const productImages = {
  "MacBook Pro M4 16-inch": "/products/macbook-pro-m4.jpg",

  "Dell XPS 15": "/products/dell-xps-15.jpg",

  "Samsung Galaxy S25": "/products/galaxy-s25.jpg",

  "iPhone 16 Pro": "/products/iphone-16-pro.jpg",

  "Sony WH-1000XM6 Wireless Headphones":
    "/products/sony-wh1000xm6.jpg",

  "Apple Watch Series 10":
    "/products/apple-watch-series-10.jpg",

  "AirPods Pro 2":
    "/products/airpods-pro-2.jpg",

  "ASUS ROG Strix G16":
    "/products/asus-rog-strix-g16.jpg",

  "Logitech MX Master 3S":
    "/products/logitech-mx-master-3s.jpg",

  "iPad Pro M4":
    "/products/ipad-pro-m4.jpg",

  "Samsung Galaxy Watch 7":
    "/products/galaxy-watch-7.jpg",

  "Anker USB-C 7-in-1 Hub":
    "/products/anker-usbc-hub.jpg",
};

// ==========================================================
// UPDATE PRODUCT IMAGES
// ==========================================================

const updateProductImages = async () => {
  try {
    console.log("==================================================");
    console.log("TECHSTORE PRO - PRODUCT IMAGE UPDATE");
    console.log("==================================================");

    // ------------------------------------------------------
    // CHECK MONGODB URI
    // ------------------------------------------------------

    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is not defined. Check server/.env."
      );
    }

    // ------------------------------------------------------
    // CONNECT TO MONGODB
    // ------------------------------------------------------

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected");

    // ------------------------------------------------------
    // UPDATE PRODUCTS
    // ------------------------------------------------------

    let updated = 0;
    let notFound = 0;

    for (const [name, image] of Object.entries(productImages)) {
      const product = await Product.findOne({ name });

      if (!product) {
        console.log(`Product not found: ${name}`);
        notFound++;
        continue;
      }

      // Main product image
      product.image = image;

      // Product gallery/images
      product.images = [image];

      await product.save();

      console.log(`Updated: ${name}`);
      console.log(`   Image: ${image}`);

      updated++;
    }

    // ------------------------------------------------------
    // SUMMARY
    // ------------------------------------------------------

    console.log("");
    console.log("==================================================");
    console.log("UPDATE COMPLETE");
    console.log("==================================================");
    console.log(`Updated: ${updated}`);
    console.log(`Not found: ${notFound}`);
    console.log(
      `Total targeted: ${Object.keys(productImages).length}`
    );
    console.log("==================================================");

    // ------------------------------------------------------
    // DISCONNECT
    // ------------------------------------------------------

    await mongoose.disconnect();

    console.log("MongoDB Disconnected");

    process.exit(0);
  } catch (error) {
    console.error("");
    console.error("==================================================");
    console.error("IMAGE UPDATE FAILED");
    console.error("==================================================");
    console.error(error.message);
    console.error("==================================================");

    try {
      await mongoose.disconnect();
    } catch {
      // Ignore disconnect errors
    }

    process.exit(1);
  }
};

// ==========================================================
// RUN SCRIPT
// ==========================================================

updateProductImages();