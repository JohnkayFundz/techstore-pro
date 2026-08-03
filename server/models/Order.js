import mongoose from "mongoose";

/* ==========================================================
   ORDER ITEM SCHEMA
========================================================== */

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  {
    _id: false,
  }
);

/* ==========================================================
   SHIPPING ADDRESS SCHEMA
========================================================== */

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    postalCode: {
      type: String,
      default: "",
      trim: true,
    },

    country: {
      type: String,
      default: "Nigeria",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

/* ==========================================================
   ORDER SCHEMA
========================================================== */

const orderSchema = new mongoose.Schema(
  {
    // Customer
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Purchased products
    orderItems: {
      type: [orderItemSchema],
      required: true,
      validate: [
        (items) => items.length > 0,
        "Order must contain at least one product.",
      ],
    },

    // Delivery Address
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },

    // Payment
    paymentMethod: {
      type: String,
      enum: [
        "Cash on Delivery",
        "Card",
        "Bank Transfer",
      ],
      default: "Cash on Delivery",
    },

    // Pricing
    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    taxPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    // Payment Status
    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    // Delivery Status
    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    // Order Status
    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* ==========================================================
   INDEXES
========================================================== */

orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

/* ==========================================================
   MODEL
========================================================== */

const Order = mongoose.model("Order", orderSchema);

export default Order;