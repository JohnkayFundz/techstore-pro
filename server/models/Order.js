import mongoose from "mongoose";


const orderSchema = new mongoose.Schema(
  {

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        image: {
          type: String,
          default: "",
        },

        price: {
          type: Number,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],


    shippingAddress: {

      fullName: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      country: {
        type: String,
        default: "Nigeria",
      },

    },


    paymentMethod: {
      type: String,
      enum: [
        "card",
        "cash_on_delivery",
      ],
      default: "cash_on_delivery",
    },


    totalAmount: {
      type: Number,
      required: true,
    },


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


  },
  {
    timestamps: true,
    versionKey: false,
  }
);



const Order = mongoose.model(
  "Order",
  orderSchema
);


export default Order;