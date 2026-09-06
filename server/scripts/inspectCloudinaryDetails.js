// ==========================================================
// TECHSTORE PRO
// CLOUDINARY DETAILED ASSET INSPECTION
// READ-ONLY
// ==========================================================

import cloudinary from "../config/cloudinary.js";

try {
  console.log("==============================================");
  console.log("TECHSTORE PRO - CLOUDINARY DETAILED INSPECTION");
  console.log("==============================================");
  console.log("");

  const result = await cloudinary.api.resources({
    type: "upload",
    prefix: "techstore-products",
    max_results: 500,
  });

  console.log(
    `Found ${result.resources.length} Cloudinary assets`
  );
  console.log("");

  result.resources.forEach((asset, index) => {
    console.log("==============================================");
    console.log(`ASSET ${index + 1}`);
    console.log("==============================================");

    console.log("Public ID:", asset.public_id);
    console.log("Asset ID:", asset.asset_id || "N/A");
    console.log("Resource Type:", asset.resource_type || "N/A");
    console.log("Format:", asset.format || "N/A");
    console.log("Width:", asset.width || "N/A");
    console.log("Height:", asset.height || "N/A");
    console.log("Bytes:", asset.bytes || "N/A");
    console.log("Created:", asset.created_at || "N/A");
    console.log(
      "Original Filename:",
      asset.original_filename || "N/A"
    );
    console.log(
      "Display Name:",
      asset.display_name || "N/A"
    );

    console.log(
      "Tags:",
      asset.tags?.length
        ? asset.tags.join(", ")
        : "None"
    );

    console.log("Context:");

    if (asset.context) {
      console.log(
        JSON.stringify(asset.context, null, 2)
      );
    } else {
      console.log("None");
    }

    console.log("Metadata:");

    if (asset.metadata) {
      console.log(
        JSON.stringify(asset.metadata, null, 2)
      );
    } else {
      console.log("None");
    }

    console.log("URL:", asset.secure_url);
    console.log("");
  });

  console.log("==============================================");
  console.log("DETAILED INSPECTION COMPLETE");
  console.log("==============================================");

} catch (error) {
  console.error("");
  console.error("==============================================");
  console.error("CLOUDINARY INSPECTION FAILED");
  console.error("==============================================");
  console.error(error.message);
  console.error("==============================================");
}