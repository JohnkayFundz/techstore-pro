// ==========================================================
// TECHSTORE PRO
// ADMIN CONTROLLER
// ==========================================================

import mongoose from "mongoose";

import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

// ==========================================================
// CONSTANTS
// ==========================================================

const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const USER_ROLES = [
  "user",
  "admin",
];

// ==========================================================
// HELPERS
// ==========================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const getErrorMessage = (error) => {
  if (error?.name === "ValidationError") {
    return Object.values(error.errors)
      .map((err) => err.message)
      .join(", ");
  }

  return error?.message || "Something went wrong.";
};

// ==========================================================
// DASHBOARD STATS
// ==========================================================

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProducts,
      activeProducts,
      inactiveProducts,
      totalUsers,
      totalOrders,

      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,

      revenueResult,
      recentOrders,
    ] = await Promise.all([
      // ----------------------------------------------------
      // PRODUCTS
      // ----------------------------------------------------

      Product.countDocuments(),

      Product.countDocuments({
        isActive: true,
      }),

      Product.countDocuments({
        isActive: false,
      }),

      // ----------------------------------------------------
      // USERS
      // ----------------------------------------------------

      User.countDocuments(),

      // ----------------------------------------------------
      // ORDERS
      // ----------------------------------------------------

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

      // ----------------------------------------------------
      // REVENUE
      // ----------------------------------------------------

      Order.aggregate([
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
      ]),

      // ----------------------------------------------------
      // RECENT ORDERS
      // ----------------------------------------------------

      Order.find()
        .populate("user", "name email")
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .lean(),
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,

        activeProducts,
        inactiveProducts,

        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,

        currency: "USD",
      },

      recentOrders,
    });
  } catch (error) {
    console.error(
      "Get dashboard stats error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to load dashboard statistics",

      error:
        process.env.NODE_ENV === "production"
          ? undefined
          : getErrorMessage(error),
    });
  }
};

// ==========================================================
// SALES ANALYTICS
// ==========================================================

export const getSalesAnalytics = async (
  req,
  res
) => {
  try {
    const [
      totalRevenueResult,
      totalOrders,
      deliveredOrders,
      cancelledOrders,
      averageOrderResult,
      salesByStatus,
      salesByDay,
      topProducts,
    ] = await Promise.all([
      // ----------------------------------------------------
      // TOTAL REVENUE
      // ----------------------------------------------------

      Order.aggregate([
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
      ]),

      // ----------------------------------------------------
      // TOTAL ORDERS
      // ----------------------------------------------------

      Order.countDocuments(),

      // ----------------------------------------------------
      // DELIVERED ORDERS
      // ----------------------------------------------------

      Order.countDocuments({
        status: "delivered",
      }),

      // ----------------------------------------------------
      // CANCELLED ORDERS
      // ----------------------------------------------------

      Order.countDocuments({
        status: "cancelled",
      }),

      // ----------------------------------------------------
      // AVERAGE ORDER VALUE
      // ----------------------------------------------------

      Order.aggregate([
        {
          $match: {
            status: "delivered",
          },
        },

        {
          $group: {
            _id: null,

            averageOrderValue: {
              $avg: "$totalAmount",
            },
          },
        },
      ]),

      // ----------------------------------------------------
      // SALES BY STATUS
      // ----------------------------------------------------

      Order.aggregate([
        {
          $group: {
            _id: "$status",

            count: {
              $sum: 1,
            },

            revenue: {
              $sum: "$totalAmount",
            },
          },
        },

        {
          $sort: {
            count: -1,
          },
        },
      ]),

      // ----------------------------------------------------
      // DAILY SALES
      // ----------------------------------------------------

      Order.aggregate([
        {
          $match: {
            status: "delivered",
          },
        },

        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
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
            _id: 1,
          },
        },
      ]),

      // ----------------------------------------------------
      // TOP PRODUCTS
      // ----------------------------------------------------

      Order.aggregate([
        {
          $match: {
            status: "delivered",
          },
        },

        {
          $unwind: "$items",
        },

        {
          $group: {
            _id: "$items.product",

            productName: {
              $first: "$items.name",
            },

            quantitySold: {
              $sum: "$items.quantity",
            },

            revenue: {
              $sum: {
                $multiply: [
                  "$items.price",
                  "$items.quantity",
                ],
              },
            },
          },
        },

        {
          $sort: {
            quantitySold: -1,
          },
        },

        {
          $limit: 10,
        },
      ]),
    ]);

    const totalRevenue =
      totalRevenueResult.length > 0
        ? totalRevenueResult[0].totalRevenue
        : 0;

    const averageOrderValue =
      averageOrderResult.length > 0
        ? averageOrderResult[0]
            .averageOrderValue
        : 0;

    res.status(200).json({
      success: true,

      summary: {
        totalRevenue,
        totalOrders,
        deliveredOrders,
        cancelledOrders,
        averageOrderValue,
        currency: "USD",
      },

      sales: salesByDay,

      salesByDay,

      salesByStatus,

      topProducts,
    });
  } catch (error) {
    console.error(
      "Get sales analytics error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to load sales analytics",

      error:
        process.env.NODE_ENV === "production"
          ? undefined
          : getErrorMessage(error),
    });
  }
};

