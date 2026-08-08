import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";


// Public Pages
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import Cart from "./pages/Cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";


// Customer Pages
import Checkout from "./pages/Checkout.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";


// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import CreateProduct from "./pages/admin/CreateProduct.jsx";
import EditProduct from "./pages/admin/EditProduct.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";


// Error Page
import NotFound from "./pages/NotFound.jsx";



function App() {


  return (

    <Routes>


      <Route element={<Layout />}>


        {/* ============================
            PUBLIC ROUTES
        ============================ */}


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




        {/* ============================
            CUSTOMER PROTECTED ROUTES
        ============================ */}


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





        {/* ============================
            ADMIN ROUTES
        ============================ */}


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
          path="/admin/products/new"
          element={
            <AdminRoute>
              <CreateProduct />
            </AdminRoute>
          }
        />


        <Route
          path="/admin/products/edit/:id"
          element={
            <AdminRoute>
              <EditProduct />
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





        {/* ============================
            404 ROUTE
        ============================ */}


        <Route
          path="*"
          element={<NotFound />}
        />


      </Route>


    </Routes>

  );

}



export default App;