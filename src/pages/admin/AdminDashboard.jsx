import {
  useEffect,
  useState,
} from "react";


import {
  getDashboardStats,
  getSalesAnalytics,
} from "../../api/adminApi";


import DashboardHeader from "../../components/admin/DashboardHeader";
import StatsCards from "../../components/admin/StatsCards";
import SalesChart from "../../components/admin/SalesChart";
import QuickActions from "../../components/admin/QuickActions";
import RecentOrders from "../../components/admin/RecentOrders";


import "../../components/admin/Dashboard.css";



function AdminDashboard() {


  const initialStats = {

    totalProducts: 0,

    totalUsers: 0,

    totalOrders: 0,

    revenue: 0,

  };



  const [stats, setStats] = useState(
    initialStats
  );


  const [salesData, setSalesData] = useState([]);


  const [recentOrders, setRecentOrders] = useState([]);


  const [loading, setLoading] = useState(true);


  const [error, setError] = useState("");




  useEffect(() => {

    loadDashboard();

  }, []);





  const loadDashboard = async () => {


    try {


      setLoading(true);

      setError("");



      const [

        dashboardResponse,

        analyticsResponse,

      ] = await Promise.all([


        getDashboardStats(),


        getSalesAnalytics(),


      ]);





      const dashboard =

        dashboardResponse.data ||
        dashboardResponse;





      const analytics =

        analyticsResponse.data ||
        analyticsResponse;






      if (dashboard.success) {



        setStats({


          totalProducts:

            dashboard.stats?.totalProducts || 0,



          totalUsers:

            dashboard.stats?.totalUsers || 0,



          totalOrders:

            dashboard.stats?.totalOrders || 0,



          revenue:

            dashboard.stats?.revenue || 0,


        });





        setRecentOrders(

          dashboard.recentOrders || []

        );


      }





      if (analytics.success) {


        setSalesData(

          analytics.salesData || []

        );


      }




    } catch (error) {


      console.error(

        "Dashboard Error:",

        error

      );



      setError(

        "Failed to load dashboard data."

      );



    } finally {


      setLoading(false);


    }


  };







  if (loading) {


    return (


      <div className="dashboard-loading">


        <h2>

          Loading Dashboard...

        </h2>


      </div>


    );


  }







  return (


    <div className="admin-dashboard">





      <DashboardHeader

        refresh={loadDashboard}

      />






      {error && (


        <div className="error-message">


          <p>

            {error}

          </p>



          <button

            onClick={loadDashboard}

          >

            Retry

          </button>



        </div>


      )}







      <StatsCards

        stats={stats}

      />








      <SalesChart

        salesData={salesData}

      />








      <QuickActions />







      <RecentOrders

        orders={recentOrders}

      />





    </div>


  );

}



export default AdminDashboard;