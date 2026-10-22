import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Stock from "../models/Stock.js";

const stocks = [
  // IT
  { symbol: "TCS", name: "Tata Consultancy Services", sector: "IT", currentPrice: 3890, previousClose: 3936, dayHigh: 3960, dayLow: 3870, marketCap: 1400000 },
  { symbol: "INFY", name: "Infosys Ltd", sector: "IT", currentPrice: 1567, previousClose: 1554, dayHigh: 1580, dayLow: 1550, marketCap: 650000 },
  { symbol: "WIPRO", name: "Wipro Ltd", sector: "IT", currentPrice: 542, previousClose: 536, dayHigh: 548, dayLow: 533, marketCap: 280000 },
  { symbol: "HCLTECH", name: "HCL Technologies", sector: "IT", currentPrice: 1780, previousClose: 1772, dayHigh: 1795, dayLow: 1765, marketCap: 480000 },

  // Banking
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd", sector: "Banking", currentPrice: 1690, previousClose: 1634, dayHigh: 1705, dayLow: 1640, marketCap: 1280000 },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd", sector: "Banking", currentPrice: 1245, previousClose: 1220, dayHigh: 1258, dayLow: 1218, marketCap: 875000 },
  { symbol: "SBIN", name: "State Bank of India", sector: "Banking", currentPrice: 812, previousClose: 800, dayHigh: 820, dayLow: 798, marketCap: 725000 },
  { symbol: "AXISBANK", name: "Axis Bank Ltd", sector: "Banking", currentPrice: 1120, previousClose: 1108, dayHigh: 1135, dayLow: 1105, marketCap: 345000 },

  // FMCG
  { symbol: "HINDUNILVR", name: "Hindustan Unilever Ltd", sector: "FMCG", currentPrice: 2456, previousClose: 2450, dayHigh: 2470, dayLow: 2440, marketCap: 575000 },
  { symbol: "ITC", name: "ITC Ltd", sector: "FMCG", currentPrice: 445, previousClose: 440, dayHigh: 449, dayLow: 439, marketCap: 555000 },
  { symbol: "NESTLEIND", name: "Nestle India Ltd", sector: "FMCG", currentPrice: 2340, previousClose: 2360, dayHigh: 2375, dayLow: 2330, marketCap: 225000 },

  // Pharma
  { symbol: "SUNPHARMA", name: "Sun Pharmaceutical", sector: "Pharma", currentPrice: 1580, previousClose: 1560, dayHigh: 1595, dayLow: 1555, marketCap: 380000 },
  { symbol: "DRREDDY", name: "Dr Reddys Laboratories", sector: "Pharma", currentPrice: 1265, previousClose: 1280, dayHigh: 1290, dayLow: 1258, marketCap: 210000 },

  // Energy
  { symbol: "RELIANCE", name: "Reliance Industries", sector: "Energy", currentPrice: 2456, previousClose: 2406, dayHigh: 2470, dayLow: 2410, marketCap: 1660000 },
  { symbol: "ONGC", name: "Oil & Natural Gas Corp", sector: "Energy", currentPrice: 245, previousClose: 240, dayHigh: 249, dayLow: 239, marketCap: 308000 },
  { symbol: "NTPC", name: "NTPC Ltd", sector: "Energy", currentPrice: 358, previousClose: 352, dayHigh: 362, dayLow: 350, marketCap: 348000 },
  { symbol: "POWERGRID", name: "Power Grid Corp", sector: "Energy", currentPrice: 312, previousClose: 308, dayHigh: 316, dayLow: 306, marketCap: 290000 },

  // Auto
  { symbol: "MARUTI", name: "Maruti Suzuki India", sector: "Auto", currentPrice: 12450, previousClose: 12300, dayHigh: 12520, dayLow: 12280, marketCap: 390000 },
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd", sector: "Auto", currentPrice: 985, previousClose: 960, dayHigh: 998, dayLow: 955, marketCap: 360000 },
  { symbol: "M&M", name: "Mahindra & Mahindra", sector: "Auto", currentPrice: 2890, previousClose: 2850, dayHigh: 2915, dayLow: 2845, marketCap: 355000 },

  // Telecom
  { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd", sector: "Telecom", currentPrice: 1585, previousClose: 1550, dayHigh: 1595, dayLow: 1545, marketCap: 940000 },

  // Metals
  { symbol: "TATASTEEL", name: "Tata Steel Ltd", sector: "Metals", currentPrice: 145, previousClose: 148, dayHigh: 150, dayLow: 143, marketCap: 180000 },
  { symbol: "JSWSTEEL", name: "JSW Steel Ltd", sector: "Metals", currentPrice: 945, previousClose: 930, dayHigh: 955, dayLow: 925, marketCap: 230000 },

  // Infrastructure
  { symbol: "LT", name: "Larsen & Toubro", sector: "Infrastructure", currentPrice: 3560, previousClose: 3510, dayHigh: 3580, dayLow: 3505, marketCap: 490000 },

  // Consumer
  { symbol: "ASIANPAINT", name: "Asian Paints Ltd", sector: "Consumer", currentPrice: 2890, previousClose: 2920, dayHigh: 2935, dayLow: 2880, marketCap: 277000 },
  { symbol: "TITAN", name: "Titan Company Ltd", sector: "Consumer", currentPrice: 3345, previousClose: 3300, dayHigh: 3360, dayLow: 3295, marketCap: 297000 },
];

const seed = async () => {
  try {
    await connectDB();
    console.log("🌱 Seeding stocks...");

    await Stock.deleteMany({});
    console.log("🗑️  Cleared existing stocks");

    const created = await Stock.insertMany(stocks);
    console.log(`✅ Inserted ${created.length} stocks\n`);

    console.log("📈 Stocks by sector:");
    const bySector = created.reduce((acc, s) => {
      acc[s.sector] = (acc[s.sector] || 0) + 1;
      return acc;
    }, {});
    Object.entries(bySector).forEach(([sector, count]) => {
      console.log(`   ${sector}: ${count}`);
    });

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seed error: ${error.message}`);
    process.exit(1);
  }
};

seed(); 