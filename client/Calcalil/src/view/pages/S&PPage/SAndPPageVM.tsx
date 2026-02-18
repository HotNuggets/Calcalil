import { useEffect, useRef, useState } from "react";

export type DataPoint = {
  date: string;
  spxUSD: number;
  spxILS: number;
};

export type Period = 'YTD' | '1M' | '3M' | '6M' | '1Y';

export interface SAndPPageVM {
  data: DataPoint[];
  loading: boolean;
  error: string | null;
  period: Period;
  setPeriod: (p: Period) => void;
  
  // Current values
  currentUSD: number;
  currentILS: number;
  
  // Growth metrics
  usdGrowth: number;
  ilsGrowth: number;
  
  // Comparison metrics
  fxImpact: number;      // How much FX hurt/helped (ilsGrowth - usdGrowth)
  highestUSD: number;
  lowestUSD: number;
  highestILS: number;
  lowestILS: number;
  
  // Formatted strings
  fxImpactFormatted: string;
}

export function useSAndPPageVM(): SAndPPageVM {
  const [rawData, setRawData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>('YTD');

  const hasFetched = useRef(false);
  const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    async function fetchData() {
      try {
        if (!API_KEY) {
          setError('מפתח API חסר - הגדר VITE_ALPHA_VANTAGE_KEY');
          setLoading(false);
          return;
        }

        // ── S&P 500 (using SPY ETF as proxy) ──
        const spRes = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=SPY&apikey=${API_KEY}`
        );
        const spJson = await spRes.json();

        if (!spJson['Time Series (Daily)']) {
          setError('הגעת למגבלת הקריאות - נסה שוב בעוד דקה');
          setLoading(false);
          return;
        }

        // Wait to avoid rate limit
        await sleep(1200);

        // ── USD/ILS FX rate ──
        const fxRes = await fetch(
          `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=USD&to_symbol=ILS&apikey=${API_KEY}`
        );
        const fxJson = await fxRes.json();

        if (!fxJson['Time Series FX (Daily)']) {
          setError('שגיאה בטעינת שער מטבע');
          setLoading(false);
          return;
        }

        const spSeries = spJson['Time Series (Daily)'];
        const fxSeries = fxJson['Time Series FX (Daily)'];

        // Build combined dataset
        const rows: DataPoint[] = Object.keys(spSeries)
          .map((date) => {
            const sp = Number(spSeries[date]['4. close']);
            const fx = Number(fxSeries[date]?.['4. close']);
            if (!fx) return null;

            return {
              date,
              spxUSD: sp,
              spxILS: sp * fx,
            };
          })
          .filter(Boolean)
          .reverse() as DataPoint[]; // oldest → newest

        setRawData(rows);
      } catch (e) {
        console.error('Fetch error:', e);
        setError('שגיאה בטעינת נתונים');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [API_KEY]);

  // ── Filter data by selected period ──────────────────────────────────────────
  const data = (() => {
    if (rawData.length === 0) return [];

    const now = new Date();
    const cutoffDate = new Date(now);

    switch (period) {
      case 'YTD':
        cutoffDate.setMonth(0, 1); // Jan 1 of current year
        break;
      case '1M':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case '3M':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case '6M':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case '1Y':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return rawData.filter((d) => new Date(d.date) >= cutoffDate);
  })();

  // ── Compute metrics ──────────────────────────────────────────────────────────
  const first = data[0];
  const last = data[data.length - 1];

  const currentUSD = last?.spxUSD ?? 0;
  const currentILS = last?.spxILS ?? 0;

  const usdGrowth =
    first && last ? ((last.spxUSD - first.spxUSD) / first.spxUSD) * 100 : 0;
  const ilsGrowth =
    first && last ? ((last.spxILS - first.spxILS) / first.spxILS) * 100 : 0;

  const fxImpact = ilsGrowth - usdGrowth;
  const fxImpactFormatted = fxImpact >= 0 
    ? `+${fxImpact.toFixed(2)}%` 
    : `${fxImpact.toFixed(2)}%`;

  const highestUSD = data.length > 0 ? Math.max(...data.map((d) => d.spxUSD)) : 0;
  const lowestUSD = data.length > 0 ? Math.min(...data.map((d) => d.spxUSD)) : 0;
  const highestILS = data.length > 0 ? Math.max(...data.map((d) => d.spxILS)) : 0;
  const lowestILS = data.length > 0 ? Math.min(...data.map((d) => d.spxILS)) : 0;

  return {
    data,
    loading,
    error,
    period,
    setPeriod,
    currentUSD,
    currentILS,
    usdGrowth,
    ilsGrowth,
    fxImpact,
    fxImpactFormatted,
    highestUSD,
    lowestUSD,
    highestILS,
    lowestILS,
  };
}
