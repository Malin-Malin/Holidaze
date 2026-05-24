import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext.tsx";
import type { Profile } from "../types/profile.types.tsx";
import { AUTH_UNAUTHORIZED_EVENT } from "../utils/auth";

/**
 * Parses the stored user information from localStorage.
 * @returns {Partial<Profile> | null} The parsed user object or null if not found/invalid.
 */
function parseStoredUser(): Partial<Profile> | null {
  const savedUser = localStorage.getItem("userInfo");
  if (!savedUser) return null;

  try {
    return JSON.parse(savedUser) as Partial<Profile>;
  } catch {
    return null;
  }
}

/**
 * Checks if a JWT access token is expired.
 * @param {string} token - The JWT access token.
 * @returns {boolean} True if expired, false otherwise.
 */
function isJwtExpired(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) return true;

  try {
    const payload = JSON.parse(atob(parts[1])) as { exp?: number };
    if (!payload.exp) return false;
    return payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

/**
 * Determines if the stored authentication is complete and valid.
 * @param {Partial<Profile> | null} user - The user object from storage.
 * @returns {boolean} True if authentication is complete, false otherwise.
 */
function hasCompleteStoredAuth(user: Partial<Profile> | null): boolean {
  const token = localStorage.getItem("accessToken");

  if (!token || isJwtExpired(token)) return false;

  return Boolean(user?.name);
}

/**
 * Provides authentication context to the app, managing user state and auth actions.
 * @param {object} props
 * @param {ReactNode} props.children - The child components.
 * @returns {JSX.Element}
 */
const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Partial<Profile> | null>(parseStoredUser);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() =>
    hasCompleteStoredAuth(parseStoredUser()),
  );
  const [isVenueManager, setIsVenueManager] = useState<boolean>(
    () => user?.venueManager === true,
  );

  /**
   * Clears authentication state and removes user data from localStorage.
   */
  const clearAuthState = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");

    setUser(null);
    setIsLoggedIn(false);
    setIsVenueManager(false);
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuthState();
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, []);

  /**
   * Logs in the user by saving tokens and user info, and updating state.
   * @param {string} accessToken - The JWT access token.
   * @param {Partial<Profile>} userInfo - The user information object.
   */
  const login = (accessToken: string, userInfo: Partial<Profile>) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("userInfo", JSON.stringify(userInfo));

    setUser(userInfo);
    setIsLoggedIn(true);
    setIsVenueManager(userInfo.venueManager === true);
  };

  /**
   * Updates the user information in state and localStorage.
   * @param {Partial<Profile>} userInfo - The updated user information.
   */
  const setUserInfo = (userInfo: Partial<Profile>) => {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    setUser(userInfo);
    setIsVenueManager(userInfo.venueManager === true);
  };

  /**
   * Logs out the user and clears authentication state.
   */
  const logout = () => {
    clearAuthState();
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isVenueManager,
        user,
        login,
        setUserInfo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
