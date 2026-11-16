import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";
import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";

import app from "../app.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

process.env.JWT_SECRET ||= "techstore-pro-http-test-secret-only";

let replicaSet;
let server;
let baseUrl;

const shippingAddress = {
  fullName: "HTTP Test Buyer",
  phone: "+2348000000000",
  address: "1 Disposable Test Street",
  city: "Lagos",
  state: "Lagos",
  country: "Nigeria",
};

const request = async (path, { token, ...options } = {}) => {
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  return fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
};

const register = async (name, email) => {
  const response = await request("/api/auth/register", {
    method: "POST",
    body: { name, email, password: "test-password-123" },
  });

  assert.equal(response.status, 201);
  const cookie = response.headers.get("set-cookie") || "";
  const token = cookie.match(/(?:^|;\s*)token=([^;]+)/)?.[1];

  assert.ok(token, "registration should issue an HTTP-only auth cookie");
  return { token: decodeURIComponent(token), body: await response.json() };
};

const createProduct = async () => Product.create({
  name: "HTTP Integration Test Phone",
  description: "Disposable product used only by automated tests",
  price: 1250,
  category: "Phones",
  sku: `HTTP-TEST-${new mongoose.Types.ObjectId()}`,
  stock: 8,
  isActive: true,
});

before(async () => {
  replicaSet = await MongoMemoryReplSet.create({
    binary: { version: "7.0.14" },
    replSet: { count: 1, storageEngine: "wiredTiger" },
  });

  await mongoose.connect(replicaSet.getUri(), {
    dbName: "techstore_pro_http_integration",
  });
  await Promise.all([User.init(), Product.init(), Order.init()]);

  server = app.listen(0);
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

beforeEach(async () => {
  await Promise.all([Order.deleteMany({}), Product.deleteMany({}), User.deleteMany({})]);
});

after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  await mongoose.disconnect();
  await replicaSet?.stop();
});

test("customer registration and protected current-user route work over HTTP", async () => {
  const { token, body } = await register(
    "HTTP Buyer",
    `http-buyer-${new mongoose.Types.ObjectId()}@example.test`
  );

  assert.equal(body.success, true);
  assert.equal(body.user.role, "user");
  assert.equal(Object.hasOwn(body.user, "password"), false);

  const current = await request("/api/auth/me", { token });
  assert.equal(current.status, 200);
  const payload = await current.json();
  assert.equal(payload.user.email, body.user.email);

  const anonymous = await request("/api/auth/me");
  assert.equal(anonymous.status, 401);
});

test("customer can place a cash-on-delivery order and retrieve it from order history", async () => {
  const { token } = await register(
    "Checkout Buyer",
    `checkout-${new mongoose.Types.ObjectId()}@example.test`
  );
  const product = await createProduct();

  const response = await request("/api/orders", {
    method: "POST",
    token,
    body: {
      items: [{ product: product._id.toString(), quantity: 2, price: 0.01 }],
      shippingAddress,
      paymentMethod: "cash",
    },
  });

  assert.equal(response.status, 201);
  const payload = await response.json();
  assert.equal(payload.success, true);
  assert.equal(payload.order.totalAmount, 2500);
  assert.equal(payload.order.paymentMethod, "cash");
  assert.equal(payload.order.paymentStatus, "pending");
  assert.equal((await Product.findById(product._id)).stock, 6);

  const history = await request("/api/orders/my-orders", { token });
  assert.equal(history.status, 200);
  const historyPayload = await history.json();
  assert.equal(historyPayload.count, 1);
  assert.equal(historyPayload.orders[0]._id, payload.order._id);
});

test("customer cannot read another customer's order and can cancel their own pending order", async () => {
  const owner = await register(
    "Order Owner",
    `owner-${new mongoose.Types.ObjectId()}@example.test`
  );
  const other = await register(
    "Other Buyer",
    `other-${new mongoose.Types.ObjectId()}@example.test`
  );
  const product = await createProduct();

  const created = await request("/api/orders", {
    method: "POST",
    token: owner.token,
    body: {
      items: [{ product: product._id.toString(), quantity: 3 }],
      shippingAddress,
      paymentMethod: "cash",
    },
  });
  assert.equal(created.status, 201);
  const { order } = await created.json();

  const forbidden = await request(`/api/orders/${order._id}`, { token: other.token });
  assert.ok([403, 404].includes(forbidden.status));

  const cancelled = await request(`/api/orders/${order._id}/cancel`, {
    method: "PATCH",
    token: owner.token,
  });
  assert.equal(cancelled.status, 200);
  const cancelledPayload = await cancelled.json();
  assert.equal(cancelledPayload.order.status, "cancelled");
  assert.equal((await Product.findById(product._id)).stock, 8);
});

test("checkout rejects unauthenticated requests and unsupported card payment", async () => {
  const product = await createProduct();
  const body = {
    items: [{ product: product._id.toString(), quantity: 1 }],
    shippingAddress,
    paymentMethod: "cash",
  };

  const anonymous = await request("/api/orders", { method: "POST", body });
  assert.equal(anonymous.status, 401);

  const { token } = await register(
    "Payment Test Buyer",
    `payment-${new mongoose.Types.ObjectId()}@example.test`
  );
  const card = await request("/api/orders", {
    method: "POST",
    token,
    body: { ...body, paymentMethod: "card" },
  });
  assert.equal(card.status, 400);
  assert.equal((await card.json()).message, "Invalid payment method.");
  assert.equal((await Product.findById(product._id)).stock, 8);
  assert.equal(await Order.countDocuments({}), 0);
});
