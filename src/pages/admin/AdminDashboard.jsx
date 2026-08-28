import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  getDashboardStats,
  getSalesAnalytics,
} from "../../api/adminApi";

import Loading from "../../components/Loading";

import { formatPrice } from "../../utils/formatPrice";

import "./AdminDashboard.css";


function AdminDashboard() {
  // ==========================================================
  // STATE
  // ==========================================================

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    activeProducts: 0,
    inactiveProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
  });


  const [salesSummary, setSalesSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    averageOrderValue: 0,
  });


  const [salesByDay, setSalesByDay] = useState([]);

  const [topProducts, setTopProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ==========================================================
  // LOAD DASHBOARD
  // ==========================================================

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);

      setError("");


      // ======================================================
      // LOAD DASHBOARD + ANALYTICS
      // ======================================================

      const [
        dashboardResponse,
        analyticsResponse,
      ] = await Promise.all([
        getDashboardStats(),
        getSalesAnalytics(),
      ]);


      // ======================================================
      // VALIDATE DASHBOARD RESPONSE
      // ======================================================

      if (!dashboardResponse?.success) {
        throw new Error(
          dashboardResponse?.message ||
          "Failed to load dashboard."
        );
      }


      // ======================================================
      // DASHBOARD DATA
      //
      // Backend returns:
      //
      // {
      //   success: true,
      //   stats: {...},
      //   recentOrders: [...]
      // }
      //
      // ======================================================

      const dashboard =
        dashboardResponse.stats || {};


      setStats({
        totalUsers:
          dashboard.totalUsers || 0,

        totalProducts:
          dashboard.totalProducts || 0,

        activeProducts:
          dashboard.activeProducts || 0,

        inactiveProducts:
          dashboard.inactiveProducts || 0,

        totalOrders:
          dashboard.totalOrders || 0,

        pendingOrders:
          dashboard.pendingOrders || 0,

        processingOrders:
          dashboard.processingOrders || 0,

        shippedOrders:
          dashboard.shippedOrders || 0,

        deliveredOrders:
          dashboard.deliveredOrders || 0,

        cancelledOrders:
          dashboard.cancelledOrders || 0,

        totalRevenue:
          dashboard.totalRevenue || 0,
      });


      // ======================================================
      // VALIDATE ANALYTICS RESPONSE
      // ======================================================

      if (!analyticsResponse?.success) {
        throw new Error(
          analyticsResponse?.message ||
          "Failed to load sales analytics."
        );
      }


      // ======================================================
      // SALES ANALYTICS
      //
      // Backend returns:
      //
      // {
      //   success: true,
      //   summary: {...},
      //   salesByStatus: [...],
      //   salesByDay: [...],
      //   topProducts: [...]
      // }
      //
      // ======================================================

      const analytics =
        analyticsResponse || {};


      setSalesSummary(
        analytics.summary || {
          totalRevenue: 0,
          totalOrders: 0,
          deliveredOrders: 0,
          cancelledOrders: 0,
          averageOrderValue: 0,
        }
      );


      setSalesByDay(
        Array.isArray(
          analytics.salesByDay
        )
          ? analytics.salesByDay
          : []
      );


      setTopProducts(
        Array.isArray(
          analytics.topProducts
        )
          ? analytics.topProducts
          : []
      );


    } catch (err) {
      console.error(
        "Dashboard Error:",
        err
      );


      setError(
        err.message ||
        "Failed to load dashboard."
      );


    } finally {
      setLoading(false);
    }
  }, []);


  // ==========================================================
  // LOAD ON MOUNT
  // ==========================================================

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return <Loading />;
  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <section className="admin-dashboard">

        <div className="admin-error">

          <h2>
            Dashboard Error
          </h2>


          <p>
            {error}
          </p>


          <button
            type="button"
            onClick={loadDashboard}
          >
            Try Again
          </button>

        </div>

      </section>
    );
  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section className="admin-dashboard">

      {/* ====================================================
          HEADER
          ==================================================== */}

      <header className="dashboard-title">

        <div>

          <h1>
            Admin Dashboard
          </h1>


          <p>
            Welcome back, Administrator
          </p>

        </div>

      </header>


      {/* ====================================================
          STATISTICS
          ==================================================== */}

      <div className="stats-grid">

        {/* USERS */}

        <div className="stat-card">

          <h3>
            Users
          </h3>


          <strong>
            {stats.totalUsers}
          </strong>

        </div>


        {/* PRODUCTS */}

        <div className="stat-card">

          <h3>
            Products
          </h3>


          <strong>
            {stats.totalProducts}
          </strong>


          <small>
            {stats.activeProducts} active
          </small>

        </div>


        {/* ORDERS */}

        <div className="stat-card">

          <h3>
            Orders
          </h3>


          <strong>
            {stats.totalOrders}
          </strong>


          <small>
            {stats.pendingOrders} pending
          </small>

        </div>


        {/* REVENUE */}

        <div className="stat-card">

          <h3>
            Revenue
          </h3>


          <strong>
            {formatPrice(
              stats.totalRevenue
            )}
          </strong>


          <small>
            Delivered orders
          </small>

        </div>

      </div>


      {/* ====================================================
          ORDER STATUS
          ==================================================== */}

      <section className="admin-actions">

        <h2>
          Order Overview
        </h2>


        <div className="action-grid">

          <div>

            <strong>
              {stats.pendingOrders}
            </strong>


            <span>
              Pending
            </span>

          </div>


          <div>

            <strong>
              {stats.processingOrders}
            </strong>


            <span>
              Processing
            </span>

          </div>


          <div>

            <strong>
              {stats.shippedOrders}
            </strong>


            <span>
              Shipped
            </span>

          </div>


          <div>

            <strong>
              {stats.deliveredOrders}
            </strong>


            <span>
              Delivered
            </span>

          </div>


          <div>

            <strong>
              {stats.cancelledOrders}
            </strong>


            <span>
              Cancelled
            </span>

          </div>

        </div>

      </section>


      {/* ====================================================
          QUICK ACTIONS
          ==================================================== */}

      <section className="admin-actions">

        <h2>
          Quick Actions
        </h2>


        <div className="action-grid">

          <Link to="/admin/products">
            Manage Products
          </Link>


          <Link to="/admin/orders">
            Manage Orders
          </Link>


          <Link to="/admin/users">
            Manage Users
          </Link>

        </div>

      </section>


      {/* ====================================================
          SALES SUMMARY
          ==================================================== */}

      <section className="sales-section">

        <h2>
          Sales Analytics
        </h2>


        <div className="stats-grid">

          {/* TOTAL REVENUE */}

          <div className="stat-card">

            <h3>
              Total Revenue
            </h3>


            <strong>
              {formatPrice(
                salesSummary.totalRevenue
              )}
            </strong>

          </div>


          {/* TOTAL ORDERS */}

          <div className="stat-card">

            <h3>
              Total Orders
            </h3>


            <strong>
              {salesSummary.totalOrders}
            </strong>

          </div>


          {/* DELIVERED */}

          <div className="stat-card">

            <h3>
              Delivered
            </h3>


            <strong>
              {salesSummary.deliveredOrders}
            </strong>

          </div>


          {/* AVERAGE ORDER */}

          <div className="stat-card">

            <h3>
              Average Order
            </h3>


            <strong>
              {formatPrice(
                salesSummary.averageOrderValue
              )}
            </strong>

          </div>

        </div>

      </section>


      {/* ====================================================
          SALES BY DAY
          ==================================================== */}

      <section className="sales-section">

        <h2>
          Daily Sales
        </h2>


        {salesByDay.length === 0 ? (

          <p>
            No sales data available.
          </p>

        ) : (

          <div className="sales-list">

            {salesByDay.map((sale) => (

              <div
                className="sales-item"
                key={sale._id}
              >

                <span>
                  {sale._id}
                </span>


                <strong>
                  {formatPrice(
                    sale.revenue
                  )}
                </strong>


                <small>
                  {sale.orders} Orders
                </small>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* ====================================================
          TOP PRODUCTS
          ==================================================== */}

      <section className="sales-section">

        <h2>
          Top Products
        </h2>


        {topProducts.length === 0 ? (

          <p>
            No product sales data available.
          </p>

        ) : (

          <div className="sales-list">

            {topProducts.map((product) => (

              <div
                className="sales-item"
                key={
                  product._id ||
                  product.productName
                }
              >

                <span>
                  {product.productName}
                </span>


                <strong>
                  {product.quantitySold}
                  {" "}
                  sold
                </strong>


                <small>
                  {formatPrice(
                    product.revenue
                  )}
                </small>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* ====================================================
          ADMIN LINKS
          ==================================================== */}

      <section className="admin-actions">

        <h2>
          Administration
        </h2>


        <div className="action-grid">

          <Link to="/admin/products">
            Products
          </Link>


          <Link to="/admin/orders">
            Orders
          </Link>


          <Link to="/admin/users">
            Users
          </Link>

        </div>

      </section>

    </section>
  );
}


export default AdminDashboard;