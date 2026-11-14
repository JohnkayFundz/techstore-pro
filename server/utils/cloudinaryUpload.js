export const uploadBufferToCloudinary = (uploader, buffer, options) =>
  new Promise((resolve, reject) => {
    if (!Buffer.isBuffer(buffer)) {
      reject(new TypeError("Cloudinary upload requires a Buffer."));
      return;
    }

    if (!uploader || typeof uploader.upload_stream !== "function") {
      reject(new TypeError("A Cloudinary upload_stream API is required."));
      return;
    }

    const stream = uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      if (!result?.secure_url || !result?.public_id) {
        reject(new Error("Cloudinary returned an incomplete upload result."));
        return;
      }

      resolve(result);
    });

    stream.once("error", reject);
    stream.end(buffer);
  });
