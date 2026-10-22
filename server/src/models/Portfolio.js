import mongoose from "mongoose";

const holdingSchema = new mongoose.Schema(
  {
    stockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      required: true,
    },
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    avgPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    cash: {
      type: Number,
      default: 1000000, // ₹10,00,000 virtual cash
      min: 0,
    },
    holdings: [holdingSchema],
    totalInvested: {
      type: Number,
      default: 0,
    },
    realizedPnL: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;