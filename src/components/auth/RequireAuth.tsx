import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

type RequireAuthProps = {
  children: ReactNode;
  requireVenueManager?: boolean;
};

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
