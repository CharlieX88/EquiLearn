import { cn } from "../../utils/cn";

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary-400 mb-3 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base sm:text-lg text-dark-100 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}