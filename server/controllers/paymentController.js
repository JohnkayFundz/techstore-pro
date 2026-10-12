import crypto from "node:crypto";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import {
  initializePaystackTransaction,
  verifyPaystackTransaction,
  isValidPaystackSignature,
} from "../services/paystackService.js";

const expectedAmountKobo = (order) =>
  Math.round(Number(order.totalAmount) * 100);

const matchesOrderTransaction = (transaction, order) =>
  transaction?.status === "success" &&
  transaction?.currency === "NGN" &&
  Number(transaction?.amount) === expectedAmountKobo(order) &&
  transaction?.reference === order.paystackReference;

const publicOrder = (order) => ({
  id: order._id,
  orderNumber: order.orderNumber,
  paymentStatus: order.paymentStatus,
  status: order.status,
  totalAmount: order.totalAmount,
  currency: "NGN",
});

/**
 * POST /api/payments/init
 * The authenticated customer may initialize only their own pending card order.
 */
export const initializePayment = async (req, res) => {
  try {
    const { orderId } = req.body || {};
    if (!mongoose.Types.ObjectId.isValid(orderId || "")) {
      return res.status(400).json({ success: false, message: "A valid orderId is required." });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    if (order.paymentMethod !== "card") {
      return res.status(400).json({ success: false, message: "This order is not a card payment." });
    }

    if (order.status === "cancelled" || order.paymentStatus !== "pending") {
      return res.status(409).json({ success: false, message: "This order is not awaiting payment." });
    }

    if (!req.user.email) {
      return res.status(400).json({ success: false, message: "A customer email is required for payment." });
    }

    const reference = order.paystackReference || `TS_${order._id}_${crypto.randomUUID().replace(/-/g, "")}`;
    order.paystackReference = reference;
    await order.save();

    const clientUrl = process.env.CLIENT_URL?.replace(/\/$/, "");
    if (!clientUrl) {
      return res.status(503).json({ success: false, message: "Payment callback URL is not configured." });
    }

    const transaction = await initializePaystackTransaction({
      email: req.user.email,
      amount: expectedAmountKobo(order),
      currency: "NGN",
      reference,
      callback_url: `${clientUrl}/order-success/${order._id}`,
      metadata: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        userId: req.user._id.toString(),
      },
    });

    if (!transaction?.authorization_url || transaction.reference !== reference) {
      return res.status(502).json({ success: false, message: "Paystack did not return a valid checkout session." });
    }

    return res.status(200).json({
      success: true,
      authorizationUrl: transaction.authorization_url,
      reference,
      order: publicOrder(order),
    });
  } catch (error) {
    console.error("Paystack initialization error:", error.message);
    return res.status(error.statusCode || 502).json({
      success: false,
      message: error.statusCode === 503
        ? error.message
        : "Unable to initialize payment. Your order may still be pending; check your orders before retrying.",
    });
  }
};

/**
 * GET /api/payments/verify/:reference
 * Never trusts the browser callback alone; verifies server-to-server with Paystack.
 */
export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;
    if (!reference || reference.length > 150) {
      return res.status(400).json({ success: false, message: "A valid payment reference is required." });
    }

    const order = await Order.findOne({
      paystackReference: reference,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Payment reference not found for this account." });
    }

    if (order.paymentStatus === "paid") {
      return res.status(200).json({ success: true, verified: true, order: publicOrder(order) });
    }

    const transaction = await verifyPaystackTransaction(reference);
    if (!matchesOrderTransaction(transaction, order)) {
      if (transaction?.reference === reference && transaction?.status && transaction.status !== "success") {
        await Order.updateOne(
          { _id: order._id, paymentStatus: "pending", status: { $ne: "cancelled" } },
          { $set: { paymentStatus: "failed", paymentFailureAt: new Date() } }
        );
      }

      return res.status(402).json({
        success: false,
        verified: false,
        message: "Payment has not been confirmed. Do not retry with a new payment until you check your order.",
      });
    }

    const updated = await Order.findOneAndUpdate(
      {
        _id: order._id,
        paymentMethod: "card",
        paymentStatus: "pending",
        paystackReference: reference,
      },
      {
        $set: {
          paymentStatus: "paid",
          paidAt: new Date(),
          paymentProvider: "paystack",
        },
      },
      { new: true }
    );

    if (!updated) {
      const current = await Order.findById(order._id);
      if (current?.paymentStatus !== "paid") {
        return res.status(409).json({ success: false, message: "Order lifecycle changed before payment could be applied." });
      }
      return res.status(200).json({ success: true, verified: true, order: publicOrder(current) });
    }

    return res.status(200).json({ success: true, verified: true, order: publicOrder(updated) });
  } catch (error) {
    console.error("Paystack verification error:", error.message);
    return res.status(error.statusCode || 502).json({
      success: false,
      message: error.statusCode === 503 ? error.message : "Unable to verify payment right now.",
    });
  }
};

/**
 * POST /api/payments/webhook
 * Paystack signature is checked against the exact request bytes captured by Express.
 */
export const paystackWebhook = async (req, res) => {
  try {
    const signature = req.get("x-paystack-signature");
    if (!isValidPaystackSignature(req.rawBody, signature)) {
      return res.status(401).json({ success: false, message: "Invalid Paystack signature." });
    }

    const event = req.body;
    if (event?.event !== "charge.success") {
      return res.status(200).json({ success: true, ignored: true });
    }

    const transaction = event?.data;
    const reference = transaction?.reference;
    if (typeof reference !== "string" || !reference) {
      return res.status(400).json({ success: false, message: "Webhook payment reference is missing." });
    }

    const order = await Order.findOne({ paystackReference: reference });
    if (!order) {
      // A valid signed event can arrive before a delayed order write becomes visible.
      return res.status(404).json({ success: false, message: "Order for payment reference was not found." });
    }

    if (!matchesOrderTransaction(transaction, order)) {
      return res.status(400).json({ success: false, message: "Webhook transaction does not match the order." });
    }

    if (order.paymentStatus === "paid") {
      return res.status(200).json({ success: true, duplicate: true });
    }

    const updated = await Order.updateOne(
      {
        _id: order._id,
        paymentMethod: "card",
        paymentStatus: "pending",
        paystackReference: reference,
      },
      {
        $set: {
          paymentStatus: "paid",
          paidAt: new Date(),
          paymentProvider: "paystack",
          lastPaymentEventAt: new Date(),
        },
      }
    );

    return res.status(200).json({
      success: true,
      processed: updated.modifiedCount === 1,
      duplicate: updated.modifiedCount === 0,
    });
  } catch (error) {
    console.error("Paystack webhook error:", error.message);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode === 503 ? error.message : "Webhook processing failed.",
    });
  }
};
