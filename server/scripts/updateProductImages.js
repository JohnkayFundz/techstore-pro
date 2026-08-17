import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config();

/*
==========================================================
TECHSTORE PRO
UPDATE EXISTING PRODUCT IMAGES
==========================================================
*/

const productImages = {
  "MacBook Pro M4 16-inch":
    "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",

  "Dell XPS 15":
    "https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?auto=format&fit=crop&w=1200&q=80",

  "Samsung Galaxy S25":
    "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1200&q=80",

  "iPhone 16 Pro":
    "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1200&q=80",

  "Sony WH-1000XM6 Wireless Headphones":
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",

  "Apple Watch Series 10":
    "https://images.unsplash.com/photo-1546868871-7041f2a55e0c?auto=format&fit=crop&w=1200&q=80",

  "AirPods Pro 2":
    "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1200&q=80",

  "ASUS ROG Strix G16":
    "https://images.unsplash.com/photo-1593640495253-23196b27a87f?auto=format&fit=crop&w=1200&q=80",

  "Logitech MX Master 3S":
    "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80",

  "iPad Pro M4":
    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=80",

  "Samsung Galaxy Watch 7":
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",

  "Anker USB-C 7-in-1 Hub":
    "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=1200&q=80",
};

const updateProductImages = async () => {
  try {
    console.log("==================================================");
    console.log("TECHSTORE PRO - PRODUCT IMAGE UPDATE");
    console.log("==================================================");

await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected");

    let updated = 0;
    let notFound = 0;

    for (const [name, image] of Object.entries(productImages)) {
      const product = await Product.findOne({ name });

      if (!product) {
        console.log(`❌ Product not found: ${name}`);
        notFound++;
        continue;
      }

      product.image = image;
      product.gallery = [image];

      await product.save();

      console.log(`✅ Updated: ${name}`);

      updated++;
    }

    console.log("");
    console.log("==================================================");
    console.log("UPDATE COMPLETE");
    console.log("==================================================");
    console.log(`✅ Updated: ${updated}`);
    console.log(`❌ Not found: ${notFound}`);
    console.log(`📦 Total targeted: ${Object.keys(productImages).length}`);
    console.log("==================================================");

    await mongoose.disconnect();

    console.log("✅ MongoDB Disconnected");

    process.exit(0);
  } catch (error) {
    console.error("");
    console.error("❌ IMAGE UPDATE FAILED");
    console.error(error);

    await mongoose.disconnect();

    process.exit(1);
  }
};

updateProductImages();