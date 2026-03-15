"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { loginUser, registerUser, logoutUser, type AuthUser } from "@/lib/api";

interface AuthState {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "fleeto_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      // ignore malformed storage
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await loginUser(username, password);

    const success = res.success === true || res.success === 1 || res.success === "true";

    if (success) {
      // Handle multiple WP response shapes:
      // 1. { success, user: { user_id, ... } }
      // 2. { success, data: { user_id, ... } }
      // 3. { success, user_id, username, email, ... } (flat)
      const raw = res.user ?? res.data ?? (res.user_id ? res : null);

      if (raw) {
        const normalizedUser: AuthUser = {
          user_id: Number(raw.user_id),
          username: raw.username ?? "",
          email: raw.email ?? "",
          display_name: raw.display_name ?? raw.username ?? "",
        };
        setUser(normalizedUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedUser));
      }
    }

    return {
      success: Boolean(success),
      message: String(res.message ?? res.data?.message ?? (success ? "Login successful" : "Login failed")),
    };
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await registerUser(username, email, password);
      const success = res.success === true || res.success === 1 || res.success === "true";
      return {
        success: Boolean(success),
        message: String(res.message ?? res.data?.message ?? (success ? "Registered successfully" : "Registration failed")),
      };
    },
    []
  );

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
