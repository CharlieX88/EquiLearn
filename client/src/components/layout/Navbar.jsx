import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, TrendingUp, Sun, Moon } from "lucide-react";
import Container from "../ui/Container";
import Button from "../ui/Button";
import { APP_NAME, ROUTES } from "../../constants";
import { cn } from "../../utils/cn";
import useAuthStore from "../../store/authStore";
import useThemeStore from "../../store/themeStore";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-dark-900/80 backdrop-blur-xl border-b border-white/5 py-3"
          : "bg-transparent py-5"
      )}
    >
      <Container>
        <div className="flex items-center justify-between">
          <Link
            to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-600/30 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-dark-50">
              {APP_NAME}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-dark-100 hover:text-dark-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-dark-100 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-primary-600" />
              )}
            </button>

            {isAuthenticated ? (
              <Link to={ROUTES.DASHBOARD}>
                <Button variant="gradient" size="sm">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to={ROUTES.LOGIN}>
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to={ROUTES.SIGNUP}>
                  <Button variant="gradient" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 text-dark-100 hover:text-dark-50 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-primary-600" />
              )}
            </button>
            <button
              className="text-dark-50"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-3 animate-fade-in">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-dark-100 hover:text-dark-50 py-2"
              >
                {link.label}
              </a>
            ))}
            <div className="flex gap-3 mt-2">
              {isAuthenticated ? (
                <Link
                  to={ROUTES.DASHBOARD}
                  className="flex-1"
                  onClick={() => setMobileOpen(false)}
                >
                  <Button variant="gradient" size="sm" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link
                    to={ROUTES.LOGIN}
                    className="flex-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Button variant="secondary" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link
                    to={ROUTES.SIGNUP}
                    className="flex-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Button variant="gradient" size="sm" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}