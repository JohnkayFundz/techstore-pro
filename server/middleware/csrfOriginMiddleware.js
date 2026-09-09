const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

const getAllowedOrigin = () => process.env.CLIENT_URL?.replace(/\/$/, "");

const getRequestOrigin = (req) => {
  if (typeof req.headers.origin === "string" && req.headers.origin) {
    return req.headers.origin.replace(/\/$/, "");
  }

  if (typeof req.headers.referer === "string" && req.headers.referer) {
    try {
      return new URL(req.headers.referer).origin;
    } catch {
      return null;
    }
  }

  return null;
};

/**
 * Reject cross-origin state-changing browser requests.
 * This complements SameSite=None cookies when the frontend and API
 * are hosted on different sites (for example Vercel + Render).
 */
export const csrfOriginCheck = (req, res, next) => {
  if (process.env.NODE_ENV !== "production" || SAFE_METHODS.has(req.method)) {
    return next();
  }

  const allowedOrigin = getAllowedOrigin();
  const requestOrigin = getRequestOrigin(req);

  if (allowedOrigin && requestOrigin === allowedOrigin) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Cross-origin request blocked.",
  });
};

export default csrfOriginCheck;
