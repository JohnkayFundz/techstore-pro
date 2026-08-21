import mongoose from "mongoose";

import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

/* ==========================================================
   HELPERS
========================================================== */

/**
 * Convert a value to a number when possible.
 */
const parseNumber = (value, fallback = undefined) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};


/**
 * Convert incoming values to boolean safely.
 */
const parseBoolean = (value, fallback = undefined) => {
  if (value === undefined || value === null) {
    return fallback;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value
      .trim()
      .toLowerCase();

    if (normalized === "true") {
      return true;
    }

    if (normalized === "false") {
      return false;
    }
  }

  return Boolean(value);
};


/**
 * Parse arrays coming from:
 *
 * - JSON requests
 * - multipart/form-data
 * - JSON-stringified arrays
 */
const parseArray = (value) => {
  if (value === undefined || value === null || value === "") {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean);
      }
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
};


/**
 * Prepare product data for MongoDB.
 *
 * Supports:
 *
 * - JSON
 * - multipart/form-data
 * - image
 * - images
 * - features
 * - numeric fields
 * - boolean fields
 */
const prepareProductData = (req) => {
  const body = {
    ...req.body,
  };

  /* ========================================================
     BASIC STRING FIELDS
  ======================================================== */

  if (body.name !== undefined) {
    body.name = String(body.name).trim();
  }

  if (body.description !== undefined) {
    body.description = String(
      body.description
    ).trim();
  }

  if (body.brand !== undefined) {
    body.brand = String(body.brand).trim();
  }

  if (body.category !== undefined) {
    body.category = String(
      body.category
    ).trim();
  }

  if (body.warranty !== undefined) {
    body.warranty = String(
      body.warranty
    ).trim();
  }

  /* ========================================================
     NUMERIC FIELDS
  ======================================================== */

  const numericFields = [
    "price",
    "oldPrice",
    "discount",
    "stock",
    "rating",
    "numReviews",
  ];

  numericFields.forEach((field) => {
    if (body[field] !== undefined) {
      const parsed = parseNumber(
        body[field]
      );

      if (parsed !== undefined) {
        body[field] = parsed;
      } else {
        delete body[field];
      }
    }
  });

  /* ========================================================
     BOOLEAN FIELDS
  ======================================================== */

  const booleanFields = [
    "featured",
    "bestseller",
    "newArrival",
    "isActive",
  ];

  booleanFields.forEach((field) => {
    if (body[field] !== undefined) {
      const parsed = parseBoolean(
        body[field]
      );

      if (parsed !== undefined) {
        body[field] = parsed;
      }
    }
  });

  /* ========================================================
     FEATURES
  ======================================================== */

  if (body.features !== undefined) {
    body.features = parseArray(
      body.features
    );
  }

  /* ========================================================
     IMAGES
  ======================================================== */

  let images = [];

  /*
   * Current upload route uses:
   *
   * upload.single("image")
   *
   * Therefore req.file is the main uploaded image.
   */

  if (req.file) {
    const uploadedUrl =
      req.file.path ||
      req.file.secure_url ||
      req.file.url;

    if (uploadedUrl) {
      images.push(uploadedUrl);
    }
  }

  /* ========================================================
     IMAGE FIELD
  ======================================================== */

  if (
    !images.length &&
    body.image
  ) {
    images.push(
      String(body.image).trim()
    );
  }

  /* ========================================================
     IMAGES ARRAY
  ======================================================== */

  if (
    body.images !== undefined
  ) {
    const existingImages =
      parseArray(body.images);

    if (existingImages.length) {
      images = existingImages;
    }
  }

  /* ========================================================
     PRIMARY IMAGE
  ======================================================== */

  if (images.length > 0) {
    body.image = images[0];
    body.images = images;
  } else if (
    body.image !== undefined
  ) {
    body.image = String(
      body.image
    ).trim();

    body.images = body.image
      ? [body.image]
      : [];
  }

  return body;
};


