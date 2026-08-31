// ==========================================================
// TECHSTORE PRO
// CLOUDINARY VISUAL CATALOG
// ==========================================================

import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import path from "path";

const outputFile = path.resolve(
  "./cloudinary-preview-assets/cloudinary-catalog.html"
);

const createCatalog = async () => {
  try {
    console.log("==============================================");
    console.log("TECHSTORE PRO - CLOUDINARY VISUAL CATALOG");
    console.log("==============================================");
    console.log("");

    const result =
      await cloudinary.api.resources({
        type: "upload",
        prefix: "techstore-products",
        max_results: 500,
      });

    const assets = result.resources;

    const cards = assets
      .map(
        (asset, index) => `
        <div class="card">
          <img src="${asset.secure_url}" alt="Asset ${index + 1}" />

          <div class="info">
            <h2>Asset ${index + 1}</h2>

            <p>
              <strong>Public ID:</strong><br>
              ${asset.public_id}
            </p>

            <p>
              <strong>Format:</strong>
              ${asset.format}
            </p>

            <p>
              <strong>Dimensions:</strong>
              ${asset.width} × ${asset.height}
            </p>

            <p>
              <strong>Bytes:</strong>
              ${asset.bytes}
            </p>

            <p>
              <strong>Created:</strong>
              ${asset.created_at}
            </p>

            <p class="url">
              ${asset.secure_url}
            </p>
          </div>
        </div>
      `
      )
      .join("\n");

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>TechStore Pro - Cloudinary Catalog</title>

<style>

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 30px;
  font-family: Arial, sans-serif;
  background: #f4f4f4;
  color: #222;
}

header {
  max-width: 1400px;
  margin: 0 auto 30px;
}

h1 {
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
}

.grid {
  max-width: 1400px;
  margin: auto;

  display: grid;

  grid-template-columns:
    repeat(auto-fit, minmax(360px, 1fr));

  gap: 25px;
}

.card {
  background: white;

  border-radius: 12px;

  overflow: hidden;

  box-shadow:
    0 3px 12px rgba(0, 0, 0, 0.12);
}

.card img {
  display: block;

  width: 100%;

  height: 300px;

  object-fit: contain;

  background: #eee;
}

.info {
  padding: 18px;
}

.info h2 {
  margin-top: 0;
}

.info p {
  line-height: 1.45;

  word-break: break-word;
}

.url {
  font-size: 12px;

  color: #555;

  background: #f5f5f5;

  padding: 10px;

  border-radius: 6px;
}

</style>

</head>

<body>

<header>

<h1>TechStore Pro — Cloudinary Assets</h1>

<p class="subtitle">
${assets.length} Cloudinary assets found
</p>

</header>

<div class="grid">

${cards}

</div>

</body>
</html>
`;

    fs.writeFileSync(
      outputFile,
      html,
      "utf8"
    );

    console.log(
      `Created catalog with ${assets.length} assets.`
    );

    console.log("");
    console.log("File:");
    console.log(outputFile);

    console.log("");
    console.log("==============================================");
    console.log("CATALOG CREATED");
    console.log("==============================================");

  } catch (error) {
    console.error("");
    console.error("CATALOG CREATION FAILED");
    console.error(error.message);

    process.exit(1);
  }
};

createCatalog();