import { useEffect, useState } from "react";
import {
  User as UserIcon,
  Mail,
  Calendar,
  Coins,
  Flame,
  BookOpen,
  TrendingUp,
  Wallet,
  Edit3,
  Save,
  X,
  Shield,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../services/api";
import useAuthStore from "../store/authStore";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { cn } from "../utils/cn";

const getInitials = (name) =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

const riskOptions = [
  { value: "conservative", label: "Conservative", desc: "Prefer safety over returns" },
  { value: "moderate", label: "Moderate", desc: "Balance risk and reward" },
  { value: "aggressive", label: "Aggressive", desc: "Comfortable with high risk" },
  { value: "unknown", label: "Not sure yet", desc: "Still figuring out" },
];

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const fetchMe = useAuthStore((state) => state.fetchMe);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/rewards");
      setStats(data);
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveName = async () => {
    if (!editName.trim() || editName.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    // Backend update endpoint nahi hai abhi — sirf frontend demo
    toast.success("Name updated (demo mode)");
    setEditing(false);
  };

  const handleRiskChange = async (value) => {
    toast.success(`Risk profile: ${value} (demo mode)`);
  };

  if (loading || !user) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <RefreshCw className="w-6 h-6 text-primary-400 animate-spin" />
      </div>
    );
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Profile 👤</h1>
        <p className="text-dark-100 text-sm">
          Manage your account information.
        </p>
      </div>

      {/* Profile card */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-primary-600/30">
              {getInitials(user.name)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-success border-4 border-dark-900 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 w-full">
            {editing ? (
              <div className="space-y-3">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your name"
                  icon={UserIcon}
                />
                <div className="flex gap-2">
                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={handleSaveName}
                    disabled={saving}
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditing(false);
                      setEditName(user.name);
                    }}
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold truncate">{user.name}</h2>
                  <button
                    onClick={() => setEditing(true)}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-dark-100 hover:text-primary-400 transition-colors shrink-0"
                    aria-label="Edit name"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-dark-100">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    {user.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Member since {memberSince}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              icon: Coins,
              label: "Coins",
              value: stats.coins,
              color: "text-coin",
              bg: "bg-coin/10",
            },
            {
              icon: Flame,
              label: "Current Streak",
              value: `${stats.streak.current}d`,
              color: "text-orange-400",
              bg: "bg-orange-500/10",
            },
            {
              icon: BookOpen,
              label: "Lessons Done",
              value: stats.stats.lessonsCompleted,
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
            },
            {
              icon: TrendingUp,
              label: "Total Trades",
              value: stats.stats.totalTrades,
              color: "text-primary-400",
              bg: "bg-primary-500/10",
            },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="p-4 rounded-2xl border border-white/5 bg-white/[0.02]"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
                    s.bg
                  )}
                >
                  <Icon className={cn("w-5 h-5", s.color)} />
                </div>
                <p className="text-xs text-dark-100 mb-1">{s.label}</p>
                <p className="text-xl font-bold font-mono">{s.value}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Portfolio value card */}
      {stats && (
        <div className="rounded-2xl border border-primary-500/20 bg-gradient-to-br from-primary-600/10 to-transparent p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-dark-100 mb-1">Virtual Portfolio Value</p>
              <p className="text-3xl font-bold font-mono">
                ₹{stats.stats.portfolioValue.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-dark-100 mt-2">
                Starting capital: ₹10,00,000
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary-500/20 flex items-center justify-center">
              <Wallet className="w-7 h-7 text-primary-400" />
            </div>
          </div>
        </div>
      )}

      {/* Risk profile */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <h3 className="font-semibold mb-1">Risk Profile</h3>
        <p className="text-xs text-dark-100 mb-5">
          This helps us tailor recommendations for you.
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          {riskOptions.map((opt) => {
            const active = user.riskProfile === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleRiskChange(opt.value)}
                className={cn(
                  "text-left p-4 rounded-xl border transition-all",
                  active
                    ? "border-primary-500/50 bg-primary-500/10"
                    : "border-white/5 bg-white/[0.02] hover:border-white/10"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">{opt.label}</p>
                  {active && (
                    <span className="text-[10px] font-semibold text-primary-400 uppercase tracking-wider">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-dark-100">{opt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}