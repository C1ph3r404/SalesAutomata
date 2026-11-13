import { useCallback, useEffect, useState } from "react";

import { apiGet, type QueryParams } from "../api";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(path: string, params: QueryParams = {}) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const key = JSON.stringify(params);

  const reload = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const data = await apiGet<T>(path, JSON.parse(key) as QueryParams);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }, [path, key]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { ...state, reload };
}
