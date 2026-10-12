const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export const csrfProtection = (req, res, next) => {
  // Paystack cannot send our browser Origin header. This route is protected
  // by Paystack's HMAC-SHA512 signature over the captured raw request body.
  if (
    req.method === "POST" &&
    req.originalUrl?.split("?")[0] === "/api/payments/webhook"
  ) {
    return next();
  }

  if (SAFE_METHODS.has(req.method)) {
    return next();
  }

  // In production the browser client is cross-site from the API, so require
  // an explicit, trusted Origin on every state-changing request. This blocks
  // cross-site form/fetch requests from using the HttpOnly auth cookie.
  if (process.env.NODE_ENV !== "production") {
    return next();
  }

  const requestOrigin = req.get("Origin");
  const allowedOrigin = process.env.CLIENT_URL?.replace(/\/$/, "");

  if (!requestOrigin || !allowedOrigin || requestOrigin !== allowedOrigin) {
    return res.status(403).json({
      success: false,
      message: "Invalid request origin.",
    });
  }

  return next();
};

export default csrfProtection;
