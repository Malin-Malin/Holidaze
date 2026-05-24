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
  "aria-label"?: string;
};

/**
 * Link component styled as a button, for navigation.
 * @param {ButtonLinkProps} props
 * @param {ButtonVariant} [props.variant] - Button style variant.
 * @param {ButtonSize} [props.size] - Button size.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {ReactNode} props.children - Link content.
 * @returns {JSX.Element}
 */
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
