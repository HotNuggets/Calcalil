import { useEffect, useRef, useState } from "react";

type DataPoint = {
  date: string;
  spxUSD: number;
  spxILS: number;
};

export function useSAndPPageVM() {
  console.log("✅ VM loaded");

  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const hasFetched = useRef(false);
  const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;

  console.log("🔑 API KEY:", API_KEY ? "GOT API KEY" : "NO API KEY");

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    console.log("🚀 useEffect started");

    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    async function fetchData() {
      try {
        console.log("📡 Entered fetchData");

        if (!API_KEY) return;

        // ---- S&P ----
        console.log("🌍 Fetching S&P data...");
        const spRes = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=SPY&apikey=${API_KEY}`
        );
        const spJson = await spRes.json();
        console.log("📈 S&P JSON OK");

        if (!spJson["Time Series (Daily)"]) {
          console.error("❌ S&P RATE LIMITED");
          return;
        }

        // ⏱ WAIT to avoid rate limit
        await sleep(1200);

        // ---- FX ----
        console.log("🌍 Fetching USD/ILS FX...");
        const fxRes = await fetch(
          `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=USD&to_symbol=ILS&apikey=${API_KEY}`
        );
        const fxJson = await fxRes.json();

        if (!fxJson["Time Series FX (Daily)"]) {
          console.error("❌ FX RATE LIMITED");
          return;
        }

        const spSeries = spJson["Time Series (Daily)"];
        const fxSeries = fxJson["Time Series FX (Daily)"];

        const year = new Date().getFullYear();

        const rows: DataPoint[] = Object.keys(spSeries)
          .filter((date) => date.startsWith(String(year)))
          .map((date) => {
            const sp = Number(spSeries[date]["4. close"]);
            const fx = Number(fxSeries[date]?.["4. close"]);
            if (!fx) return null;

            return {
              date,
              spxUSD: sp,
              spxILS: sp * fx,
            };
          })
          .filter(Boolean) as DataPoint[];

        console.log("✅ FINAL ROWS:", rows.length);
        setData(rows.reverse());
      } catch (e) {
        console.error("🔥 FETCH ERROR:", e);
      } finally {
        setLoading(false);
        console.log("🏁 Fetch finished");
      }
    }

    fetchData();
  }, []);

  const first = data[0];
  const last = data[data.length - 1];

  return {
    data,
    loading,
    usdGrowth:
      first && last ? ((last.spxUSD - first.spxUSD) / first.spxUSD) * 100 : 0,
    ilsGrowth:
      first && last ? ((last.spxILS - first.spxILS) / first.spxILS) * 100 : 0,
    currentUSD: last?.spxUSD ?? 0,
    currentILS: last?.spxILS ?? 0,
  };
}
