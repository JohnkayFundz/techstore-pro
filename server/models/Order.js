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
    },


    image: {
      type: String,
      required: true,
    },


    price: {
      type: Number,
      required: true,
    },


    quantity: {
      type: Number,
      required: true,
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


    // User who placed order

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },



    // Human readable order number

    orderNumber: {
      type: String,
      unique: true,
    },



    // Purchased products

    items: [
      {
        type: orderItemSchema,
        required: true,
      }
    ],



    // Delivery information

    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },



    // Payment method

    paymentMethod: {

      type: String,

      enum: [
        "cash",
        "card",
      ],

      default: "cash",

    },



    // Payment status

    paymentStatus: {

      type: String,

      enum: [
        "pending",
        "paid",
        "failed",
      ],

      default: "pending",

    },



    // Order status

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



    // Total price

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
   CREATE ORDER NUMBER
========================================================== */

orderSchema.pre(
  "save",
  function(next){

    if(!this.orderNumber){

      const timestamp =
        Date.now()
          .toString()
          .slice(-8);


      this.orderNumber =
        `TS-${timestamp}`;

    }


    next();

  }
);






/* ==========================================================
   INDEXES
========================================================== */

// Search orders by user quickly

orderSchema.index({
  user: 1,
});


// Search orders by date

orderSchema.index({
  createdAt: -1,
});






const Order = mongoose.model(
  "Order",
  orderSchema
);


export default Order;