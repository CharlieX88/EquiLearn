import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Moon,
  Globe,
  LogOut,
  Trash2,
  Shield,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

import useAuthStore from "../store/authStore";
import Button from "../components/ui/Button";
import { ROUTES } from "../constants";
import { cn } from "../utils/cn";

export default function Settings() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const [notifications, setNotifications] = useState({
    email: true,
    streak: true,
    trades: false,
    aiTips: true,
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate(ROUTES.HOME);
  };

  const handleToggle = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
    toast.success("Preference saved (demo mode)");
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion is disabled in demo mode");
    setShowDeleteConfirm(false);
  };

  const notifItems = [
    { key: "email", label: "Email updates", desc: "Product news and announcements" },
    { key: "streak", label: "Streak reminders", desc: "Daily reminder to keep your streak alive" },
    { key: "trades", label: "Trade alerts", desc: "Notifications when your virtual stocks move" },
    { key: "aiTips", label: "AI Mentor tips", desc: "Weekly learning tips from your AI mentor" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Settings ⚙️</h1>
        <p className="text-dark-100 text-sm">
          Manage your preferences and account.
        </p>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
          <Bell className="w-4 h-4 text-primary-400" />
          <h3 className="font-semibold">Notifications</h3>
        </div>
        <div className="divide-y divide-white/5">
          {notifItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 p-5"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-dark-100 mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={() => handleToggle(item.key)}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors shrink-0",
                  notifications[item.key]
                    ? "bg-primary-600"
                    : "bg-white/10"
                )}
                aria-label={`Toggle ${item.label}`}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                    notifications[item.key] && "translate-x-5"
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
          <Moon className="w-4 h-4 text-primary-400" />
          <h3 className="font-semibold">Appearance</h3>
        </div>
        <div className="divide-y divide-white/5">
          <div className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="text-xs text-dark-100 mt-0.5">
                Dark mode (only theme available)
              </p>
            </div>
            <span className="text-xs font-medium text-primary-400 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20">
              Dark
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-sm font-medium">Language</p>
              <p className="text-xs text-dark-100 mt-0.5">
                App interface language
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-dark-100">
              <Globe className="w-4 h-4" />
              English
            </div>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
          <Shield className="w-4 h-4 text-primary-400" />
          <h3 className="font-semibold">Privacy & Data</h3>
        </div>
        <div className="divide-y divide-white/5">
          <button className="w-full flex items-center justify-between gap-4 p-5 hover:bg-white/[0.02] transition-colors text-left">
            <div>
              <p className="text-sm font-medium">Download my data</p>
              <p className="text-xs text-dark-100 mt-0.5">
                Export all your account data
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-dark-100" />
          </button>
          <button className="w-full flex items-center justify-between gap-4 p-5 hover:bg-white/[0.02] transition-colors text-left">
            <div>
              <p className="text-sm font-medium">Privacy Policy</p>
              <p className="text-xs text-dark-100 mt-0.5">
                How we handle your data
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-dark-100" />
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-danger/20 bg-danger/5 overflow-hidden">
        <div className="px-5 py-4 border-b border-danger/10 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-danger" />
          <h3 className="font-semibold text-danger">Danger Zone</h3>
        </div>

        <div className="divide-y divide-danger/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5">
            <div>
              <p className="text-sm font-medium">Log out</p>
              <p className="text-xs text-dark-100 mt-0.5">
                Sign out from your current device
              </p>
            </div>
            <Button variant="secondary" size="md" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5">
            <div>
              <p className="text-sm font-medium text-danger">
                Delete account
              </p>
              <p className="text-xs text-dark-100 mt-0.5">
                Permanently delete your account and all data
              </p>
            </div>
            <Button
              variant="danger"
              size="md"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* App info */}
      <div className="text-center py-4">
        <p className="text-xs text-dark-100">
            EquiLearn · v1.0.0
        </p>
        <p className="text-xs text-dark-100 mt-1">
          ⚠️ Educational only. Not investment advice.
        </p>
      </div>

      {/* Delete confirm modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-md w-full rounded-2xl border border-danger/30 bg-dark-800 p-6 animate-slide-up">
            <div className="w-12 h-12 rounded-xl bg-danger/10 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-danger" />
            </div>
            <h3 className="text-lg font-bold mb-2">Delete your account?</h3>
            <p className="text-sm text-dark-100 mb-6 leading-relaxed">
              This action cannot be undone. All your progress, coins, and trade
              history will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="md"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="md"
                className="flex-1"
                onClick={handleDeleteAccount}
              >
                Yes, delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}