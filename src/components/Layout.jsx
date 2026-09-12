import { Outlet } from "react-router-dom";

import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import Toast from "./Toast.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import AIShoppingAssistant from "./AIShoppingAssistant.jsx";

function Layout() {
  return (
    <>
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="skip-link"
      >
        Skip to content
      </a>

      {/* Header */}
      <Navbar />

      {/* Global Notifications */}
      <Toast />

      {/* Route Content */}
      <div className="container">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </div>

      {/* Footer */}
      <Footer />

      {/* AI Shopping Assistant */}
      <AIShoppingAssistant />
    </>
  );
}

export default Layout;
