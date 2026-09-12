import express from "express";
import rateLimit from "express-rate-limit";

import { aiShoppingAssistant } from "../controllers/aiAssistantController.js";

const router = express.Router();

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many AI requests. Please try again later.",
  },
});

router.post("/assistant", aiLimiter, aiShoppingAssistant);

export default router;
