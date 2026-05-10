import { useEffect, useState } from "react";
import { ensureFreshData, fetchMarketData } from "../../../services/marketDataService"; // adjust path

export type DataPoint = {
  date: string;
  spxUSD: number;
  spxILS: number;
};

export type Period    = 'YTD' | '1M' | '3M' | '6M' | '1Y';
export type ChartView = 'daily' | 'monthly' | 'ytd';

export interface SAndPPageVM {
  data: DataPoint[];
  loading: boolean;
  error: string | null;
  period: Period;
  setPeriod: (p: Period) => void;
  chartView: ChartView;
  setChartView: (v: ChartView) => void;
  chartData: DataPoint[];
  isPercentView: boolean;
  currentUSD: number;
  currentILS: number;
  usdGrowth: number;
  ilsGrowth: number;
  fxImpact: number;
  fxImpactFormatted: string;
  highestUSD: number;
  lowestUSD: number;
  highestILS: number;
  lowestILS: number;
}

export function useSAndPPageVM(): SAndPPageVM {
  const [rawData,   setRawData]   = useState<DataPoint[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [period,    setPeriod]    = useState<Period>('YTD');
  const [chartView, setChartView] = useState<ChartView>('daily');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        // Fire refresh in background (skips if already up to date)
        ensureFreshData();

        const rows = await fetchMarketData("SPY");

        if (rows.length === 0) {
          setError("אין נתונים זמינים – יתכן שהסנכרון היומי טרם הופעל");
          return;
        }

        setRawData(rows.map((r) => ({
          date:   r.date,
          spxUSD: r.close_usd,
          spxILS: r.close_ils,
        })));
      } catch (e) {
        setError("שגיאה בטעינת נתונים מהשרת");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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

  const toPercent = (slice: DataPoint[]): DataPoint[] => {
    if (slice.length === 0) return [];
    const base = slice[0];
    return slice.map((d) => ({
      date:   d.date,
      spxUSD: ((d.spxUSD - base.spxUSD) / base.spxUSD) * 100,
      spxILS: ((d.spxILS - base.spxILS) / base.spxILS) * 100,
    }));
  };

  const dailyData = toPercent(data);

  const monthlyData: DataPoint[] = (() => {
    if (data.length === 0) return [];
    const byMonth: Record<string, DataPoint> = {};
    for (const point of data) byMonth[point.date.slice(0, 7)] = point;
    return toPercent(Object.values(byMonth));
  })();

  const ytdData: DataPoint[] = (() => {
    const jan1 = new Date(new Date().getFullYear(), 0, 1);
    return toPercent(rawData.filter((d) => new Date(d.date) >= jan1));
  })();

  const chartData =
    chartView === 'daily'   ? dailyData :
    chartView === 'monthly' ? monthlyData :
    ytdData;

  const isPercentView = true;

  const first = data[0];
  const last  = data[data.length - 1];

  const currentUSD = last?.spxUSD ?? 0;
  const currentILS = last?.spxILS ?? 0;

  const usdGrowth = first && last
    ? ((last.spxUSD - first.spxUSD) / first.spxUSD) * 100 : 0;
  const ilsGrowth = first && last
    ? ((last.spxILS - first.spxILS) / first.spxILS) * 100 : 0;

  const fxImpact = ilsGrowth - usdGrowth;
  const fxImpactFormatted =
    fxImpact >= 0 ? `+${fxImpact.toFixed(2)}%` : `${fxImpact.toFixed(2)}%`;

  const highestUSD = data.length > 0 ? Math.max(...data.map((d) => d.spxUSD)) : 0;
  const lowestUSD  = data.length > 0 ? Math.min(...data.map((d) => d.spxUSD)) : 0;
  const highestILS = data.length > 0 ? Math.max(...data.map((d) => d.spxILS)) : 0;
  const lowestILS  = data.length > 0 ? Math.min(...data.map((d) => d.spxILS)) : 0;

  return {
    data, loading, error, period, setPeriod,
    chartView, setChartView, chartData, isPercentView,
    currentUSD, currentILS, usdGrowth, ilsGrowth,
    fxImpact, fxImpactFormatted,
    highestUSD, lowestUSD, highestILS, lowestILS,
  };
}
