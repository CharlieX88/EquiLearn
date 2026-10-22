import { cn } from "../../utils/cn";

export default function StatCard({
  label,
  value,
  change,
  icon: Icon,
  iconColor = "text-primary-400",
  iconBg = "bg-primary-500/10",
  delay = 0,
}) {
  return (
    <div
      className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-5 hover:border-white/10 transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            iconBg
          )}
        >
          {Icon && <Icon className={cn("w-5 h-5", iconColor)} />}
        </div>
        {change && (
          <span
            className={cn(
              "text-xs font-mono font-semibold px-2 py-1 rounded-md",
              change.startsWith("+")
                ? "bg-success/10 text-success"
                : "bg-danger/10 text-danger"
            )}
          >
            {change}
          </span>
        )}
      </div>
      <p className="text-xs text-dark-100 mb-1">{label}</p>
      <p className="text-2xl font-bold font-mono tracking-tight">{value}</p>
    </div>
  );
}