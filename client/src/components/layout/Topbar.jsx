import { Menu, Coins, Flame, LogOut, ChevronDown, Sun, Moon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import useAuthStore from "../../store/authStore";
import useThemeStore from "../../store/themeStore";
import { ROUTES } from "../../constants";
import { cn } from "../../utils/cn";

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  
  const { theme, toggleTheme } = useThemeStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate(ROUTES.HOME);
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <header className="h-16 border-b border-white/5 bg-dark-950/80 backdrop-blur-xl sticky top-0 z-30 transition-colors duration-300">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Menu + Greeting */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-dark-100 hover:text-white p-2 -ml-2 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden sm:block">
            <p className="text-xs text-dark-100">Welcome back,</p>
            <p className="text-sm font-semibold">{user?.name || "Learner"}</p>
          </div>
        </div>

        {/* Right: Coins + Streak + Theme + Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-dark-100 transition-colors"
            title="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-primary-600" />
            )}
          </button>

          {/* Coins */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-coin/10 border border-coin/20">
            <Coins className="w-3.5 h-3.5 text-coin" />
            <span className="text-xs font-mono font-bold text-coin">
              {user?.coins ?? 0}
            </span>
          </div>

          {/* Streak */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs font-mono font-bold text-orange-400">
              {user?.streak?.current ?? 0}
            </span>
          </div>

          {/* Profile dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 p-1 pr-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-xs font-bold text-white">
                {initials}
              </div>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 text-dark-100 transition-transform hidden sm:block",
                  menuOpen && "rotate-180"
                )}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/10 bg-dark-800 shadow-2xl shadow-black/50 overflow-hidden animate-fade-in">
                <div className="p-3 border-b border-white/5">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-dark-100 truncate">{user?.email}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(ROUTES.PROFILE);
                    }}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-white/5 transition-colors"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(ROUTES.SETTINGS);
                    }}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-white/5 transition-colors"
                  >
                    Settings
                  </button>
                </div>
                <div className="p-1 border-t border-white/5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm rounded-lg text-danger hover:bg-danger/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}