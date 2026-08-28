// ==========================================================
// TECHSTORE PRO
// AUTH CONTROLLER
// ==========================================================

import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ==========================================================
// GENERATE JWT TOKEN
// ==========================================================

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

// ==========================================================
// SEND TOKEN RESPONSE
// ==========================================================

const sendTokenResponse = (
  user,
  statusCode,
  res,
  message
) => {
  const token = generateToken(user._id);

  // --------------------------------------------------------
  // COOKIE OPTIONS
  // --------------------------------------------------------

  const isProduction =
    process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  };

  // --------------------------------------------------------
  // SAFE USER RESPONSE
  // --------------------------------------------------------

  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    phone: user.phone,
    address: user.address,
    createdAt: user.createdAt,
  };

  // --------------------------------------------------------
  // SEND RESPONSE
  // --------------------------------------------------------

  return res
    .status(statusCode)
    .cookie(
      "token",
      token,
      cookieOptions
    )
    .json({
      success: true,
      message,
      token,
      user: userResponse,
    });
};

// ==========================================================
// REGISTER USER
// ==========================================================

/**
 * POST /api/auth/register
 *
 * Register a new user.
 */
export const registerUser = async (
  req,
  res
) => {
  try {
    let {
      name,
      email,
      password,
    } = req.body;

    // ------------------------------------------------------
    // VALIDATE REQUIRED FIELDS
    // ------------------------------------------------------

    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide name, email and password.",
      });
    }

    // ------------------------------------------------------
    // NORMALIZE INPUT
    // ------------------------------------------------------

    name = name.trim();
    email = email
      .trim()
      .toLowerCase();

    // ------------------------------------------------------
    // VALIDATE EMPTY VALUES
    // ------------------------------------------------------

    if (!name) {
      return res.status(400).json({
        success: false,
        message:
          "Name cannot be empty.",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message:
          "Email cannot be empty.",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message:
          "Password cannot be empty.",
      });
    }

    // ------------------------------------------------------
    // CHECK PASSWORD LENGTH
    // ------------------------------------------------------

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters long.",
      });
    }

    // ------------------------------------------------------
    // CHECK EXISTING USER
    // ------------------------------------------------------

    const existingUser =
      await User.findOne({
        email,
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    // ------------------------------------------------------
    // CREATE USER
    //
    // Password hashing should be handled by the
    // User model pre-save middleware.
    // ------------------------------------------------------

    const user = await User.create({
      name,
      email,
      password,
    });

    // ------------------------------------------------------
    // SEND TOKEN
    // ------------------------------------------------------

    return sendTokenResponse(
      user,
      201,
      res,
      "Registration successful."
    );
  } catch (error) {
    console.error(
      "Register User Error:",
      error
    );

    // ------------------------------------------------------
    // DUPLICATE EMAIL
    // ------------------------------------------------------

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    // ------------------------------------------------------
    // MONGOOSE VALIDATION ERROR
    // ------------------------------------------------------

    if (
      error.name ===
      "ValidationError"
    ) {
      const errors =
        Object.values(
          error.errors
        ).map(
          (err) => err.message
        );

      return res.status(400).json({
        success: false,
        message:
          "User validation failed.",
        errors,
      });
    }

    // ------------------------------------------------------
    // SERVER ERROR
    // ------------------------------------------------------

    return res.status(500).json({
      success: false,
      message:
        "Internal server error.",
    });
  }
};

// ==========================================================
// LOGIN USER
// ==========================================================

/**
 * POST /api/auth/login
 *
 * Authenticate an existing user.
 */
export const loginUser = async (
  req,
  res
) => {
  try {
    let {
      email,
      password,
    } = req.body;

    // ------------------------------------------------------
    // VALIDATE REQUIRED FIELDS
    // ------------------------------------------------------

    if (
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide email and password.",
      });
    }

    // ------------------------------------------------------
    // NORMALIZE EMAIL
    // ------------------------------------------------------

    email = email
      .trim()
      .toLowerCase();

    // ------------------------------------------------------
    // FIND USER
    //
    // Password is explicitly selected because the User
    // model should normally hide it by default.
    // ------------------------------------------------------

    const user =
      await User.findOne({
        email,
      }).select("+password");

    // ------------------------------------------------------
    // USER NOT FOUND
    // ------------------------------------------------------

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // ------------------------------------------------------
    // CHECK PASSWORD
    // ------------------------------------------------------

    const isMatch =
      await user.matchPassword(
        password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // ------------------------------------------------------
    // SEND TOKEN
    // ------------------------------------------------------

    return sendTokenResponse(
      user,
      200,
      res,
      "Login successful."
    );
  } catch (error) {
    console.error(
      "Login User Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal server error.",
    });
  }
};

// ==========================================================
// LOGOUT USER
// ==========================================================

/**
 * POST /api/auth/logout
 *
 * Clear authentication cookie.
 */
export const logoutUser = async (
  req,
  res
) => {
  try {
    const isProduction =
      process.env.NODE_ENV ===
      "production";

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction
        ? "none"
        : "lax",
      path: "/",
    };

    return res
      .clearCookie(
        "token",
        cookieOptions
      )
      .status(200)
      .json({
        success: true,
        message:
          "Logged out successfully.",
      });
  } catch (error) {
    console.error(
      "Logout User Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to logout.",
    });
  }
};

// ==========================================================
// GET CURRENT USER
// ==========================================================

/**
 * GET /api/auth/me
 *
 * Returns the currently authenticated user.
 *
 * Requires:
 * protect middleware
 */
export const getCurrentUser = async (
  req,
  res
) => {
  try {
    // ------------------------------------------------------
    // PROTECT MIDDLEWARE SHOULD PROVIDE req.user
    // ------------------------------------------------------

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    // ------------------------------------------------------
    // FIND FRESH USER
    // ------------------------------------------------------

    const user =
      await User.findById(
        req.user._id
      ).select("-password");

    // ------------------------------------------------------
    // USER NOT FOUND
    // ------------------------------------------------------

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    // ------------------------------------------------------
    // SAFE USER RESPONSE
    // ------------------------------------------------------

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      address: user.address,
      createdAt: user.createdAt,
    };

    // ------------------------------------------------------
    // SEND RESPONSE
    // ------------------------------------------------------

    return res.status(200).json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    console.error(
      "Get Current User Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal server error.",
    });
  }
};

// ==========================================================
// DEFAULT EXPORT
// ==========================================================

export default {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
};