// ==========================================================
// GET ALL USERS
// ==========================================================

export const getUsers = async (
  req,
  res
) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({
        createdAt: -1,
      })
      .lean();

    res.status(200).json({
      success: true,

      count: users.length,

      data: users,
    });
  } catch (error) {
    console.error(
      "Get users error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to fetch users",

      error:
        process.env.NODE_ENV === "production"
          ? undefined
          : getErrorMessage(error),
    });
  }
};

// ==========================================================
// UPDATE USER ROLE
// ==========================================================

export const updateUserRole = async (
  req,
  res
) => {
  try {
    const { role } = req.body;

    // ------------------------------------------------------
    // VALIDATE ROLE
    // ------------------------------------------------------

    if (!role) {
      return res.status(400).json({
        success: false,

        message:
          "Role is required",
      });
    }

    const normalizedRole =
      String(role)
        .toLowerCase()
        .trim();

    if (
      !USER_ROLES.includes(
        normalizedRole
      )
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid role. Role must be either user or admin.",
      });
    }

    // ------------------------------------------------------
    // VALIDATE USER ID
    // ------------------------------------------------------

    if (
      !isValidObjectId(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid user ID",
      });
    }

    // ------------------------------------------------------
    // FIND USER
    // ------------------------------------------------------

    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,

        message:
          "User not found",
      });
    }

    // ------------------------------------------------------
    // PREVENT ADMIN FROM REMOVING OWN ADMIN ROLE
    // ------------------------------------------------------

    if (
      req.user &&
      user._id.toString() ===
        req.user._id.toString() &&
      normalizedRole !== "admin"
    ) {
      return res.status(400).json({
        success: false,

        message:
          "You cannot remove your own admin role",
      });
    }

    // ------------------------------------------------------
    // UPDATE ROLE
    // ------------------------------------------------------

    user.role =
      normalizedRole;

    const updatedUser =
      await user.save();

    const userResponse =
      updatedUser.toObject();

    delete userResponse.password;

    res.status(200).json({
      success: true,

      message:
        "User role updated successfully",

      data: userResponse,
    });
  } catch (error) {
    console.error(
      "Update user role error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to update user role",

      error:
        process.env.NODE_ENV === "production"
          ? undefined
          : getErrorMessage(error),
    });
  }
};

// ==========================================================
// DELETE USER
// ==========================================================

export const deleteUser = async (
  req,
  res
) => {
  try {
    // ------------------------------------------------------
    // VALIDATE USER ID
    // ------------------------------------------------------

    if (
      !isValidObjectId(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid user ID",
      });
    }

    // ------------------------------------------------------
    // FIND USER
    // ------------------------------------------------------

    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,

        message:
          "User not found",
      });
    }

    // ------------------------------------------------------
    // PREVENT SELF-DELETION
    // ------------------------------------------------------

    if (
      req.user &&
      user._id.toString() ===
        req.user._id.toString()
    ) {
      return res.status(400).json({
        success: false,

        message:
          "You cannot delete your own admin account",
      });
    }

    // ------------------------------------------------------
    // DELETE USER
    // ------------------------------------------------------

    await user.deleteOne();

    res.status(200).json({
      success: true,

      message:
        "User deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete user error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to delete user",

      error:
        process.env.NODE_ENV === "production"
          ? undefined
          : getErrorMessage(error),
    });
  }
};

