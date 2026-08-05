import jwt from "jsonwebtoken";
import User from "../models/User.js";



/* ==========================================================
   GET TOKEN HELPER
========================================================== */

const getToken = (req) => {

  let token = null;


  // Authorization header

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {

    token = req.headers.authorization.split(" ")[1];

  }


  // Cookie fallback

  if (!token && req.cookies?.token) {

    token = req.cookies.token;

  }


  return token;

};




/* ==========================================================
   PROTECT ROUTES
   Requires authentication
========================================================== */

export const protect = async (
  req,
  res,
  next
) => {

  try {


    const token = getToken(req);



    if (!token) {

      return res.status(401).json({

        success: false,

        message:
          "Authentication token is missing.",

      });

    }



    // Validate JWT format

    if (
      typeof token !== "string" ||
      token.trim() === "" ||
      token.split(".").length !== 3
    ) {

      return res.status(401).json({

        success: false,

        message:
          "Malformed authentication token.",

      });

    }



    // Verify token

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );



    // Find user

    const user = await User.findById(
      decoded.id
    )
      .select("-password")
      .lean();



    if (!user) {

      return res.status(401).json({

        success: false,

        message:
          "User not found.",

      });

    }



    // Attach user

    req.user = user;



    next();



  } catch (error) {


    console.error(
      "Protect Middleware Error:",
      error
    );



    if (
      error.name === "TokenExpiredError"
    ) {

      return res.status(401).json({

        success: false,

        message:
          "Token has expired.",

      });

    }



    if (
      error.name === "JsonWebTokenError"
    ) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid authentication token.",

      });

    }



    return res.status(500).json({

      success: false,

      message:
        "Authentication failed.",

    });


  }

};




/* ==========================================================
   ADMIN ONLY
   Requires admin role
========================================================== */

export const adminOnly = (
  req,
  res,
  next
) => {


  if (!req.user) {

    return res.status(401).json({

      success: false,

      message:
        "Authentication required.",

    });

  }



  if (
    req.user.role !== "admin"
  ) {

    return res.status(403).json({

      success: false,

      message:
        "Access denied. Admin privileges required.",

    });

  }



  next();

};




/* ==========================================================
   OPTIONAL AUTH
   Authentication if token exists
========================================================== */

export const optionalAuth = async (
  req,
  res,
  next
) => {

  try {


    const token = getToken(req);



    // Continue without user

    if (!token) {

      return next();

    }



    // Ignore invalid token

    if (
      typeof token !== "string" ||
      token.split(".").length !== 3
    ) {

      return next();

    }



    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );



    const user = await User.findById(
      decoded.id
    )
      .select("-password")
      .lean();



    if (user) {

      req.user = user;

    }



    next();



  } catch (error) {

    // Optional auth should never block request

    next();

  }

};