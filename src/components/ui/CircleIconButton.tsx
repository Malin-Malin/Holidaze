import type { ButtonHTMLAttributes, ReactNode } from "react";

type CircleIconButtonSize = "sm" | "md" | "lg";

type CircleIconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
  size?: CircleIconButtonSize;
};

const sizeClassMap: Record<CircleIconButtonSize, string> = {
  sm: "w-8 h-8 md:w-9 md:h-9 text-lg",
  md: "w-9 h-9 md:w-10 md:h-10 text-lx",
  lg: "w-11 h-11 md:w-12 md:h-12 text-2xl",
};

/**
 * Circular icon button component for actions.
 * @param {CircleIconButtonProps} props
 * @param {ReactNode} props.children - Icon or content inside the button.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {"sm"|"md"|"lg"} [props.size] - Button size.
 * @returns {JSX.Element}
 */
const CircleIconButton = ({
  children,
  className = "",
  size = "sm",
  ...props
}: CircleIconButtonProps) => (
  <button
    type="button"
    {...props}
    className={[
      "inline-flex items-center justify-center",
      "rounded-full bg-black/60 text-white",
      sizeClassMap[size],
      "p-0",
      "border-2 border-transparent",
      "transition shadow-md",
      "hover:bg-black/80 hover:scale-105 hover:border-[var(--color-honey)]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-honey)]",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
  >
    {children}
  </button>
);

export default CircleIconButton;
