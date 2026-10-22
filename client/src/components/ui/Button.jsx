import { cn } from "../../utils/cn";

const variants = {
  primary:
    "bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/20",
  secondary:
    "bg-white/5 hover:bg-white/10 text-dark-50 border border-white/10 backdrop-blur",
  ghost: "hover:bg-white/5 text-dark-50",
  danger: "bg-danger hover:bg-danger/80 text-white",
  gradient:
    "bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white shadow-lg shadow-primary-600/30",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  as: Component = "button",
  ...props
}) {
  return (
    <Component
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary-500/50",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "hover:scale-[1.02] active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}