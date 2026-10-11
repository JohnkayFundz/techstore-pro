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

const allowedTransitions = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

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

    if (!allowedTransitions[previousStatus]?.includes(status)) {
      await session.abortTransaction();
      return res.status(409).json({
        success: false,
        message: `Order status cannot transition from "${previousStatus}" to "${status}".`,
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
    const deletedOrder = await Order.findOneAndDelete({
      _id: id,
      status: "cancelled",
    }).lean();

    if (!deletedOrder) {
      const orderExists = await Order.exists({ _id: id });

      if (!orderExists) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }

      return res.status(409).json({
        success: false,
        message: "Only cancelled orders can be permanently deleted.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cancelled order deleted successfully.",
      orderId: String(deletedOrder._id),
    });
  } catch (error) {
    console.error("Delete Admin Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete order.",
    });
  }
};


/**
 * Record cash actually received for an order.
 * Card payments must be verified by a real payment provider.
 */
export const recordCashPaymentSafely = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID.",
    });
  }

  try {
    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: id,
        paymentMethod: "cash",
        paymentStatus: "pending",
      },
      {
        $set: { paymentStatus: "paid" },
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("_id paymentMethod paymentStatus status");

    if (!updatedOrder) {
      // Read only to return a useful error; the state-changing operation above
      // remains a single atomic conditional update.
      const currentOrder = await Order.findById(id)
        .select("_id paymentMethod paymentStatus")
        .lean();

      if (!currentOrder) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }

      if (String(currentOrder.paymentMethod || "").trim().toLowerCase() !== "cash") {
        return res.status(400).json({
          success: false,
          message: "Only cash orders can be marked paid through this action.",
        });
      }

      return res.status(409).json({
        success: false,
        message: "Only orders with pending payment can be updated.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cash payment recorded successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Record Cash Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to record cash payment.",
    });
  }
};
