import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../utils/cn";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      error,
      icon: Icon,
      className,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label className="block text-sm font-medium text-dark-50 mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-100 pointer-events-none">
              <Icon className="w-4 h-4" />
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            className={cn(
              "w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10",
              "text-white placeholder:text-dark-100/60",
              "focus:outline-none focus:border-primary-500/50 focus:bg-white/[0.07]",
              "focus:ring-2 focus:ring-primary-500/20",
              "transition-all duration-200",
              Icon && "pl-10",
              isPassword && "pr-11",
              error && "border-danger/50 focus:border-danger focus:ring-danger/20",
              className
            )}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-100 hover:text-white transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {error && (
          <p className="mt-1.5 text-xs text-danger">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;