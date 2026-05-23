type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "icon";
type ButtonSize = "sm" | "md" | "lg";
type ButtonWidth = "auto" | "full" | "wide";

const baseClass =
  "inline-flex items-center justify-center rounded-md border text-sm font-semibold tracking-[0.01em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";
const widthClass: Record<ButtonWidth, string> = {
  auto: "w-auto",
  full: "w-full",
  wide: "min-w-[220px] w-full md:w-[340px]",
};
const sizeClass: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5",
  md: "px-4 py-2",
  lg: "px-7 py-3.5",
};

const variantClass: Record<ButtonVariant, string> = {
  primary: [
    "border-[var(--color-honey)]/60",
    "bg-[var(--color-honey)]/50",
    "text-[var(--color-ink)]",
    "shadow-[0_2px_8px_rgba(0,0,0,0.10)]",
    "hover:bg-[var(--color-honey)]/80",
    "hover:border-[var(--color-honey)]",
    "hover:text-[var(--color-ink)]",
    "hover:brightness-105",
    "hover:shadow-[0_4px_12px_rgba(0,0,0,0.14)]",
    "focus-visible:outline-[var(--color-honey)]",
    "dark:border-[var(--color-bark)]/60",
    "dark:bg-[var(--color-bark)]/50",
    "dark:text-[var(--color-honey)]/90",
    "dark:hover:bg-[var(--color-honey)]/20",
    "dark:hover:border-[var(--color-honey)]/80",
    "dark:hover:text-[var(--color-honey)]/90",
    "dark:hover:brightness-105",
  ].join(" "),
  secondary: [
    "border-[var(--color-bark)]/40",
    "bg-[var(--color-bark)]/8",
    "text-[var(--color-ink)]",
    "shadow-[0_6px_14px_rgba(129,94,78,0.10)]",
    "hover:border-[var(--color-bark)]/60",
    "hover:bg-[var(--color-bark)]/14",
    "hover:bg-[var(--color-honey)]/60",
    "dark:border-[var(--color-honey)]/30",
    "dark:bg-[var(--color-honey)]/7",
    "dark:text-[var(--color-honey)]/80",
    "dark:shadow-none",
    "dark:hover:border-[var(--color-honey)]/50",
    "dark:hover:bg-[var(--color-honey)]/12",
    "focus-visible:outline-[var(--color-honey)]",
  ].join(" "),
  outline: [
    "border-[var(--color-bark)]",
    "text-[var(--color-bark)]",
    "hover:border-[var(--color-nav-link)]",
    "hover:text-[var(--color-nav-link)]",
    "hover:bg-[var(--color-nav-link)]/20",
    "focus-visible:outline-[var(--color-honey)]",
    "dark:border-[var(--color-bark)]",
    "dark:text-[var(--color-bark)]",
    "dark:hover:border-[var(--color-honey)]",
    "dark:hover:text-[var(--color-honey)]",
  ].join(" "),
  danger: [
    "border-[var(--color-danger)]",
    "text-[var(--color-danger)]",
    "hover:text-[var(--color-ink)]",
    "hover:bg-[var(--color-danger)]/30",
    "focus-visible:outline-[var(--color-danger)]",
    "dark:hover:text-white",
  ].join(" "),
  icon: [
    "bg-transparent border-none shadow-none",
    "hover:bg-white/10 hover:ring-1 hover:ring-[var(--shell-accent)]/30",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--shell-accent)]",
    "text-[var(--shell-accent)]",
  ].join(" "),
};

type ButtonClassOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  width?: ButtonWidth;
  className?: string;
};

function getButtonClass({
  variant = "primary",
  size = "md",
  width = "auto",
  className,
}: ButtonClassOptions = {}) {
  return [
    baseClass,
    sizeClass[size],
    variantClass[variant],
    widthClass[width],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export {
  getButtonClass,
  type ButtonVariant,
  type ButtonSize,
  type ButtonWidth,
  type ButtonClassOptions,
};
