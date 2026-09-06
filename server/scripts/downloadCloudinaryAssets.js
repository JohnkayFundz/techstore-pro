import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import path from "path";
import https from "https";

const outputDir = path.resolve("../cloudinary-preview");

const download = (url, filepath) =>
  new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        file.close();
        try {
          fs.unlinkSync(filepath);
        } catch {}

        reject(
          new Error(`HTTP ${response.statusCode} for ${url}`)
        );

        return;
      }

      response.pipe(file);

      file.on("finish", () => {
        file.close(resolve);
      });
    }).on("error", (error) => {
      file.close();

      try {
        fs.unlinkSync(filepath);
      } catch {}

      reject(error);
    });
  });

try {
  console.log("==============================================");
  console.log("DOWNLOADING CLOUDINARY PRODUCT ASSETS");
  console.log("==============================================");
  console.log("");

  fs.mkdirSync(outputDir, { recursive: true });

  const result = await cloudinary.api.resources({
    type: "upload",
    prefix: "techstore-products",
    max_results: 500,
  });

  console.log(`Found ${result.resources.length} assets`);
  console.log("");

  for (let i = 0; i < result.resources.length; i++) {
    const asset = result.resources[i];

    const extension = asset.format || "jpg";

    const publicId =
      asset.public_id.split("/").pop();

    const filename =
      `${String(i + 1).padStart(2, "0")}-${publicId}.${extension}`;

    const filepath =
      path.join(outputDir, filename);

    console.log(
      `Downloading ${i + 1}/${result.resources.length}: ${filename}`
    );

    await download(
      asset.secure_url,
      filepath
    );
  }

  console.log("");
  console.log("==============================================");
  console.log("DOWNLOAD COMPLETE");
  console.log("==============================================");
  console.log(`Files saved to: ${outputDir}`);
  console.log("");

} catch (error) {
  console.error("");
  console.error("==============================================");
  console.error("❌ DOWNLOAD FAILED");
  console.error("==============================================");
  console.error(error.message);
}
