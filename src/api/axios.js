// ==========================================================
// TECHSTORE PRO
// AXIOS API CLIENT
// ==========================================================

import axios from "axios";

// ==========================================================
// API BASE URL
// ==========================================================

const API_URL = import.meta.env.VITE_API_URL;

// ----------------------------------------------------------
// Validate API URL
// ----------------------------------------------------------

if (!API_URL) {
  console.error(
    "❌ VITE_API_URL is not configured."
  );
}

// ==========================================================
// AXIOS INSTANCE
// ==========================================================

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,

  headers: {
    Accept: "application/json",
  },

  timeout: 30000,
});

// ==========================================================
// REQUEST INTERCEPTOR
// ==========================================================
//
// Automatically attaches the JWT stored in localStorage.
//
// The backend supports:
// Authorization: Bearer <token>
//
// Cookies are also sent automatically because:
// withCredentials: true
// ==========================================================

api.interceptors.request.use(
  (config) => {
    try {
      const token =
        localStorage.getItem("token");

      // ----------------------------------------------------
      // ATTACH JWT
      // ----------------------------------------------------

      if (token) {
        config.headers =
          config.headers || {};

        config.headers.Authorization =
          `Bearer ${token}`;
      }

      // ----------------------------------------------------
      // FORM DATA
      // ----------------------------------------------------
      //
      // Do NOT manually set Content-Type for FormData.
      // Axios/browser will automatically add:
      //
      // multipart/form-data; boundary=...
      //

      if (
        config.data instanceof FormData
      ) {
        if (
          config.headers &&
          config.headers["Content-Type"]
        ) {
          delete config.headers[
            "Content-Type"
          ];
        }
      }

      return config;
    } catch (error) {
      console.error(
        "❌ Axios request interceptor error:",
        error
      );

      return Promise.reject(error);
    }
  },

  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================================
// RESPONSE INTERCEPTOR
// ==========================================================
//
// Handles authentication failures globally.
//
// Important:
// We do NOT redirect for every 401 automatically if the
// current request is already an authentication endpoint.
// This prevents unnecessary redirect loops during login.
// ==========================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    const status =
      error.response?.status;

    const requestUrl =
      error.config?.url || "";

    // ======================================================
    // 401 UNAUTHORIZED
    // ======================================================

    if (status === 401) {
      // ----------------------------------------------------
      // Authentication endpoints
      // ----------------------------------------------------
      //
      // Do not redirect from login/register/logout requests.
      //

      const isAuthRequest =
        requestUrl.includes(
          "/auth/login"
        ) ||
        requestUrl.includes(
          "/auth/register"
        ) ||
        requestUrl.includes(
          "/auth/logout"
        );

      // ----------------------------------------------------
      // CLEAR LOCAL SESSION
      // ----------------------------------------------------

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "techstore-user"
      );

      // ----------------------------------------------------
      // REDIRECT TO LOGIN
      // ----------------------------------------------------

      if (
        !isAuthRequest &&
        window.location.pathname !==
          "/login"
      ) {
        window.location.href =
          "/login";
      }
    }

    // ======================================================
    // 403 FORBIDDEN
    // ======================================================

    if (status === 403) {
      console.warn(
        "⚠️ Access denied:",
        error.response?.data
      );
    }

    // ======================================================
    // 404 NOT FOUND
    // ======================================================

    if (status === 404) {
      console.warn(
        "⚠️ API route not found:",
        requestUrl
      );
    }

    // ======================================================
    // 429 RATE LIMIT
    // ======================================================

    if (status === 429) {
      console.warn(
        "⚠️ Too many requests. Please try again later."
      );
    }

    // ======================================================
    // 500 SERVER ERROR
    // ======================================================

    if (
      status &&
      status >= 500
    ) {
      console.error(
        "❌ Server error:",
        error.response?.data
      );
    }

    // ======================================================
    // NETWORK ERROR
    // ======================================================

    if (!error.response) {
      console.error(
        "❌ Network error. Please check your internet connection or API server."
      );
    }

    return Promise.reject(error);
  }
);

// ==========================================================
// EXPORT
// ==========================================================

export default api;