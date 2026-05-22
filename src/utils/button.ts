type ButtonVariant = "primary" | "secondary" | "outline" | "danger";
type ButtonSize = "md" | "lg";

const baseClass =
  "inline-flex items-center justify-center rounded-md border text-sm font-semibold tracking-[0.01em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";
const sizeClass: Record<ButtonSize, string> = {
  md: "px-4 py-2",
  lg: "px-7 py-3.5",
};

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "border-[var(--color-honey)]/90 bg-[linear-gradient(180deg,var(--color-honey)_0%,#d8ba72_100%)] text-[var(--color-ink)] shadow-[0_8px_20px_rgba(0,0,0,0.22)] hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_10px_24px_rgba(0,0,0,0.28)] focus-visible:outline-[var(--color-honey)]",
  secondary:
    "border-[var(--color-honey)]/75 bg-[linear-gradient(180deg,rgba(246,177,116,0.20)_0%,rgba(246,177,116,0.10)_100%)] text-[var(--color-ink)] shadow-[0_6px_14px_rgba(129,94,78,0.16)] hover:-translate-y-0.5 hover:border-[var(--color-honey)] hover:bg-[linear-gradient(180deg,rgba(246,177,116,0.30)_0%,rgba(246,177,116,0.16)_100%)] dark:border-[var(--color-honey)]/70 dark:bg-[var(--color-honey)]/14 dark:text-[var(--color-honey)] dark:shadow-none dark:hover:border-[var(--color-honey)] dark:hover:bg-[var(--color-honey)]/24 focus-visible:outline-[var(--color-honey)]",
  outline:
    "border-[var(--border)] text-[var(--text-h)] hover:border-[var(--color-honey)] hover:text-[var(--color-honey)] focus-visible:outline-[var(--color-honey)]",
  danger:
    "border-[var(--color-danger)] text-[var(--color-danger)] hover:bg-[var(--color-danger)] hover:text-white focus-visible:outline-[var(--color-danger)]",
};

type ButtonClassOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

function getButtonClass({
  variant = "primary",
  size = "md",
  className,
}: ButtonClassOptions = {}) {
  return [baseClass, sizeClass[size], variantClass[variant], className]
    .filter(Boolean)
    .join(" ");
}

export {
  getButtonClass,
  type ButtonVariant,
  type ButtonSize,
  type ButtonClassOptions,
};
