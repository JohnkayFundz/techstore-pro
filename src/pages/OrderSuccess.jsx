import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { getOrderById } from "../api/orderApi";
import { formatPrice } from "../utils/formatPrice";



function OrderSuccess() {

  const {
    id,
  } = useParams();


  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");



  useEffect(() => {

    const fetchOrder = async () => {

      try {

        const response =
          await getOrderById(id);


        setOrder(
          response.data.order
        );


      } catch(error) {


        console.error(
          "Order fetch error:",
          error
        );


        setError(
          "Unable to load order details."
        );


      } finally {

        setLoading(false);

      }

    };


    fetchOrder();


  }, [id]);





  if(loading){

    return (

      <div className="order-success">

        <h2>
          Loading order...
        </h2>

      </div>

    );

  }





  if(error){

    return (

      <div className="order-success">

        <h2>
          {error}
        </h2>


        <Link to="/">
          Back Home
        </Link>

      </div>

    );

  }





  return (

    <div className="order-success">


      <div className="success-card">


        <h1>
          🎉 Order Placed Successfully!
        </h1>


        <p>
          Thank you for shopping with TechStore Pro.
        </p>



        <div className="order-info">


          <h3>
            Order Information
          </h3>


          <p>
            Order Number:
            {" "}
            <strong>
              {order.orderNumber}
            </strong>
          </p>



          <p>
            Status:
            {" "}
            <strong>
              {order.status}
            </strong>
          </p>



          <p>
            Total:
            {" "}
            <strong>
              {
                formatPrice(
                  order.totalAmount
                )
              }
            </strong>
          </p>



        </div>





        <div className="order-items">


          <h3>
            Items
          </h3>



          {
            order.items.map(
              (item, index)=> (

                <div
                  key={index}
                  className="order-item"
                >


                  <img
                    src={item.image}
                    alt={item.name}
                  />


                  <div>

                    <h4>
                      {item.name}
                    </h4>


                    <p>
                      Quantity:
                      {" "}
                      {item.quantity}
                    </p>


                    <p>
                      {
                        formatPrice(
                          item.price
                        )
                      }
                    </p>

                  </div>


                </div>

              )
            )
          }


        </div>





        <div className="shipping">


          <h3>
            Delivery Address
          </h3>


          <p>
            {order.shippingAddress.fullName}
          </p>


          <p>
            {order.shippingAddress.address}
          </p>


          <p>
            {order.shippingAddress.city},
            {" "}
            {order.shippingAddress.state}
          </p>


          <p>
            {order.shippingAddress.country}
          </p>


        </div>





        <Link
          to="/products"
          className="continue-btn"
        >

          Continue Shopping

        </Link>



      </div>


    </div>

  );

}


export default OrderSuccess;