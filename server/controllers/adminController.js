import mongoose from "mongoose";

import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";


/* ==========================================================
   HELPERS
========================================================== */

/**
 * Safely return a useful error message.
 */
const getErrorMessage = (error, fallback) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
};


/**
 * Check whether a MongoDB ObjectId is valid.
 */
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};


/**
 * Convert a value to a number safely.
 */
const toNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
};


/* ==========================================================
   DASHBOARD
========================================================== */

/**
 * GET /api/admin/dashboard
 *
 * Admin dashboard statistics.
 */
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
    ] = await Promise.all([
      User.countDocuments(),

      Product.countDocuments({
        $or: [
          { isDeleted: { $ne: true } },
          { isDeleted: { $exists: false } },
        ],
      }),

      Order.countDocuments(),

      Order.countDocuments({
        status: "pending",
      }),

      Order.countDocuments({
        status: "processing",
      }),

      Order.countDocuments({
        status: "shipped",
      }),

      Order.countDocuments({
        status: "delivered",
      }),

      Order.countDocuments({
        status: "cancelled",
      }),
    ]);


    const revenueResult =
      await Order.aggregate([
        {
          $match: {
            status: "delivered",
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


    const totalRevenue =
      toNumber(
        revenueResult[0]?.totalRevenue
      );


    return res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        totalProducts,
        totalOrders,

        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,

        totalRevenue,
      },

      totalUsers,
      totalProducts,
      totalOrders,

      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,

      totalRevenue,
    });
  } catch (error) {
    console.error(
      "Get Dashboard Stats Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message: getErrorMessage(
        error,
        "Failed to load dashboard statistics."
      ),
    });
  }
};


/* ==========================================================
   SALES ANALYTICS
========================================================== */

/**
 * GET /api/admin/analytics
 * GET /api/admin/sales
 *
 * Sales analytics based on delivered orders.
 */
export const getSalesAnalytics = async (req, res) => {
  try {

    /* --------------------------------------------------------
       GET ALL ORDER COUNTS
    -------------------------------------------------------- */

    const [
      totalOrders,
      deliveredOrders,
      cancelledOrders,
    ] = await Promise.all([
      Order.countDocuments(),

      Order.countDocuments({
        status: "delivered",
      }),

      Order.countDocuments({
        status: "cancelled",
      }),
    ]);


    /* --------------------------------------------------------
       MONTHLY DELIVERED SALES
    -------------------------------------------------------- */

    const salesData =
      await Order.aggregate([
        {
          $match: {
            status: "delivered",
          },
        },

        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },

              month: {
                $month: "$createdAt",
              },
            },

            revenue: {
              $sum: "$totalAmount",
            },

            orders: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);


    /* --------------------------------------------------------
       FORMAT MONTHLY DATA
    -------------------------------------------------------- */

    const formattedSalesData =
      salesData.map((item) => ({
        year: item._id.year,

        month: item._id.month,

        monthName:
          new Date(
            2000,
            item._id.month - 1,
            1
          ).toLocaleString(
            "en-US",
            {
              month: "short",
            }
          ),

        sales:
          toNumber(item.revenue),

        revenue:
          toNumber(item.revenue),

        orders:
          Number(item.orders) || 0,
      }));


    /* --------------------------------------------------------
       TOTAL REVENUE
    -------------------------------------------------------- */

    const totalRevenue =
      formattedSalesData.reduce(
        (total, item) =>
          total +
          toNumber(item.revenue),

        0
      );


    /* --------------------------------------------------------
       AVERAGE ORDER VALUE
    -------------------------------------------------------- */

    const averageOrderValue =
      deliveredOrders > 0
        ? totalRevenue /
          deliveredOrders
        : 0;


    /* --------------------------------------------------------
       BEST PERFORMING MONTH
    -------------------------------------------------------- */

    let bestMonth = null;


    if (
      formattedSalesData.length > 0
    ) {
      bestMonth =
        formattedSalesData.reduce(
          (best, current) => {
            return current.sales >
              best.sales
              ? current
              : best;
          },
          formattedSalesData[0]
        );
    }


    /* --------------------------------------------------------
       RESPONSE
    -------------------------------------------------------- */

    return res.status(200).json({
      success: true,


      /* ------------------------------------------------------
         SUMMARY
         AdminAnalytics.jsx expects this object.
      ------------------------------------------------------ */

      summary: {
        totalRevenue,

        totalOrders,

        deliveredOrders,

        cancelledOrders,

        averageOrderValue,
      },


      /* ------------------------------------------------------
         MONTHLY SALES
         AdminAnalytics.jsx expects `sales`.
      ------------------------------------------------------ */

      sales:
        formattedSalesData,


      /* ------------------------------------------------------
         BEST MONTH
      ------------------------------------------------------ */

      bestMonth: bestMonth
        ? {
            year:
              bestMonth.year,

            month:
              bestMonth.month,

            monthName:
              bestMonth.monthName,

            sales:
              bestMonth.sales,

            revenue:
              bestMonth.revenue,

            orders:
              bestMonth.orders,
          }
        : {
            year: null,

            month: null,

            monthName: "N/A",

            sales: 0,

            revenue: 0,

            orders: 0,
          },


      /* ------------------------------------------------------
         BACKWARD COMPATIBILITY
      ------------------------------------------------------ */

      salesData:
        formattedSalesData,

      data:
        formattedSalesData,

      totalRevenue,

      deliveredOrders,

      totalOrders,

      cancelledOrders,

      averageOrderValue,
    });
  } catch (error) {
    console.error(
      "Get Sales Analytics Error:",
      error
    );

    return res.status(500).json({
      success: false,

      summary: {
        totalRevenue: 0,

        totalOrders: 0,

        deliveredOrders: 0,

        cancelledOrders: 0,

        averageOrderValue: 0,
      },

      sales: [],

      salesData: [],

      data: [],

      bestMonth: {
        year: null,

        month: null,

        monthName: "N/A",

        sales: 0,

        revenue: 0,

        orders: 0,
      },

      message: getErrorMessage(
        error,
        "Failed to load sales analytics."
      ),
    });
  }
};


