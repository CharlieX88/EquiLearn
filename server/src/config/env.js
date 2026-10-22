import dotenv from "dotenv";

dotenv.config();

const requiredEnv = ["MONGO_URI", "JWT_SECRET"];
const missing = requiredEnv.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`❌ Missing required env vars: ${missing.join(", ")}`);
  process.exit(1);
}

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  GROQ_API_KEY: process.env.GROQ_API_KEY || "",
  GROQ_MODEL: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
  PAYMENT_ENABLED: process.env.PAYMENT_ENABLED === "true",
};