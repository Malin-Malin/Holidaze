import { useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext.tsx";
import type { Profile } from "../types/profile.types.tsx";

function parseStoredUser(): Partial<Profile> | null {
  const savedUser = localStorage.getItem("userInfo");
  if (!savedUser) return null;

  try {
    return JSON.parse(savedUser) as Partial<Profile>;
  } catch {
    return null;
  }
}

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

function hasCompleteStoredAuth(user: Partial<Profile> | null): boolean {
  const token = localStorage.getItem("accessToken");

  if (!token || isJwtExpired(token)) return false;

  return Boolean(user?.name);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Partial<Profile> | null>(parseStoredUser);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() =>
    hasCompleteStoredAuth(parseStoredUser()),
  );
  const [isVenueManager, setIsVenueManager] = useState<boolean>(
    () => user?.venueManager === true,
  );
  const [apiKey, setApiKey] = useState<string | null>(
    localStorage.getItem("apiKey"),
  );

  const login = (
    accessToken: string,
    apiKey: string,
    userInfo: Partial<Profile>,
  ) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("apiKey", apiKey);
    localStorage.setItem("userInfo", JSON.stringify(userInfo));

    setApiKey(apiKey);
    setUser(userInfo);
    setIsLoggedIn(true);
    setIsVenueManager(userInfo.venueManager === true);
  };

  const setUserInfo = (userInfo: Partial<Profile>) => {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    setUser(userInfo);
    setIsVenueManager(userInfo.venueManager === true);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("apiKey");
    localStorage.removeItem("userInfo");

    setApiKey(null);
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isVenueManager,
        user,
        apiKey,
        login,
        setUserInfo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
