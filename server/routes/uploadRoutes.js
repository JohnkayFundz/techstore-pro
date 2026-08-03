import express from "express";

import upload from "../middleware/uploadMiddleware.js";
import { uploadImage } from "../controllers/uploadController.js";
import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  adminOnly,
  upload,
  uploadImage
);

export default router;