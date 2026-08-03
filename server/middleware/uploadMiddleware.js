import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinary from "../config/cloudinary.js";

// Lazy initialization of upload middleware
const createUploadMiddleware = () => {
  // Ensure Cloudinary is configured
  if (!cloudinary.config().api_key) {
    console.log("🔄 Reconfiguring Cloudinary with latest env vars...");
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "techstore-products",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
  });

  return multer({
    storage,

    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB max
    },

    fileFilter: (req, file, cb) => {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new Error("Only JPG, PNG, and WEBP images are allowed"),
          false
        );
      }
    },
  });
};

// Create once and reuse
let uploadInstance = null;

const getUpload = () => {
  if (!uploadInstance) {
    uploadInstance = createUploadMiddleware();
  }
  return uploadInstance;
};

// Export a middleware wrapper that ensures fresh config
export default (req, res, next) => {
  const upload = getUpload();
  upload.single("image")(req, res, next);
};