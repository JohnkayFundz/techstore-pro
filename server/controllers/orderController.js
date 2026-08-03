import Order from "../models/Order.js";

/* ==========================================================
   CREATE ORDER
========================================================== */

export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one product.",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required.",
      });
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    const createdOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("orderItems.product", "name image price");

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      order: createdOrder,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    return res.status(500).json({
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
      .populate("orderItems.product", "name image price")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your orders.",
    });
  }
};

/* ==========================================================
   GET ORDER BY ID
========================================================== */

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name image price");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order.",
    });
  }
};

/* ==========================================================
   GET ALL ORDERS (ADMIN)
========================================================== */

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product", "name image price")
      .sort({ createdAt: -1 });

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    return res.status(200).json({
      success: true,
      count: orders.length,
      totalRevenue,
      orders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders.",
    });
  }
};

/* ==========================================================
   UPDATE ORDER STATUS (ADMIN)
========================================================== */

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.status = status;

    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update order status.",
    });
  }
};

/* ==========================================================
   MARK ORDER AS PAID
========================================================== */

export const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.isPaid = true;
    order.paidAt = new Date();

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order marked as paid.",
      order,
    });
  } catch (error) {
    console.error("Mark Order Paid Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update payment status.",
    });
  }
};

/* ==========================================================
   DELETE ORDER (ADMIN)
========================================================== */

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    await order.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete order.",
    });
  }
};