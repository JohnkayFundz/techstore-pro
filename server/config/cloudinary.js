import { v2 as cloudinary } from "cloudinary";

// Silently configure cloudinary with environment variables
// Validation will happen when upload is attempted
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;