/**
 * Validate MongoDB ObjectId.
 */
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(
    id
  );
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

    const totalSales = Number(
      salesResult[0]?.totalSales || 0
    );

    return res.status(200).json({
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
      "❌ Dashboard Stats Error:",
      error
    );

    return res.status(500).json({
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
    const sales =
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

    return res.status(200).json({
      success: true,

      sales,
    });
  } catch (error) {
    console.error(
      "❌ Sales Analytics Error:",
      error
    );

    return res.status(500).json({
      success: false,

      sales: [],

      message:
        "Failed to load sales analytics.",
    });
  }
};


/* ==========================================================
   USERS
========================================================== */

/* ----------------------------------------------------------
   GET USERS
   GET /api/admin/users
---------------------------------------------------------- */

export const getUsers = async (
  req,
  res
) => {
  try {
    const users =
      await User.find()
        .select("-password")
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,

      count: users.length,

      users,
    });
  } catch (error) {
    console.error(
      "❌ Get Users Error:",
      error
    );

    return res.status(500).json({
      success: false,

      users: [],

      message:
        "Failed to load users.",
    });
  }
};


/* ----------------------------------------------------------
   UPDATE USER ROLE
   PUT /api/admin/users/:id/role
---------------------------------------------------------- */

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

        message:
          "Invalid user ID.",
      });
    }

    if (
      !["user", "admin"].includes(
        role
      )
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Role must be either user or admin.",
      });
    }

    if (
      req.user?._id?.toString() ===
        id &&
      role !== "admin"
    ) {
      return res.status(400).json({
        success: false,

        message:
          "You cannot remove your own admin role.",
      });
    }

    const user =
      await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,

        message:
          "User not found.",
      });
    }

    user.role = role;

    await user.save();

    const safeUser =
      await User.findById(id)
        .select("-password");

    return res.status(200).json({
      success: true,

      message:
        "User role updated successfully.",

      user: safeUser,
    });
  } catch (error) {
    console.error(
      "❌ Update User Role Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to update user role.",
    });
  }
};


/* ----------------------------------------------------------
   DELETE USER
   DELETE /api/admin/users/:id
---------------------------------------------------------- */

export const deleteUser = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid user ID.",
      });
    }

    if (
      req.user?._id?.toString() ===
      id
    ) {
      return res.status(400).json({
        success: false,

        message:
          "You cannot delete your own admin account.",
      });
    }

    const user =
      await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,

        message:
          "User not found.",
      });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,

      message:
        "User deleted successfully.",
    });
  } catch (error) {
    console.error(
      "❌ Delete User Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to delete user.",
    });
  }
};


/* ==========================================================
   ORDERS
========================================================== */

/* ----------------------------------------------------------
   GET ORDERS
   GET /api/admin/orders
---------------------------------------------------------- */

export const getOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await Order.find()
        .populate(
          "user",
          "name email phone"
        )
        .populate(
          "items.product",
          "name image images price"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,

      count: orders.length,

      orders,
    });
  } catch (error) {
    console.error(
      "❌ Get Orders Error:",
      error
    );

    return res.status(500).json({
      success: false,

      orders: [],

      message:
        "Failed to load orders.",
    });
  }
};


/* ----------------------------------------------------------
   UPDATE ORDER STATUS
   PUT /api/admin/orders/:id
---------------------------------------------------------- */

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

        message:
          "Invalid order ID.",
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

        message:
          "Order not found.",
      });
    }

    if (
      order.status === status
    ) {
      await order.populate([
        {
          path: "user",
          select:
            "name email phone",
        },

        {
          path: "items.product",
          select:
            "name image images price",
        },
      ]);

      return res.status(200).json({
        success: true,

        message:
          "Order status is already set to this value.",

        order,
      });
    }

    order.status = status;

    await order.save();

    await order.populate([
      {
        path: "user",
        select:
          "name email phone",
      },

      {
        path: "items.product",
        select:
          "name image images price",
      },
    ]);

    return res.status(200).json({
      success: true,

      message:
        "Order status updated successfully.",

      order,
    });
  } catch (error) {
    console.error(
      "❌ Update Order Status Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to update order status.",
    });
  }
};


