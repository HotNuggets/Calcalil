import { useEffect, useRef, useState } from "react";

export type DataPoint = {
  date: string;
  nsdqUSD: number;
  nsdqILS: number;
};

export type Period = 'YTD' | '1M' | '3M' | '6M' | '1Y';
export type ChartView = 'daily' | 'monthly' | 'ytd';

export interface NasdaqPageVM {
  data: DataPoint[];
  loading: boolean;
  error: string | null;
  period: Period;
  setPeriod: (p: Period) => void;

  // Chart view
  chartView: ChartView;
  setChartView: (v: ChartView) => void;
  chartData: DataPoint[];
  isPercentView: boolean;

  // Current values
  currentUSD: number;
  currentILS: number;

  // Growth metrics
  usdGrowth: number;
  ilsGrowth: number;

  // Comparison metrics
  fxImpact: number;
  highestUSD: number;
  lowestUSD: number;
  highestILS: number;
  lowestILS: number;

  // Formatted strings
  fxImpactFormatted: string;
}

export function useNasdaqPageVM(): NasdaqPageVM {
  const [rawData, setRawData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>('YTD');
  const [chartView, setChartView] = useState<ChartView>('daily');

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

        // ── Nasdaq 100 (QQQ ETF as proxy) ──
        const nsdqRes = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=QQQ&apikey=${API_KEY}`
        );
        const nsdqJson = await nsdqRes.json();

        if (!nsdqJson['Time Series (Daily)']) {
          setError('הגעת למגבלת הקריאות - נסה שוב בעוד דקה');
          setLoading(false);
          return;
        }

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

        const nsdqSeries = nsdqJson['Time Series (Daily)'];
        const fxSeries   = fxJson['Time Series FX (Daily)'];

        const rows: DataPoint[] = Object.keys(nsdqSeries)
          .map((date) => {
            const nsdq = Number(nsdqSeries[date]['4. close']);
            const fx   = Number(fxSeries[date]?.['4. close']);
            if (!fx) return null;
            return { date, nsdqUSD: nsdq, nsdqILS: nsdq * fx };
          })
          .filter(Boolean)
          .reverse() as DataPoint[];

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

  // ── Filter by selected period ──────────────────────────────────────────────
  const data = (() => {
    if (rawData.length === 0) return [];
    const now    = new Date();
    const cutoff = new Date(now);
    switch (period) {
      case 'YTD': cutoff.setMonth(0, 1); break;
      case '1M':  cutoff.setMonth(now.getMonth() - 1); break;
      case '3M':  cutoff.setMonth(now.getMonth() - 3); break;
      case '6M':  cutoff.setMonth(now.getMonth() - 6); break;
      case '1Y':  cutoff.setFullYear(now.getFullYear() - 1); break;
    }
    return rawData.filter((d) => new Date(d.date) >= cutoff);
  })();

  // ── Build chart data ───────────────────────────────────────────────────────

  const toPercent = (slice: DataPoint[]): DataPoint[] => {
    if (slice.length === 0) return [];
    const base = slice[0];
    return slice.map((d) => ({
      date:     d.date,
      nsdqUSD: ((d.nsdqUSD - base.nsdqUSD) / base.nsdqUSD) * 100,
      nsdqILS: ((d.nsdqILS - base.nsdqILS) / base.nsdqILS) * 100,
    }));
  };

  const dailyData = toPercent(data);

  const monthlyData: DataPoint[] = (() => {
    if (data.length === 0) return [];
    const byMonth: Record<string, DataPoint> = {};
    for (const point of data) {
      byMonth[point.date.slice(0, 7)] = point;
    }
    return toPercent(Object.values(byMonth));
  })();

  const ytdData: DataPoint[] = (() => {
    const now  = new Date();
    const jan1 = new Date(now.getFullYear(), 0, 1);
    return toPercent(rawData.filter((d) => new Date(d.date) >= jan1));
  })();

  const chartData =
    chartView === 'daily'   ? dailyData :
    chartView === 'monthly' ? monthlyData :
    ytdData;

  const isPercentView = true;

  // ── Metrics ───────────────────────────────────────────────────────────────
  const first = data[0];
  const last  = data[data.length - 1];

  const currentUSD = last?.nsdqUSD ?? 0;
  const currentILS = last?.nsdqILS ?? 0;

  const usdGrowth =
    first && last ? ((last.nsdqUSD - first.nsdqUSD) / first.nsdqUSD) * 100 : 0;
  const ilsGrowth =
    first && last ? ((last.nsdqILS - first.nsdqILS) / first.nsdqILS) * 100 : 0;

  const fxImpact = ilsGrowth - usdGrowth;
  const fxImpactFormatted =
    fxImpact >= 0 ? `+${fxImpact.toFixed(2)}%` : `${fxImpact.toFixed(2)}%`;

  const highestUSD = data.length > 0 ? Math.max(...data.map((d) => d.nsdqUSD)) : 0;
  const lowestUSD  = data.length > 0 ? Math.min(...data.map((d) => d.nsdqUSD)) : 0;
  const highestILS = data.length > 0 ? Math.max(...data.map((d) => d.nsdqILS)) : 0;
  const lowestILS  = data.length > 0 ? Math.min(...data.map((d) => d.nsdqILS)) : 0;

  return {
    data,
    loading,
    error,
    period,
    setPeriod,
    chartView,
    setChartView,
    chartData,
    isPercentView,
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
