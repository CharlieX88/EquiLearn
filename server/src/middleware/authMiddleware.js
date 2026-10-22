import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Cookie se token lo
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. Ya Authorization header se (Bearer <token>)
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // User fetch karo (password chhod ke)
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found or inactive",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Admin access only",
  });
};