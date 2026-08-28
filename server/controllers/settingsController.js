// ==========================================================
// TECHSTORE PRO
// SETTINGS CONTROLLER
// ==========================================================

import Settings from "../models/Settings.js";

// ==========================================================
// DEFAULT SETTINGS
// ==========================================================

const DEFAULT_SETTINGS = {
  storeName: "TechStore Pro",
  storeEmail: "admin@techstorepro.com",
  currency: "USD",
  maintenanceMode: false,
  emailNotifications: true,
  orderNotifications: true,
};

// ==========================================================
// GET SETTINGS
// ==========================================================
// GET /api/settings
// Public
// ==========================================================

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    // Create the default settings document if one doesn't exist.
    if (!settings) {
      settings = await Settings.create(DEFAULT_SETTINGS);
    }

    res.status(200).json(settings);
  } catch (error) {
    console.error(
      "❌ Failed to get settings:",
      error
    );

    res.status(500).json({
      message: "Failed to load store settings.",
    });
  }
};

// ==========================================================
// UPDATE SETTINGS
// ==========================================================
// PATCH /api/settings
// Admin only
// ==========================================================

export const updateSettings = async (req, res) => {
  try {
    const {
      storeName,
      storeEmail,
      currency,
      maintenanceMode,
      emailNotifications,
      orderNotifications,
    } = req.body;

    const updateData = {
      storeName,
      storeEmail,
      currency,
      maintenanceMode,
      emailNotifications,
      orderNotifications,
    };

    let settings = await Settings.findOne();

    // ======================================================
    // CREATE SETTINGS IF NONE EXIST
    // ======================================================

    if (!settings) {
      settings = await Settings.create({
        ...DEFAULT_SETTINGS,
        ...updateData,
      });
    } else {
      settings = await Settings.findOneAndUpdate(
        {},
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );
    }

    res.status(200).json({
      message: "Settings updated successfully.",
      settings,
    });
  } catch (error) {
    console.error(
      "❌ Failed to update settings:",
      error
    );

    res.status(500).json({
      message: "Failed to update store settings.",
    });
  }
};