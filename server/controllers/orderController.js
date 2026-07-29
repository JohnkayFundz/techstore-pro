import Order from "../models/Order.js";


/* ==========================================================
   CREATE ORDER
========================================================== */

export const createOrder = async (req, res) => {

  try {

    const {
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
    } = req.body;


    if (!items || items.length === 0) {

      return res.status(400).json({
        success: false,
        message: "Order items are required.",
      });

    }


    const order = await Order.create({

      user: req.user._id,

      items,

      shippingAddress,

      paymentMethod,

      totalAmount,

    });



    res.status(201).json({

      success: true,

      message: "Order created successfully.",

      order,

    });


  } catch (error) {

    console.error(
      "Create Order Error:",
      error
    );


    res.status(500).json({

      success: false,

      message: "Failed to create order.",

    });

  }

};



/* ==========================================================
   GET MY ORDERS
========================================================== */

export const getMyOrders = async (req, res) => {

  try {

    const orders = await Order.find({
      user: req.user._id,
    })
    .sort({
      createdAt: -1,
    });


    res.json({

      success: true,

      orders,

    });


  } catch (error) {

    console.error(
      "Get Orders Error:",
      error
    );


    res.status(500).json({

      success: false,

      message: "Failed to fetch orders.",

    });

  }

};



/* ==========================================================
   GET ALL ORDERS (ADMIN)
========================================================== */

export const getAllOrders = async (req, res) => {

  try {

    const orders = await Order.find()
      .populate(
        "user",
        "name email"
      )
      .sort({
        createdAt: -1,
      });


    res.json({

      success: true,

      orders,

    });


  } catch (error) {

    console.error(
      "Admin Orders Error:",
      error
    );


    res.status(500).json({

      success: false,

      message: "Failed to fetch orders.",

    });

  }

};