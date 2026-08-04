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

function saveToStorage(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    if (value == null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
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
      const storedToken = loadFromStorage<string | null>(TOKEN_KEY, null);
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getAuth<{ user: AuthUser }>(
          "/api/auth/me",
          storedToken,
        );
        if (cancelled) return;
        setUser(res.user);
        setToken(storedToken);
        saveToStorage(USER_KEY, res.user);
      } catch {
        if (cancelled) return;
        setToken(null);
        setUser(null);
        saveToStorage(TOKEN_KEY, null);
        saveToStorage(USER_KEY, null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const applyAuth = useCallback((res: AuthResponse) => {
    setUser(res.user);
    setToken(res.token);
    saveToStorage(TOKEN_KEY, res.token);
    saveToStorage(USER_KEY, res.user);
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
    setToken(null);
    setUser(null);
    saveToStorage(TOKEN_KEY, null);
    saveToStorage(USER_KEY, null);
  }, []);

  const updateProfile = useCallback(
    async (data: { name: string; phone: string }) => {
      if (!token) throw new Error("লগইন প্রয়োজন।");
      const res = await api.putAuth<{ user: AuthUser }>(
        "/api/auth/me",
        data,
        token,
      );
      setUser(res.user);
      saveToStorage(USER_KEY, res.user);
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
