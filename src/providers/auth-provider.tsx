"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "@/lib/api";
import type { AuthResponse, AuthUser } from "@/lib/types";

const TOKEN_KEY = "hs-token";
const USER_KEY = "hs-user";

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function clearStoredAuth() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  } catch {
    // ignore storage errors
  }
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => void;
  updateProfile: (data: { name: string; phone: string }) => Promise<AuthUser>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      // 1) Persistent session via the HTTP-only auth cookie (set on login).
      try {
        const res = await api.get<{ user: AuthUser }>("/api/auth/me");
        if (!cancelled && res?.user) {
          setUser(res.user);
          clearStoredAuth();
          setLoading(false);
          return;
        }
      } catch {
        // no valid cookie — fall through
      }

      // 2) Legacy sessions stored in localStorage (pre-cookie). Validating
      //    here also migrates them to the cookie via /me.
      const storedToken = loadFromStorage<string | null>(TOKEN_KEY, null);
      if (storedToken) {
        try {
          const res = await api.getAuth<{ user: AuthUser }>(
            "/api/auth/me",
            storedToken,
          );
          if (!cancelled && res?.user) {
            setUser(res.user);
            setToken(storedToken);
            clearStoredAuth();
            setLoading(false);
            return;
          }
        } catch {
          // stale token — clear below
        }
      }

      clearStoredAuth();
      if (!cancelled) setLoading(false);
    };

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const applyAuth = useCallback((res: AuthResponse) => {
    setUser(res.user);
    setToken(res.token);
    clearStoredAuth();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.post<AuthResponse>("/api/auth/login", {
        email,
        password,
      });
      applyAuth(res);
      return res;
    },
    [applyAuth],
  );

  const register = useCallback(
    async (data: RegisterData) => {
      const res = await api.post<AuthResponse>("/api/auth/register", data);
      applyAuth(res);
      return res;
    },
    [applyAuth],
  );

  const logout = useCallback(() => {
    api.post("/api/auth/logout", {}).catch(() => {});
    setToken(null);
    setUser(null);
    clearStoredAuth();
  }, []);

  const updateProfile = useCallback(
    async (data: { name: string; phone: string }) => {
      const res = await api.putAuth<{ user: AuthUser }>(
        "/api/auth/me",
        data,
        token,
      );
      setUser(res.user);
      return res.user;
    },
    [token],
  );

  const isAdmin = user?.role === "admin";

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAdmin,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, token, loading, isAdmin, login, register, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
