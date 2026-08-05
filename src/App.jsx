import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";


// Public Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Register from "./pages/Register";


// Customer Pages
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import OrderSuccess from "./pages/OrderSuccess";


// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";


// Error Page
import NotFound from "./pages/NotFound";



function App() {


  return (

    <Routes>


      <Route element={<Layout />}>


        {/* ==================================================
            PUBLIC ROUTES
        ================================================== */}


        <Route
          path="/"
          element={<Home />}
        />


        <Route
          path="/products"
          element={<Products />}
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






        {/* ==================================================
            CUSTOMER PROTECTED ROUTES
        ================================================== */}



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








        {/* ==================================================
            ADMIN PROTECTED ROUTES
        ================================================== */}



        <Route
          path="/admin"
          element={

            <AdminRoute>

              <AdminDashboard />

            </AdminRoute>

          }
        />




        <Route
          path="/admin/products"
          element={

            <AdminRoute>

              <AdminProducts />

            </AdminRoute>

          }
        />




        <Route
          path="/admin/orders"
          element={

            <AdminRoute>

              <AdminOrders />

            </AdminRoute>

          }
        />








        {/* ==================================================
            404 FALLBACK
        ================================================== */}


        <Route
          path="*"
          element={<NotFound />}
        />


      </Route>


    </Routes>

  );

}



export default App;