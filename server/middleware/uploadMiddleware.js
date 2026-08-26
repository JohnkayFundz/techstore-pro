import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinary from "../config/cloudinary.js";

/* ==========================================================
   CLOUDINARY UPLOAD STORAGE
========================================================== */

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => ({
    folder: "techstore-products",

    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ],

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
  }),
});

/* ==========================================================
   MULTER
========================================================== */

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, PNG, and WEBP images are allowed."
        ),
        false
      );
    }
  },
});

export default upload.single("image");