import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  Coins,
  Flame,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Bot,
  Trophy,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

import useAuthStore from "../store/authStore";
import api from "../services/api";
import StatCard from "../components/ui/StatCard";
import Button from "../components/ui/Button";
import { ROUTES, APP_NAME } from "../constants";
import { cn } from "../utils/cn";

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const fetchMe = useAuthStore((state) => state.fetchMe);

  // 👇 States for Real-time Data
  const [portfolio, setPortfolio] = useState(null);
  const [recentTrades, setRecentTrades] = useState([]);
  const [topMovers, setTopMovers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 👇 Fetch Data Logic
  const fetchDashboardData = async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      
      const [portfolioRes, historyRes, stocksRes] = await Promise.all([
        api.get("/trades/portfolio"),
        api.get("/trades/history?limit=4"),
        api.get("/trades/stocks"),
      ]);

      setPortfolio(portfolioRes.data.portfolio);
      setRecentTrades(historyRes.data.trades || []);

      // Top Movers calculate karo (Sort by highest absolute % change)
      const allStocks = stocksRes.data.stocks || [];
      const sortedStocks = allStocks.sort((a, b) => {
        const aChange = Math.abs((a.currentPrice - a.previousClose) / a.previousClose);
        const bChange = Math.abs((b.currentPrice - b.previousClose) / b.previousClose);
        return bChange - aChange;
      });
      setTopMovers(sortedStocks.slice(0, 4)); // Top 4 utha lo

    } catch (error) {
      if (!isSilent) toast.error("Failed to load dashboard data");
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  // 👇 Polling (Har 5 second mein update)
  useEffect(() => {
    fetchMe();
    fetchDashboardData();

    const interval = setInterval(() => {
      fetchDashboardData(true); // Silent update
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchMe]);

  const firstName = user?.name?.split(" ")[0] || "Learner";

  if (loading || !portfolio) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <RefreshCw className="w-6 h-6 text-primary-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ---------- WELCOME BANNER ---------- */}
      <div className="relative rounded-2xl overflow-hidden border border-primary-500/20 bg-gradient-to-br from-primary-600/20 via-primary-700/10 to-transparent p-6 sm:p-8">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Namaste, {firstName}! 👋
            </h1>
            <p className="text-dark-100 text-sm">
              Aaj kya seekhna hai? Start with a lesson or jump into trading.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to={ROUTES.LEARN}>
              <Button variant="gradient" size="md">
                <BookOpen className="w-4 h-4" />
                Continue Learning
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ---------- STATS GRID ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Portfolio Value"
          value={`₹${portfolio.totalValue.toLocaleString("en-IN")}`}
          change={`${portfolio.totalPnLPercent >= 0 ? "+" : ""}${portfolio.totalPnLPercent}%`}
          icon={Wallet}
          iconColor="text-primary-400"
          iconBg="bg-primary-500/10"
        />
        <StatCard
          label="Virtual Coins"
          value={user?.coins ?? 100}
          icon={Coins}
          iconColor="text-coin"
          iconBg="bg-coin/10"
        />
        <StatCard
          label="Current Streak"
          value={`${user?.streak?.current ?? 0} days`}
          icon={Flame}
          iconColor="text-orange-400"
          iconBg="bg-orange-500/10"
        />
        <StatCard
          label="Total P&L"
          value={`${portfolio.totalPnL >= 0 ? "+" : ""}₹${portfolio.totalPnL.toLocaleString("en-IN")}`}
          change={`${portfolio.totalPnLPercent >= 0 ? "+" : ""}${portfolio.totalPnLPercent}%`}
          icon={portfolio.totalPnL >= 0 ? TrendingUp : TrendingDown}
          iconColor={portfolio.totalPnL >= 0 ? "text-success" : "text-danger"}
          iconBg={portfolio.totalPnL >= 0 ? "bg-success/10" : "bg-danger/10"}
        />
      </div>

      {/* ---------- QUICK ACTIONS ---------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Practice Trade", icon: TrendingUp, path: ROUTES.TRADE, color: "from-blue-500 to-cyan-500" },
          { label: "Ask AI Mentor", icon: Bot, path: ROUTES.AI_MENTOR, color: "from-purple-500 to-pink-500" },
          { label: "See Leaderboard", icon: Trophy, path: ROUTES.LEADERBOARD, color: "from-amber-500 to-orange-500" },
          { label: "Learn Lessons", icon: BookOpen, path: ROUTES.LEARN, color: "from-green-500 to-emerald-500" },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              to={action.path}
              className="group relative p-4 rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:border-white/10 hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 shadow-lg",
                  action.color
                )}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium">{action.label}</p>
              <ArrowRight className="absolute top-4 right-4 w-4 h-4 text-dark-100 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
            </Link>
          );
        })}
      </div>

      {/* ---------- TWO COLUMN LAYOUT ---------- */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Real Recent Trades */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold">Recent Trades</h2>
              <p className="text-xs text-dark-100 mt-0.5">
                Your last few transactions
              </p>
            </div>
            <Link
              to={ROUTES.PORTFOLIO}
              className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentTrades.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-dark-100 mb-3">No trades yet. Start trading!</p>
              <Link to={ROUTES.TRADE}>
                <Button variant="secondary" size="sm">Place your first trade</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTrades.map((trade) => (
                <div
                  key={trade._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center",
                        trade.type === "BUY"
                          ? "bg-success/10 text-success"
                          : "bg-danger/10 text-danger"
                      )}
                    >
                      {trade.type === "BUY" ? (
                        <ArrowDownRight className="w-4 h-4" /> 
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{trade.symbol}</p>
                      <p className="text-xs text-dark-100">
                        {trade.type} • {trade.quantity} qty @ ₹{trade.price}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-dark-100">
                    {new Date(trade.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Real Top Movers */}
        <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-semibold">Top Movers</h2>
            <p className="text-xs text-dark-100 mt-0.5">
              Live virtual market
            </p>
          </div>

          <div className="space-y-3">
            {topMovers.map((stock) => {
              const isUp = stock.currentPrice >= stock.previousClose;
              const changePct = (((stock.currentPrice - stock.previousClose) / stock.previousClose) * 100).toFixed(2);
              
              return (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center text-xs font-bold text-primary-300">
                      {stock.symbol[0]}
                    </div>
                    <span className="text-sm font-medium">{stock.symbol}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono">₹{stock.currentPrice.toLocaleString("en-IN")}</p>
                    <p className={cn("text-xs font-mono", isUp ? "text-success" : "text-danger")}>
                      {isUp ? "+" : ""}{changePct}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            to={ROUTES.TRADE}
            className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-primary-500/30 text-sm text-primary-400 hover:bg-primary-500/10 transition-colors"
          >
            Start Trading
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ---------- DISCLAIMER ---------- */}
      <div className="p-4 rounded-xl border border-warning/20 bg-warning/5 flex items-start gap-3">
        <span className="text-warning text-lg">⚠️</span>
        <div>
          <p className="text-sm font-medium text-warning mb-0.5">Disclaimer</p>
          <p className="text-xs text-dark-100 leading-relaxed">
            {APP_NAME} is an educational platform. All trades shown are virtual
            (paper trading) — no real money involved. This is not investment
            advice.
          </p>
        </div>
      </div>
    </div>
  );
}