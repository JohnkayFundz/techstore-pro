import React from "react";
import ReactDOM from "react-dom/client";
import PropTypes from "prop-types";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";

import { Toaster } from "react-hot-toast";

import { ToastProvider } from "./context/ToastContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";

/* ==========================================================
   GLOBAL ERROR BOUNDARY
========================================================== */

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application Error:", error);
    console.error("Component Stack:", errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.assign("/");
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-boundary" role="alert">
          <div className="error-card">
            <h1>⚠️ Something went wrong</h1>

            <p>
              An unexpected error occurred while loading the application.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details
                style={{
                  marginTop: "1rem",
                  textAlign: "left",
                  whiteSpace: "pre-wrap",
                }}
              >
                <summary>Error Details</summary>

                <pre>{this.state.error.message}</pre>
              </details>
            )}

            <div className="error-actions">
              <button
                className="btn btn-primary"
                onClick={this.handleReload}
              >
                Refresh Page
              </button>

              <button
                className="btn btn-secondary"
                onClick={this.handleGoHome}
              >
                Go Home
              </button>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

/* ==========================================================
   GLOBAL PROVIDERS
========================================================== */

function AppProviders({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};

/* ==========================================================
   APPLICATION ROOT
========================================================== */

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element (#root) was not found.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProviders>
        <ErrorBoundary>
          <App />

          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            containerStyle={{
              top: 20,
              right: 20,
            }}
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: "12px",
                fontSize: "15px",
                padding: "12px 16px",
              },
              success: {
                iconTheme: {
                  primary: "#16a34a",
                  secondary: "#ffffff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#dc2626",
                  secondary: "#ffffff",
                },
              },
            }}
          />
        </ErrorBoundary>
      </AppProviders>
    </BrowserRouter>
  </React.StrictMode>
);