/* ==========================================================
   USERS
========================================================== */

/**
 * GET /api/admin/users
 */
export const getUsers = async (req, res) => {
  try {
    const users =
      await User.find({})
        .select("-password")
        .sort({
          createdAt: -1,
        })
        .lean();


    return res.status(200).json({
      success: true,

      users,

      count: users.length,
    });
  } catch (error) {
    console.error(
      "Get Users Error:",
      error
    );

    return res.status(500).json({
      success: false,

      users: [],

      message: getErrorMessage(
        error,
        "Failed to load users."
      ),
    });
  }
};


/**
 * PUT /api/admin/users/:id/role
 */
export const updateUserRole = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const { role } = req.body;


    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,

        message: "Invalid user ID.",
      });
    }


    if (!role) {
      return res.status(400).json({
        success: false,

        message: "User role is required.",
      });
    }


    const allowedRoles = [
      "user",
      "admin",
    ];


    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid role. Use user or admin.",
      });
    }


    const user =
      await User.findById(id);


    if (!user) {
      return res.status(404).json({
        success: false,

        message: "User not found.",
      });
    }


    user.role = role;

    await user.save();


    const safeUser =
      user.toObject();

    delete safeUser.password;


    return res.status(200).json({
      success: true,

      message:
        "User role updated successfully.",

      user: safeUser,
    });
  } catch (error) {
    console.error(
      "Update User Role Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message: getErrorMessage(
        error,
        "Failed to update user role."
      ),
    });
  }
};


/**
 * DELETE /api/admin/users/:id
 */
