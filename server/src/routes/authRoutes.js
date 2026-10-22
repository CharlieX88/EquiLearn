import express from "express";
import {
  register,
  login,
  getMe,
  logout,
  forgotPassword, // 👈
  resetPassword,  // 👈
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/authValidator.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/register", authLimiter, registerValidator, register);
router.post("/login", authLimiter, loginValidator, login);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

// 👇 New Routes
router.post("/forgot-password", authLimiter, forgotPassword);
router.put("/reset-password/:token", authLimiter, resetPassword);

export default router;