import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { getMyOrders } from "../api/orderApi";


function Orders() {


  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("All");

  const [sort, setSort] = useState("Newest");





  useEffect(() => {


    const fetchOrders = async () => {


      try {


        const result = await getMyOrders();



        if (result.success) {


          setOrders(result.orders);


        } else {


          setError(
            result.message ||
            "Failed to load orders."
          );


        }



      } catch (err) {


        console.error(
          "Orders Error:",
          err
        );


        setError(
          "Unable to fetch orders."
        );



      } finally {


        setLoading(false);


      }


    };



    fetchOrders();



  }, []);







  const filteredOrders = useMemo(() => {


    let result = [...orders];



    if (search.trim()) {


      result = result.filter((order) =>

        order._id
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

      );


    }





    if (status !== "All") {


      result = result.filter(
        (order) =>
          order.status === status
      );


    }





    result.sort((a, b) => {


      if (sort === "Newest") {


        return (
          new Date(b.createdAt) -
          new Date(a.createdAt)
        );


      }



      return (
        new Date(a.createdAt) -
        new Date(b.createdAt)
      );


    });



    return result;



  }, [
    orders,
    search,
    status,
    sort,
  ]);








  const stats = {


    total:
      orders.length,



    pending:
      orders.filter(
        (order) =>
          order.status === "pending"
      ).length,



    processing:
      orders.filter(
        (order) =>
          order.status === "processing"
      ).length,



    shipped:
      orders.filter(
        (order) =>
          order.status === "shipped"
      ).length,



    delivered:
      orders.filter(
        (order) =>
          order.status === "delivered"
      ).length,

  };








  if (loading) {


    return (

      <section className="container">

        <h2>
          Loading orders...
        </h2>

      </section>

    );

  }








  return (

    <section className="orders-page">


      <div className="container">





        <div className="page-header">


          <h1>
            My Orders
          </h1>


          <p>
            Track and manage your purchases.
          </p>


        </div>






        {error && (

          <div className="error-message">

            {error}

          </div>

        )}








        <div className="orders-stats">



          <div className="orders-stat">

            <h2>
              {stats.total}
            </h2>

            <p>
              Total
            </p>

          </div>





          <div className="orders-stat">

            <h2>
              {stats.pending}
            </h2>

            <p>
              Pending
            </p>

          </div>





          <div className="orders-stat">

            <h2>
              {stats.processing}
            </h2>

            <p>
              Processing
            </p>

          </div>





          <div className="orders-stat">

            <h2>
              {stats.shipped}
            </h2>

            <p>
              Shipped
            </p>

          </div>





          <div className="orders-stat">

            <h2>
              {stats.delivered}
            </h2>

            <p>
              Delivered
            </p>

          </div>



        </div>








        <div className="orders-toolbar">



          <input

            type="search"

            placeholder="Search Order ID..."

            value={search}

            onChange={(e) =>
              setSearch(e.target.value)
            }

          />





          <select

            value={status}

            onChange={(e) =>
              setStatus(e.target.value)
            }

          >

            <option value="All">
              All
            </option>


            <option value="pending">
              Pending
            </option>


            <option value="processing">
              Processing
            </option>


            <option value="shipped">
              Shipped
            </option>


            <option value="delivered">
              Delivered
            </option>


          </select>







          <select

            value={sort}

            onChange={(e) =>
              setSort(e.target.value)
            }

          >

            <option value="Newest">
              Newest
            </option>


            <option value="Oldest">
              Oldest
            </option>


          </select>



        </div>









        <div className="orders-list">





          {filteredOrders.length === 0 ? (



            <div className="empty-orders">


              <h2>
                No Orders Found
              </h2>


              <p>
                You have not placed any orders yet.
              </p>


            </div>



          ) : (



            filteredOrders.map((order) => (



              <div

                key={order._id}

                className="order-card"

              >




                <div className="order-top">


                  <div>


                    <h3>

                      Order #
                      {order._id.slice(-8)}

                    </h3>



                    <p>

                      {
                        new Date(
                          order.createdAt
                        ).toLocaleDateString()

                      }

                    </p>


                  </div>





                  <span

                    className={
                      `status ${order.status}`
                    }

                  >

                    {order.status}

                  </span>



                </div>








                <div className="order-middle">



                  <div>

                    <strong>
                      Total
                    </strong>


                    <p>

                      $

                      {
                        order.totalAmount
                          .toLocaleString()
                      }

                    </p>


                  </div>






                  <div>

                    <strong>
                      Payment
                    </strong>


                    <p>

                      {
                        order.paymentMethod
                      }

                    </p>


                  </div>






                  <div>

                    <strong>
                      Items
                    </strong>


                    <p>

                      {
                        order.items.length
                      }

                      {" "}products

                    </p>


                  </div>



                </div>








                <div className="order-bottom">



                  <Link

                    to={`/orders/${order._id}`}

                    className="btn btn-primary"

                  >

                    View Details

                  </Link>



                </div>






              </div>



            ))

          )}




        </div>





      </div>


    </section>

  );

}



export default Orders;