import Order from "../models/Order.js";



/* ==========================================================
   CREATE ORDER
   POST /api/orders
   PRIVATE
========================================================== */

export const createOrder = async (
  req,
  res
) => {

  try {


    const {
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
    } = req.body;



    // Validate cart items

    if (
      !items ||
      items.length === 0
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Order must contain at least one item.",

      });

    }



    // Create order

    const order = await Order.create({

      user: req.user._id,

      items,

      shippingAddress,

      paymentMethod,

      totalAmount,

    });



    res.status(201).json({

      success: true,

      message:
        "Order created successfully.",

      order,

    });



  } catch (error) {


    console.error(
      "Create Order Error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        error.message ||
        "Failed to create order.",

    });


  }

};






/* ==========================================================
   GET MY ORDERS
   GET /api/orders/my-orders
   PRIVATE
========================================================== */

export const getMyOrders = async (
  req,
  res
) => {

  try {


    const orders =
      await Order.find({

        user: req.user._id,

      })
      .sort({
        createdAt: -1,
      });



    res.status(200).json({

      success: true,

      count: orders.length,

      orders,

    });



  } catch(error) {


    console.error(
      "Get My Orders Error:",
      error
    );



    res.status(500).json({

      success:false,

      message:
        error.message ||
        "Failed to get orders.",

    });


  }

};







/* ==========================================================
   GET SINGLE ORDER
   GET /api/orders/:id
   PRIVATE
========================================================== */

export const getOrderById = async (
  req,
  res
) => {


  try {


    const order =
      await Order.findById(
        req.params.id
      )
      .populate(
        "user",
        "name email"
      );



    if(!order){

      return res.status(404).json({

        success:false,

        message:
          "Order not found.",

      });

    }



    // Allow only owner or admin

    if(
      order.user._id.toString() !==
      req.user._id.toString()
      &&
      req.user.role !== "admin"
    ){

      return res.status(403).json({

        success:false,

        message:
          "You are not allowed to view this order.",

      });

    }



    res.status(200).json({

      success:true,

      order,

    });



  } catch(error) {


    console.error(
      "Get Order Error:",
      error
    );


    res.status(500).json({

      success:false,

      message:
        error.message ||
        "Failed to get order.",

    });


  }

};







/* ==========================================================
   GET ALL ORDERS (ADMIN)
   GET /api/orders
   ADMIN
========================================================== */

export const getAllOrders = async (
  req,
  res
) => {

  try {


    const orders =
      await Order.find()
      .populate(
        "user",
        "name email"
      )
      .sort({
        createdAt:-1,
      });



    res.status(200).json({

      success:true,

      count: orders.length,

      orders,

    });



  } catch(error) {


    console.error(
      "Get All Orders Error:",
      error
    );



    res.status(500).json({

      success:false,

      message:
        error.message ||
        "Failed to get orders.",

    });


  }

};







/* ==========================================================
   UPDATE ORDER STATUS (ADMIN)
   PATCH /api/orders/:id/status
   ADMIN
========================================================== */

export const updateOrderStatus = async (
  req,
  res
) => {

  try {


    const {
      status,
    } = req.body;



    const order =
      await Order.findById(
        req.params.id
      );



    if(!order){

      return res.status(404).json({

        success:false,

        message:
          "Order not found.",

      });

    }



    order.status = status;


    await order.save();



    res.status(200).json({

      success:true,

      message:
        "Order status updated.",

      order,

    });



  } catch(error) {


    console.error(
      "Update Order Status Error:",
      error
    );


    res.status(500).json({

      success:false,

      message:
        error.message ||
        "Failed to update order.",

    });


  }

};