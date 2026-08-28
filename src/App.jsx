import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import MaintenanceGate from "./components/MaintenanceGate.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

// ==========================================================
// PUBLIC PAGES
// ==========================================================

import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Maintenance from "./pages/Maintenance.jsx";

// ==========================================================
// CUSTOMER PAGES
// ==========================================================

import Checkout from "./pages/Checkout.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";

// ==========================================================
// ADMIN PAGES
// ==========================================================

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";

import AddProduct from "./pages/admin/AddProduct.jsx";
import CreateProduct from "./pages/admin/CreateProduct.jsx";
import EditProduct from "./pages/admin/EditProduct.jsx";

import ProductManagement from "./pages/admin/ProductManagement.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";

// ==========================================================
// ERROR PAGE
// ==========================================================

import NotFound from "./pages/NotFound.jsx";

// ==========================================================
// APP
// ==========================================================

function App() {
  return (
    <Routes>

      {/* ==================================================
          MAINTENANCE GATE

          Controls access to the normal storefront.
          ================================================== */}

      <Route element={<MaintenanceGate />}>

        {/* ==================================================
            STANDALONE MAINTENANCE PAGE
            ================================================== */}

        <Route
          path="/maintenance"
          element={<Maintenance />}
        />


        {/* ==================================================
            MAIN WEBSITE LAYOUT
            ================================================== */}

        <Route element={<Layout />}>

          {/* ================================================
              PUBLIC ROUTES
              ================================================ */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/products/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/wishlist"
            element={<Wishlist />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />


          {/* ================================================
              CUSTOMER PROTECTED ROUTES
              ================================================ */}

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-success/:id"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />

        </Route>


        {/* ==================================================
            ADMIN LAYOUT
            ==================================================

            AdminRoute handles:
            - Authentication
            - Administrator authorization

            AdminLayout handles:
            - Sidebar
            - Admin header
            - Outlet
            ================================================== */}

        <Route
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >

          {/* ================================================
              ADMIN DASHBOARD
              ================================================ */}

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />


          {/* ================================================
              ADMIN ANALYTICS
              ================================================ */}

          <Route
            path="/admin/analytics"
            element={<AdminAnalytics />}
          />


          {/* ================================================
              ADMIN PRODUCTS
              ================================================ */}

          <Route
            path="/admin/products"
            element={<AdminProducts />}
          />


          {/* ================================================
              ADD PRODUCT
              ================================================ */}

          <Route
            path="/admin/products/add"
            element={<AddProduct />}
          />


          {/* ================================================
              CREATE PRODUCT
              ================================================ */}

          <Route
            path="/admin/products/new"
            element={<CreateProduct />}
          />


          {/* ================================================
              EDIT PRODUCT
              ================================================ */}

          <Route
            path="/admin/products/edit/:id"
            element={<EditProduct />}
          />


          {/* ================================================
              PRODUCT MANAGEMENT
              ================================================ */}

          <Route
            path="/admin/product-management"
            element={<ProductManagement />}
          />


          {/* ================================================
              ADMIN ORDERS
              ================================================ */}

          <Route
            path="/admin/orders"
            element={<AdminOrders />}
          />


          {/* ================================================
              ADMIN USERS
              ================================================ */}

          <Route
            path="/admin/users"
            element={<AdminUsers />}
          />


          {/* ================================================
              ADMIN SETTINGS
              ================================================ */}

          <Route
            path="/admin/settings"
            element={<AdminSettings />}
          />

        </Route>

      </Route>


      {/* ==================================================
          404
          ================================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}

export default App;
