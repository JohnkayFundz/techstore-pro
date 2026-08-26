import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

/* ==========================================================
   LOAD ENVIRONMENT VARIABLES
========================================================== */

dotenv.config({
  path: "./.env",
});

/* ==========================================================
   VALIDATE CLOUDINARY CONFIGURATION
========================================================== */

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName) {
  console.error(
    "❌ CLOUDINARY_CLOUD_NAME is missing."
  );
}

if (!apiKey) {
  console.error(
    "❌ CLOUDINARY_API_KEY is missing."
  );
}

if (!apiSecret) {
  console.error(
    "❌ CLOUDINARY_API_SECRET is missing."
  );
}

/* ==========================================================
   CONFIGURE CLOUDINARY
========================================================== */

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

/* ==========================================================
   EXPORT
========================================================== */

export default cloudinary;