export const deleteUser = async (
  req,
  res
) => {
  try {
    const { id } = req.params;


    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,

        message: "Invalid user ID.",
      });
    }


    /*
     * Prevent an admin from deleting
     * their own account.
     */
    if (
      req.user?._id &&
      String(req.user._id) ===
        String(id)
    ) {
      return res.status(400).json({
        success: false,

        message:
          "You cannot delete your own admin account.",
      });
    }


    const user =
      await User.findByIdAndDelete(id);


    if (!user) {
      return res.status(404).json({
        success: false,

        message: "User not found.",
      });
    }


    return res.status(200).json({
      success: true,

      message:
        "User deleted successfully.",

      userId: id,
    });
  } catch (error) {
    console.error(
      "Delete User Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message: getErrorMessage(
        error,
        "Failed to delete user."
      ),
    });
  }
};


/* ==========================================================
   ORDERS
========================================================== */

/**
 * GET /api/admin/orders
 */
export const getOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await Order.find({})
        .populate(
          "user",
          "name email role"
        )
        .sort({
          createdAt: -1,
        })
        .lean();


    return res.status(200).json({
      success: true,

      orders,

      count: orders.length,
    });
  } catch (error) {
    console.error(
      "Get Orders Error:",
      error
    );

    return res.status(500).json({
      success: false,

      orders: [],

      message: getErrorMessage(
        error,
        "Failed to load orders."
      ),
    });
  }
};


/**
 * PUT /api/admin/orders/:id
 */
export const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const { status } = req.body;


    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,

        message: "Invalid order ID.",
      });
    }


    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];


    if (!status) {
      return res.status(400).json({
        success: false,

        message:
          "Order status is required.",
      });
    }


    if (
      !allowedStatuses.includes(
        status
      )
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid order status.",
      });
    }


    const order =
      await Order.findById(id);


    if (!order) {
      return res.status(404).json({
        success: false,

        message: "Order not found.",
      });
    }


    order.status = status;


    /*
     * When an order is delivered,
     * mark it as paid if payment
     * is still pending.
     */
    if (
      status === "delivered" &&
      order.paymentStatus ===
        "pending"
    ) {
      order.paymentStatus = "paid";
    }


    await order.save();


    const updatedOrder =
      await Order.findById(id)
        .populate(
          "user",
          "name email role"
        )
        .lean();


    return res.status(200).json({
      success: true,

      message:
        "Order status updated successfully.",

      order: updatedOrder,
    });
  } catch (error) {
    console.error(
      "Update Order Status Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message: getErrorMessage(
        error,
        "Failed to update order status."
      ),
    });
  }
};


/**
 * DELETE /api/admin/orders/:id
 */
export const deleteOrder = async (
  req,
  res
) => {
  try {
    const { id } = req.params;


    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,

        message: "Invalid order ID.",
      });
    }


    const order =
      await Order.findByIdAndDelete(id);


    if (!order) {
      return res.status(404).json({
        success: false,

        message: "Order not found.",
      });
    }


    return res.status(200).json({
      success: true,

      message:
        "Order deleted successfully.",

      orderId: id,
    });
  } catch (error) {
    console.error(
      "Delete Order Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message: getErrorMessage(
        error,
        "Failed to delete order."
      ),
    });
  }
};


/* ==========================================================
   PRODUCTS
========================================================== */

/**
 * GET /api/admin/products
 */
export const getProducts = async (
  req,
  res
) => {
  try {
    const products =
      await Product.find({})
        .sort({
          createdAt: -1,
        })
        .lean();


    return res.status(200).json({
      success: true,

      products,

      count: products.length,
    });
  } catch (error) {
    console.error(
      "Get Admin Products Error:",
      error
    );

    return res.status(500).json({
      success: false,

      products: [],

      message: getErrorMessage(
        error,
        "Failed to load products."
      ),
    });
  }
};


/**
 * GET /api/admin/products/:id
 */
export const getProduct = async (
  req,
  res
) => {
  try {
    const { id } = req.params;


    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid product ID.",
      });
    }


    const product =
      await Product.findById(id)
        .lean();


    if (!product) {
      return res.status(404).json({
        success: false,

        product: null,

        message:
          "Product not found.",
      });
    }


    return res.status(200).json({
      success: true,

      product,
    });
  } catch (error) {
    console.error(
      "Get Admin Product Error:",
      error
    );

    return res.status(500).json({
      success: false,

      product: null,

      message: getErrorMessage(
        error,
        "Failed to load product."
      ),
    });
  }
};


