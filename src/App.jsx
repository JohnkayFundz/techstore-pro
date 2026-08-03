import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

// Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Admin Pages (enable when files exist)
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import AdminProducts from "./pages/admin/AdminProducts";
// import AdminOrders from "./pages/admin/AdminOrders";

// Protected Routes (enable when files exist)
// import ProtectedRoute from "./components/ProtectedRoute";
// import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <Routes>

      {/* Shared Layout */}
      <Route element={<Layout />}>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Products />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />


        {/* Protected Routes */}
        {/* 
        <Route element={<ProtectedRoute />}>

          <Route 
            path="/checkout" 
            element={<Checkout />} 
          />

        </Route>
        */}

        {/* Temporary Checkout Access */}
        <Route path="/checkout" element={<Checkout />} />


        {/* Admin Routes */}
        {/*
        <Route element={<AdminRoute />}>

          <Route 
            path="/admin" 
            element={<AdminDashboard />} 
          />

          <Route 
            path="/admin/products" 
            element={<AdminProducts />} 
          />

          <Route 
            path="/admin/orders" 
            element={<AdminOrders />} 
          />

        </Route>
        */}


        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />

      </Route>

    </Routes>
  );
}

export default App;