/* ----------------------------------------------------------
   DELETE ORDER
   DELETE /api/admin/orders/:id
---------------------------------------------------------- */

export const deleteOrder = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid order ID.",
      });
    }

    const order =
      await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,

        message:
          "Order not found.",
      });
    }

    await Order.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,

      message:
        "Order deleted successfully.",
    });
  } catch (error) {
    console.error(
      "❌ Delete Order Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to delete order.",
    });
  }
};


/* ==========================================================
   PRODUCTS
========================================================== */

/* ----------------------------------------------------------
   GET ALL PRODUCTS
   GET /api/admin/products
---------------------------------------------------------- */

export const getProducts = async (
  req,
  res
) => {
  try {
    const products =
      await Product.find()
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,

      count: products.length,

      totalProducts:
        products.length,

      currentPage: 1,

      totalPages: 1,

      products,
    });
  } catch (error) {
    console.error(
      "❌ Get Admin Products Error:",
      error
    );

    return res.status(500).json({
      success: false,

      products: [],

      message:
        "Failed to load products.",
    });
  }
};


/* ----------------------------------------------------------
   GET SINGLE PRODUCT
   GET /api/admin/products/:id
---------------------------------------------------------- */

export const getProduct = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,

        product: null,

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

    return res.status(200).json({
      success: true,

      product,
    });
  } catch (error) {
    console.error(
      "❌ Get Product Error:",
      error
    );

    return res.status(500).json({
      success: false,

      product: null,

      message:
        "Failed to load product.",
    });
  }
};


/* ----------------------------------------------------------
   VALIDATE PRODUCT DATA
---------------------------------------------------------- */

const validateProductData = (
  productData
) => {
  if (
    productData.name !==
      undefined &&
    !String(
      productData.name
    ).trim()
  ) {
    return "Product name is required.";
  }

  if (
    productData.price !==
      undefined &&
    (
      !Number.isFinite(
        Number(
          productData.price
        )
      ) ||
      Number(
        productData.price
      ) < 0
    )
  ) {
    return "Product price must be a valid non-negative number.";
  }

  if (
    productData.oldPrice !==
      undefined &&
    (
      !Number.isFinite(
        Number(
          productData.oldPrice
        )
      ) ||
      Number(
        productData.oldPrice
      ) < 0
    )
  ) {
    return "Old price must be a valid non-negative number.";
  }

  if (
    productData.discount !==
      undefined &&
    (
      Number(
        productData.discount
      ) < 0 ||
      Number(
        productData.discount
      ) > 100
    )
  ) {
    return "Discount must be between 0 and 100.";
  }

  if (
    productData.stock !==
      undefined &&
    (
      !Number.isFinite(
        Number(
          productData.stock
        )
      ) ||
      Number(
        productData.stock
      ) < 0
    )
  ) {
    return "Stock must be a valid non-negative number.";
  }

  if (
    productData.rating !==
      undefined &&
    (
      !Number.isFinite(
        Number(
          productData.rating
        )
      ) ||
      Number(
        productData.rating
      ) < 0 ||
      Number(
        productData.rating
      ) > 5
    )
  ) {
    return "Rating must be between 0 and 5.";
  }

  if (
    productData.numReviews !==
      undefined &&
    (
      !Number.isFinite(
        Number(
          productData.numReviews
        )
      ) ||
      Number(
        productData.numReviews
      ) < 0
    )
  ) {
    return "Number of reviews cannot be negative.";
  }

  return null;
};


/* ----------------------------------------------------------
   CREATE PRODUCT
   POST /api/admin/products
---------------------------------------------------------- */

