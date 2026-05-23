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
};

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
