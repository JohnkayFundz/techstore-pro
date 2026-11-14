import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";
import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";

import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { createOrder, cancelOrder } from "../controllers/orderController.js";
import { registerUser, loginUser, getCurrentUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { updateOrderStatusSafely, recordCashPaymentSafely } from "../controllers/adminOrderLifecycleController.js";

process.env.JWT_SECRET ||= "techstore-pro-integration-test-secret-only";

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
    cookie(name, value, options) {
      this.cookieData = { name, value, options };
      return this;
    },
    clearCookie(name, options) {
      this.clearedCookie = { name, options };
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


test("registers a normalized account, hashes its password, and issues an HTTP-only token cookie", async () => {
  const response = responseRecorder();
  const email = `auth-register-${new mongoose.Types.ObjectId()}@example.test`;

  await registerUser(
    { body: { name: "  Integration Buyer  ", email: ` ${email.toUpperCase()} `, password: "secure-pass-123" } },
    response
  );

  assert.equal(response.statusCode, 201);
  assert.equal(response.body.success, true);
  assert.equal(response.body.user.email, email);
  assert.equal(response.body.user.name, "Integration Buyer");
  assert.equal(response.cookieData.name, "token");
  assert.equal(response.cookieData.options.httpOnly, true);

  const saved = await User.findOne({ email }).select("+password");
  assert.ok(saved);
  assert.notEqual(saved.password, "secure-pass-123");
  assert.equal(await saved.matchPassword("secure-pass-123"), true);
});

test("rejects duplicate registration without creating a second account", async () => {
  const email = `auth-duplicate-${new mongoose.Types.ObjectId()}@example.test`;
  await User.create({ name: "Existing Buyer", email, password: "secure-pass-123" });

  const response = responseRecorder();
  await registerUser(
    { body: { name: "Another Buyer", email: email.toUpperCase(), password: "secure-pass-123" } },
    response
  );

  assert.equal(response.statusCode, 409);
  assert.equal(await User.countDocuments({ email }), 1);
});

test("logs in with normalized email and rejects an incorrect password", async () => {
  const email = `auth-login-${new mongoose.Types.ObjectId()}@example.test`;
  await User.create({ name: "Login Buyer", email, password: "secure-pass-123" });

  const success = responseRecorder();
  await loginUser(
    { body: { email: email.toUpperCase(), password: "secure-pass-123" } },
    success
  );

  assert.equal(success.statusCode, 200);
  assert.equal(success.body.success, true);
  assert.equal(success.cookieData.name, "token");
  assert.equal(success.cookieData.options.httpOnly, true);

  const failure = responseRecorder();
  await loginUser(
    { body: { email, password: "incorrect-password" } },
    failure
  );

  assert.equal(failure.statusCode, 401);
  assert.equal(failure.body.message, "Invalid email or password.");
});

test("protect middleware authenticates the issued bearer token and current-user response excludes password", async () => {
  const email = `auth-protect-${new mongoose.Types.ObjectId()}@example.test`;
  const registration = responseRecorder();
  await registerUser(
    { body: { name: "Protected Buyer", email, password: "secure-pass-123" } },
    registration
  );

  const req = {
    headers: { authorization: `Bearer ${registration.cookieData.value}` },
    cookies: {},
  };
  const middlewareResponse = responseRecorder();
  let nextCalled = false;

  await protect(req, middlewareResponse, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(req.user.email, email);

  const current = responseRecorder();
  await getCurrentUser({ user: req.user }, current);
  assert.equal(current.statusCode, 200);
  assert.equal(current.body.user.email, email);
  assert.equal(Object.hasOwn(current.body.user, "password"), false);
});

test("protect middleware rejects a malformed bearer token", async () => {
  const response = responseRecorder();
  let nextCalled = false;

  await protect(
    { headers: { authorization: "Bearer not-a-jwt" }, cookies: {} },
    response,
    () => { nextCalled = true; }
  );

  assert.equal(nextCalled, false);
  assert.equal(response.statusCode, 401);
  assert.equal(response.body.message, "Malformed authentication token.");
});


test("delivering an order does not falsely mark its cash payment as received", async () => {
  const product = await createProduct();
  const order = await Order.create({
    user: user._id,
    items: [{ product: product._id, name: product.name, price: product.price, quantity: 1 }],
    shippingAddress,
    paymentMethod: "cash",
    paymentStatus: "pending",
    status: "pending",
    totalAmount: product.price,
  });

  const response = responseRecorder();
  await updateOrderStatusSafely(
    { params: { id: order._id.toString() }, body: { status: "delivered" } },
    response
  );

  assert.equal(response.statusCode, 200);
  const saved = await Order.findById(order._id);
  assert.equal(saved.status, "delivered");
  assert.equal(saved.paymentStatus, "pending");
});

test("records a cash receipt explicitly and prevents a second receipt update", async () => {
  const product = await createProduct();
  const order = await Order.create({
    user: user._id,
    items: [{ product: product._id, name: product.name, price: product.price, quantity: 1 }],
    shippingAddress,
    paymentMethod: "cash",
    paymentStatus: "pending",
    status: "delivered",
    totalAmount: product.price,
  });

  const first = responseRecorder();
  await recordCashPaymentSafely({ params: { id: order._id.toString() } }, first);

  assert.equal(first.statusCode, 200);
  assert.equal(first.body.order.paymentStatus, "paid");

  const second = responseRecorder();
  await recordCashPaymentSafely({ params: { id: order._id.toString() } }, second);

  assert.equal(second.statusCode, 409);
  assert.equal((await Order.findById(order._id)).paymentStatus, "paid");
});