// ==========================================================
// GET ALL ORDERS
// ==========================================================

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
          createdAt: -1,
        })
        .lean();

    res.status(200).json({
      success: true,

      count: orders.length,

      data: orders,
    });
  } catch (error) {
    console.error(
      "Get orders error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to fetch orders",

      error:
        process.env.NODE_ENV === "production"
          ? undefined
          : getErrorMessage(error),
    });
  }
};

// ==========================================================
// UPDATE ORDER STATUS
// ==========================================================

export const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    // ------------------------------------------------------
    // VALIDATE STATUS
    // ------------------------------------------------------

    if (!status) {
      return res.status(400).json({
        success: false,

        message:
          "Order status is required",
      });
    }

    const normalizedStatus =
      String(status)
        .toLowerCase()
        .trim();

    if (
      !ORDER_STATUSES.includes(
        normalizedStatus
      )
    ) {
      return res.status(400).json({
        success: false,

        message:
          `Invalid order status. Valid statuses: ${ORDER_STATUSES.join(
            ", "
          )}`,
      });
    }

    // ------------------------------------------------------
    // VALIDATE ORDER ID
    // ------------------------------------------------------

    if (
      !isValidObjectId(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid order ID",
      });
    }

    // ------------------------------------------------------
    // FIND ORDER
    // ------------------------------------------------------

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        success: false,

        message:
          "Order not found",
      });
    }

    // ------------------------------------------------------
    // UPDATE STATUS
    // ------------------------------------------------------

    order.status =
      normalizedStatus;

    const updatedOrder =
      await order.save();

    await updatedOrder.populate(
      "user",
      "name email"
    );

    res.status(200).json({
      success: true,

      message:
        "Order status updated successfully",

      data: updatedOrder,
    });
  } catch (error) {
    console.error(
      "Update order status error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to update order status",

      error:
        process.env.NODE_ENV === "production"
          ? undefined
          : getErrorMessage(error),
    });
  }
};

// ==========================================================
// DELETE ORDER
// ==========================================================

export const deleteOrder = async (
  req,
  res
) => {
  try {
    // ------------------------------------------------------
    // VALIDATE ORDER ID
    // ------------------------------------------------------

    if (
      !isValidObjectId(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid order ID",
      });
    }

    // ------------------------------------------------------
    // FIND ORDER
    // ------------------------------------------------------

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        success: false,

        message:
          "Order not found",
      });
    }

    // ------------------------------------------------------
    // DELETE ORDER
    // ------------------------------------------------------

    await order.deleteOne();

    res.status(200).json({
      success: true,

      message:
        "Order deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete order error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to delete order",

      error:
        process.env.NODE_ENV === "production"
          ? undefined
          : getErrorMessage(error),
    });
  }
};

// ==========================================================
// GET ALL PRODUCTS
// ==========================================================
//
// IMPORTANT:
// Admin can see BOTH active and inactive products.
// This allows deleted products to be restored.
// ==========================================================

export const getProducts = async (
  req,
  res
) => {
  try {
    const products =
      await Product.find()
        .populate(
          "createdBy",
          "name email"
        )
        .sort({
          createdAt: -1,
        })
        .lean();

    res.status(200).json({
      success: true,

      count: products.length,

      data: products,
    });
  } catch (error) {
    console.error(
      "Get products error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to fetch products",

      error:
        process.env.NODE_ENV === "production"
          ? undefined
          : getErrorMessage(error),
    });
  }
};

// ==========================================================
// GET SINGLE PRODUCT
// ==========================================================

