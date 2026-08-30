// ==========================================================
// TECHSTORE PRO
// SAFE PRODUCT SEEDER
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
  console.error("ERROR: MONGODB_URI is not defined in .env");
  process.exit(1);
}

// ==========================================================
// CONNECT TO DATABASE
// ==========================================================

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed");
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

    const normalizedSku = product.sku.trim().toUpperCase();

    if (skus.has(normalizedSku)) {
      throw new Error(
        `Duplicate SKU found: ${normalizedSku}`
      );
    }

    skus.add(normalizedSku);

    const normalizedName = product.name.trim().toLowerCase();

    if (names.has(normalizedName)) {
      throw new Error(
        `Duplicate product name found: ${product.name}`
      );
    }

    names.add(normalizedName);
  }

  console.log("Product data validation passed");
};

// ==========================================================
// CHECK WHETHER AN IMAGE IS A CLOUDINARY IMAGE
// ==========================================================

const isCloudinaryImage = (image) => {
  if (!image || typeof image !== "string") {
    return false;
  }

  return image.includes("cloudinary.com");
};

// ==========================================================
// UPDATE EXISTING PRODUCT SAFELY
//
// Important:
// - Product is matched by SKU.
// - Existing Cloudinary images are preserved.
// - Stock/rating/review counts are preserved.
// - Manually created products are untouched.
// ==========================================================

const updateExistingProduct = async (existingProduct, seedProduct) => {
  const updateData = {
    name: seedProduct.name,
    description: seedProduct.description,
    price: seedProduct.price,
    oldPrice: seedProduct.oldPrice,
    discount: seedProduct.discount,
    currency: seedProduct.currency,
    category: seedProduct.category,
    brand: seedProduct.brand,
    shipping: seedProduct.shipping,
    warranty: seedProduct.warranty,
    features: seedProduct.features,
    featured: seedProduct.featured,
    bestseller: seedProduct.bestseller,
    newArrival: seedProduct.newArrival,
  };

  // --------------------------------------------------------
  // PRESERVE EXISTING CLOUDINARY PRIMARY IMAGE
  // --------------------------------------------------------

  if (
    existingProduct.image &&
    isCloudinaryImage(existingProduct.image)
  ) {
    updateData.image = existingProduct.image;
  } else {
    updateData.image = seedProduct.image;
  }

  // --------------------------------------------------------
  // PRESERVE EXISTING CLOUDINARY IMAGE COLLECTION
  // --------------------------------------------------------

  const existingImages = Array.isArray(existingProduct.images)
    ? existingProduct.images
    : [];

  const hasCloudinaryImages = existingImages.some(
    isCloudinaryImage
  );

  if (hasCloudinaryImages) {
    updateData.images = existingImages;
  } else {
    updateData.images = seedProduct.images;
  }

  await Product.updateOne(
    { sku: existingProduct.sku },
    { $set: updateData }
  );
};

// ==========================================================
// SEED PRODUCTS
//
// SAFE MODE:
// - Does NOT delete existing products.
// - Creates missing seed products.
// - Updates existing seed products by SKU.
// - Preserves Cloudinary images.
// - Leaves manually-created products untouched.
// ==========================================================

const seedProducts = async () => {
  try {
    await connectDB();

    console.log("");
    console.log("==========================================");
    console.log("       TECHSTORE PRO SAFE SEEDER");
    console.log("==========================================");
    console.log("");

    // --------------------------------------------------------
    // VALIDATE SEED DATA
    // --------------------------------------------------------

    validateProducts();

    console.log(`Products in seed file: ${products.length}`);
    console.log("");

    // --------------------------------------------------------
    // PROCESS PRODUCTS
    // --------------------------------------------------------

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const seedProduct of products) {
      const normalizedSku = seedProduct.sku
        .trim()
        .toUpperCase();

      const existingProduct = await Product.findOne({
        sku: normalizedSku,
      });

      // ------------------------------------------------------
      // CREATE NEW PRODUCT
      // ------------------------------------------------------

      if (!existingProduct) {
        await Product.create({
          ...seedProduct,
          sku: normalizedSku,
        });

        createdCount++;

        console.log(
          `CREATED: ${seedProduct.name} | ${normalizedSku}`
        );

        continue;
      }

      // ------------------------------------------------------
      // UPDATE EXISTING SEED PRODUCT
      // ------------------------------------------------------

      await updateExistingProduct(
        existingProduct,
        seedProduct
      );

      updatedCount++;

      console.log(
        `UPDATED: ${seedProduct.name} | ${normalizedSku}`
      );
    }

    // --------------------------------------------------------
    // COUNT DATABASE PRODUCTS
    // --------------------------------------------------------

    const databaseTotal = await Product.countDocuments();

    // --------------------------------------------------------
    // SUMMARY
    // --------------------------------------------------------

    console.log("");
    console.log("==========================================");
    console.log("          SEEDING COMPLETE");
    console.log("==========================================");
    console.log(`Seed products       : ${products.length}`);
    console.log(`Products created    : ${createdCount}`);
    console.log(`Products updated    : ${updatedCount}`);
    console.log(`Products skipped    : ${skippedCount}`);
    console.log(`Database total      : ${databaseTotal}`);
    console.log("==========================================");
    console.log("");
    console.log("Existing products were NOT deleted.");
    console.log("Existing Cloudinary images were preserved.");
    console.log("Manually-created products were preserved.");
    console.log("");

    // --------------------------------------------------------
    // CLOSE DATABASE
    // --------------------------------------------------------

    await mongoose.connection.close();

    console.log("MongoDB connection closed");
    console.log("Seeder finished successfully");

    process.exit(0);
  } catch (error) {
    console.error("");
    console.error("==========================================");
    console.error("          SEEDER ERROR");
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
        "Error closing MongoDB connection:",
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