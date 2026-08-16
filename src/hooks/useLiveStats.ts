import { useState, useEffect, useCallback, useRef } from 'react';
import { AdminLiveStats, SitePublicStats, AnalyticsEvent, OrderStatus } from '../types';

interface UseLiveStatsOptions {
  pollingInterval?: number; // default: 15000ms (15 seconds)
  enabled?: boolean;
}

export function useLiveStats(options: UseLiveStatsOptions = {}) {
  const { pollingInterval = 15000, enabled = true } = options;

  const [adminStats, setAdminStats] = useState<AdminLiveStats | null>(null);
  const [siteStats, setSiteStats] = useState<SitePublicStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const isMountedRef = useRef(true);

  const fetchStats = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    }

    try {
      // Parallel fetch for optimal latency
      const [adminRes, siteRes] = await Promise.all([
        fetch('/api/admin/stats').catch((e) => {
          console.warn('Failed to fetch admin stats:', e);
          return null;
        }),
        fetch('/api/site/stats').catch((e) => {
          console.warn('Failed to fetch site stats:', e);
          return null;
        }),
      ]);

      if (!isMountedRef.current) return;

      let hasData = false;

      if (adminRes && adminRes.ok) {
        const adminData = await adminRes.json();
        if (adminData.success && adminData.stats) {
          setAdminStats(adminData.stats);
          hasData = true;
        }
      }

      if (siteRes && siteRes.ok) {
        const siteData = await siteRes.json();
        if (siteData.success && siteData.stats) {
          setSiteStats(siteData.stats);
          hasData = true;
        }
      }

      if (hasData) {
        setError(null);
        setLastFetched(new Date());
      } else if (!adminStats && !siteStats) {
        setError('امکان اتصال به پایگاه داده زنده فراهم نشد.');
      }
    } catch (err: any) {
      console.error('Error in useLiveStats polling:', err);
      if (isMountedRef.current && !adminStats) {
        setError(err?.message || 'خطا در ارتباط با سرور زنده');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [adminStats, siteStats]);

  // Track Analytics Event helper
  const trackEvent = useCallback(
    async (eventData: Omit<AnalyticsEvent, 'id' | 'createdAt'>) => {
      try {
        await fetch('/api/analytics/event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData),
        });
      } catch (err) {
        console.warn('Failed to track analytics event:', err);
      }
    },
    []
  );

  // Initial Fetch & Auto Revalidation Interval
  useEffect(() => {
    isMountedRef.current = true;
    if (!enabled) return;

    // Initial load
    fetchStats();

    // Auto-polling revalidation (every 10-30s)
    const intervalId = setInterval(() => {
      fetchStats(false);
    }, pollingInterval);

    return () => {
      isMountedRef.current = false;
      clearInterval(intervalId);
    };
  }, [fetchStats, pollingInterval, enabled]);

  return {
    adminStats,
    siteStats,
    isLoading,
    isRefreshing,
    error,
    lastFetched,
    refetch: () => fetchStats(true),
    trackEvent,
  };
}
