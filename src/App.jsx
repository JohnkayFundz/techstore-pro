import { Suspense, lazy, useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Loading from "./components/Loading";
import ErrorBoundary from "./components/ErrorBoundary";


// Pages
import Home from "./pages/Home";


// Lazy loaded pages
const Products = lazy(() => import("./pages/Products"));

const ProductDetails = lazy(
  () => import("./pages/ProductDetails")
);

const CartPage = lazy(
  () => import("./pages/CartPage")
);

const Checkout = lazy(
  () => import("./pages/Checkout")
);

const WishlistPage = lazy(
  () => import("./pages/WishlistPage")
);

const Login = lazy(
  () => import("./pages/Login")
);

const Register = lazy(
  () => import("./pages/Register")
);

const Profile = lazy(
  () => import("./pages/Profile")
);

const Orders = lazy(
  () => import("./pages/Orders")
);

const Dashboard = lazy(
  () => import("./pages/Dashboard")
);

const NotFound = lazy(
  () => import("./pages/NotFound")
);




function ScrollToTop() {

  const { pathname } = useLocation();


  useEffect(() => {

    window.scrollTo(0, 0);

  }, [pathname]);


  return null;

}





function App() {


  return (

    <ErrorBoundary>


      <ScrollToTop />


      <Suspense fallback={<Loading />}>



        <Routes>



          <Route
            path="/"
            element={<Layout />}
          >




            {/* =========================
                PUBLIC ROUTES
            ========================== */}


            <Route
              index
              element={<Home />}
            />



            <Route
              path="products"
              element={<Products />}
            />



            <Route
              path="products/:id"
              element={<ProductDetails />}
            />






            {/* =========================
                AUTH ROUTES
            ========================== */}



            <Route
              path="login"
              element={<Login />}
            />



            <Route
              path="register"
              element={<Register />}
            />







            {/* =========================
                SHOPPING ROUTES
            ========================== */}



            <Route
              path="cart"
              element={<CartPage />}
            />



            <Route
              path="checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />







            {/* =========================
                USER ROUTES
            ========================== */}



            <Route
              path="wishlist"
              element={
                <ProtectedRoute>
                  <WishlistPage />
                </ProtectedRoute>
              }
            />



            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />



            <Route
              path="orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />








            {/* =========================
                ADMIN ROUTES
            ========================== */}



            <Route
              path="dashboard"
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              }
            />







            {/* =========================
                404 ROUTE
            ========================== */}



            <Route
              path="*"
              element={<NotFound />}
            />



          </Route>



        </Routes>



      </Suspense>



    </ErrorBoundary>

  );

}



export default App;