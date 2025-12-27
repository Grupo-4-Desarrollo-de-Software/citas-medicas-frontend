import { createContext } from "react";

interface User {
  id: number;
  email: string;
  name?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
