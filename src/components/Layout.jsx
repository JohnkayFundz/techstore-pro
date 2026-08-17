import { Outlet } from "react-router-dom";

import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import Toast from "./Toast.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";

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

      {/* Main Content */}
      <main
        id="main-content"
        className="container"
      >
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default Layout;