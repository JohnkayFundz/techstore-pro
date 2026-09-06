// ==========================================================
// TECHSTORE PRO
// SETTINGS API
// ==========================================================

import api from "./axios";

// ==========================================================
// GET STORE SETTINGS
//
// GET /api/settings
//
// Public
// ==========================================================

export const getSettings = async () => {
  try {
    const response = await api.get("/settings");

    return response.data;
  } catch (error) {
    console.error(
      "Get Settings Error:",
      error
    );

    return {
      storeName: "TechStore Pro",
      storeEmail: "admin@techstorepro.com",
      currency: "USD",
      maintenanceMode: false,
      emailNotifications: true,
      orderNotifications: true,
    };
  }
};


// ==========================================================
// UPDATE STORE SETTINGS
//
// PATCH /api/settings
//
// Admin only
// ==========================================================

export const updateSettings = async (
  settings
) => {
  try {
    const response = await api.patch(
      "/settings",
      settings
    );

    return response.data;
  } catch (error) {
    console.error(
      "Update Settings Error:",
      error
    );

    throw error;
  }
};