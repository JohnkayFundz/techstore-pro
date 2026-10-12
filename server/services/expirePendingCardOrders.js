import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { verifyPaystackTransaction } from "./paystackService.js";
import { matchesSuccessfulTransaction } from "./paymentValidation.js";

/**
 * Run periodically from the API process. A provider reference is verified
 * before inventory is released; network/provider uncertainty leaves the order
 * untouched for a later retry instead of risking a paid order losing stock.
 */
export const expirePendingCardOrders = async () => {
  const dueOrders = await Order.find({
    paymentMethod: "card",
    paymentStatus: "pending",
    status: "pending",
    expiresAt: { $lte: new Date() },
  })
    .select("_id paystackReference totalAmount")
    .limit(100)
    .lean();

  for (const candidate of dueOrders) {
    let transaction = null;

    if (candidate.paystackReference) {
      try {
        transaction = await verifyPaystackTransaction(candidate.paystackReference);
      } catch (error) {
        console.warn("Payment expiry deferred; Paystack verification unavailable:", error.message);
        continue;
      }

      if (transaction?.status === "success") {
        if (!matchesSuccessfulTransaction(transaction, candidate)) {
          console.error("Payment expiry requires manual review: successful transaction did not match order", candidate._id.toString());
          continue;
        }

        await Order.updateOne(
          {
            _id: candidate._id,
            paystackReference: candidate.paystackReference,
            paymentMethod: "card",
            paymentStatus: "pending",
          },
          {
            $set: {
              paymentStatus: "paid",
              paymentProvider: "paystack",
              paidAt: new Date(),
            },
          }
        );
        continue;
      }

      // A pending/ongoing/unknown provider status is not safe to expire.
      if (!["failed", "abandoned"].includes(String(transaction?.status || "").toLowerCase())) {
        continue;
      }
    }

    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const order = await Order.findOne({
        _id: candidate._id,
        paymentMethod: "card",
        paymentStatus: "pending",
        status: "pending",
        expiresAt: { $lte: new Date() },
        ...(candidate.paystackReference
          ? { paystackReference: candidate.paystackReference }
          : { paystackReference: { $exists: false } }),
      }).session(session);

      if (!order) {
        await session.abortTransaction();
        continue;
      }

      order.paymentStatus = "failed";
      order.paymentFailureAt = new Date();
      await order.save({ session });

      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.product },
          { $inc: { stock: item.quantity } },
          { session }
        );
      }

      await session.commitTransaction();
    } catch (error) {
      if (session.inTransaction()) await session.abortTransaction();
      console.error("Unable to expire pending card order:", error.message);
    } finally {
      await session.endSession();
    }
  }

  return { examined: dueOrders.length };
};
