// ==========================================================
// TECHSTORE PRO
// CLOUDINARY IMAGE MATCHER
// ==========================================================

import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import path from "path";
import https from "https";
import crypto from "crypto";

// ==========================================================
// LOCAL IMAGE DIRECTORY
// ==========================================================

const imageDir = path.resolve("./cloudinary-preview");

// ==========================================================
// CREATE SHA-256 HASH
// ==========================================================

const sha256 = (buffer) =>
  crypto
    .createHash("sha256")
    .update(buffer)
    .digest("hex");

// ==========================================================
// DOWNLOAD CLOUDINARY IMAGE INTO MEMORY
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

try {
  console.log("==============================================");
  console.log("TECHSTORE PRO - CLOUDINARY IMAGE MATCHER");
  console.log("==============================================");
  console.log("");

  // --------------------------------------------------------
  // CHECK LOCAL DIRECTORY
  // --------------------------------------------------------

  if (!fs.existsSync(imageDir)) {
    throw new Error(
      `Image directory not found: ${imageDir}`
    );
  }

  // --------------------------------------------------------
  // FIND LOCAL IMAGES
  // --------------------------------------------------------

  const localFiles = fs
    .readdirSync(imageDir)
    .filter((file) =>
      /^\d{2}\.(png|jpg|jpeg)$/i.test(file)
    )
    .sort();

  console.log(
    `Local images found: ${localFiles.length}`
  );
  console.log("");

  if (localFiles.length === 0) {
    throw new Error(
      "No numbered images were found in cloudinary-preview."
    );
  }

  // --------------------------------------------------------
  // HASH LOCAL IMAGES
  // --------------------------------------------------------

  const localImages = [];

  for (const filename of localFiles) {
    const filepath = path.join(
      imageDir,
      filename
    );

    const buffer = fs.readFileSync(filepath);

    localImages.push({
      filename,
      size: buffer.length,
      hash: sha256(buffer),
    });
  }

  // --------------------------------------------------------
  // GET CLOUDINARY ASSETS
  // --------------------------------------------------------

  const result =
    await cloudinary.api.resources({
      type: "upload",
      prefix: "techstore-products",
      max_results: 500,
    });

  console.log(
    `Cloudinary assets found: ${result.resources.length}`
  );
  console.log("");

  // --------------------------------------------------------
  // CACHE CLOUDINARY HASHES
  // --------------------------------------------------------

  const cloudinaryImages = [];

  for (let i = 0; i < result.resources.length; i++) {
    const asset = result.resources[i];

    console.log(
      `Checking Cloudinary asset ${i + 1}/${result.resources.length}...`
    );

    const buffer =
      await downloadBuffer(asset.secure_url);

    cloudinaryImages.push({
      asset,
      size: buffer.length,
      hash: sha256(buffer),
    });
  }

  console.log("");
  console.log("==============================================");
  console.log("EXACT IMAGE MATCHES");
  console.log("==============================================");
  console.log("");

  // --------------------------------------------------------
  // MATCH LOCAL FILES TO CLOUDINARY ASSETS
  // --------------------------------------------------------

  let matched = 0;

  for (const local of localImages) {
    const found =
      cloudinaryImages.find(
        (cloudinaryImage) =>
          cloudinaryImage.hash === local.hash
      );

    console.log("----------------------------------------------");
    console.log(`LOCAL FILE: ${local.filename}`);
    console.log(`Local bytes: ${local.size}`);

    if (found) {
      matched++;

      console.log("MATCH: YES");
      console.log(
        `Public ID: ${found.asset.public_id}`
      );
      console.log(
        `Format: ${found.asset.format}`
      );
      console.log(
        `Width: ${found.asset.width}`
      );
      console.log(
        `Height: ${found.asset.height}`
      );
      console.log(
        `Created: ${found.asset.created_at}`
      );
      console.log(
        `URL: ${found.asset.secure_url}`
      );
    } else {
      console.log("MATCH: NOT FOUND");
    }

    console.log("");
  }

  // --------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------

  console.log("==============================================");
  console.log("MATCHING COMPLETE");
  console.log("==============================================");
  console.log(
    `Local images: ${localImages.length}`
  );
  console.log(
    `Cloudinary assets: ${cloudinaryImages.length}`
  );
  console.log(
    `Exact matches: ${matched}`
  );
  console.log(
    `Unmatched local images: ${
      localImages.length - matched
    }`
  );
  console.log("==============================================");

} catch (error) {
  console.error("");
  console.error("==============================================");
  console.error("IMAGE MATCHING FAILED");
  console.error("==============================================");
  console.error(error.message);
  console.error("==============================================");
}