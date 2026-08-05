// ==========================================================
// Checkout.jsx
// ==========================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import { createOrder } from "../api/orderApi";
import { formatPrice } from "../utils/formatPrice";


function Checkout() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    cart,
    cartTotal,
    clearCart,
  } = useCart();


  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
    paymentMethod: "cash",
  });


  // ==========================================================
  // HANDLE INPUT CHANGE
  // ==========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // ==========================================================
  // SUBMIT ORDER
  // ==========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!user) {
      navigate("/login");
      return;
    }


    if (!cart || cart.length === 0) {
      alert("Your cart is empty");
      navigate("/cart");
      return;
    }


    try {
      setLoading(true);


      const orderData = {

        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
        },


        paymentMethod: formData.paymentMethod,


        items: cart.map((item) => ({
          product: item._id || item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),


        totalAmount: cartTotal,

      };


      const response = await createOrder(orderData);


      clearCart();


      navigate(
        `/order-success/${response.data._id}`
      );


    } catch (error) {

      console.error(
        "Order creation failed:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to place order"
      );

    } finally {

      setLoading(false);

    }
  };



  // ==========================================================
  // PAGE UI
  // ==========================================================


  return (

    <div className="checkout-page">


      <h1>
        Checkout
      </h1>



      <div className="checkout-container">



        {/* FORM */}

        <form
          className="checkout-form"
          onSubmit={handleSubmit}
        >


          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />


          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />


          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />


          <textarea
            name="address"
            placeholder="Delivery Address"
            value={formData.address}
            onChange={handleChange}
            required
          />


          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />


          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            required
          />



          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
          >

            <option value="cash">
              Cash On Delivery
            </option>


            <option value="card">
              Card Payment
            </option>

          </select>



          <button
            type="submit"
            disabled={loading}
          >

            {
              loading
              ? "Processing..."
              : "Place Order"
            }

          </button>


        </form>





        {/* ORDER SUMMARY */}


        <div className="order-summary">


          <h2>
            Order Summary
          </h2>



          {
            cart.map((item)=>(
              
              <div
                key={item.id || item._id}
                className="summary-item"
              >

                <span>
                  {item.name}
                  {" "}
                  x {item.quantity}
                </span>


                <span>
                  {
                    formatPrice(
                      item.price * item.quantity
                    )
                  }
                </span>


              </div>

            ))
          }



          <hr />


          <h3>

            Total:

            {" "}

            {
              formatPrice(cartTotal)
            }

          </h3>


        </div>



      </div>


    </div>

  );
}


export default Checkout;