/**
 * POST /api/admin/products
 */
export const createProduct = async (
  req,
  res
) => {
  try {
    const body = {
      ...req.body,
    };


    if (
      body.price !== undefined
    ) {
      body.price =
        toNumber(body.price);
    }


    if (
      body.stock !== undefined
    ) {
      body.stock =
        toNumber(body.stock);
    }


    const product =
      await Product.create(body);


    return res.status(201).json({
      success: true,

      message:
        "Product created successfully.",

      product,
    });
  } catch (error) {
    console.error(
      "Create Product Error:",
      error
    );

    return res.status(400).json({
      success: false,

      product: null,

      message: getErrorMessage(
        error,
        "Failed to create product."
      ),
    });
  }
};


/**
 * PUT /api/admin/products/:id
 */
export const updateProduct = async (
  req,
  res
) => {
  try {
    const { id } = req.params;


    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid product ID.",
      });
    }


    const updates = {
      ...req.body,
    };


    if (
      updates.price !== undefined
    ) {
      updates.price =
        toNumber(updates.price);
    }


    if (
      updates.stock !== undefined
    ) {
      updates.stock =
        toNumber(updates.stock);
    }


    delete updates._id;


    const product =
      await Product.findByIdAndUpdate(
        id,
        updates,
        {
          new: true,

          runValidators: true,
        }
      );


    if (!product) {
      return res.status(404).json({
        success: false,

        product: null,

        message:
          "Product not found.",
      });
    }


    return res.status(200).json({
      success: true,

      message:
        "Product updated successfully.",

      product,
    });
  } catch (error) {
    console.error(
      "Update Product Error:",
      error
    );

    return res.status(400).json({
      success: false,

      product: null,

      message: getErrorMessage(
        error,
        "Failed to update product."
      ),
    });
  }
};


/**
 * DELETE /api/admin/products/:id
 *
 * Soft delete when supported.
 */
export const deleteProduct = async (
  req,
  res
) => {
  try {
    const { id } = req.params;


    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid product ID.",
      });
    }


    const product =
      await Product.findById(id);


    if (!product) {
      return res.status(404).json({
        success: false,

        message:
          "Product not found.",
      });
    }


    const productObject =
      product.toObject();


    if (
      Object.prototype.hasOwnProperty.call(
        productObject,
        "isDeleted"
      )
    ) {
      product.isDeleted = true;

      await product.save();


      return res.status(200).json({
        success: true,

        message:
          "Product deleted successfully.",

        product,
      });
    }


    await Product.findByIdAndDelete(
      id
    );


    return res.status(200).json({
      success: true,

      message:
        "Product deleted successfully.",

      productId: id,
    });
  } catch (error) {
    console.error(
      "Delete Product Error:",
      error
    );

    return res.status(400).json({
      success: false,

      message: getErrorMessage(
        error,
        "Failed to delete product."
      ),
    });
  }
};


/**
 * PUT /api/admin/products/:id/restore
 */
export const restoreProduct = async (
  req,
  res
) => {
  try {
    const { id } = req.params;


    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid product ID.",
      });
    }


    const product =
      await Product.findById(id);


    if (!product) {
      return res.status(404).json({
        success: false,

        product: null,

        message:
          "Product not found.",
      });
    }


    const productObject =
      product.toObject();


    if (
      Object.prototype.hasOwnProperty.call(
        productObject,
        "isDeleted"
      )
    ) {
      product.isDeleted = false;

      await product.save();


      return res.status(200).json({
        success: true,

        message:
          "Product restored successfully.",

        product,
      });
    }


    return res.status(400).json({
      success: false,

      product: null,

      message:
        "Product does not support soft restore.",
    });
  } catch (error) {
    console.error(
      "Restore Product Error:",
      error
    );

    return res.status(400).json({
      success: false,

      product: null,

      message: getErrorMessage(
        error,
        "Failed to restore product."
      ),
    });
  }
};