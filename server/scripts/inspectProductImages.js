import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";

/* ==========================================================
   LOAD ENVIRONMENT VARIABLES
========================================================== */

dotenv.config({
  path: "./server/.env",
});

/* ==========================================================
   INSPECT PRODUCT IMAGES
========================================================== */

const inspectProductImages = async () => {
  try {
    console.log("====================================");
    console.log("TECHSTORE PRO - PRODUCT IMAGE CHECK");
    console.log("====================================");

    /* --------------------------------------------------------
       CHECK MONGODB URI
    -------------------------------------------------------- */

    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is not defined. Check server/.env."
      );
    }

    /* --------------------------------------------------------
       CONNECT TO MONGODB
    -------------------------------------------------------- */

    await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log("✅ MongoDB Connected");
    console.log("");

    /* --------------------------------------------------------
       GET PRODUCTS
    -------------------------------------------------------- */

    const products =
      await Product.find({})
        .select(
          "name image images gallery sku"
        )
        .sort({
          createdAt: 1,
        })
        .lean();

    console.log(
      `Found ${products.length} products`
    );

    console.log("");

    /* --------------------------------------------------------
       DISPLAY PRODUCTS
    -------------------------------------------------------- */

    products.forEach((product, index) => {
      console.log(
        "===================================="
      );

      console.log(
        `PRODUCT ${index + 1}`
      );

      console.log(
        "===================================="
      );

      console.log(
        "Name:",
        product.name || "N/A"
      );

      console.log(
        "SKU:",
        product.sku || "N/A"
      );

      console.log(
        "Image:",
        product.image || "N/A"
      );

      console.log(
        "Images:"
      );

      console.log(
        JSON.stringify(
          product.images || [],
          null,
          2
        )
      );

      console.log(
        "Gallery:"
      );

      console.log(
        JSON.stringify(
          product.gallery || [],
          null,
          2
        )
      );

      console.log("");
    });

    /* --------------------------------------------------------
       IMAGE TYPE SUMMARY
    -------------------------------------------------------- */

    let cloudinaryCount = 0;
    let localProductCount = 0;
    let placeholderCount = 0;
    let emptyImageCount = 0;
    let otherImageCount = 0;

    products.forEach((product) => {
      const image =
        product.image || "";

      if (!image) {
        emptyImageCount++;
      } else if (
        image.includes(
          "res.cloudinary.com"
        )
      ) {
        cloudinaryCount++;
      } else if (
        image.startsWith(
          "/products/"
        )
      ) {
        localProductCount++;
      } else if (
        image.includes(
          "placeholder-product"
        )
      ) {
        placeholderCount++;
      } else {
        otherImageCount++;
      }
    });

    /* --------------------------------------------------------
       SUMMARY
    -------------------------------------------------------- */

    console.log(
      "===================================="
    );

    console.log(
      "IMAGE STORAGE SUMMARY"
    );

    console.log(
      "===================================="
    );

    console.log(
      `Cloudinary images: ${cloudinaryCount}`
    );

    console.log(
      `Local /products images: ${localProductCount}`
    );

    console.log(
      `Placeholder images: ${placeholderCount}`
    );

    console.log(
      `Empty images: ${emptyImageCount}`
    );

    console.log(
      `Other image URLs: ${otherImageCount}`
    );

    console.log(
      `Total products: ${products.length}`
    );

    console.log(
      "===================================="
    );

    console.log(
      "INSPECTION COMPLETE"
    );

    console.log(
      "===================================="
    );

    /* --------------------------------------------------------
       DISCONNECT
    -------------------------------------------------------- */

    await mongoose.disconnect();

    console.log(
      "✅ MongoDB Disconnected"
    );

    process.exit(0);
  } catch (error) {
    console.error("");

    console.error(
      "===================================="
    );

    console.error(
      "❌ IMAGE INSPECTION FAILED"
    );

    console.error(
      "===================================="
    );

    console.error(
      error.message
    );

    console.error(
      "===================================="
    );

    try {
      await mongoose.disconnect();
    } catch {
      // Ignore disconnect errors
    }

    process.exit(1);
  }
};

/* ==========================================================
   RUN
========================================================== */

inspectProductImages();