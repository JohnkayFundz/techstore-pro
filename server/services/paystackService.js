import crypto from "node:crypto";

const PAYSTACK_API = "https://api.paystack.co";

const getSecretKey = () => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const mode = process.env.PAYSTACK_MODE || "test";

  if (!secret) {
    const error = new Error("Paystack is not configured.");
    error.statusCode = 503;
    throw error;
  }

  if (mode === "test" && !secret.startsWith("sk_test_")) {
    const error = new Error("PAYSTACK_MODE=test requires a Paystack test secret key.");
    error.statusCode = 503;
    throw error;
  }

  if (mode === "live" && !secret.startsWith("sk_live_")) {
    const error = new Error("PAYSTACK_MODE=live requires a Paystack live secret key.");
    error.statusCode = 503;
    throw error;
  }

  if (!["test", "live"].includes(mode)) {
    const error = new Error("PAYSTACK_MODE must be either test or live.");
    error.statusCode = 503;
    throw error;
  }

  return secret;
};

const requestPaystack = async (path, options = {}) => {
  const secret = getSecretKey();
  const response = await fetch(`${PAYSTACK_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
    signal: AbortSignal.timeout(12000),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.status !== true) {
    const error = new Error(payload?.message || "Paystack request failed.");
    error.statusCode = response.status >= 500 ? 502 : 400;
    throw error;
  }

  return payload.data;
};

export const initializePaystackTransaction = (transaction) =>
  requestPaystack("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify(transaction),
  });

export const verifyPaystackTransaction = (reference) =>
  requestPaystack(`/transaction/verify/${encodeURIComponent(reference)}`);

export const isValidPaystackSignature = (rawBody, signature) => {
  const secret = getSecretKey();
  if (!Buffer.isBuffer(rawBody) || typeof signature !== "string") return false;

  const expected = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest();

  let provided;
  try {
    provided = Buffer.from(signature, "hex");
  } catch {
    return false;
  }

  return provided.length === expected.length &&
    crypto.timingSafeEqual(provided, expected);
};
