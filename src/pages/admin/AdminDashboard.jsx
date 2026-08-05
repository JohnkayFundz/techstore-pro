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


  const [stats, setStats] = useState({

    totalUsers: 0,

    totalProducts: 0,

    totalOrders: 0,

    totalRevenue: 0,

  });



  const [recentOrders, setRecentOrders] = useState([]);

  const [sales, setSales] = useState([]);



  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");




  const loadDashboard = useCallback(async () => {


    try {


      setLoading(true);

      setError("");



      const [

        dashboard,

        analytics,

      ] = await Promise.all([

        getDashboardStats(),

        getSalesAnalytics(),

      ]);





      setStats({

        totalUsers:
          dashboard.stats?.totalUsers || 0,


        totalProducts:
          dashboard.stats?.totalProducts || 0,


        totalOrders:
          dashboard.stats?.totalOrders || 0,


        totalRevenue:
          dashboard.stats?.totalRevenue || 0,

      });





      setRecentOrders(

        dashboard.recentOrders || []

      );





      setSales(

        analytics?.sales || []

      );




    } catch (err) {


      console.error(
        "Dashboard Error:",
        err
      );



      setError(

        err.response?.data?.message ||

        "Failed to load dashboard."

      );



    } finally {


      setLoading(false);


    }


  }, []);





  useEffect(() => {


    loadDashboard();


  }, [loadDashboard]);







  if (loading) {

    return <Loading />;

  }






  if (error) {


    return (

      <div className="admin-error">

        {error}

      </div>

    );

  }







  return (


    <section className="admin-dashboard">





      {/* Header */}

      <header className="dashboard-title">


        <h1>

          Admin Dashboard

        </h1>



        <p>

          Welcome back, Administrator

        </p>



      </header>









      {/* Statistics Cards */}


      <div className="stats-grid">





        <div className="stat-card">


          <h3>

            Users

          </h3>


          <strong>

            {stats.totalUsers}

          </strong>


        </div>







        <div className="stat-card">


          <h3>

            Products

          </h3>


          <strong>

            {stats.totalProducts}

          </strong>


        </div>







        <div className="stat-card">


          <h3>

            Orders

          </h3>


          <strong>

            {stats.totalOrders}

          </strong>


        </div>







        <div className="stat-card">


          <h3>

            Revenue

          </h3>


          <strong>

            {formatPrice(
              stats.totalRevenue
            )}

          </strong>


        </div>





      </div>









      {/* Quick Actions */}


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









      {/* Sales Analytics */}


      <section className="sales-section">


        <h2>

          Sales Analytics

        </h2>





        {

          sales.length === 0 ?


          (

            <p>

              No sales data available.

            </p>

          )



          :



          (

            <div className="sales-list">


              {

                sales.map((sale) => (


                  <div

                    className="sales-item"

                    key={
                      `${sale._id.year}-${sale._id.month}`
                    }

                  >


                    <span>

                      {sale._id.month}/

                      {sale._id.year}

                    </span>




                    <strong>

                      {formatPrice(
                        sale.totalSales
                      )}

                    </strong>




                    <small>

                      {sale.totalOrders}

                      {" "}Orders

                    </small>



                  </div>


                ))

              }



            </div>

          )


        }



      </section>









      {/* Recent Orders */}


      <section className="recent-orders">


        <h2>

          Recent Orders

        </h2>





        {

          recentOrders.length === 0 ?


          (

            <p>

              No recent orders.

            </p>

          )



          :



          (


            <table className="admin-table">



              <thead>


                <tr>


                  <th>

                    Order

                  </th>



                  <th>

                    Customer

                  </th>



                  <th>

                    Status

                  </th>



                  <th>

                    Total

                  </th>


                </tr>


              </thead>







              <tbody>



                {

                  recentOrders.map((order) => (



                    <tr key={order._id}>


                      <td>

                        {order.orderNumber}

                      </td>




                      <td>

                        {
                          order.user?.name ||
                          "Unknown"
                        }

                      </td>




                      <td>

                        {order.status}

                      </td>




                      <td>

                        {formatPrice(
                          order.totalAmount
                        )}

                      </td>



                    </tr>


                  ))


                }



              </tbody>




            </table>


          )


        }



      </section>






    </section>


  );

}



export default AdminDashboard;