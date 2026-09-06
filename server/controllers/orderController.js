import mongoose from "mongoose";

import Order from "../models/Order.js";
import Product from "../models/Product.js";

/* ==========================================================
   CREATE ORDER
   POST /api/orders
   PRIVATE
========================================================== */

export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    /* --------------------------------------------------------
       VALIDATE USER
    -------------------------------------------------------- */

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    /* --------------------------------------------------------
       GET REQUEST DATA
    -------------------------------------------------------- */

    const {
      items,
      shippingAddress,
      paymentMethod = "cash",
    } = req.body;

    /* --------------------------------------------------------
       VALIDATE ITEMS
    -------------------------------------------------------- */

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item.",
      });
    }

    /* --------------------------------------------------------
       VALIDATE PAYMENT METHOD
    -------------------------------------------------------- */

    const allowedPaymentMethods = [
      "cash",
      "card",
    ];

    if (!allowedPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method.",
      });
    }

    /* --------------------------------------------------------
       VALIDATE SHIPPING ADDRESS
    -------------------------------------------------------- */

    if (
      !shippingAddress ||
      typeof shippingAddress !== "object"
    ) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required.",
      });
    }

    const requiredAddressFields = [
      "fullName",
      "phone",
      "address",
      "city",
      "state",
      "country",
    ];

    for (const field of requiredAddressFields) {
      if (
        !shippingAddress[field] ||
        String(shippingAddress[field]).trim() === ""
      ) {
        return res.status(400).json({
          success: false,
          message: `${field} is required.`,
        });
      }
    }

    /* --------------------------------------------------------
       NORMALIZE ITEMS
    -------------------------------------------------------- */

    const normalizedItems = [];

    for (const item of items) {
      if (
        !item ||
        !item.product ||
        !mongoose.Types.ObjectId.isValid(item.product)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID.",
        });
      }

      const quantity = Number(item.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Product quantity must be at least 1.",
        });
      }

      normalizedItems.push({
        product: item.product,
        quantity,
      });
    }

    /* --------------------------------------------------------
       COMBINE DUPLICATE PRODUCTS
    -------------------------------------------------------- */

    const quantityMap = new Map();

    for (const item of normalizedItems) {
      const productId = item.product.toString();

      const currentQuantity =
        quantityMap.get(productId) || 0;

      quantityMap.set(
        productId,
        currentQuantity + item.quantity
      );
    }

    const uniqueItems = Array.from(
      quantityMap.entries()
    ).map(([product, quantity]) => ({
      product,
      quantity,
    }));

    /* --------------------------------------------------------
       LOAD PRODUCTS
    -------------------------------------------------------- */

    const productIds = uniqueItems.map(
      (item) => item.product
    );

    const products = await Product.find({
      _id: {
        $in: productIds,
      },
    }).lean();

    /* --------------------------------------------------------
       VERIFY PRODUCTS
    -------------------------------------------------------- */

    if (products.length !== productIds.length) {
      return res.status(404).json({
        success: false,
        message: "One or more products were not found.",
      });
    }

    /* --------------------------------------------------------
       PRODUCT MAP
    -------------------------------------------------------- */

    const productMap = new Map();

    for (const product of products) {
      productMap.set(
        product._id.toString(),
        product
      );
    }

    /* --------------------------------------------------------
       PREPARE ORDER ITEMS
    -------------------------------------------------------- */

    const orderItems = [];

    let totalAmount = 0;

    for (const item of uniqueItems) {
      const product = productMap.get(
        item.product.toString()
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      /* PRODUCT ACTIVE */

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message:
            `${product.name} is no longer available.`,
        });
      }

      /* STOCK */

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message:
            `${product.name} does not have enough stock.`,
        });
      }

      /* SERVER PRICE */

      const price = Number(product.price);

      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({
          success: false,
          message:
            `Invalid price for ${product.name}.`,
        });
      }

      const subtotal =
        price * item.quantity;

      totalAmount += subtotal;

      /* PRODUCT SNAPSHOT */

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image || "",
        price,
        quantity: item.quantity,
      });
    }

    /* --------------------------------------------------------
       ROUND TOTAL
    -------------------------------------------------------- */

    totalAmount =
      Math.round(totalAmount * 100) / 100;

    /* ========================================================
       TRANSACTION
    ======================================================== */

    session.startTransaction();

    /* --------------------------------------------------------
       REDUCE STOCK ATOMICALLY
    -------------------------------------------------------- */

    for (const item of orderItems) {
      const updatedProduct =
        await Product.findOneAndUpdate(
          {
            _id: item.product,
            isActive: true,
            stock: {
              $gte: item.quantity,
            },
          },
          {
            $inc: {
              stock: -item.quantity,
            },
          },
          {
            new: true,
            session,
          }
        );

      if (!updatedProduct) {
        throw new Error(
          `Insufficient stock for ${item.name}.`
        );
      }
    }

    /* --------------------------------------------------------
       CREATE ORDER
    -------------------------------------------------------- */

    const createdOrders = await Order.create(
      [
        {
          user: req.user._id,

          items: orderItems,

          shippingAddress: {
            fullName:
              String(
                shippingAddress.fullName
              ).trim(),

            phone:
              String(
                shippingAddress.phone
              ).trim(),

            address:
              String(
                shippingAddress.address
              ).trim(),

            city:
              String(
                shippingAddress.city
              ).trim(),

            state:
              String(
                shippingAddress.state
              ).trim(),

            country:
              String(
                shippingAddress.country
              ).trim(),
          },

          paymentMethod,

          paymentStatus: "pending",

          status: "pending",

          totalAmount,
        },
      ],
      {
        session,
      }
    );

    const order = createdOrders[0];

    /* --------------------------------------------------------
       COMMIT
    -------------------------------------------------------- */

    await session.commitTransaction();

    /* --------------------------------------------------------
       RESPONSE
    -------------------------------------------------------- */

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      order,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error(
      "❌ Create Order Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to create order.",
    });
  } finally {
    await session.endSession();
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
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        orders: [],
        message: "Authentication required.",
      });
    }

    const orders = await Order.find({
      user: req.user._id,
    })
      .populate(
        "items.product",
        "name image price"
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
      "❌ Get My Orders Error:",
      error
    );

    return res.status(500).json({
      success: false,
      orders: [],
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to get orders.",
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
    const { id } = req.params;

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        order: null,
        message: "Authentication required.",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        order: null,
        message: "Invalid order ID.",
      });
    }

    const order = await Order.findById(id)
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
        order: null,
        message: "Order not found.",
      });
    }

    const orderUserId =
      order.user?._id
        ? order.user._id.toString()
        : order.user?.toString();

    const currentUserId =
      req.user._id.toString();

    const isOwner =
      orderUserId === currentUserId;

    const isAdmin =
      req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        order: null,
        message:
          "You are not allowed to view this order.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "❌ Get Order Error:",
      error
    );

    return res.status(500).json({
      success: false,
      order: null,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to get order.",
    });
  }
};

