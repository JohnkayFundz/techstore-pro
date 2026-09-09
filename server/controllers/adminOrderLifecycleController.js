import mongoose from "mongoose";

import Order from "../models/Order.js";
import Product from "../models/Product.js";

const isValidObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

const allowedStatuses = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

/**
 * Update an order status while keeping inventory consistent.
 *
 * Cancellation is only valid before shipment. When an order moves
 * from pending/processing to cancelled, the quantities reserved at
 * checkout are returned to product stock in the same transaction.
 */
export const updateOrderStatusSafely = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID.",
    });
  }

  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order status.",
    });
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const order = await Order.findById(id).session(session);

    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const previousStatus = String(order.status || "pending").toLowerCase();

    if (previousStatus === "cancelled" && status !== "cancelled") {
      await session.abortTransaction();
      return res.status(409).json({
        success: false,
        message: "Cancelled orders cannot be reopened.",
      });
    }

    if (
      status === "cancelled" &&
      !["pending", "processing"].includes(previousStatus)
    ) {
      await session.abortTransaction();
      return res.status(409).json({
        success: false,
        message: "Only pending or processing orders can be cancelled.",
      });
    }

    if (status === previousStatus) {
      await session.commitTransaction();

      const unchangedOrder = await Order.findById(id)
        .populate("user", "name email role")
        .lean();

      return res.status(200).json({
        success: true,
        message: "Order status is already up to date.",
        order: unchangedOrder,
      });
    }

    if (status === "cancelled") {
      for (const item of order.items || []) {
        const productId = item?.product;
        const quantity = Number(item?.quantity) || 0;

        if (!productId || quantity <= 0) {
          throw new Error("Order contains invalid inventory data.");
        }

        const restored = await Product.findOneAndUpdate(
          { _id: productId },
          { $inc: { stock: quantity } },
          { new: true, session }
        );

        if (!restored) {
          throw new Error("A product linked to this order no longer exists.");
        }
      }
    }

    order.status = status;

    if (
      status === "delivered" &&
      order.paymentStatus === "pending"
    ) {
      order.paymentStatus = "paid";
    }

    await order.save({ session });
    await session.commitTransaction();

    const updatedOrder = await Order.findById(id)
      .populate("user", "name email role")
      .lean();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    await session.abortTransaction().catch(() => {});

    console.error("Update Admin Order Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update order status.",
    });
  } finally {
    await session.endSession();
  }
};

/**
 * Permanently delete only cancelled orders.
 * Active orders remain available as an audit trail and cannot be
 * removed while their inventory reservation may still matter.
 */
export const deleteOrderSafely = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID.",
    });
  }

  try {
    const order = await Order.findById(id).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (String(order.status).toLowerCase() !== "cancelled") {
      return res.status(409).json({
        success: false,
        message: "Only cancelled orders can be permanently deleted.",
      });
    }

    await Order.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Cancelled order deleted successfully.",
      orderId: id,
    });
  } catch (error) {
    console.error("Delete Admin Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete order.",
    });
  }
};
