import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    stockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      required: true,
    },
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true,
    },
    orderType: {
      type: String,
      enum: ["MARKET", "LIMIT"],
      default: "MARKET",
    },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    realizedPnL: { type: Number, default: 0 }, // only for SELL
  },
  { timestamps: true }
);

tradeSchema.index({ userId: 1, createdAt: -1 });

const Trade = mongoose.model("Trade", tradeSchema);

export default Trade;