import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";
import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";

import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { createOrder, cancelOrder } from "../controllers/orderController.js";

let replicaSet;
let user;

const shippingAddress = {
  fullName: "Integration Test Buyer",
  phone: "+2348000000000",
  address: "1 Test Street",
  city: "Lagos",
  state: "Lagos",
  country: "Nigeria",
};

const responseRecorder = () => {
  const response = {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };

  return response;
};

const createProduct = (overrides = {}) =>
  Product.create({
    name: "Integration Test Phone",
    description: "Disposable integration-test product",
    price: 129.99,
    category: "Phones",
    sku: `TEST-${new mongoose.Types.ObjectId().toString()}`,
    stock: 10,
    isActive: true,
    ...overrides,
  });

before(async () => {
  replicaSet = await MongoMemoryReplSet.create({
    binary: { version: "7.0.14" },
    replSet: { count: 1, storageEngine: "wiredTiger" },
  });

  await mongoose.connect(replicaSet.getUri(), {
    dbName: "techstore_pro_integration",
  });

  await Promise.all([User.init(), Product.init(), Order.init()]);
  user = await User.create({
    name: "Integration Test Buyer",
    email: "integration-buyer@example.test",
    password: "test-password-123",
  });
});

beforeEach(async () => {
  await Promise.all([
    Order.deleteMany({}),
    Product.deleteMany({}),
  ]);
});

after(async () => {
  await mongoose.disconnect();
  await replicaSet?.stop();
});

test("creates an order in a replica-set transaction and decrements stock using server prices", async () => {
  const product = await createProduct({ stock: 10 });
  const response = responseRecorder();

  await createOrder(
    {
      user: { _id: user._id },
      body: {
        items: [
          { product: product._id.toString(), quantity: 1, price: 0.01 },
          { product: product._id.toString(), quantity: 2, price: 0.01 },
        ],
        shippingAddress,
        paymentMethod: "cash",
      },
    },
    response
  );

  assert.equal(response.statusCode, 201);
  assert.equal(response.body.success, true);
  assert.equal(response.body.order.items.length, 1);
  assert.equal(response.body.order.items[0].quantity, 3);
  assert.equal(response.body.order.items[0].price, 129.99);
  assert.equal(response.body.order.totalAmount, 389.97);
  assert.equal(response.body.order.paymentMethod, "cash");
  assert.equal(response.body.order.paymentStatus, "pending");

  const savedProduct = await Product.findById(product._id);
  assert.equal(savedProduct.stock, 7);
  assert.equal(await Order.countDocuments({ user: user._id }), 1);
});

test("cancels a pending order transactionally and restores stock exactly once", async () => {
  const product = await createProduct({ stock: 10 });
  const createResponse = responseRecorder();

  await createOrder(
    {
      user: { _id: user._id },
      body: {
        items: [{ product: product._id.toString(), quantity: 3 }],
        shippingAddress,
        paymentMethod: "cash",
      },
    },
    createResponse
  );

  assert.equal(createResponse.statusCode, 201);
  assert.equal((await Product.findById(product._id)).stock, 7);

  const cancelResponse = responseRecorder();
  await cancelOrder(
    {
      user: { _id: user._id },
      params: { id: createResponse.body.order._id.toString() },
    },
    cancelResponse
  );

  assert.equal(cancelResponse.statusCode, 200);
  assert.equal(cancelResponse.body.order.status, "cancelled");
  assert.equal((await Product.findById(product._id)).stock, 10);

  const secondCancelResponse = responseRecorder();
  await cancelOrder(
    {
      user: { _id: user._id },
      params: { id: createResponse.body.order._id.toString() },
    },
    secondCancelResponse
  );

  assert.equal(secondCancelResponse.statusCode, 400);
  assert.equal((await Product.findById(product._id)).stock, 10);
  assert.equal(await Order.countDocuments({ status: "cancelled" }), 1);
});

test("rejects an order when stock is insufficient without creating an order or changing stock", async () => {
  const product = await createProduct({ stock: 2 });
  const response = responseRecorder();

  await createOrder(
    {
      user: { _id: user._id },
      body: {
        items: [{ product: product._id.toString(), quantity: 3 }],
        shippingAddress,
        paymentMethod: "cash",
      },
    },
    response
  );

  assert.equal(response.statusCode, 400);
  assert.match(response.body.message, /not have enough stock/i);
  assert.equal((await Product.findById(product._id)).stock, 2);
  assert.equal(await Order.countDocuments({}), 0);
});

test("rejects unsupported card payment before opening an order transaction", async () => {
  const product = await createProduct();
  const response = responseRecorder();

  await createOrder(
    {
      user: { _id: user._id },
      body: {
        items: [{ product: product._id.toString(), quantity: 1 }],
        shippingAddress,
        paymentMethod: "card",
      },
    },
    response
  );

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.message, "Invalid payment method.");
  assert.equal((await Product.findById(product._id)).stock, 10);
  assert.equal(await Order.countDocuments({}), 0);
});