/* ==========================================================
   CANCEL MY ORDER
   PATCH /api/orders/:id/cancel
   PRIVATE
========================================================== */

export const cancelOrder = async (
  req,
  res
) => {
  const session =
    await mongoose.startSession();

  try {
    /* --------------------------------------------------------
       VALIDATE USER
    -------------------------------------------------------- */

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const { id } = req.params;

    /* --------------------------------------------------------
       VALIDATE ORDER ID
    -------------------------------------------------------- */

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    /* --------------------------------------------------------
       START TRANSACTION
    -------------------------------------------------------- */

    session.startTransaction();

    /* --------------------------------------------------------
       FIND USER ORDER
    -------------------------------------------------------- */

    const order =
      await Order.findOne({
        _id: id,
        user: req.user._id,
      }).session(session);

    /* --------------------------------------------------------
       ORDER NOT FOUND
    -------------------------------------------------------- */

    if (!order) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    /* --------------------------------------------------------
       ONLY PENDING ORDERS
    -------------------------------------------------------- */

    if (order.status !== "pending") {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message:
          "Only pending orders can be cancelled.",
      });
    }

    /* --------------------------------------------------------
       RESTORE STOCK
    -------------------------------------------------------- */

    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: item.quantity,
          },
        },
        {
          session,
        }
      );
    }

    /* --------------------------------------------------------
       MARK CANCELLED
    -------------------------------------------------------- */

    order.status = "cancelled";

    await order.save({
      session,
    });

    /* --------------------------------------------------------
       COMMIT TRANSACTION
    -------------------------------------------------------- */

    await session.commitTransaction();

    /* --------------------------------------------------------
       RESPONSE
    -------------------------------------------------------- */

    return res.status(200).json({
      success: true,
      message:
        "Order cancelled successfully.",
      order,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    /* --------------------------------------------------------
       IMPORTANT DIAGNOSTIC LOG
    -------------------------------------------------------- */

    console.error(
      "❌ Cancel Order Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to cancel order.",
    });
  } finally {
    await session.endSession();
  }
};