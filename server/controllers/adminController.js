import mongoose from "mongoose";

import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

/* ==========================================================
   HELPERS
========================================================== */

const prepareProductData = (req) => {
  const body = {
    ...req.body,
  };

  // --------------------------------------------------------
  // Parse features
  // --------------------------------------------------------

  if (body.features) {
    try {
      body.features =
        typeof body.features === "string"
          ? JSON.parse(body.features)
          : body.features;
    } catch {
      body.features = [];
    }
  }

  // --------------------------------------------------------
  // Uploaded images
  // --------------------------------------------------------

  let images = [];

  if (req.files?.length) {
    images = req.files.map(
      (file) => file.path
    );
  } else if (body.image) {
    images = [body.image];
  }

  body.images = images;
  body.image = images[0] || "";

  return body;
};


/* ==========================================================
   DASHBOARD STATS
   GET /api/admin/dashboard
========================================================== */

export const getDashboardStats = async (
  req,
  res
) => {
  try {
    const [
      totalProducts,
      totalUsers,
      totalOrders,
      activeProducts,
      pendingOrders,
    ] = await Promise.all([
      Product.countDocuments(),

      User.countDocuments(),

      Order.countDocuments(),

      Product.countDocuments({
        isActive: true,
      }),

      Order.countDocuments({
        status: "pending",
      }),
    ]);

    const salesResult =
      await Order.aggregate([
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
            totalSales: {
              $sum: "$totalAmount",
            },
          },
        },
      ]);

    const totalSales =
      salesResult[0]?.totalSales || 0;

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalUsers,
        totalOrders,
        activeProducts,
        pendingOrders,
        totalSales,
      },
    });
  } catch (error) {
    console.error(
      "Dashboard Stats Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load dashboard statistics.",
    });
  }
};


/* ==========================================================
   SALES ANALYTICS
   GET /api/admin/sales
========================================================== */

export const getSalesAnalytics = async (
  req,
  res
) => {
  try {
    const sales = await Order.aggregate([
      {
        $match: {
          status: {
            $ne: "cancelled",
          },
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

          totalSales: {
            $sum: "$totalAmount",
          },

          orderCount: {
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

    res.status(200).json({
      success: true,
      sales,
    });
  } catch (error) {
    console.error(
      "Sales Analytics Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load sales analytics.",
    });
  }
};


/* ==========================================================
   GET USERS
   GET /api/admin/users
========================================================== */

export const getUsers = async (
  req,
  res
) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(
      "Get Users Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load users.",
    });
  }
};


/* ==========================================================
   UPDATE USER ROLE
   PUT /api/admin/users/:id/role
========================================================== */

export const updateUserRole = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message:
          "Role must be either user or admin.",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.role = role;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "User role updated successfully.",
      user,
    });
  } catch (error) {
    console.error(
      "Update User Role Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update user role.",
    });
  }
};


/* ==========================================================
   DELETE USER
   DELETE /api/admin/users/:id
========================================================== */

export const deleteUser = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    if (
      req.user?._id?.toString() === id
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot delete your own admin account.",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete User Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete user.",
    });
  }
};


/* ==========================================================
   GET ORDERS
   GET /api/admin/orders
========================================================== */

export const getOrders = async (
  req,
  res
) => {
  try {
    const orders = await Order.find()
      .populate(
        "user",
        "name email phone"
      )
      .populate(
        "items.product",
        "name image price"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(
      "Get Orders Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load orders.",
    });
  }
};


/* ==========================================================
   UPDATE ORDER STATUS
   PUT /api/admin/orders/:id
========================================================== */

export const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
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

    if (
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    const order =
      await Order.findByIdAndUpdate(
        id,
        {
          status,
        },
        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "user",
          "name email phone"
        )
        .populate(
          "items.product",
          "name image price"
        );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error(
      "Update Order Status Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update order status.",
    });
  }
};


/* ==========================================================
   DELETE ORDER
   DELETE /api/admin/orders/:id
========================================================== */

export const deleteOrder = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
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

    res.status(200).json({
      success: true,
      message: "Order deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Order Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete order.",
    });
  }
};


/* ==========================================================
   GET ALL PRODUCTS
   GET /api/admin/products
========================================================== */

export const getProducts = async (
  req,
  res
) => {
  try {
    const products = await Product.find()
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts: products.length,
      currentPage: 1,
      totalPages: 1,
      products,
    });
  } catch (error) {
    console.error(
      "Get Admin Products Error:",
      error
    );

    res.status(500).json({
      success: false,
      products: [],
      message:
        "Failed to load products.",
    });
  }
};


/* ==========================================================
   GET SINGLE PRODUCT
   GET /api/admin/products/:id
========================================================== */

export const getProduct = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        product: null,
        message: "Invalid product ID.",
      });
    }

    const product =
      await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        product: null,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(
      "Get Product Error:",
      error
    );

    res.status(500).json({
      success: false,
      product: null,
      message:
        "Failed to load product.",
    });
  }
};


/* ==========================================================
   CREATE PRODUCT
   POST /api/admin/products
========================================================== */

export const createProduct = async (
  req,
  res
) => {
  try {
    const productData =
      prepareProductData(req);

    const product =
      await Product.create({
        ...productData,
        createdBy: req.user._id,
      });

    res.status(201).json({
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

    res.status(500).json({
      success: false,
      message:
        "Failed to create product.",
      error: error.message,
    });
  }
};


/* ==========================================================
   UPDATE PRODUCT
   PUT /api/admin/products/:id
========================================================== */

export const updateProduct = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product =
      await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const productData =
      prepareProductData(req);

    // ------------------------------------------------------
    // Keep existing images if no new images were uploaded
    // ------------------------------------------------------

    if (!req.files?.length) {
      productData.images =
        product.images || [];

      productData.image =
        product.image ||
        product.images?.[0] ||
        "";
    }

    Object.assign(
      product,
      productData
    );

    await product.save();

    res.status(200).json({
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

    res.status(500).json({
      success: false,
      message:
        "Failed to update product.",
      error: error.message,
    });
  }
};


/* ==========================================================
   DELETE PRODUCT
   DELETE /api/admin/products/:id
========================================================== */

export const deleteProduct = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product =
      await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message:
        "Product deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Product Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete product.",
    });
  }
};