export const getProduct = async (
  req,
  res
) => {
  try {
    // ------------------------------------------------------
    // VALIDATE PRODUCT ID
    // ------------------------------------------------------

    if (
      !isValidObjectId(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid product ID",
      });
    }

    // ------------------------------------------------------
    // FIND PRODUCT
    // ------------------------------------------------------

    const product =
      await Product.findById(
        req.params.id
      ).populate(
        "createdBy",
        "name email"
      );

    if (!product) {
      return res.status(404).json({
        success: false,

        message:
          "Product not found",
      });
    }

    res.status(200).json({
      success: true,

      data: product,
    });
  } catch (error) {
    console.error(
      "Get product error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to fetch product",

      error:
        process.env.NODE_ENV === "production"
          ? undefined
          : getErrorMessage(error),
    });
  }
};

// ==========================================================
// CREATE PRODUCT
// ==========================================================

export const createProduct = async (
  req,
  res
) => {
  try {
    const {
      name,
      description,
      price,
      oldPrice,
      discount,
      currency,
      category,
      brand,
      sku,
      image,
      images,
      features,
      stock,
      shipping,
      rating,
      numReviews,
      warranty,
      featured,
      bestseller,
      newArrival,
    } = req.body;

    // ------------------------------------------------------
    // REQUIRED FIELDS
    // ------------------------------------------------------

    if (
      !name ||
      !String(name).trim()
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Product name is required",
      });
    }

    if (
      !description ||
      !String(description).trim()
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Product description is required",
      });
    }

    if (
      price === undefined ||
      price === null ||
      price === ""
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Product price is required",
      });
    }

    const numericPrice =
      Number(price);

    if (
      !Number.isFinite(
        numericPrice
      ) ||
      numericPrice < 0
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Product price must be a valid non-negative number",
      });
    }

    if (
      !category ||
      !String(category).trim()
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Product category is required",
      });
    }

    if (
      !sku ||
      !String(sku).trim()
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Product SKU is required",
      });
    }

    // ------------------------------------------------------
    // CREATE PRODUCT
    // ------------------------------------------------------

    const product =
      await Product.create({
        name:
          String(name).trim(),

        description:
          String(description).trim(),

        price:
          numericPrice,

        oldPrice,

        discount,

        currency,

        category:
          String(category).trim(),

        brand,

        sku:
          String(sku).trim(),

        image,

        images,

        features,

        stock,

        shipping,

        rating,

        numReviews,

        warranty,

        featured,

        bestseller,

        newArrival,

        createdBy:
          req.user?._id || null,

        isActive: true,
      });

    res.status(201).json({
      success: true,

      message:
        "Product created successfully",

      data: product,
    });
  } catch (error) {
    console.error(
      "Create product error:",
      error
    );

    // ------------------------------------------------------
    // DUPLICATE SKU
    // ------------------------------------------------------

    if (
      error.code === 11000
    ) {
      return res.status(409).json({
        success: false,

        message:
          "A product with this SKU already exists",
      });
    }

    // ------------------------------------------------------
    // VALIDATION ERROR
    // ------------------------------------------------------

    if (
      error.name ===
      "ValidationError"
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Product validation failed",

        errors:
          Object.values(
            error.errors
          ).map(
            (err) =>
              err.message
          ),
      });
    }

    res.status(500).json({
      success: false,

      message:
        "Failed to create product",

      error:
        process.env.NODE_ENV === "production"
          ? undefined
          : getErrorMessage(error),
    });
  }
};

// ==========================================================
// UPDATE PRODUCT
// ==========================================================

