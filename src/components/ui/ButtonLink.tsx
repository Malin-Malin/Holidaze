import type { ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";

import {
  type ButtonVariant,
  type ButtonSize,
  getButtonClass,
} from "../../utils/button";

type ButtonLinkProps = LinkProps & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

const ButtonLink = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonLinkProps) => {
  return (
    <Link {...props} className={getButtonClass({ variant, size, className })}>
      {children}
    </Link>
  );
};

export default ButtonLink;
