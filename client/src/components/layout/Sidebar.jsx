import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  LineChart,
  Briefcase,
  Bot,
  Trophy,
  Gift,
  User,
  TrendingUp,
  X,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { ROUTES, APP_NAME } from "../../constants";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: ROUTES.DASHBOARD },
  { label: "Learn", icon: BookOpen, path: ROUTES.LEARN },
  { label: "Trade", icon: LineChart, path: ROUTES.TRADE },
  { label: "Portfolio", icon: Briefcase, path: ROUTES.PORTFOLIO },
  { label: "AI Mentor", icon: Bot, path: ROUTES.AI_MENTOR },
  { label: "Leaderboard", icon: Trophy, path: ROUTES.LEADERBOARD },
  { label: "Rewards", icon: Gift, path: ROUTES.REWARDS },
  { label: "Profile", icon: User, path: ROUTES.PROFILE },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 w-64 z-50 border-r border-white/5 bg-dark-950 flex flex-col transition-transform duration-300",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/5">
          <NavLink to={ROUTES.DASHBOARD} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-600/30">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold tracking-tight">{APP_NAME}</span>
          </NavLink>

          <button
            onClick={onClose}
            className="lg:hidden text-dark-100 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-primary-500/10 text-primary-300 border border-primary-500/20"
                      : "text-dark-100 hover:text-white hover:bg-white/5 border border-transparent"
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom disclaimer */}
        <div className="p-3 border-t border-white/5">
          <div className="p-3 rounded-lg bg-warning/5 border border-warning/20">
            <p className="text-[10px] text-warning font-medium mb-1">
              ⚠️ DISCLAIMER
            </p>
            <p className="text-[10px] text-dark-100 leading-relaxed">
              Educational only. Not investment advice.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}