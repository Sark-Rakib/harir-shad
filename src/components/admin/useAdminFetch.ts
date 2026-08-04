"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";

interface AdminFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string;
  reload: () => void;
}

export function useAdminFetch<T>(path: string, reloadKey = 0): AdminFetchResult<T> {
  const { token } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    api
      .getAuth<T>(path, token)
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : "ডেটা লোড করা যায়নি।",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [path, token, reloadKey, tick]);

  return { data, loading, error, reload };
}
