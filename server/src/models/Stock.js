import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sector: {
      type: String,
      required: true,
      enum: [
        "IT",
        "Banking",
        "FMCG",
        "Pharma",
        "Energy",
        "Auto",
        "Telecom",
        "Infrastructure",
        "Metals",
        "Consumer",
      ],
    },
    currentPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    previousClose: {
      type: Number,
      required: true,
      min: 0,
    },
    dayHigh: {
      type: Number,
      default: 0,
    },
    dayLow: {
      type: Number,
      default: 0,
    },
    marketCap: {
      type: Number, // in crores
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Virtual: change % from previous close
stockSchema.virtual("changePercent").get(function () {
  if (!this.previousClose) return 0;
  return (((this.currentPrice - this.previousClose) / this.previousClose) * 100).toFixed(2);
});

stockSchema.set("toJSON", { virtuals: true });
stockSchema.set("toObject", { virtuals: true });

const Stock = mongoose.model("Stock", stockSchema);

export default Stock;