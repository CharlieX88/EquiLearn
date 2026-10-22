import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { env } from "./src/config/env.js";
import Stock from "./src/models/Stock.js"; 

const startServer = async () => {
  try {
    await connectDB();
    
    // 👇 LIVE PRICE SIMULATOR (Har 5 second mein price change hoga)
    setInterval(async () => {
      try {
        const stocks = await Stock.find({ isActive: true });
        
        for (let stock of stocks) {
          // Randomly price ko -0.5% se +0.5% ke beech change karo
          const changePercent = (Math.random() - 0.5) * 0.01; 
          const newPrice = stock.currentPrice * (1 + changePercent);
          
          // Day high aur low update karo
          const newHigh = Math.max(stock.dayHigh, newPrice);
          const newLow = Math.min(stock.dayLow, newPrice);

          await Stock.findByIdAndUpdate(stock._id, {
            currentPrice: Number(newPrice.toFixed(2)),
            dayHigh: Number(newHigh.toFixed(2)),
            dayLow: Number(newLow.toFixed(2)),
          });
        }
      } catch (err) {
        console.error("Price simulator error:", err.message);
      }
    }, 5000); // 5000ms = 5 seconds

    app.listen(env.PORT, () => {
      console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      console.log(`   → http://localhost:${env.PORT}/api/v1/health`);
      console.log(`   📈 Live Price Simulator is ACTIVE (Updates every 5s)`);
    });
  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();