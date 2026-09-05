import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FiBarChart2,
  FiDollarSign,
  FiRefreshCw,
  FiShoppingBag,
  FiTrendingUp,
} from "react-icons/fi";

import {
  getSalesAnalytics,
} from "../../api/adminApi";

import "./AdminAnalytics.css";


/* ==========================================================
   CONSTANTS
========================================================== */

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];


/* ==========================================================
   HELPERS
========================================================== */

const formatCurrency = (value = 0) => {
  return new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }
  ).format(
    Number(value) || 0
  );
};


const normalizeMonthlySales = (
  sales = []
) => {
  const normalized = MONTHS.map(
    (month, index) => ({
      month,
      monthNumber: index + 1,
      sales: 0,
      revenue: 0,
      orders: 0,
    })
  );

  if (!Array.isArray(sales)) {
    return normalized;
  }

  sales.forEach((item) => {
    const monthNumber =
      Number(item.month);

    if (
      monthNumber >= 1 &&
      monthNumber <= 12
    ) {
      const target =
        normalized[
          monthNumber - 1
        ];

      target.sales +=
        Number(item.sales) || 0;

      target.revenue +=
        Number(item.revenue) || 0;

      target.orders +=
        Number(item.orders) || 0;
    }
  });

  return normalized;
};


/* ==========================================================
   COMPONENT
========================================================== */

