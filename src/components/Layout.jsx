import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";
import Toast from "./Toast";
import ErrorBoundary from "./ErrorBoundary";


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
      <header className="site-header">
        <Navbar />
      </header>


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
      <footer className="site-footer">
        <Footer />
      </footer>


    </>
  );
}


export default Layout;