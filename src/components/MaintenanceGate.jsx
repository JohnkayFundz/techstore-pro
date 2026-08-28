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
  //
  // Important:
  // We must NOT redirect while the settings request is still
  // loading. Otherwise the app could briefly assume that
  // maintenance mode is false before the backend responds.
  //
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading TechStore Pro...
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
    location.pathname === "/register"
  ) {
    return <Outlet />;
  }

  // ==========================================================
  // ALWAYS ALLOW ADMIN ROUTES
  // ==========================================================
  //
  // AdminRoute is responsible for checking:
  // - Authentication
  // - Admin authorization
  //
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