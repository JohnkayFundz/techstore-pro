import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { currency } from "../data/products";


function CartPage() {


  const {
    state,
    dispatch,
    cartTotal,
  } = useCart();





  if (state.cart.length === 0) {


    return (

      <section className="empty-cart container">


        <h1>
          🛒 Shopping Cart
        </h1>


        <p>
          Your cart is empty.
        </p>



        <Link
          to="/products"
          className="btn-primary"
        >

          Continue Shopping

        </Link>


      </section>

    );

  }







  return (

    <section className="cart-page container">


      <h1>
        🛒 Shopping Cart
      </h1>





      <div className="cart-layout">



        {/* Cart Items */}


        <div className="cart-items">


          {
            state.cart.map((item)=>(


              <article

                key={item.id}

                className={
                  item.id === state.lastAddedId
                  ? "cart-item highlight"
                  : "cart-item"
                }

              >



                <div className="cart-product">


                  <div className="cart-image">

                    {item.image}

                  </div>



                  <div>


                    <h2>
                      {item.name}
                    </h2>


                    <p>
                      {item.brand}
                    </p>


                    <strong>

                      {currency}
                      {item.price.toLocaleString()}

                    </strong>


                  </div>


                </div>







                <div className="cart-actions">



                  <div className="quantity-controls">


                    <button

                      onClick={()=>
                        dispatch({

                          type:"DECREASE",

                          payload:item.id,

                        })
                      }

                    >

                      −

                    </button>



                    <span>
                      {item.quantity}
                    </span>



                    <button

                      onClick={()=>
                        dispatch({

                          type:"INCREASE",

                          payload:item.id,

                        })
                      }

                    >

                      +

                    </button>


                  </div>






                  <p>

                    Subtotal:

                    <strong>

                      {currency}

                      {
                        (
                          item.price *
                          item.quantity

                        ).toLocaleString()

                      }

                    </strong>


                  </p>







                  <button

                    className="remove-btn"

                    onClick={()=>

                      dispatch({

                        type:"REMOVE",

                        payload:item.id,

                      })

                    }

                  >

                    🗑 Remove

                  </button>



                </div>



              </article>


            ))
          }


        </div>








        {/* Summary */}



        <aside className="cart-summary">


          <h2>
            Order Summary
          </h2>




          <div className="summary-row">

            <span>
              Items
            </span>


            <span>
              {state.cart.length}
            </span>


          </div>






          <div className="summary-row">


            <span>
              Total
            </span>



            <strong>

              {currency}

              {cartTotal.toLocaleString()}

            </strong>


          </div>






          <button

            className="btn-primary"

          >

            💳 Checkout

          </button>






          <button

            className="clear-btn"

            onClick={()=>

              dispatch({

                type:"CLEAR_CART"

              })

            }

          >

            Clear Cart

          </button>




        </aside>



      </div>


    </section>

  );

}


export default CartPage;