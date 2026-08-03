import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";

import { getOrderById } from "../api/orderApi";
import { currency } from "../data/products";


function OrderDetails() {

  const {
    id,
  } = useParams();


  const navigate = useNavigate();


  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");




  useEffect(() => {

    loadOrder();

  }, [id]);





  const loadOrder = async () => {

    try {

      setLoading(true);

      setError("");


      const result = await getOrderById(id);



      if (result.success) {

        setOrder(result.order);


      } else {

        setError(
          result.message ||
          "Order not found."
        );

      }



    } catch (err) {

      console.error(
        "Order Details Error:",
        err
      );


      setError(
        err.response?.data?.message ||
        "Failed to load order."
      );


    } finally {

      setLoading(false);

    }

  };







  if (loading) {

    return (

      <section className="container">

        <h2>
          Loading Order...
        </h2>

      </section>

    );

  }






  if (error) {

    return (

      <section className="container">

        <div className="error-message">


          <h2>
            {error}
          </h2>



          <Link

            to="/orders"

            className="btn btn-primary"

          >

            Back to Orders

          </Link>



        </div>

      </section>

    );

  }






  if (!order) {

    return null;

  }






  return (

    <section className="order-details-page">


      <div className="container">





        <div className="order-header">


          <div>


            <h1>

              Order #

              {String(order._id)
                .slice(-8)
                .toUpperCase()}


            </h1>



            <p>

              Placed on{" "}

              {new Date(
                order.createdAt
              ).toLocaleString()}


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









        <div className="order-summary-grid">





          <div className="summary-card">


            <h3>
              Payment
            </h3>


            <p>
              {order.paymentMethod}
            </p>


          </div>







          <div className="summary-card">


            <h3>
              Shipping Address
            </h3>



            <p>
              {order.shippingAddress.fullName}
            </p>


            <p>
              {order.shippingAddress.phone}
            </p>


            <p>
              {order.shippingAddress.address}
            </p>


            <p>

              {order.shippingAddress.city},{" "}

              {order.shippingAddress.country}

            </p>



          </div>








          <div className="summary-card">


            <h3>
              Status
            </h3>


            <p>
              {order.status}
            </p>


          </div>








          <div className="summary-card">


            <h3>
              Total
            </h3>


            <h2>

              {currency}

              {order.totalAmount
                .toLocaleString("en-US")}


            </h2>


          </div>






        </div>









        <div className="order-products">


          <h2>
            Items Ordered
          </h2>





          {order.items.map(
            (item, index) => (


              <div

                key={index}

                className="ordered-product"

              >





                <img

                  src={
                    item.image ||
                    "/images/product-placeholder.png"
                  }

                  alt={item.name}

                />







                <div className="ordered-product-info">


                  <h3>
                    {item.name}
                  </h3>



                  <p>
                    Quantity: {item.quantity}
                  </p>



                  <p>

                    Price: {currency}

                    {item.price
                      .toLocaleString("en-US")}

                  </p>



                </div>







                <strong>


                  {currency}

                  {(
                    item.price *
                    item.quantity

                  ).toLocaleString("en-US")}



                </strong>





              </div>



            )

          )}





        </div>









        <div className="order-actions">





          <button

            className="btn btn-secondary"

            onClick={() =>
              navigate("/orders")
            }

          >

            Back to Orders

          </button>







          <Link

            to="/products"

            className="btn btn-primary"

          >

            Continue Shopping

          </Link>








          {(order.status === "pending" ||
            order.status === "processing") && (

              <button

                className="btn btn-danger"

                disabled

                title="Cancel order feature coming soon"

              >

                Cancel Order

              </button>

            )}




        </div>





      </div>



    </section>

  );

}



export default OrderDetails;