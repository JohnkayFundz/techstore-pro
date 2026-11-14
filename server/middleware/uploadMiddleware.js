import multer from "multer";

import cloudinary from "../config/cloudinary.js";
import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js";

const uploadOptions = {
  folder: "techstore-products",
  allowed_formats: ["jpg", "jpeg", "png", "webp"],
  resource_type: "image",
  transformation: [
    {
      width: 1200,
      height: 1200,
      crop: "limit",
      quality: "auto",
      fetch_format: "auto",
    },
  ],
};

const parser = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
      return;
    }

    cb(new Error("Only JPG, PNG, and WEBP images are allowed."), false);
  },
}).single("image");

const upload = (req, res, next) => {
  parser(req, res, async (parseError) => {
    if (parseError) {
      next(parseError);
      return;
    }

    if (!req.file) {
      next();
      return;
    }

    try {
      const result = await uploadBufferToCloudinary(
        cloudinary.uploader,
        req.file.buffer,
        uploadOptions
      );

      req.file.path = result.secure_url;
      req.file.filename = result.public_id;
      req.file.size = result.bytes ?? req.file.size;
      req.file.cloudinary = result;
      delete req.file.buffer;

      next();
    } catch (uploadError) {
      next(uploadError);
    }
  });
};

export default upload;
