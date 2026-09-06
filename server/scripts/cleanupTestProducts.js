import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";

dotenv.config({ path: "./server/.env" });

const testProductNames = [
  "Test Laptop",
  "TechStore Test Product",
  "crypto",
];

try {
  console.log("Connecting to MongoDB...");

  await connectDB();

  const products = await Product.find({
    name: { $in: testProductNames },
  }).select("_id name sku");

  console.log("\nProducts found for deletion:");

  if (products.length === 0) {
    console.log("No matching test products found.");
  } else {
    products.forEach((product) => {
      console.log(
        `- ${product.name} | SKU: ${product.sku} | ID: ${product._id}`
      );
    });

    const result = await Product.deleteMany({
      _id: { $in: products.map((product) => product._id) },
    });

    console.log(`\nDeleted: ${result.deletedCount}`);
  }

  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
} catch (error) {
  console.error("\nCleanup failed:");
  console.error(error);
  await mongoose.connection.close();
  process.exitCode = 1;
}