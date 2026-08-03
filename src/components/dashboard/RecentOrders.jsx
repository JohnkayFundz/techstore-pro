import PropTypes from "prop-types";

import { currency } from "../../data/products";


function RecentOrders({
  orders,
}) {


  return (

    <div className="recent-orders">

      <h2>
        Recent Orders
      </h2>


      {orders.length === 0 ? (

        <p>
          No recent orders.
        </p>

      ) : (

        orders.map((order) => (

          <div
            key={order._id}
            className="recent-order-item"
          >

            <div>

              <strong>
                #
                {order._id
                  .slice(-6)
                  .toUpperCase()}
              </strong>


              <p>
                {order.user?.name ||
                  "Customer"}
              </p>

            </div>


            <div>

              <strong>

                {currency}

                {order.totalAmount
                  .toLocaleString()}

              </strong>


              <span>
                {order.status}
              </span>

            </div>


          </div>

        ))

      )}


    </div>

  );

}


RecentOrders.propTypes = {

  orders: PropTypes.array.isRequired,

};


export default RecentOrders;