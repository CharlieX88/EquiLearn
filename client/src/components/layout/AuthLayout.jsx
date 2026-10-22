import { Link } from "react-router-dom";
import { TrendingUp, Shield, Sparkles } from "lucide-react";
import { APP_NAME, ROUTES } from "../../constants";
import { cn } from "../../utils/cn";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-dark-900 transition-colors duration-300">
      {/* LEFT: FORM */}
      <div className="flex flex-col p-6 sm:p-10">
        <Link to={ROUTES.HOME} className="flex items-center gap-2 self-start">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-600/30">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">{APP_NAME}</span>
        </Link>

        <div className="flex-1 flex items-center justify-center py-10">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{title}</h1>
              <p className="text-dark-100">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>

        <p className="text-xs text-dark-100 text-center">
          ⚠️ Educational only. No real money involved.
        </p>
      </div>

      {/* RIGHT: ILLUSTRATION */}
      <div className="hidden lg:flex relative items-center justify-center p-10 overflow-hidden border-l border-white/5 bg-gradient-to-br from-primary-950/40 via-dark-900 to-dark-900 transition-colors duration-300">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />

        <div className="absolute inset-0 bg-grid-pattern opacity-[0.04]" />

        <div className="relative max-w-md text-center">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 mb-8 animate-float">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs text-dark-100 mb-1">
                  Your Virtual Portfolio
                </p>
                <p className="text-2xl font-bold font-mono">₹10,00,000</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                +12.4%
              </span>
            </div>

            <div className="flex items-end gap-1.5 h-24 mb-5">
              {[30, 45, 25, 60, 50, 75, 65, 85, 55, 70, 80, 90].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-to-t from-primary-600/40 to-primary-400"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>

            <div className="space-y-2">
              {[
                { name: "RELIANCE", change: "+2.1%", up: true },
                { name: "TCS", change: "-1.2%", up: false },
              ].map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 text-sm"
                >
                  <span>{s.name}</span>
                  <span
                    className={cn(
                      "font-mono",
                      s.up ? "text-success" : "text-danger"
                    )}
                  >
                    {s.change}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">
            Learn. Practice. <span className="text-gradient">Invest.</span>
          </h2>
          <p className="text-dark-100 text-sm">
            Join 10,000+ learners building financial confidence — with virtual
            money, real knowledge.
          </p>

          <div className="mt-8 space-y-3 text-left max-w-xs mx-auto">
            {[
              { icon: Shield, text: "Zero risk — no real money" },
              { icon: Sparkles, text: "AI Mentor in Hinglish" },
              { icon: TrendingUp, text: "Real NSE/BSE stock practice" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-primary-400" />
                </div>
                <span className="text-dark-100">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}