function AdminAnalytics() {
  const [
    analytics,
    setAnalytics,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  /* ========================================================
     LOAD ANALYTICS
  ======================================================== */

  const loadAnalytics = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response =
        await getSalesAnalytics();

      if (
        !response ||
        response.success === false
      ) {
        throw new Error(
          response?.message ||
            "Failed to load sales analytics."
        );
      }

      setAnalytics(response);
    } catch (error) {
      console.error(
        "Load Analytics Error:",
        error
      );

      setError(
        error?.message ||
          "Failed to load sales analytics."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  /* ========================================================
     LOAD ON MOUNT
  ======================================================== */

  useEffect(() => {
    loadAnalytics();
  }, []);


  /* ========================================================
     SUMMARY
  ======================================================== */

  const summary =
    analytics?.summary || {};

  const totalRevenue =
    Number(
      summary.totalRevenue
    ) || 0;

  const totalOrders =
    Number(
      summary.totalOrders
    ) || 0;

  const deliveredOrders =
    Number(
      summary.deliveredOrders
    ) || 0;

  const cancelledOrders =
    Number(
      summary.cancelledOrders
    ) || 0;

  const averageOrderValue =
    Number(
      summary.averageOrderValue
    ) || 0;


  /* ========================================================
     MONTHLY DATA
  ======================================================== */

  const monthlyData =
    useMemo(
      () =>
        normalizeMonthlySales(
          analytics?.sales
        ),
      [analytics]
    );


  /* ========================================================
     ACTIVE MONTHS
  ======================================================== */

  const activeMonths =
    monthlyData.filter(
      (item) =>
        Number(item.sales) > 0
    ).length;


  /* ========================================================
     BEST MONTH
  ======================================================== */

  const bestMonth = useMemo(() => {
    if (
      analytics?.bestMonth
    ) {
      return {
        month:
          analytics.bestMonth
            .monthName || "N/A",

        sales:
          Number(
            analytics.bestMonth.sales
          ) || 0,

        orders:
          Number(
            analytics.bestMonth.orders
          ) || 0,
      };
    }

    return monthlyData.reduce(
      (best, current) =>
        current.sales >
        best.sales
          ? current
          : best,
      {
        month: "N/A",
        sales: 0,
        orders: 0,
      }
    );
  }, [
    analytics,
    monthlyData,
  ]);


  /* ========================================================
     MAX SALES
  ======================================================== */

  const maxSales = Math.max(
    ...monthlyData.map(
      (item) =>
        Number(item.sales) || 0
    ),
    1
  );


  /* ========================================================
     LOADING
  ======================================================== */

  if (loading) {
    return (
      <div className="admin-analytics">
        <div className="analytics-loading">
          <FiBarChart2 />

          <h1>
            Loading Analytics...
          </h1>

          <p>
            Preparing your sales
            dashboard.
          </p>
        </div>
      </div>
    );
  }


  /* ========================================================
     RENDER
  ======================================================== */

  return (
    <div className="admin-analytics">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="analytics-header">

        <div>
          <h1>
            Sales Analytics
          </h1>

          <p>
            Monitor sales performance
            and revenue trends.
          </p>
        </div>

        <button
          type="button"
          className="analytics-refresh-btn"
          onClick={() =>
            loadAnalytics(true)
          }
          disabled={refreshing}
        >
          <FiRefreshCw
            className={
              refreshing
                ? "spinning"
                : ""
            }
          />

          <span>
            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </span>
        </button>

      </div>


      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="analytics-error">

          <strong>
            Unable to load analytics
          </strong>

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              loadAnalytics()
            }
          >
            Try Again
          </button>

        </div>
      )}


      {/* ==================================================
          SUMMARY CARDS
      ================================================== */}

      <div className="analytics-summary">

        {/* TOTAL REVENUE */}

        <div className="analytics-card">

          <div className="analytics-card-icon revenue">
            <FiDollarSign />
          </div>

          <div>
            <span>
              Total Revenue
            </span>

            <strong>
              {formatCurrency(
                totalRevenue
              )}
            </strong>

            <small>
              From delivered orders
            </small>
          </div>

        </div>


        {/* DELIVERED ORDERS */}

        <div className="analytics-card">

          <div className="analytics-card-icon orders">
            <FiShoppingBag />
          </div>

          <div>
            <span>
              Delivered Orders
            </span>

            <strong>
              {deliveredOrders}
            </strong>

            <small>
              Successful completed orders
            </small>
          </div>

        </div>


        {/* AVERAGE ORDER */}

        <div className="analytics-card">

          <div className="analytics-card-icon average">
            <FiTrendingUp />
          </div>

          <div>
            <span>
              Average Order Value
            </span>

            <strong>
              {formatCurrency(
                averageOrderValue
              )}
            </strong>

            <small>
              Per delivered order
            </small>
          </div>

        </div>


        {/* BEST MONTH */}

        <div className="analytics-card">

          <div className="analytics-card-icon best">
            <FiBarChart2 />
          </div>

          <div>
            <span>
              Best Month
            </span>

            <strong>
              {bestMonth.month}
            </strong>

            <small>
              {formatCurrency(
                bestMonth.sales
              )}
            </small>
          </div>

        </div>

      </div>


      {/* ==================================================
          MONTHLY SALES
      ================================================== */}

      <section className="analytics-panel">

        <div className="analytics-panel-header">

          <div>
            <h2>
              Monthly Sales
            </h2>

            <p>
              Delivered sales performance
              by month
            </p>
          </div>

          <FiBarChart2 />

        </div>


        <div className="sales-chart">

          {monthlyData.map(
            (item) => {

              const sales =
                Number(item.sales) ||
                0;

              const height =
                sales > 0
                  ? Math.max(
                      (sales /
                        maxSales) *
                        100,
                      5
                    )
                  : 2;

              return (
                <div
                  className="chart-column"
                  key={item.month}
                >

                  <div className="chart-value">
                    {formatCurrency(
                      sales
                    )}
                  </div>

                  <div className="chart-bar-wrapper">

                    <div
                      className="chart-bar"
                      style={{
                        height:
                          `${height}%`,
                      }}
                      title={`${item.month}: ${formatCurrency(
                        sales
                      )}`}
                    />

                  </div>

                  <span className="chart-label">
                    {item.month}
                  </span>

                </div>
              );
            }
          )}

        </div>

      </section>


      {/* ==================================================
          PERFORMANCE GRID
      ================================================== */}

      <div className="analytics-grid">

        {/* BEST PERFORMING MONTH */}

        <section className="analytics-panel performance-panel">

          <div className="analytics-panel-header">

            <div>
              <h2>
                Best Performing Month
              </h2>

              <p>
                Highest recorded
                delivered sales
              </p>
            </div>

            <FiTrendingUp />

          </div>


          <div className="best-month">

            <div className="best-month-icon">
              <FiBarChart2 />
            </div>

            <div>

              <span>
                {bestMonth.month}
              </span>

              <strong>
                {formatCurrency(
                  bestMonth.sales
                )}
              </strong>

              <small>
                {bestMonth.orders}{" "}
                delivered{" "}
                {bestMonth.orders === 1
                  ? "order"
                  : "orders"}
              </small>

            </div>

          </div>

        </section>


        {/* MONTHLY BREAKDOWN */}

        <section className="analytics-panel">

          <div className="analytics-panel-header">

            <div>
              <h2>
                Monthly Breakdown
              </h2>

              <p>
                Detailed sales figures
              </p>
            </div>

            <FiDollarSign />

          </div>


          <div className="monthly-list">

            {monthlyData.map(
              (item) => {

                const sales =
                  Number(item.sales) ||
                  0;

                const percentage =
                  sales > 0
                    ? (
                        sales /
                        maxSales
                      ) * 100
                    : 0;

                return (
                  <div
                    className="monthly-row"
                    key={item.month}
                  >

                    <span>
                      {item.month}
                    </span>

                    <div className="monthly-progress">

                      <div
                        className="monthly-progress-fill"
                        style={{
                          width:
                            `${percentage}%`,
                        }}
                      />

                    </div>

                    <strong>
                      {formatCurrency(
                        sales
                      )}
                    </strong>

                  </div>
                );
              }
            )}

          </div>

        </section>

      </div>


      {/* ==================================================
          ORDER SUMMARY
      ================================================== */}

      <section className="analytics-panel order-summary-panel">

        <div className="analytics-panel-header">

          <div>
            <h2>
              Order Summary
            </h2>

            <p>
              Overview of your order
              activity
            </p>
          </div>

          <FiShoppingBag />

        </div>


        <div className="order-summary-grid">

          <div>
            <span>
              Total Orders
            </span>

            <strong>
              {totalOrders}
            </strong>
          </div>


          <div>
            <span>
              Delivered
            </span>

            <strong>
              {deliveredOrders}
            </strong>
          </div>


          <div>
            <span>
              Cancelled
            </span>

            <strong>
              {cancelledOrders}
            </strong>
          </div>


          <div>
            <span>
              Active Sales Months
            </span>

            <strong>
              {activeMonths}
            </strong>
          </div>

        </div>

      </section>


      {/* ==================================================
          EMPTY STATE
      ================================================== */}

      {totalRevenue === 0 && (
        <div className="analytics-empty">

          <FiBarChart2 />

          <h2>
            No delivered sales yet
          </h2>

          <p>
            Sales analytics will appear
            here when orders are marked
            as delivered.
          </p>

        </div>
      )}

    </div>
  );
}

export default AdminAnalytics;