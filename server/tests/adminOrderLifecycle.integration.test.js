import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";
import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";

import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import {
  deleteOrderSafely,
  recordCashPaymentSafely,
  updateOrderStatusSafely,
} from "../controllers/adminOrderLifecycleController.js";

let replSet;
let user;

function responseRecorder() {
  return {
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
}

function requestFor(id, body = {}) {
  return { params: { id: String(id) }, body };
}

async function createProduct({ stock = 10, sku = "TEST-SKU" } = {}) {
  return Product.create({
    name: "Integration Test Product",
    description: "Temporary product for isolated lifecycle tests",
    price: 100,
    category: "Test",
    sku,
    stock,
  });
}

async function createOrder({
  status = "pending",
  paymentMethod = "cash",
  paymentStatus = "pending",
  items,
} = {}) {
  if (!items?.length) {
    const product = await createProduct();
    items = [{
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
    }];
  }

  return Order.create({
    user: user._id,
    items,
    shippingAddress: {
      fullName: "Test Customer",
      phone: "08000000000",
      address: "1 Test Street",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
    },
    paymentMethod,
    paymentStatus,
    status,
    totalAmount: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  });
}

before(async () => {
  // A single-node replica set is required for real MongoDB transaction semantics.
  replSet = await MongoMemoryReplSet.create({
    replSet: { count: 1 },
  });
  await mongoose.connect(replSet.getUri());
  user = await User.create({
    name: "Lifecycle Test User",
    email: "lifecycle-test@example.invalid",
    password: "temporary-test-password",
    role: "admin",
  });
});

beforeEach(async () => {
  await Order.deleteMany({});
  await Product.deleteMany({});
});

after(async () => {
  await mongoose.disconnect();
  if (replSet) await replSet.stop();
});

test("rejects pending to delivered without changing the order", async () => {
  const order = await createOrder();
  const res = responseRecorder();

  await updateOrderStatusSafely(
    requestFor(order._id, { status: "delivered" }),
    res
  );

  assert.equal(res.statusCode, 409);
  assert.equal((await Order.findById(order._id)).status, "pending");
});

test("does not delete a pending order, but permits deleting a cancelled order", async () => {
  const pendingOrder = await createOrder();
  const blocked = responseRecorder();

  await deleteOrderSafely(requestFor(pendingOrder._id), blocked);

  assert.equal(blocked.statusCode, 409);
  assert.ok(await Order.exists({ _id: pendingOrder._id }));

  const cancelledOrder = await createOrder({ status: "cancelled" });
  const allowed = responseRecorder();

  await deleteOrderSafely(requestFor(cancelledOrder._id), allowed);

  assert.equal(allowed.statusCode, 200);
  assert.equal(await Order.findById(cancelledOrder._id), null);
});

test("only one concurrent cash-payment request changes pending to paid", async () => {
  const order = await createOrder({ paymentMethod: "cash" });
  const responses = [responseRecorder(), responseRecorder()];

  await Promise.all(
    responses.map((res) =>
      recordCashPaymentSafely(requestFor(order._id), res)
    )
  );

  assert.deepEqual(
    responses.map((res) => res.statusCode).sort((a, b) => a - b),
    [200, 409]
  );
  assert.equal((await Order.findById(order._id)).paymentStatus, "paid");
});

test("cancelling an eligible order restores inventory and marks it cancelled", async () => {
  const product = await createProduct({ stock: 10 });
  const order = await createOrder({
    items: [{ product: product._id, name: product.name, price: 100, quantity: 2 }],
  });
  const res = responseRecorder();

  await updateOrderStatusSafely(
    requestFor(order._id, { status: "cancelled" }),
    res
  );

  assert.equal(res.statusCode, 200);
  assert.equal((await Order.findById(order._id)).status, "cancelled");
  assert.equal((await Product.findById(product._id)).stock, 12);
});

test("concurrent cancellation requests restore stock no more than once", async () => {
  const product = await createProduct({ stock: 10 });
  const order = await createOrder({
    items: [{ product: product._id, name: product.name, price: 100, quantity: 2 }],
  });
  const responses = [responseRecorder(), responseRecorder()];

  await Promise.all(
    responses.map((res) =>
      updateOrderStatusSafely(
        requestFor(order._id, { status: "cancelled" }),
        res
      )
    )
  );

  assert.equal((await Order.findById(order._id)).status, "cancelled");
  assert.equal(
    (await Product.findById(product._id)).stock,
    12,
    "stock must increase by the ordered quantity exactly once"
  );
  assert.ok(responses.every((res) => [200, 500].includes(res.statusCode)));
});

test("rolls back earlier stock restoration if a later product is missing", async () => {
  const product = await createProduct({ stock: 10 });
  const missingProductId = new mongoose.Types.ObjectId();
  const order = await createOrder({
    items: [
      { product: product._id, name: product.name, price: 100, quantity: 2 },
      { product: missingProductId, name: "Deleted Product", price: 50, quantity: 1 },
    ],
  });
  const res = responseRecorder();

  await updateOrderStatusSafely(
    requestFor(order._id, { status: "cancelled" }),
    res
  );

  assert.equal(res.statusCode, 500);
  assert.equal((await Order.findById(order._id)).status, "pending");
  assert.equal((await Product.findById(product._id)).stock, 10);
});
