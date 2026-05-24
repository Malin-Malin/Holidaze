import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

type RequireAuthProps = {
  children: ReactNode;
  requireVenueManager?: boolean;
};

/**
 * Component to protect routes that require authentication (and optionally venue manager role).
 * Redirects to login or profile if requirements are not met.
 * @param {RequireAuthProps} props
 * @param {ReactNode} props.children - The protected content.
 * @param {boolean} [props.requireVenueManager] - If true, requires venue manager role.
 * @returns {JSX.Element}
 */
const RequireAuth = ({
  children,
  requireVenueManager = false,
}: RequireAuthProps) => {
  const location = useLocation();
  const { isLoggedIn, isVenueManager } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireVenueManager && !isVenueManager) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
