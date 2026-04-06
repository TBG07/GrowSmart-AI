'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { LiveDashboardData, UseLiveDataResult } from '@/lib/realtime/types';

const POLL_INTERVAL_MS = 30_000; // 30 seconds

export function useLiveDashboard(): UseLiveDataResult<LiveDashboardData> {
  const [data, setData] = useState<LiveDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const clockRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    try {
      const res = await fetch('/api/live-data', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: LiveDashboardData = await res.json();
      setData(json);
      setLastUpdated(Date.now());
      setSecondsAgo(0);
      setError(null);
    } catch (err) {
      console.error('[useLiveDashboard] fetch error:', err);
      setError('Unable to fetch live data. Retrying…');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchData(false);
  }, [fetchData]);

  // Polling loop
  useEffect(() => {
    timerRef.current = setInterval(() => {
      fetchData(true);
    }, POLL_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchData]);

  // "Seconds ago" clock — updates every second
  useEffect(() => {
    clockRef.current = setInterval(() => {
      if (lastUpdated !== null) {
        setSecondsAgo(Math.floor((Date.now() - lastUpdated) / 1000));
      }
    }, 1000);

    return () => {
      if (clockRef.current) clearInterval(clockRef.current);
    };
  }, [lastUpdated]);

  const refresh = useCallback(() => {
    // Reset the polling interval so next auto-refresh is 30s from now
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => fetchData(true), POLL_INTERVAL_MS);
    fetchData(true);
  }, [fetchData]);

  return { data, isLoading, isRefreshing, lastUpdated, secondsAgo, error, refresh };
}
