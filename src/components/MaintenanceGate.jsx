import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useSettings } from "../context/SettingsContext";

function MaintenanceGate() {
  const location = useLocation();

  const {
    maintenanceMode,
    loading,
  } = useSettings();

  // ==========================================================
  // WAIT FOR SETTINGS TO LOAD
  // ==========================================================

  if (loading) {
    return (
      <div
        className="maintenance-gate-loading"
        role="status"
        aria-live="polite"
      >
        <span
          className="maintenance-gate-spinner"
          aria-hidden="true"
        />
        <span>Loading TechStore Pro...</span>
      </div>
    );
  }

  // ==========================================================
  // ALWAYS ALLOW MAINTENANCE PAGE
  // ==========================================================

  if (location.pathname === "/maintenance") {
    return <Outlet />;
  }

  // ==========================================================
  // ALWAYS ALLOW AUTHENTICATION PAGES
  // ==========================================================

  if (
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password"
  ) {
    return <Outlet />;
  }

  // ==========================================================
  // ALWAYS ALLOW ADMIN ROUTES
  // ==========================================================

  if (location.pathname.startsWith("/admin")) {
    return <Outlet />;
  }

  // ==========================================================
  // MAINTENANCE MODE
  // ==========================================================

  if (maintenanceMode) {
    return (
      <Navigate
        to="/maintenance"
        replace
      />
    );
  }

  // ==========================================================
  // NORMAL STOREFRONT
  // ==========================================================

  return <Outlet />;
}

export default MaintenanceGate;