export const updateProduct = async (
  req,
  res
) => {
  try {
    // ------------------------------------------------------
    // VALIDATE PRODUCT ID
    // ------------------------------------------------------

    if (
      !isValidObjectId(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid product ID",
      });
    }

    // ------------------------------------------------------
    // FIND PRODUCT
    // ------------------------------------------------------

    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,

        message:
          "Product not found",
      });
    }

    // ------------------------------------------------------
    // ALLOWED FIELDS
    // ------------------------------------------------------

    const allowedFields = [
      "name",
      "description",
      "price",
      "oldPrice",
      "discount",
      "currency",
      "category",
      "brand",
      "sku",
      "image",
      "images",
      "features",
      "stock",
      "shipping",
      "rating",
      "numReviews",
      "warranty",
      "featured",
      "bestseller",
      "newArrival",
      "isActive",
    ];

    // ------------------------------------------------------
    // UPDATE ONLY ALLOWED FIELDS
    // ------------------------------------------------------

    allowedFields.forEach(
      (field) => {
        if (
          req.body[field] !==
          undefined
        ) {
          product[field] =
            req.body[field];
        }
      }
    );

    // ------------------------------------------------------
    // VALIDATE PRICE
    // ------------------------------------------------------

    if (
      product.price !==
      undefined
    ) {
      const numericPrice =
        Number(product.price);

      if (
        !Number.isFinite(
          numericPrice
        ) ||
        numericPrice < 0
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Product price must be a valid non-negative number",
        });
      }

      product.price =
        numericPrice;
    }

    // ------------------------------------------------------
    // SAVE
    // ------------------------------------------------------

    const updatedProduct =
      await product.save();

    res.status(200).json({
      success: true,

      message:
        "Product updated successfully",

      data: updatedProduct,
    });
  } catch (error) {
    console.error(
      "Update product error:",
      error
    );

    // ------------------------------------------------------
    // DUPLICATE SKU
    // ------------------------------------------------------

    if (
      error.code === 11000
    ) {
      return res.status(409).json({
        success: false,

        message:
          "A product with this SKU already exists",
      });
    }

    // ------------------------------------------------------
    // VALIDATION ERROR
    // ------------------------------------------------------

    if (
      error.name ===
      "ValidationError"
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Product validation failed",

        errors:
          Object.values(
            error.errors
          ).map(
            (err) =>
              err.message
          ),
      });
    }

    res.status(500).json({
      success: false,

      message:
        "Failed to update product",

      error:
        process.env.NODE_ENV === "production"
          ? undefined
          : getErrorMessage(error),
    });
  }
};

// ==========================================================
// SOFT DELETE PRODUCT
// ==========================================================

export const deleteProduct = async (
  req,
  res
) => {
  try {
    // ------------------------------------------------------
    // VALIDATE PRODUCT ID
    // ------------------------------------------------------

    if (
      !isValidObjectId(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid product ID",
      });
    }

    // ------------------------------------------------------
    // FIND PRODUCT
    // ------------------------------------------------------

    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,

        message:
          "Product not found",
      });
    }

    // ------------------------------------------------------
    // CHECK CURRENT STATUS
    // ------------------------------------------------------

    if (
      product.isActive === false
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Product is already deleted",
      });
    }

    // ------------------------------------------------------
    // SOFT DELETE
    // ------------------------------------------------------

    product.isActive = false;

    await product.save();

    res.status(200).json({
      success: true,

      message:
        "Product deleted successfully",

      data: product,
    });
  } catch (error) {
    console.error(
      "Delete product error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to delete product",

      error:
        process.env.NODE_ENV === "production"
          ? undefined
          : getErrorMessage(error),
    });
  }
};

// ==========================================================
// RESTORE PRODUCT
// ==========================================================

export const restoreProduct = async (
  req,
  res
) => {
  try {
    // ------------------------------------------------------
    // VALIDATE PRODUCT ID
    // ------------------------------------------------------

    if (
      !isValidObjectId(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid product ID",
      });
    }

    // ------------------------------------------------------
    // FIND PRODUCT
    // ------------------------------------------------------

    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,

        message:
          "Product not found",
      });
    }

    // ------------------------------------------------------
    // CHECK CURRENT STATUS
    // ------------------------------------------------------

    if (
      product.isActive === true
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Product is already active",
      });
    }

    // ------------------------------------------------------
    // RESTORE PRODUCT
    // ------------------------------------------------------

    product.isActive = true;

    await product.save();

    res.status(200).json({
      success: true,

      message:
        "Product restored successfully",

      data: product,
    });
  } catch (error) {
    console.error(
      "Restore product error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to restore product",

      error:
        process.env.NODE_ENV === "production"
          ? undefined
          : getErrorMessage(error),
    });
  }
};

// ==========================================================
// DEFAULT EXPORT
// ==========================================================

export default {
  getDashboardStats,
  getSalesAnalytics,

  getUsers,
  updateUserRole,
  deleteUser,

  getOrders,
  updateOrderStatus,
  deleteOrder,

  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
};