import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { isValidPaystackSignature } from "../services/paystackService.js";

const secret = "sk_test_unit_test_secret";

const signatureFor = (body) =>
  crypto.createHmac("sha512", secret).update(body).digest("hex");

test("accepts a valid HMAC-SHA512 signature for exact raw bytes", () => {
  process.env.PAYSTACK_MODE = "test";
  process.env.PAYSTACK_SECRET_KEY = secret;
  const rawBody = Buffer.from('{ "event":"charge.success", "data":{"amount":50000} }');
  assert.equal(isValidPaystackSignature(rawBody, signatureFor(rawBody)), true);
});

test("rejects a signature when raw payload bytes change", () => {
  process.env.PAYSTACK_MODE = "test";
  process.env.PAYSTACK_SECRET_KEY = secret;
  const original = Buffer.from('{"event":"charge.success"}');
  const altered = Buffer.from('{ "event":"charge.success"}');
  assert.equal(isValidPaystackSignature(altered, signatureFor(original)), false);
});

test("rejects missing, malformed, and non-hex signatures", () => {
  process.env.PAYSTACK_MODE = "test";
  process.env.PAYSTACK_SECRET_KEY = secret;
  const rawBody = Buffer.from('{"event":"charge.success"}');
  assert.equal(isValidPaystackSignature(rawBody, undefined), false);
  assert.equal(isValidPaystackSignature(rawBody, "not-a-signature"), false);
  assert.equal(isValidPaystackSignature(rawBody, "zz".repeat(64)), false);
});

test("refuses a live key while configured for test mode", () => {
  process.env.PAYSTACK_MODE = "test";
  process.env.PAYSTACK_SECRET_KEY = "sk_live_not_allowed";
  assert.throws(() => isValidPaystackSignature(Buffer.from("{}"), "00"), /test secret key/);
  process.env.PAYSTACK_SECRET_KEY = secret;
});
