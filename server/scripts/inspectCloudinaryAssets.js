import cloudinary from "../config/cloudinary.js";

try {
  console.log("==============================================");
  console.log("TECHSTORE PRO - CLOUDINARY ASSET INSPECTION");
  console.log("==============================================");
  console.log("");

  const result = await cloudinary.api.resources({
    type: "upload",
    prefix: "techstore-products",
    max_results: 500,
  });

  console.log(`Found ${result.resources.length} Cloudinary assets`);
  console.log("");

  result.resources.forEach((asset, index) => {
    console.log("==============================================");
    console.log(`ASSET ${index + 1}`);
    console.log("==============================================");

    console.log("Public ID:", asset.public_id);
    console.log("Format:", asset.format);
    console.log("Width:", asset.width);
    console.log("Height:", asset.height);
    console.log("Bytes:", asset.bytes);
    console.log("Created:", asset.created_at);
    console.log("URL:", asset.secure_url);
    console.log("");
  });

  console.log("==============================================");
  console.log("INSPECTION COMPLETE");
  console.log("==============================================");

} catch (error) {
  console.error("==============================================");
  console.error("❌ CLOUDINARY INSPECTION FAILED");
  console.error("==============================================");
  console.error(error.message);
}
