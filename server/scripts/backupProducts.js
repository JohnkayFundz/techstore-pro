import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";

dotenv.config({ path: "./server/.env" });

try {
  console.log("Connecting to MongoDB...");

  await connectDB();

  const products = await Product.find({}).lean();

  const backupPath = path.resolve(
    "./server/data/products-backup-clean.json"
  );

  fs.writeFileSync(
    backupPath,
    JSON.stringify(products, null, 2),
    "utf8"
  );

  console.log(`\nBackup created successfully.`);
  console.log(`Products backed up: ${products.length}`);
  console.log(`File: ${backupPath}`);

  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
} catch (error) {
  console.error("\nBackup failed:");
  console.error(error);

  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }

  process.exitCode = 1;
}