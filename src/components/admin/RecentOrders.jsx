import PropTypes from "prop-types";
import { Link } from "react-router-dom";


function RecentOrders({ orders }) {


  const formatStatus = (status) => {

    return status
      ? status.charAt(0).toUpperCase() +
          status.slice(1)
      : "Pending";

  };



  return (

    <section className="recent-orders">

      <div className="recent-orders-header">

        <div>

          <h2>
            Recent Orders
          </h2>

          <p>
            Latest customer purchases
          </p>

        </div>


        <Link
          to="/admin/orders"
          className="view-all-btn"
        >
          View All
        </Link>

      </div>





      <div className="table-wrapper">


        {orders.length === 0 ? (

          <div className="empty-orders">

            <p>
              No orders available.
            </p>

          </div>


        ) : (


          <table className="orders-table">


            <thead>

              <tr>

                <th>
                  Order ID
                </th>


                <th>
                  Customer
                </th>


                <th>
                  Date
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


              {orders.map((order) => (


                <tr key={order._id}>


                  <td>

                    #

                    {order._id
                      .slice(-6)
                      .toUpperCase()}

                  </td>





                  <td>

                    <strong>

                      {
                        order.user?.name ||
                        order.shippingAddress?.fullName ||
                        "Guest"
                      }

                    </strong>


                  </td>





                  <td>

                    {
                      order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "N/A"
                    }

                  </td>





                  <td>

                    <span
                      className={
                        `status-badge status-${order.status}`
                      }
                    >

                      {
                        formatStatus(
                          order.status
                        )
                      }

                    </span>

                  </td>





                  <td>

                    ₦

                    {
                      Number(
                        order.totalAmount || 0
                      )
                      .toLocaleString(
                        "en-NG"
                      )
                    }

                  </td>


                </tr>


              ))}


            </tbody>


          </table>


        )}


      </div>


    </section>

  );

}



RecentOrders.propTypes = {

  orders:
    PropTypes.array.isRequired,

};



export default RecentOrders;