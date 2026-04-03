import { useState, useEffect, useCallback } from 'react';
import { PaginatedResponse } from '../types';

interface UsePaginationResult<T> {
  data: T[];
  meta: PaginatedResponse<T>['meta'] | null;
  loading: boolean;
  error: string | null;
  page: number;
  setPage: (page: number) => void;
  setFilters: (filters: Record<string, any>) => void;
  refresh: () => void;
}

export function usePagination<T>(
  apiFn: (params?: Record<string, any>) => Promise<PaginatedResponse<T>>,
  initialFilters: Record<string, any> = {}
): UsePaginationResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<T>['meta'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const refresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiFn({ ...filters, page });
        if (!cancelled) {
          setData(response.data);
          setMeta(response.meta);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message || 'An error occurred');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [page, filters, refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSetFilters = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  return {
    data,
    meta,
    loading,
    error,
    page,
    setPage,
    setFilters: handleSetFilters,
    refresh,
  };
}
