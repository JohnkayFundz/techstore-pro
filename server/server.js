import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

import app from "./app.js";

/* ==========================================================
   CONFIG
========================================================== */

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

/* ==========================================================
   VALIDATE ENVIRONMENT VARIABLES
========================================================== */

if (!MONGO_URI) {
  console.error("❌ MONGODB_URI is missing in the .env file.");
  process.exit(1);
}

/* ==========================================================
   DATABASE CONNECTION
========================================================== */

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);
    process.exit(1);
  }
};

/* ==========================================================
   START SERVER
========================================================== */

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log("====================================");
      console.log(
        `🚀 Server running in ${
          process.env.NODE_ENV || "development"
        } mode`
      );
      console.log(`🌍 http://localhost:${PORT}`);
      console.log("====================================");
    });

    /* ==========================================================
       GRACEFUL SHUTDOWN
    ========================================================== */

    const shutdown = async () => {
      console.log("\n🛑 Shutting down server...");

      server.close(async () => {
        await mongoose.connection.close();

        console.log("✅ MongoDB connection closed.");
        console.log("👋 Server stopped.");

        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("❌ Failed to start server.");
    console.error(error);
    process.exit(1);
  }
};

/* ==========================================================
   GLOBAL ERROR HANDLERS
========================================================== */

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Promise Rejection:");
  console.error(reason);

  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:");
  console.error(error);

  process.exit(1);
});

/* ==========================================================
   START APPLICATION
========================================================== */

startServer();