export const createProduct = async (
  req,
  res
) => {
  try {
    const productData =
      prepareProductData(req);

    /* ======================================================
       REQUIRED FIELDS
    ====================================================== */

    if (
      !productData.name
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Product name is required.",
      });
    }

    if (
      productData.price ===
        undefined ||
      !Number.isFinite(
        Number(
          productData.price
        )
      )
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Valid product price is required.",
      });
    }

    if (
      !productData.description
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Product description is required.",
      });
    }

    if (
      !productData.category
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Product category is required.",
      });
    }

    /* ======================================================
       VALIDATION
    ====================================================== */

    const validationError =
      validateProductData(
        productData
      );

    if (validationError) {
      return res.status(400).json({
        success: false,

        message:
          validationError,
      });
    }

    /* ======================================================
       CREATED BY
    ====================================================== */

    if (
      req.user?._id
    ) {
      productData.createdBy =
        req.user._id;
    }

    /* ======================================================
       CREATE
    ====================================================== */

    const product =
      await Product.create(
        productData
      );

    return res.status(201).json({
      success: true,

      message:
        "Product created successfully.",

      product,
    });
  } catch (error) {
    console.error(
      "❌ Create Product Error:",
      error
    );

    if (
      error.name ===
      "ValidationError"
    ) {
      return res.status(400).json({
        success: false,

        message:
          Object.values(
            error.errors
          )
            .map(
              (item) =>
                item.message
            )
            .join(", "),
      });
    }

    if (
      error.code === 11000
    ) {
      return res.status(400).json({
        success: false,

        message:
          "A product with this information already exists.",
      });
    }

    return res.status(500).json({
      success: false,

      message:
        "Failed to create product.",
    });
  }
};


/* ----------------------------------------------------------
   UPDATE PRODUCT
   PUT /api/admin/products/:id
---------------------------------------------------------- */

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

    const product =
      await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,

        message:
          "Product not found.",
      });
    }

    const productData =
      prepareProductData(req);

    /* ======================================================
       PROTECTED FIELDS
    ====================================================== */

    delete productData._id;
    delete productData.createdBy;
    delete productData.createdAt;
    delete productData.updatedAt;

    /* ======================================================
       KEEP EXISTING IMAGE
    ====================================================== */

    const imageWasProvided =
      Object.prototype.hasOwnProperty.call(
        productData,
        "image"
      );

    const imagesWereProvided =
      Object.prototype.hasOwnProperty.call(
        productData,
        "images"
      );

    if (
      !imageWasProvided &&
      !imagesWereProvided
    ) {
      productData.image =
        product.image || "";

      productData.images =
        Array.isArray(
          product.images
        )
          ? product.images
          : product.image
            ? [product.image]
            : [];
    }

    /* ======================================================
       KEEP EXISTING FEATURES
    ====================================================== */

    if (
      !Object.prototype.hasOwnProperty.call(
        productData,
        "features"
      )
    ) {
      productData.features =
        Array.isArray(
          product.features
        )
          ? product.features
          : [];
    }

    /* ======================================================
       VALIDATE
    ====================================================== */

    const validationError =
      validateProductData(
        productData
      );

    if (validationError) {
      return res.status(400).json({
        success: false,

        message:
          validationError,
      });
    }

    /* ======================================================
       UPDATE
    ====================================================== */

    Object.assign(
      product,
      productData
    );

    await product.save();

    return res.status(200).json({
      success: true,

      message:
        "Product updated successfully.",

      product,
    });
  } catch (error) {
    console.error(
      "❌ Update Product Error:",
      error
    );

    if (
      error.name ===
      "ValidationError"
    ) {
      return res.status(400).json({
        success: false,

        message:
          Object.values(
            error.errors
          )
            .map(
              (item) =>
                item.message
            )
            .join(", "),
      });
    }

    if (
      error.code === 11000
    ) {
      return res.status(400).json({
        success: false,

        message:
          "A product with this information already exists.",
      });
    }

    return res.status(500).json({
      success: false,

      message:
        "Failed to update product.",
    });
  }
};


/* ----------------------------------------------------------
   DELETE PRODUCT
   DELETE /api/admin/products/:id
---------------------------------------------------------- */

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

    await Product.findByIdAndDelete(
      id
    );

    return res.status(200).json({
      success: true,

      message:
        "Product deleted successfully.",
    });
  } catch (error) {
    console.error(
      "❌ Delete Product Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to delete product.",
    });
  }
};