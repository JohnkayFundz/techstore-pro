import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { currency } from "../data/products";

import { createOrder } from "../api/orderApi";


function Checkout() {


  const navigate = useNavigate();


  const {
    state,
    cartTotal,
    dispatch,
  } = useCart();



  const [form, setForm] = useState({

    name: "",
    email: "",
    phone: "",
    address: "",

  });



  const [ordered, setOrdered] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");




  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });

  };





  const handlePlaceOrder = async (e) => {

    e.preventDefault();


    setLoading(true);

    setError("");



    try {


      const orderData = {


        items: state.cart.map((item) => ({


          productId: item.id,


          name: item.name,


          image: item.image,


          price: item.price,


          quantity: item.quantity,


        })),



        shippingAddress: {


          fullName: form.name,


          phone: form.phone,


          address: form.address,


          city: "Lagos",


          country: "Nigeria",


        },



        paymentMethod:
          "cash_on_delivery",



        totalAmount:
          cartTotal,


      };




      const result = await createOrder(
        orderData
      );




      if (result.success) {


        setOrdered(true);



        dispatch({

          type: "CLEAR_CART",

        });



      } else {


        setError(

          result.message ||
          "Order creation failed."

        );


      }




    } catch (err) {


      console.error(
        "Checkout Error:",
        err
      );


      setError(
        "Something went wrong while placing your order."
      );


    } finally {


      setLoading(false);


    }


  };







  if (
    state.cart.length === 0 &&
    !ordered
  ) {


    return (

      <section className="container">


        <h1>
          💳 Checkout
        </h1>


        <p>
          Your cart is empty.
        </p>



        <button

          className="btn-primary"

          onClick={() =>
            navigate("/products")
          }

        >

          Continue Shopping

        </button>


      </section>

    );

  }








  if (ordered) {


    return (

      <section className="container success-page">


        <h1>
          🎉 Order Placed Successfully!
        </h1>



        <p>
          Thank you for shopping with TechStore Pro.
        </p>



        <button

          className="btn-primary"

          onClick={() =>
            navigate("/")
          }

        >

          Back Home

        </button>


      </section>

    );

  }








  return (

    <section className="container checkout-page">


      <h1>
        💳 Checkout
      </h1>




      {error && (

        <div className="error-message">

          {error}

        </div>

      )}






      <div className="checkout-container">





        {/* Customer Details */}


        <form

          className="checkout-form"

          onSubmit={handlePlaceOrder}

        >


          <h2>
            Customer Information
          </h2>





          <input

            type="text"

            name="name"

            placeholder="Full Name"

            value={form.name}

            onChange={handleChange}

            required

          />





          <input

            type="email"

            name="email"

            placeholder="Email Address"

            value={form.email}

            onChange={handleChange}

            required

          />





          <input

            type="tel"

            name="phone"

            placeholder="Phone Number"

            value={form.phone}

            onChange={handleChange}

            required

          />





          <textarea

            name="address"

            placeholder="Shipping Address"

            rows="5"

            value={form.address}

            onChange={handleChange}

            required

          />





          <button

            className="checkout-btn"

            type="submit"

            disabled={loading}

          >


            {loading

              ? "Placing Order..."

              : "Place Order"

            }


          </button>




        </form>









        {/* Order Summary */}



        <aside className="order-summary">


          <h2>
            Order Summary
          </h2>





          {

            state.cart.map((item) => (


              <div

                key={item.id}

                className="summary-item"

              >


                <span>


                  {item.name}


                  {" × "}


                  {item.quantity}


                </span>





                <strong>


                  {currency}


                  {(
                    item.price *
                    item.quantity

                  ).toLocaleString()}



                </strong>



              </div>


            ))

          }





          <hr />





          <h2>

            Total:

            {" "}

            {currency}

            {cartTotal.toLocaleString()}


          </h2>





        </aside>





      </div>





    </section>

  );

}



export default Checkout;