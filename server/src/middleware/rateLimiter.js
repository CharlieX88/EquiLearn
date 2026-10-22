import rateLimit from "express-rate-limit";

// General API limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth routes ke liye strict limiter
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    success: false,
    message: "Too many auth attempts, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// AI routes ke liye limiter
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: {
    success: false,
    message: "Too many AI requests, slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});