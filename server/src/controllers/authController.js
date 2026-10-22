import crypto from "crypto";
import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";
import { sendTokenResponse } from "../utils/generateToken.js";
import { sendEmail } from "../utils/sendEmail.js";

// @desc    Register new user
// @route   POST /api/v1/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const user = await User.create({ name, email, password });

    await Portfolio.create({
      userId: user._id,
      cash: 1000000,
      holdings: [],
      totalInvested: 0,
      realizedPnL: 0,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Account is deactivated." });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged-in user
// @route   GET /api/v1/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
export const logout = async (req, res, next) => {
  try {
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// 👇 NEW: Forgot Password
// @route   POST /api/v1/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ success: false, message: "There is no user with that email" });
    }

    // Generate random token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    
    // Set expire (10 minutes)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you requested a password reset. Please click this link to reset: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request - EquiLearn",
        message,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #0f172a;">Password Reset Request</h2>
            <p style="color: #475569; line-height: 1.6;">You requested a password reset for your StockMarket App account.</p>
            <p style="color: #475569; line-height: 1.6;">Click the button below to reset your password. This link is valid for 10 minutes.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            
            <p style="color: #475569; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="color: #4f46e5; font-size: 14px; word-break: break-all;">${resetUrl}</p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="color: #94a3b8; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
        resetUrl
      });

      res.status(200).json({ success: true, message: "Email sent successfully" });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      
      return res.status(500).json({ success: false, message: "Email could not be sent" });
    }
  } catch (error) {
    next(error);
  }
};

// 👇 NEW: Reset Password
// @route   PUT /api/v1/auth/reset-password/:token
export const resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();

    // Auto login after reset
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};