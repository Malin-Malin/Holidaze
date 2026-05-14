import { createContext } from "react";
import type { Profile } from "../types/profile.types";

export interface AuthContextType {
  isLoggedIn: boolean;
  isVenueManager: boolean;
  user: Partial<Profile> | null;
  apiKey: string | null;
  login: (
    accessToken: string,
    apiKey: string,
    userInfo: Partial<Profile>,
  ) => void;
  setUserInfo: (userInfo: Partial<Profile>) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
