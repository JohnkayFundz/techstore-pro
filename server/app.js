import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

/* ==========================================================
   APP SETTINGS
========================================================== */

app.set("trust proxy", 1);

/* ==========================================================
   RATE LIMITERS
========================================================== */

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

/* ==========================================================
   GLOBAL SECURITY MIDDLEWARE
========================================================== */

app.use(helmet());

app.use(compression());

/* ==========================================================
   CORS CONFIGURATION
========================================================== */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header
      // e.g. Postman, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      // Allow explicitly configured origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow Vercel deployments
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      console.log("❌ CORS blocked:", origin);

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
    ],
  })
);

/* ==========================================================
   BODY PARSERS
========================================================== */

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

app.use(cookieParser());

/* ==========================================================
   LOGGING
========================================================== */

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.originalUrl}`);
    next();
  });
}

/* ==========================================================
   API RATE LIMIT
========================================================== */

app.use("/api", apiLimiter);

/* ==========================================================
   HOME ROUTE
========================================================== */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Welcome to TechStore Pro API",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

/* ==========================================================
   API INFORMATION
========================================================== */

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    name: "TechStore Pro API",
    version: "1.0.0",

    endpoints: {
      auth: "/api/auth",
      admin: "/api/admin",
      users: "/api/users",
      products: "/api/products",
      orders: "/api/orders",
      upload: "/api/upload",
    },
  });
});

/* ==========================================================
   HEALTH CHECK
========================================================== */

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/* ==========================================================
   API ROUTES
========================================================== */

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/users", userRoutes);

app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/upload", uploadRoutes);

/* ==========================================================
   INVALID JSON ERROR HANDLER
========================================================== */

app.use((err, req, res, next) => {
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    "body" in err
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload.",
    });
  }

  next(err);
});

/* ==========================================================
   MULTER ERROR HANDLER
========================================================== */

app.use((err, req, res, next) => {
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size exceeds 5MB limit.",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message || "File upload error.",
    });
  }

  if (
    err.message &&
    err.message.includes("Only JPG, PNG")
  ) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next(err);
});

/* ==========================================================
   404 ROUTE
========================================================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    method: req.method,
    path: req.originalUrl,
  });
});

/* ==========================================================
   GLOBAL ERROR HANDLER
========================================================== */

app.use((err, req, res, next) => {
  console.error("=================================");
  console.error("❌ Global Error");
  console.error(err);
  console.error("=================================");

  const statusCode =
    err.statusCode ||
    err.status ||
    500;

  res.status(statusCode).json({
    success: false,

    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message || "Something went wrong.",

    ...(process.env.NODE_ENV !== "production" && {
      stack: err.stack,
    }),
  });
});

/* ==========================================================
   EXPORT APP
========================================================== */

export default app;