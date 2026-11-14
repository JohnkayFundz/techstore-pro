import test from "node:test";
import assert from "node:assert/strict";

import {
  SUPPORTED_PAYMENT_METHODS,
  isSupportedPaymentMethod,
} from "../utils/paymentMethods.js";

test("cash on delivery is the only supported payment method", () => {
  assert.deepEqual(SUPPORTED_PAYMENT_METHODS, ["cash"]);
  assert.equal(isSupportedPaymentMethod("cash"), true);
});

test("card and unknown payment methods are rejected until a gateway exists", () => {
  assert.equal(isSupportedPaymentMethod("card"), false);
  assert.equal(isSupportedPaymentMethod("bank_transfer"), false);
  assert.equal(isSupportedPaymentMethod(""), false);
  assert.equal(isSupportedPaymentMethod(null), false);
});
