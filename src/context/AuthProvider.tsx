import { useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext.tsx";
import type { Profile } from "../types/profile.types.tsx";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    !!localStorage.getItem("accessToken"),
  );
  const [user, setUser] = useState<Partial<Profile> | null>(() => {
    const savedUser = localStorage.getItem("userInfo");
    return savedUser ? JSON.parse(savedUser) : null;
  });
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
    <AuthContext.Provider value={{ isLoggedIn, user, apiKey, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
