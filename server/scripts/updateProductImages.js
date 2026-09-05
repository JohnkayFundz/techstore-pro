import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

// --------------------------------------------------
// Load environment variables
// --------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// IMPORTANT: Your .env uses MONGODB_URI
const MONGO_URI = process.env.MONGODB_URI;

// --------------------------------------------------
// Product images to upload
// --------------------------------------------------
const productImages = [
  {
    sku: "APP-MBP-M4-16",
    file: "macbook-pro-m4.jpg",
  },
  {
    sku: "DEL-XPS15-001",
    file: "dell-xps-15.jpg",
  },
  {
    sku: "SAM-S25-001",
    file: "samsung-galaxy-s25.jpg",
  },
  {
    sku: "APP-IP16P-001",
    file: "iphone-16-pro.jpg",
  },
  {
    sku: "SON-WH1000XM6",
    file: "sony-wh1000xm6.jpg",
  },
  {
    sku: "APP-WATCH10-001",
    file: "apple-watch-series-10.jpg",
  },
  {
    sku: "APP-APP2-001",
    file: "airpods-pro-2.jpg",
  },
  {
    sku: "ASU-ROG-G16",
    file: "asus-rog-strix-g16.jpg",
  },
  {
    sku: "LOG-MX3S-001",
    file: "logitech-mx-master-3s.jpg",
  },
  {
    sku: "APP-IPAD-M4",
    file: "ipad-pro-m4.jpg",
  },
  {
    sku: "SAM-WATCH7-001",
    file: "samsung-galaxy-watch-7.jpg",
  },
  {
    sku: "ANK-USBC7-001",
    file: "anker-usbc-7-in-1.jpg",
  },
];

// --------------------------------------------------
// Local upload directory
// --------------------------------------------------
const uploadsDirectory = path.resolve(
  __dirname,
  "../uploads/products"
);

// --------------------------------------------------
// Validate environment
// --------------------------------------------------
if (!MONGO_URI) {
  console.error("❌ MONGODB_URI is missing from server/.env");
  process.exit(1);
}

// --------------------------------------------------
// Validate local image files BEFORE touching database
// --------------------------------------------------
console.log("\n🔍 Checking local image files...\n");

const missingFiles = [];

for (const item of productImages) {
  const filePath = path.join(uploadsDirectory, item.file);

  if (!fs.existsSync(filePath)) {
    missingFiles.push(item.file);
    console.log(`❌ Missing: ${item.file}`);
  } else {
    const stats = fs.statSync(filePath);

    console.log(
      `✓ ${item.file} (${Math.round(stats.size / 1024)} KB)`
    );
  }
}

if (missingFiles.length > 0) {
  console.error(
    `\n❌ ${missingFiles.length} image file(s) are missing.`
  );
  console.error("Fix the missing files before running the upload.\n");
  process.exit(1);
}

console.log("\n✅ All 12 image files are present.\n");

// --------------------------------------------------
// Upload helper
// --------------------------------------------------
const uploadImage = async (filePath, sku) => {
  return cloudinary.uploader.upload(filePath, {
    folder: "techstore-products",
    public_id: sku.toLowerCase(),
    overwrite: true,
    resource_type: "image",
  });
};

// --------------------------------------------------
// Main
// --------------------------------------------------
const updateProductImages = async () => {
  let updated = 0;
  let notFound = 0;
  let failed = 0;

  try {
    // ----------------------------------------------
    // Connect to MongoDB
    // ----------------------------------------------
    console.log("🔌 Connecting to MongoDB...");

    await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB Connected\n");

    // ----------------------------------------------
    // Process every image
    // ----------------------------------------------
    for (const item of productImages) {
      console.log("--------------------------------------------------");
      console.log(`📦 Processing: ${item.sku}`);
      console.log(`🖼️  File: ${item.file}`);

      try {
        const filePath = path.join(
          uploadsDirectory,
          item.file
        );

        // ------------------------------------------
        // Find product by SKU
        // ------------------------------------------
        const product = await Product.findOne({
          sku: item.sku,
        });

        if (!product) {
          console.log(`⚠️ Product not found: ${item.sku}`);
          notFound++;
          continue;
        }

        console.log(`✓ Product found: ${product.name}`);

        // ------------------------------------------
        // Upload image to Cloudinary
        // ------------------------------------------
        console.log("☁️ Uploading to Cloudinary...");

        const result = await uploadImage(
          filePath,
          item.sku
        );

        console.log("✅ Cloudinary upload successful");
        console.log(`🔗 Image URL: ${result.secure_url}`);

        // ------------------------------------------
        // Update MongoDB product
        // ------------------------------------------
        product.image = result.secure_url;
        product.images = [result.secure_url];

        await product.save();

        console.log("✅ MongoDB product updated");

        updated++;
      } catch (error) {
        failed++;

        console.error(
          `❌ Failed: ${item.sku}`
        );

        console.error(
          error?.message || error
        );
      }
    }

    // ----------------------------------------------
    // Summary
    // ----------------------------------------------
    console.log("\n==================================================");
    console.log("📊 IMAGE UPDATE SUMMARY");
    console.log("==================================================");

    console.log(`Updated:   ${updated}`);
    console.log(`Not found: ${notFound}`);
    console.log(`Failed:    ${failed}`);

    console.log("==================================================\n");

    if (failed === 0 && notFound === 0) {
      console.log(
        "🎉 All 12 product images were uploaded successfully!"
      );
    } else {
      console.log(
        "⚠️ Upload completed with some issues. Review the output above."
      );
    }
  } catch (error) {
    console.error("\n❌ Script failed:");
    console.error(error?.message || error);
  } finally {
    // ----------------------------------------------
    // Close MongoDB connection
    // ----------------------------------------------
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log("\n🔌 MongoDB connection closed.");
    }
  }
};

// --------------------------------------------------
// Run script
// --------------------------------------------------
updateProductImages();