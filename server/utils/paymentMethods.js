export const SUPPORTED_PAYMENT_METHODS = Object.freeze(["cash"]);

export const isSupportedPaymentMethod = (value) =>
  SUPPORTED_PAYMENT_METHODS.includes(value);
