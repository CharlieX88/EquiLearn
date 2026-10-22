import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  PieChart,
  History,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import api from "../services/api";
import Button from "../components/ui/Button";
import StatCard from "../components/ui/StatCard";
import { cn } from "../utils/cn";

const COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState(null);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("holdings");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [portfolioRes, tradesRes] = await Promise.all([
        api.get("/trades/portfolio"),
        api.get("/trades/history?limit=30"),
      ]);
      setPortfolio(portfolioRes.data.portfolio);
      setTrades(tradesRes.data.trades || []);
    } catch (error) {
      toast.error("Failed to load portfolio");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <RefreshCw className="w-6 h-6 text-primary-400 animate-spin" />
      </div>
    );
  }

  if (!portfolio) return null;

  const pieData = portfolio.holdings.map((h) => ({
    name: h.symbol,
    value: h.currentValue,
  }));

  // Fake performance chart (baad me real data se replace karenge)
  const performanceData = Array.from({ length: 30 }).map((_, i) => ({
    day: `D${i + 1}`,
    value:
      portfolio.totalValue * (1 - 0.1 + Math.sin(i * 0.3) * 0.05 + i * 0.003),
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Portfolio 💼</h1>
          <p className="text-dark-100 text-sm">
            Your virtual holdings and performance.
          </p>
        </div>
        <Link to="/trade">
          <Button variant="gradient" size="md">
            <TrendingUp className="w-4 h-4" />
            Trade More
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Value"
          value={`₹${portfolio.totalValue.toLocaleString("en-IN")}`}
          icon={Wallet}
        />
        <StatCard
          label="Available Cash"
          value={`₹${portfolio.cash.toLocaleString("en-IN")}`}
          icon={BarChart3}
          iconColor="text-coin"
          iconBg="bg-coin/10"
        />
        <StatCard
          label="Unrealized P&L"
          value={`${portfolio.unrealizedPnL >= 0 ? "+" : ""}₹${portfolio.unrealizedPnL.toLocaleString("en-IN")}`}
          change={`${portfolio.totalPnLPercent >= 0 ? "+" : ""}${portfolio.totalPnLPercent}%`}
          icon={portfolio.unrealizedPnL >= 0 ? TrendingUp : TrendingDown}
          iconColor={
            portfolio.unrealizedPnL >= 0 ? "text-success" : "text-danger"
          }
          iconBg={
            portfolio.unrealizedPnL >= 0 ? "bg-success/10" : "bg-danger/10"
          }
        />
        <StatCard
          label="Realized P&L"
          value={`${portfolio.realizedPnL >= 0 ? "+" : ""}₹${portfolio.realizedPnL.toLocaleString("en-IN")}`}
          icon={History}
          iconColor="text-primary-400"
          iconBg="bg-primary-500/10"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/5">
        {[
          { id: "holdings", label: "Holdings", icon: PieChart },
          { id: "history", label: "Trade History", icon: History },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                tab === t.id
                  ? "border-primary-500 text-primary-400"
                  : "border-transparent text-dark-100 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* -------- HOLDINGS TAB -------- */}
      {tab === "holdings" && (
        <>
          {portfolio.holdings.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-white/5 bg-white/[0.02]">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500/10 mb-4">
                <Wallet className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                No holdings yet
              </h3>
              <p className="text-sm text-dark-100 mb-6">
                Start with a virtual trade to see your portfolio grow.
              </p>
              <Link to="/trade">
                <Button variant="gradient" size="md">
                  Place First Trade
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Charts row */}
              <div className="grid lg:grid-cols-2 gap-5">
                {/* Allocation Pie */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                  <h3 className="font-semibold mb-4">Allocation</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                        >
                          {pieData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: "#1f2937",
                            border: "1px solid #374151",
                            borderRadius: "8px",
                            color: "#f9fafb",
                            fontSize: "12px",
                          }}
                          formatter={(v) =>
                            `₹${Number(v).toLocaleString("en-IN")}`
                          }
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {pieData.map((d, i) => (
                      <div
                        key={d.name}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-sm"
                          style={{
                            background: COLORS[i % COLORS.length],
                          }}
                        />
                        <span className="text-dark-100">{d.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                  <h3 className="font-semibold mb-4">Performance (30 days)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255,255,255,0.05)"
                        />
                        <XAxis
                          dataKey="day"
                          stroke="#6b7280"
                          fontSize={10}
                          tickLine={false}
                        />
                        <YAxis
                          stroke="#6b7280"
                          fontSize={10}
                          tickLine={false}
                          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "#1f2937",
                            border: "1px solid #374151",
                            borderRadius: "8px",
                            color: "#f9fafb",
                            fontSize: "12px",
                          }}
                          formatter={(v) =>
                            `₹${Number(v).toLocaleString("en-IN")}`
                          }
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#6366f1"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Holdings table */}
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
                <div className="p-5 border-b border-white/5">
                  <h3 className="font-semibold">Your Holdings</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-dark-100 uppercase tracking-wider border-b border-white/5">
                        <th className="text-left p-4">Stock</th>
                        <th className="text-right p-4">Qty</th>
                        <th className="text-right p-4">Avg Price</th>
                        <th className="text-right p-4">Current</th>
                        <th className="text-right p-4">Invested</th>
                        <th className="text-right p-4">Value</th>
                        <th className="text-right p-4">P&L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.holdings.map((h) => (
                        <tr
                          key={h.symbol}
                          className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                        >
                          <td className="p-4">
                            <p className="font-semibold">{h.symbol}</p>
                            <p className="text-xs text-dark-100 truncate max-w-[180px]">
                              {h.name}
                            </p>
                          </td>
                          <td className="text-right p-4 font-mono">
                            {h.quantity}
                          </td>
                          <td className="text-right p-4 font-mono">
                            ₹{h.avgPrice.toLocaleString("en-IN")}
                          </td>
                          <td className="text-right p-4 font-mono">
                            ₹{h.currentPrice.toLocaleString("en-IN")}
                          </td>
                          <td className="text-right p-4 font-mono text-dark-100">
                            ₹{h.invested.toLocaleString("en-IN")}
                          </td>
                          <td className="text-right p-4 font-mono">
                            ₹{h.currentValue.toLocaleString("en-IN")}
                          </td>
                          <td className="text-right p-4">
                            <p
                              className={cn(
                                "font-mono font-semibold",
                                h.pnl >= 0 ? "text-success" : "text-danger"
                              )}
                            >
                              {h.pnl >= 0 ? "+" : ""}₹
                              {Math.abs(h.pnl).toLocaleString("en-IN")}
                            </p>
                            <p
                              className={cn(
                                "text-xs font-mono",
                                h.pnl >= 0 ? "text-success" : "text-danger"
                              )}
                            >
                              {h.pnl >= 0 ? "+" : ""}
                              {h.pnlPercent}%
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* -------- HISTORY TAB -------- */}
      {tab === "history" && (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
          <div className="p-5 border-b border-white/5">
            <h3 className="font-semibold">Trade History</h3>
          </div>

          {trades.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-dark-100">No trades yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-dark-100 uppercase tracking-wider border-b border-white/5">
                    <th className="text-left p-4">Date</th>
                    <th className="text-left p-4">Stock</th>
                    <th className="text-left p-4">Type</th>
                    <th className="text-right p-4">Qty</th>
                    <th className="text-right p-4">Price</th>
                    <th className="text-right p-4">Total</th>
                    <th className="text-right p-4">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((t) => (
                    <tr
                      key={t._id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                    >
                      <td className="p-4 text-xs text-dark-100">
                        {new Date(t.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-4 font-semibold">{t.symbol}</td>
                      <td className="p-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium",
                            t.type === "BUY"
                              ? "bg-success/10 text-success"
                              : "bg-danger/10 text-danger"
                          )}
                        >
                          {t.type === "BUY" ? (
                            <ArrowDownRight className="w-3 h-3" />
                          ) : (
                            <ArrowUpRight className="w-3 h-3" />
                          )}
                          {t.type}
                        </span>
                      </td>
                      <td className="text-right p-4 font-mono">{t.quantity}</td>
                      <td className="text-right p-4 font-mono">
                        ₹{t.price.toLocaleString("en-IN")}
                      </td>
                      <td className="text-right p-4 font-mono">
                        ₹{t.total.toLocaleString("en-IN")}
                      </td>
                      <td className="text-right p-4 font-mono">
                        {t.type === "SELL" ? (
                          <span
                            className={
                              t.realizedPnL >= 0
                                ? "text-success"
                                : "text-danger"
                            }
                          >
                            {t.realizedPnL >= 0 ? "+" : ""}₹
                            {Math.abs(t.realizedPnL).toLocaleString("en-IN")}
                          </span>
                        ) : (
                          <span className="text-dark-100">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}