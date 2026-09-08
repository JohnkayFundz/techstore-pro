// ==========================================================
// TECHSTORE PRO
// AXIOS API CLIENT
// ==========================================================

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error("VITE_API_URL is not configured.");
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
  timeout: 30000,
});

const API_ERROR_EVENT = "techstore:api-error";

function getApiErrorMessage(error, fallback) {
  const responseData = error.response?.data;

  if (typeof responseData?.message === "string") return responseData.message;
  if (typeof responseData?.error === "string") return responseData.error;
  if (typeof error.message === "string" && error.message) return error.message;

  return fallback;
}

function notifyApiError({ type = "error", title, message }) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent(API_ERROR_EVENT, {
      detail: { type, title, message, duration: 5000 },
    })
  );
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    const isAuthRequest =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/logout") ||
      requestUrl.includes("/auth/me");

    if (status === 401 && !isAuthRequest) {
      notifyApiError({
        type: "warning",
        title: "Session expired",
        message: "Please sign in again to continue.",
      });

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    if (status === 403) {
      notifyApiError({
        title: "Access denied",
        message: getApiErrorMessage(
          error,
          "You do not have permission to perform this action."
        ),
      });
    }

    if (status === 404) {
      notifyApiError({
        title: "Not found",
        message: getApiErrorMessage(
          error,
          "The requested resource could not be found."
        ),
      });
    }

    if (status === 429) {
      notifyApiError({
        type: "warning",
        title: "Too many requests",
        message: "Please wait a moment and try again.",
      });
    }

    if (status && status >= 500) {
      notifyApiError({
        title: "Server error",
        message: getApiErrorMessage(
          error,
          "Something went wrong on the server. Please try again."
        ),
      });
    }

    if (!error.response) {
      notifyApiError({
        type: "warning",
        title: "Connection problem",
        message: "We could not reach the server. Check your connection and try again.",
      });
    }

    return Promise.reject(error);
  }
);

export default api;
