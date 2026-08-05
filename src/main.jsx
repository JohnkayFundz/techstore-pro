import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";

// Context Providers
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";

// Global CSS
import "./index.css";


ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <BrowserRouter>

      <AuthProvider>

        <ProductProvider>

          <CartProvider>

            <WishlistProvider>

              <ToastProvider>

                <App />

              </ToastProvider>

            </WishlistProvider>

          </CartProvider>

        </ProductProvider>

      </AuthProvider>

    </BrowserRouter>

  </React.StrictMode>

);