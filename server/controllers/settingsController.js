// ==========================================================
// TECHSTORE PRO
// SETTINGS CONTROLLER
// ==========================================================

import Settings from "../models/Settings.js";

const DEFAULT_SETTINGS = {
  storeName: "TechStore Pro",
  storeEmail: "admin@techstorepro.com",
  currency: "USD",
  maintenanceMode: false,
  emailNotifications: true,
  orderNotifications: true,
};

const ALLOWED_FIELDS = [
  "storeName",
  "storeEmail",
  "currency",
  "maintenanceMode",
  "emailNotifications",
  "orderNotifications",
];

const buildUpdateData = (body = {}) => {
  const updateData = {};

  for (const field of ALLOWED_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      updateData[field] = body[field];
    }
  }

  if (typeof updateData.storeName === "string") {
    updateData.storeName = updateData.storeName.trim();
    if (!updateData.storeName) {
      throw new Error("Store name cannot be empty.");
    }
    if (updateData.storeName.length > 100) {
      throw new Error("Store name is too long.");
    }
  }

  if (typeof updateData.storeEmail === "string") {
    updateData.storeEmail = updateData.storeEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateData.storeEmail)) {
      throw new Error("Please provide a valid store email.");
    }
  }

  for (const field of [
    "maintenanceMode",
    "emailNotifications",
    "orderNotifications",
  ]) {
    if (
      Object.prototype.hasOwnProperty.call(updateData, field) &&
      typeof updateData[field] !== "boolean"
    ) {
      throw new Error(`${field} must be a boolean.`);
    }
  }

  if (
    Object.prototype.hasOwnProperty.call(updateData, "currency") &&
    !["USD", "NGN", "GBP", "EUR"].includes(updateData.currency)
  ) {
    throw new Error("Invalid currency.");
  }

  return updateData;
};

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(DEFAULT_SETTINGS);
    }

    return res.status(200).json(settings);
  } catch (error) {
    console.error("Failed to get settings:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load store settings.",
    });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const updateData = buildUpdateData(req.body);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid settings were provided.",
      });
    }

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        ...DEFAULT_SETTINGS,
        ...updateData,
      });
    } else {
      settings = await Settings.findOneAndUpdate(
        {},
        { $set: updateData },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully.",
      settings,
    });
  } catch (error) {
    const clientError =
      error.name === "ValidationError" ||
      error.name === "CastError" ||
      error.message?.includes("cannot") ||
      error.message?.includes("too long") ||
      error.message?.includes("valid store email") ||
      error.message?.includes("must be a boolean") ||
      error.message?.includes("Invalid currency");

    console.error("Failed to update settings:", error);

    return res.status(clientError ? 400 : 500).json({
      success: false,
      message: clientError
        ? error.message
        : "Failed to update store settings.",
    });
  }
};