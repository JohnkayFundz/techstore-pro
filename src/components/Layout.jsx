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