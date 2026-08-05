import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAdminOrders,
  updateOrderStatus,
  deleteAdminOrder,
} from "../../api/adminApi";

import {
  formatPrice,
} from "../../utils/formatPrice";

import "./AdminOrders.css";


function AdminOrders() {


  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [deleting, setDeleting] = useState(null);




  // ==========================================================
  // LOAD ORDERS
  // ==========================================================

  const loadOrders = async () => {

    try {

      setLoading(true);

      setError("");


      const response = await getAdminOrders();


      const orderList =
        response?.data?.orders ||
        response?.orders ||
        response ||
        [];


      setOrders(orderList);


    } catch (error) {

      console.error(
        "Load Orders Error:",
        error
      );


      setError(
        error.response?.data?.message ||
        "Failed to load orders."
      );


    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    loadOrders();

  }, []);







  // ==========================================================
  // FORMAT STATUS
  // ==========================================================

  const formatStatus = (status) => {

    if (!status) return "Pending";


    return (

      status.charAt(0).toUpperCase() +

      status.slice(1).toLowerCase()

    );

  };








  // ==========================================================
  // UPDATE STATUS
  // ==========================================================

  const handleStatusChange = async (

    orderId,

    status

  ) => {


    try {


      await updateOrderStatus(

        orderId,

        status.toLowerCase()

      );



      setOrders(previous =>

        previous.map(order =>

          order._id === orderId

            ? {

                ...order,

                status,

              }

            :

              order

        )

      );


    } catch (error) {


      alert(

        error.response?.data?.message ||

        "Failed to update status."

      );


    }


  };









  // ==========================================================
  // DELETE ORDER
  // ==========================================================

  const handleDelete = async (

    orderId

  ) => {


    const confirmDelete =

      window.confirm(

        "Delete this order?"

      );


    if (!confirmDelete) return;



    try {


      setDeleting(orderId);



      await deleteAdminOrder(

        orderId

      );



      setOrders(previous =>

        previous.filter(

          order =>

          order._id !== orderId

        )

      );



    } catch(error){


      alert(

        error.response?.data?.message ||

        "Failed to delete order."

      );


    } finally {


      setDeleting(null);


    }


  };









  // ==========================================================
  // FILTER
  // ==========================================================

  const filteredOrders = useMemo(() => {


    return orders.filter(order => {


      const customer =

        order.user?.name?.toLowerCase() || "";



      const email =

        order.user?.email?.toLowerCase() || "";



      const keyword =

        search.toLowerCase();




      const matchesSearch =

        customer.includes(keyword) ||

        email.includes(keyword);




      const status =

        formatStatus(order.status);




      const matchesStatus =

        statusFilter === "All" ||

        status === statusFilter;



      return (

        matchesSearch &&

        matchesStatus

      );


    });


  }, [

    orders,

    search,

    statusFilter,

  ]);









  // ==========================================================
  // SUMMARY
  // ==========================================================

  const totalOrders = orders.length;



  const pendingOrders =

    orders.filter(

      order =>

      formatStatus(order.status) === "Pending"

    ).length;



  const deliveredOrders =

    orders.filter(

      order =>

      formatStatus(order.status) === "Delivered"

    ).length;



  const cancelledOrders =

    orders.filter(

      order =>

      formatStatus(order.status) === "Cancelled"

    ).length;








  if(loading){

    return (

      <div className="admin-loading">

        Loading orders...

      </div>

    );

  }






  if(error){

    return (

      <div className="error-message">

        {error}

      </div>

    );

  }







  return (

    <section className="admin-orders-page">



      <div className="page-header">

        <h1>
          Orders Management
        </h1>


        <p>
          Manage customer orders and delivery status
        </p>

      </div>







      <div className="orders-summary">


        <div className="summary-card">

          <h3>
            {totalOrders}
          </h3>

          <span>
            Total Orders
          </span>

        </div>




        <div className="summary-card">

          <h3>
            {pendingOrders}
          </h3>

          <span>
            Pending
          </span>

        </div>





        <div className="summary-card">

          <h3>
            {deliveredOrders}
          </h3>

          <span>
            Delivered
          </span>

        </div>





        <div className="summary-card">

          <h3>
            {cancelledOrders}
          </h3>

          <span>
            Cancelled
          </span>

        </div>



      </div>









      <div className="orders-toolbar">


        <input

          type="text"

          placeholder="Search customer..."

          value={search}

          onChange={(e)=>

            setSearch(e.target.value)

          }

        />





        <select

          value={statusFilter}

          onChange={(e)=>

            setStatusFilter(

              e.target.value

            )

          }

        >

          <option>
            All
          </option>

          <option>
            Pending
          </option>

          <option>
            Processing
          </option>

          <option>
            Shipped
          </option>

          <option>
            Delivered
          </option>

          <option>
            Cancelled
          </option>


        </select>


      </div>









      <div className="admin-orders-list">


      {
        filteredOrders.length === 0 ?


        (

          <div className="empty-orders">

            No orders found

          </div>

        )

        :

        filteredOrders.map(order => {


          const status = formatStatus(order.status);



          return (

          <div

            className="admin-order-card"

            key={order._id}

          >





            <div className="order-top">


              <div>


                <h3>

                  Order #

                  {order._id.slice(-8)}

                </h3>



                <p>

                  Customer:

                  {" "}

                  {order.user?.name || "Guest"}

                </p>



                <p>

                  {order.user?.email}

                </p>



                <p>

                  Payment:

                  {" "}

                  {order.paymentMethod || "N/A"}

                </p>



                <p>

                  Paid:

                  {" "}

                  {order.isPaid ? "Yes" : "No"}

                </p>


              </div>






              <select

                value={status}

                onChange={(e)=>

                  handleStatusChange(

                    order._id,

                    e.target.value

                  )

                }

              >

                <option>Pending</option>

                <option>Processing</option>

                <option>Shipped</option>

                <option>Delivered</option>

                <option>Cancelled</option>


              </select>


            </div>









            <div className="shipping-info">


              <h4>
                Shipping Information
              </h4>



              <p>

                {

                order.shippingAddress?.address ||

                "No address"

                }

              </p>



              <p>

                {

                order.shippingAddress?.city ||

                "No city"

                }

              </p>



            </div>









            <div className="order-items">


              <h4>
                Products
              </h4>




              {

              order.orderItems?.map(item => (


                <div

                  className="admin-order-item"

                  key={

                    item._id ||

                    item.product

                  }

                >


                  <img

                    src={

                      item.image ||

                      "/images/product-placeholder.png"

                    }

                    alt={item.name}

                  />



                  <div>


                    <strong>

                      {item.name}

                    </strong>



                    <p>

                      Quantity:

                      {" "}

                      {item.quantity}

                    </p>


                  </div>



                </div>


              ))

              }



            </div>









            <div className="admin-order-footer">


              <div>


                <strong>

                  Total:

                  {" "}

                  {formatPrice(order.totalPrice)}

                </strong>



                <p>

                  {

                  new Date(order.createdAt)

                  .toLocaleDateString()

                  }

                </p>



                <span

                  className={

                  `status-badge ${status.toLowerCase()}`

                  }

                >

                  {status}

                </span>


              </div>







              <button

                className="delete-btn"

                disabled={deleting === order._id}

                onClick={()=>

                  handleDelete(order._id)

                }

              >

                {

                deleting === order._id

                ?

                "Deleting..."

                :

                "Delete"

                }


              </button>


            </div>





          </div>


          );


        })

      }


      </div>





    </section>

  );

}



export default AdminOrders;