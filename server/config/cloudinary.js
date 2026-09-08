// ==========================================================
// TECHSTORE PRO
// CLOUDINARY CONFIGURATION
// ==========================================================

import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import { fileURLToPath } from "url";

// ==========================================================
// RESOLVE SERVER DIRECTORY
// ==========================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// server/.env
const envPath = path.resolve(__dirname, "../.env");

// ==========================================================
// LOAD ENVIRONMENT VARIABLES
// ==========================================================

dotenv.config({
  path: envPath,
});

// ==========================================================
// READ CLOUDINARY VARIABLES
// ==========================================================

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// ==========================================================
// VALIDATE CONFIGURATION
// ==========================================================

const missingCloudinaryVars = [
  ["CLOUDINARY_CLOUD_NAME", cloudName],
  ["CLOUDINARY_API_KEY", apiKey],
  ["CLOUDINARY_API_SECRET", apiSecret],
]
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missingCloudinaryVars.length > 0) {
  const message = `Missing Cloudinary environment variables: ${missingCloudinaryVars.join(", ")}`;

  if (process.env.NODE_ENV === "production") {
    throw new Error(message);
  }

  console.warn(`⚠️ ${message}`);
}

// ==========================================================
// CONFIGURE CLOUDINARY
// ==========================================================

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

// ==========================================================
// EXPORT
// ==========================================================

export default cloudinary;
