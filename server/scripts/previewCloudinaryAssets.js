// ==========================================================
// TECHSTORE PRO
// CLOUDINARY ASSET VISUAL PREVIEW
// ==========================================================

import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import path from "path";
import https from "https";

// ==========================================================
// CONFIGURATION
// ==========================================================

const outputDir = path.resolve("./cloudinary-preview-assets");

// ==========================================================
// DOWNLOAD IMAGE
// ==========================================================

const downloadBuffer = (url) =>
  new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(
            new Error(
              `HTTP ${response.statusCode} for ${url}`
            )
          );

          response.resume();
          return;
        }

        const chunks = [];

        response.on("data", (chunk) => {
          chunks.push(chunk);
        });

        response.on("end", () => {
          resolve(Buffer.concat(chunks));
        });

        response.on("error", reject);
      })
      .on("error", reject);
  });

// ==========================================================
// MAIN
// ==========================================================

const previewCloudinaryAssets = async () => {
  try {
    console.log("==============================================");
    console.log("TECHSTORE PRO - CLOUDINARY ASSET PREVIEW");
    console.log("==============================================");
    console.log("");

    // ------------------------------------------------------
    // CREATE OUTPUT DIRECTORY
    // ------------------------------------------------------

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, {
        recursive: true,
      });
    }

    // ------------------------------------------------------
    // GET CLOUDINARY ASSETS
    // ------------------------------------------------------

    const result =
      await cloudinary.api.resources({
        type: "upload",
        prefix: "techstore-products",
        max_results: 500,
      });

    console.log(
      `Found ${result.resources.length} Cloudinary assets`
    );

    console.log("");

    // ------------------------------------------------------
    // DOWNLOAD EACH ASSET
    // ------------------------------------------------------

    for (let i = 0; i < result.resources.length; i++) {
      const asset = result.resources[i];

      const extension =
        asset.format || "jpg";

      const filename =
        `${String(i + 1).padStart(2, "0")}-${asset.public_id
          .split("/")
          .pop()}.${extension}`;

      const filepath =
        path.join(outputDir, filename);

      console.log(
        `Downloading ${i + 1}/${result.resources.length}: ${asset.public_id}`
      );

      const buffer =
        await downloadBuffer(asset.secure_url);

      fs.writeFileSync(
        filepath,
        buffer
      );

      // ----------------------------------------------------
      // SAVE METADATA
      // ----------------------------------------------------

      const metadataFile =
        path.join(
          outputDir,
          `${String(i + 1).padStart(2, "0")}-metadata.txt`
        );

      fs.writeFileSync(
        metadataFile,
        [
          `Asset: ${i + 1}`,
          `Public ID: ${asset.public_id}`,
          `Asset ID: ${asset.asset_id}`,
          `Format: ${asset.format}`,
          `Width: ${asset.width}`,
          `Height: ${asset.height}`,
          `Bytes: ${asset.bytes}`,
          `Created: ${asset.created_at}`,
          `URL: ${asset.secure_url}`,
        ].join("\n")
      );
    }

    // ------------------------------------------------------
    // SAVE COMPLETE MAPPING
    // ------------------------------------------------------

    const mapping = result.resources.map(
      (asset, index) => ({
        number: index + 1,
        publicId: asset.public_id,
        assetId: asset.asset_id,
        format: asset.format,
        width: asset.width,
        height: asset.height,
        bytes: asset.bytes,
        createdAt: asset.created_at,
        url: asset.secure_url,
      })
    );

    fs.writeFileSync(
      path.join(
        outputDir,
        "cloudinary-assets.json"
      ),
      JSON.stringify(
        mapping,
        null,
        2
      )
    );

    // ------------------------------------------------------
    // COMPLETE
    // ------------------------------------------------------

    console.log("");
    console.log("==============================================");
    console.log("PREVIEW COMPLETE");
    console.log("==============================================");
    console.log(
      `Assets downloaded: ${result.resources.length}`
    );
    console.log(
      `Output directory: ${outputDir}`
    );
    console.log("==============================================");

  } catch (error) {
    console.error("");
    console.error("==============================================");
    console.error("CLOUDINARY PREVIEW FAILED");
    console.error("==============================================");
    console.error(error.message);
    console.error("==============================================");

    process.exit(1);
  }
};

// ==========================================================
// RUN
// ==========================================================

previewCloudinaryAssets();