import type { ButtonHTMLAttributes } from "react";

import {
  type ButtonVariant,
  type ButtonSize,
  getButtonClass,
} from "../../utils/button";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const Button = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button {...props} className={getButtonClass({ variant, size, className })}>
      {children}
    </button>
  );
};

export default Button;
