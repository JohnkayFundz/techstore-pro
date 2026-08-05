import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyOrders } from "../api/orderApi";
import { formatPrice } from "../utils/formatPrice";



function MyOrders() {


  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");




  // ==========================================================
  // LOAD ORDERS
  // ==========================================================

  useEffect(() => {

    const loadOrders = async () => {

      try {


        const response =
          await getMyOrders();



        if (
          response.data.success
        ) {

          setOrders(
            response.data.orders
          );


        } else {


          setError(
            response.data.message ||
            "Failed to load orders."
          );


        }



      } catch (err) {


        console.error(
          "My Orders Error:",
          err
        );


        setError(

          err.response?.data?.message ||
          "Failed to load your orders."

        );


      } finally {


        setLoading(false);


      }

    };



    loadOrders();


  }, []);







  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (loading) {

    return (

      <section className="container">

        <h2>
          Loading Orders...
        </h2>

      </section>

    );

  }







  // ==========================================================
  // ERROR STATE
  // ==========================================================

  if (error) {

    return (

      <section className="container">

        <div className="error-message">

          {error}

        </div>


      </section>

    );

  }







  // ==========================================================
  // PAGE
  // ==========================================================

  return (

    <section className="container my-orders-page">


      <h1>
        📦 My Orders
      </h1>





      {
        orders.length === 0 ? (


          <div className="empty-orders">


            <h2>
              No Orders Yet
            </h2>



            <p>
              You haven't placed any orders yet.
            </p>



            <Link

              to="/products"

              className="btn btn-primary"

            >

              Start Shopping

            </Link>



          </div>



        ) : (



          <div className="orders-list">


            {
              orders.map((order) => (


                <div

                  key={order._id}

                  className="order-card"

                >



                  <div className="order-header">


                    <h3>

                      Order #

                      {
                        order.orderNumber ||
                        order._id
                          .slice(-8)
                          .toUpperCase()
                      }

                    </h3>



                    <span

                      className={
                        `status ${order.status}`
                      }

                    >

                      {
                        order.status
                      }

                    </span>


                  </div>






                  <p>

                    <strong>
                      Date:
                    </strong>

                    {" "}

                    {
                      new Date(
                        order.createdAt
                      )
                      .toLocaleDateString()
                    }

                  </p>





                  <p>

                    <strong>
                      Items:
                    </strong>

                    {" "}

                    {
                      order.items.length
                    }

                  </p>





                  <p>

                    <strong>
                      Total:
                    </strong>

                    {" "}

                    {
                      formatPrice(
                        order.totalAmount
                      )
                    }

                  </p>






                  <Link

                    to={
                      `/order-success/${order._id}`
                    }

                    className="btn btn-secondary"

                  >

                    View Details

                  </Link>




                </div>


              ))

            }



          </div>


        )

      }




    </section>

  );

}



export default MyOrders;