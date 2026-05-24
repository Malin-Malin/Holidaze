import type { ButtonHTMLAttributes } from "react";
import { getButtonClass } from "../../utils/button";
import type {
  ButtonVariant,
  ButtonSize,
  ButtonWidth,
} from "../../utils/button";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  width?: ButtonWidth;
  "aria-label"?: string;
};

/**
 * Button component with customizable variant, size, and width.
 * @param {ButtonProps} props
 * @param {ButtonVariant} [props.variant] - Button style variant.
 * @param {ButtonSize} [props.size] - Button size.
 * @param {ButtonWidth} [props.width] - Button width.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {ReactNode} props.children - Button content.
 * @returns {JSX.Element}
 */
const Button = ({
  variant = "primary",
  size = "md",
  width = "auto",
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={getButtonClass({ variant, size, width, className })}
    >
      {children}
    </button>
  );
};

export default Button;
