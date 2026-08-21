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

    country: {
      type: String,
      required: true,
      trim: true,
      default: "Nigeria",
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
    /* --------------------------------------------------------
       USER WHO PLACED THE ORDER
    -------------------------------------------------------- */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* --------------------------------------------------------
       HUMAN-READABLE ORDER NUMBER
    -------------------------------------------------------- */

    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },

    /* --------------------------------------------------------
       PURCHASED PRODUCTS
    -------------------------------------------------------- */

    items: {
      type: [orderItemSchema],
      required: true,

      validate: {
        validator: function (items) {
          return Array.isArray(items) && items.length > 0;
        },

        message: "Order must contain at least one item.",
      },
    },

    /* --------------------------------------------------------
       SHIPPING ADDRESS
    -------------------------------------------------------- */

    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },

    /* --------------------------------------------------------
       PAYMENT METHOD
    -------------------------------------------------------- */

    paymentMethod: {
      type: String,

      enum: [
        "cash",
        "card",
      ],

      default: "cash",
    },

    /* --------------------------------------------------------
       PAYMENT STATUS
    -------------------------------------------------------- */

    paymentStatus: {
      type: String,

      enum: [
        "pending",
        "paid",
        "failed",
      ],

      default: "pending",
    },

    /* --------------------------------------------------------
       ORDER STATUS
    -------------------------------------------------------- */

    status: {
      type: String,

      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],

      default: "pending",
    },

    /* --------------------------------------------------------
       TOTAL ORDER AMOUNT
    -------------------------------------------------------- */

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
  },

  {
    timestamps: true,
  }
);

/* ==========================================================
   CREATE UNIQUE ORDER NUMBER
========================================================== */

orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    const timestamp = new Date()
      .toISOString()
      .replace(/\D/g, "")
      .slice(0, 14);

    const random = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    this.orderNumber = `TS-${timestamp}-${random}`;
  }

  next();
});

/* ==========================================================
   INDEXES
========================================================== */

/*
   Find user's orders quickly.
*/
orderSchema.index({
  user: 1,
});

/*
   Sort newest orders first.
*/
orderSchema.index({
  createdAt: -1,
});

/*
   Useful for admin order management.
*/
orderSchema.index({
  status: 1,
});

/*
   Useful for payment management.
*/
orderSchema.index({
  paymentStatus: 1,
});

/* ==========================================================
   CREATE ORDER MODEL
========================================================== */

const Order = mongoose.model(
  "Order",
  orderSchema
);

export default Order;