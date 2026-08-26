import cloudinary from "../config/cloudinary.js";

try {
  const result = await cloudinary.api.ping();

  console.log("=================================");
  console.log("✅ CLOUDINARY CONNECTION SUCCESS");
  console.log("=================================");
  console.log(result);
} catch (error) {
  console.error("=================================");
  console.error("❌ CLOUDINARY CONNECTION FAILED");
  console.error("=================================");
  console.error(error);
}