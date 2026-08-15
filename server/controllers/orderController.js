import mongoose from "mongoose";

import Order from "../models/Order.js";
import Product from "../models/Product.js";


/* ==========================================================
   CREATE ORDER
   POST /api/orders
   PRIVATE
========================================================== */

export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod = "cash",
    } = req.body;


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

    if (!shippingAddress) {
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
       VALIDATE PRODUCT IDS
    -------------------------------------------------------- */

    for (const item of items) {
      if (
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
    }


    /* --------------------------------------------------------
       LOAD PRODUCTS FROM DATABASE
    -------------------------------------------------------- */

    const productIds = items.map(
      (item) => item.product
    );


    const products = await Product.find({
      _id: {
        $in: productIds,
      },
    });


    /* --------------------------------------------------------
       MAKE PRODUCT LOOKUP MAP
    -------------------------------------------------------- */

    const productMap = new Map();

    products.forEach((product) => {
      productMap.set(
        product._id.toString(),
        product
      );
    });


    /* --------------------------------------------------------
       BUILD SECURE ORDER ITEMS
    -------------------------------------------------------- */

    const orderItems = [];

    let totalAmount = 0;


    for (const item of items) {
      const product = productMap.get(
        item.product.toString()
      );


      /* ------------------------------------------------------
         PRODUCT EXISTS
      ------------------------------------------------------ */

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "One or more products were not found.",
        });
      }


      /* ------------------------------------------------------
         PRODUCT ACTIVE
      ------------------------------------------------------ */

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message:
            `${product.name} is no longer available.`,
        });
      }


      /* ------------------------------------------------------
         QUANTITY
      ------------------------------------------------------ */

      const quantity = Number(item.quantity);


      /* ------------------------------------------------------
         STOCK
      ------------------------------------------------------ */

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message:
            `${product.name} does not have enough stock.`,
        });
      }


      /* ------------------------------------------------------
         DATABASE PRICE
      ------------------------------------------------------ */

      const price = Number(product.price);


      const subtotal =
        price * quantity;


      totalAmount += subtotal;


      /* ------------------------------------------------------
         SNAPSHOT PRODUCT DATA
      ------------------------------------------------------ */

      orderItems.push({
        product: product._id,

        name: product.name,

        image:
          product.image ||
          product.images?.[0] ||
          "",

        price,

        quantity,
      });
    }


    /* --------------------------------------------------------
       ROUND TOTAL
    -------------------------------------------------------- */

    totalAmount =
      Math.round(
        totalAmount * 100
      ) / 100;


    /* --------------------------------------------------------
       CREATE ORDER
    -------------------------------------------------------- */

    const order = await Order.create({
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

      paymentStatus:
        paymentMethod === "cash"
          ? "pending"
          : "pending",

      status: "pending",

      totalAmount,
    });


    /* --------------------------------------------------------
       REDUCE STOCK
    -------------------------------------------------------- */

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: -item.quantity,
          },
        }
      );
    }


    /* --------------------------------------------------------
       RESPONSE
    -------------------------------------------------------- */

    return res.status(201).json({
      success: true,

      message:
        "Order created successfully.",

      order,
    });


  } catch (error) {

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
  }
};


/* ==========================================================
   GET MY ORDERS
   GET /api/orders/my-orders
   PRIVATE
========================================================== */

export const getMyOrders = async (req, res) => {
  try {
    const orders =
      await Order.find({
        user: req.user._id,
      })
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
      "❌ Get My Orders Error:",
      error
    );


    return res.status(500).json({
      success: false,

      orders: [],

      message:
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
    const { id } = req.params;


    /* --------------------------------------------------------
       VALIDATE ID
    -------------------------------------------------------- */

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,

        order: null,

        message:
          "Invalid order ID.",
      });
    }


    const order =
      await Order.findById(id)
      .populate(
        "user",
        "name email phone"
      )
      .populate(
        "items.product",
        "name image images price"
      );


    if (!order) {
      return res.status(404).json({
        success: false,

        order: null,

        message:
          "Order not found.",
      });
    }


    /* --------------------------------------------------------
       OWNER OR ADMIN
    -------------------------------------------------------- */

    if (
      order.user._id.toString() !==
        req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
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
        "Failed to get order.",
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
  try {
    const { id } = req.params;


    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid order ID.",
      });
    }


    const order =
      await Order.findOne({
        _id: id,

        user: req.user._id,
      });


    if (!order) {
      return res.status(404).json({
        success: false,

        message:
          "Order not found.",
      });
    }


    /* --------------------------------------------------------
       ONLY PENDING ORDERS CAN BE CANCELLED
    -------------------------------------------------------- */

    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,

        message:
          "Only pending orders can be cancelled.",
      });
    }


    order.status = "cancelled";


    await order.save();


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
        }
      );
    }


    return res.status(200).json({
      success: true,

      message:
        "Order cancelled successfully.",

      order,
    });


  } catch (error) {

    console.error(
      "❌ Cancel Order Error:",
      error
    );


    return res.status(500).json({
      success: false,

      message:
        "Failed to cancel order.",
    });
  }
};