import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.tsx";

/**
 * Custom hook to access the authentication context.
 * @returns {import("../context/AuthContext").AuthContextType} Auth context value.
 * @throws {Error} If used outside an AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
