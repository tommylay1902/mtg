import { createContext } from "react";

export type AuthContextType = {
  authenticated: boolean;
  user: string;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
