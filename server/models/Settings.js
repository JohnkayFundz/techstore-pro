// ==========================================================
// TECHSTORE PRO
// SETTINGS MODEL
// ==========================================================

import mongoose from "mongoose";

// ==========================================================
// SETTINGS SCHEMA
// ==========================================================

const settingsSchema = new mongoose.Schema(
  {
    // ========================================================
    // STORE INFORMATION
    // ========================================================

    storeName: {
      type: String,
      default: "TechStore Pro",
      trim: true,
    },

    storeEmail: {
      type: String,
      default: "admin@techstorepro.com",
      trim: true,
      lowercase: true,
    },

    currency: {
      type: String,
      enum: ["USD", "NGN", "GBP", "EUR"],
      default: "USD",
    },

    // ========================================================
    // SYSTEM SETTINGS
    // ========================================================

    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    // ========================================================
    // NOTIFICATIONS
    // ========================================================

    emailNotifications: {
      type: Boolean,
      default: true,
    },

    orderNotifications: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================================
// SETTINGS MODEL
// ==========================================================

const Settings = mongoose.model(
  "Settings",
  settingsSchema
);

export default Settings;