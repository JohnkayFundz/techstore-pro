import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";


/* ==========================================================
   DASHBOARD STATISTICS
========================================================== */

export const getDashboardStats = async (req, res) => {
  try {

    const [
      totalProducts,
      totalUsers,
      totalOrders,
    ] = await Promise.all([

      Product.countDocuments(),

      User.countDocuments(),

      Order.countDocuments(),

    ]);


    const revenueResult = await Order.aggregate([

      {
        $match: {
          status: {
            $ne: "cancelled",
          },
        },
      },

      {
        $group: {

          _id: null,

          totalRevenue: {
            $sum: "$totalAmount",
          },

        },
      },

    ]);


    const revenue =
      revenueResult[0]?.totalRevenue || 0;



    const recentOrders =
      await Order.find()

        .populate(
          "user",
          "name email"
        )

        .sort({
          createdAt: -1,
        })

        .limit(5);



    res.status(200).json({

      success: true,

      stats: {

        totalProducts,

        totalUsers,

        totalOrders,

        revenue,

      },


      recentOrders,

    });


  } catch (error) {

    console.error(
      "Dashboard Error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Failed to load dashboard data.",

    });

  }
};



/* ==========================================================
   USER MANAGEMENT
========================================================== */


export const getUsers = async (req, res) => {

  try {

    const users =
      await User.find()

      .select("-password")

      .sort({
        createdAt: -1,
      });


    res.json({

      success:true,

      users,

    });


  } catch(error){

    res.status(500).json({

      success:false,

      message:error.message,

    });

  }

};



export const updateUserRole = async (
  req,
  res
) => {

  try {

    const {
      role
    } = req.body;



    const allowedRoles = [
      "user",
      "admin",
    ];



    if(
      !allowedRoles.includes(role)
    ){

      return res.status(400).json({

        success:false,

        message:
          "Invalid user role.",

      });

    }



    const user =
      await User.findById(
        req.params.id
      );



    if(!user){

      return res.status(404).json({

        success:false,

        message:
          "User not found.",

      });

    }



    user.role = role;


    await user.save();



    res.json({

      success:true,

      message:
        "User role updated.",

      user,

    });



  } catch(error){

    res.status(500).json({

      success:false,

      message:error.message,

    });

  }

};



export const deleteUser = async (
  req,
  res
) => {

  try {


    const user =
      await User.findById(
        req.params.id
      );


    if(!user){

      return res.status(404).json({

        success:false,

        message:
          "User not found.",

      });

    }



    await user.deleteOne();



    res.json({

      success:true,

      message:
        "User deleted.",

    });


  } catch(error){


    res.status(500).json({

      success:false,

      message:error.message,

    });


  }

};



/* ==========================================================
   ORDER MANAGEMENT
========================================================== */


export const getOrders = async (
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



    res.json({

      success:true,

      orders,

    });


  } catch(error){

    res.status(500).json({

      success:false,

      message:error.message,

    });

  }

};



export const updateOrderStatus = async (
  req,
  res
) => {

  try {


    const {
      status
    } = req.body;



    const allowedStatus = [

      "pending",

      "processing",

      "shipped",

      "delivered",

      "cancelled",

    ];



    if(
      !allowedStatus.includes(status)
    ){

      return res.status(400).json({

        success:false,

        message:
          "Invalid order status.",

      });

    }



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



    res.json({

      success:true,

      message:
        "Order status updated.",

      order,

    });



  } catch(error){


    res.status(500).json({

      success:false,

      message:error.message,

    });


  }

};



/* ==========================================================
   PRODUCT MANAGEMENT
========================================================== */


export const getProducts = async (
  req,
  res
) => {

  try {


    const products =
      await Product.find()

      .sort({
        createdAt:-1,
      });



    res.json({

      success:true,

      products,

    });


  } catch(error){

    res.status(500).json({

      success:false,

      message:error.message,

    });

  }

};



export const getProduct = async (
  req,
  res
) => {

  try {

    const product =
      await Product.findById(
        req.params.id
      );



    if(!product){

      return res.status(404).json({

        success:false,

        message:
          "Product not found.",

      });

    }



    res.json({

      success:true,

      product,

    });


  } catch(error){

    res.status(500).json({

      success:false,

      message:error.message,

    });

  }

};



export const createProduct = async (
  req,
  res
) => {

  try {

    const product =
      await Product.create(
        req.body
      );


    res.status(201).json({

      success:true,

      message:
        "Product created successfully.",

      product,

    });


  } catch(error){

    res.status(400).json({

      success:false,

      message:error.message,

    });

  }

};



export const updateProduct = async (
  req,
  res
) => {

  try {


    const product =
      await Product.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
          new:true,
          runValidators:true,
        }

      );



    if(!product){

      return res.status(404).json({

        success:false,

        message:
          "Product not found.",

      });

    }



    res.json({

      success:true,

      message:
        "Product updated successfully.",

      product,

    });


  } catch(error){

    res.status(400).json({

      success:false,

      message:error.message,

    });

  }

};



export const deleteProduct = async (
  req,
  res
) => {

  try {


    const product =
      await Product.findById(
        req.params.id
      );



    if(!product){

      return res.status(404).json({

        success:false,

        message:
          "Product not found.",

      });

    }



    await product.deleteOne();



    res.json({

      success:true,

      message:
        "Product deleted successfully.",

    });


  } catch(error){


    res.status(500).json({

      success:false,

      message:error.message,

    });


  }

};



/* ==========================================================
   SALES ANALYTICS
========================================================== */


export const getSalesAnalytics = async (
  req,
  res
) => {

  try {


    const sales =
      await Order.aggregate([

      {
        $match:{
          status:{
            $ne:"cancelled",
          },
        },
      },


      {
        $group:{

          _id:{

            year:{
              $year:"$createdAt",
            },

            month:{
              $month:"$createdAt",
            },

          },


          sales:{
            $sum:"$totalAmount",
          },

        },

      },


      {
        $sort:{

          "_id.year":1,

          "_id.month":1,

        },

      },

    ]);



    const months = [

      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",

    ];



    const salesData =
      sales.map(item => ({

        month:
          months[item._id.month - 1],

        sales:
          item.sales,

      }));



    res.json({

      success:true,

      salesData,

    });



  } catch(error){


    res.status(500).json({

      success:false,

      message:
        "Failed to load analytics.",

    });


  }

};