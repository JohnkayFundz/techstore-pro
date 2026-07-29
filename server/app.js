import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";


const app = express();


/* ==========================================================
   APP SETTINGS
========================================================== */

// Trust reverse proxy (Render, Railway, Nginx, etc.)
app.set("trust proxy", 1);



/* ==========================================================
   MIDDLEWARE
========================================================== */

// Security Headers
app.use(helmet());


// Enable CORS
app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",
    credentials: true,
  })
);


// Parse JSON
app.use(
  express.json({
    limit: "10mb",
  })
);


// Parse URL Encoded Data
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);


// Parse Cookies
app.use(cookieParser());


// HTTP Request Logger
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}


// Development Request Logger
if (process.env.NODE_ENV === "development") {

  app.use((req, res, next) => {

    console.log(
      `📥 ${req.method} ${req.originalUrl}`
    );

    next();

  });

}



/* ==========================================================
   HOME ROUTE
========================================================== */

app.get("/", (req, res) => {

  res.status(200).json({

    success: true,

    message:
      "🚀 Welcome to TechStore Pro API",

    version: "1.0.0",

    environment:
      process.env.NODE_ENV ||
      "development",

    timestamp:
      new Date().toISOString(),

  });

});



/* ==========================================================
   API INFO
========================================================== */

app.get("/api", (req, res) => {

  res.status(200).json({

    success: true,

    name:
      "TechStore Pro API",

    version:
      "1.0.0",


    endpoints: {

      auth:
        "/api/auth",

      users:
        "/api/users",

      products:
        "/api/products",

      orders:
        "/api/orders",

    },

  });

});



/* ==========================================================
   HEALTH CHECK
========================================================== */

app.get("/health", (req, res) => {

  res.status(200).json({

    success: true,

    status:
      "OK",

    uptime:
      process.uptime(),

    timestamp:
      new Date().toISOString(),

  });

});



/* ==========================================================
   API ROUTES
========================================================== */


// Authentication
app.use(
  "/api/auth",
  authRoutes
);


// Users
app.use(
  "/api/users",
  userRoutes
);


// Products
app.use(
  "/api/products",
  productRoutes
);


// Orders
app.use(
  "/api/orders",
  orderRoutes
);



/* ==========================================================
   INVALID JSON HANDLER
========================================================== */

app.use((err, req, res, next) => {

  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    "body" in err
  ) {

    return res.status(400).json({

      success: false,

      message:
        "Invalid JSON payload.",

    });

  }


  next(err);

});



/* ==========================================================
   404 NOT FOUND
========================================================== */

app.use((req, res) => {

  res.status(404).json({

    success: false,

    message:
      "Route not found",

    path:
      req.originalUrl,

    method:
      req.method,

  });

});



/* ==========================================================
   GLOBAL ERROR HANDLER
========================================================== */

app.use((err, req, res, next) => {

  console.error(
    "================================="
  );

  console.error(
    "❌ Global Error Handler"
  );

  console.error(
    err.stack
  );

  console.error(
    "================================="
  );


  const statusCode =
    err.statusCode ||
    err.status ||
    500;


  res.status(statusCode).json({

    success: false,

    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message ||
          "Something went wrong.",


    ...(process.env.NODE_ENV !== "production" && {

      stack:
        err.stack,

    }),

  });

});



/* ==========================================================
   EXPORT APP
========================================================== */

export default app;