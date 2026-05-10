// src/services/marketDataService.ts
//
// Call ensureFreshData() once on page load (from the VM useEffect).
// It pings the edge function which internally checks staleness and
// skips the Alpha Vantage fetch if today's data already exists.

import { supabase } from "../lib/supabase"; // adjust path if needed

export type MarketRow = {
  date:      string;
  close_usd: number;
  close_ils: number;
};

/**
 * Triggers the edge function to refresh data if needed.
 * Safe to call on every page load — the function skips if already up to date.
 */
export async function ensureFreshData(): Promise<void> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-market-data`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Use anon key if no user session (function is public)
          "Authorization": token
            ? `Bearer ${token}`
            : `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      }
    );
    // We don't await the result aggressively — data loads from Supabase
    // regardless; this just fires the refresh in the background.
  } catch (e) {
    // Non-fatal — app still works from cached Supabase data
    console.warn("Could not refresh market data:", e);
  }
}

/**
 * Fetch rows for a symbol from Supabase, ordered oldest → newest.
 */
export async function fetchMarketData(symbol: "SPY" | "QQQ"): Promise<MarketRow[]> {
  const { data, error } = await supabase
    .from("market_data")
    .select("date, close_usd, close_ils")
    .eq("symbol", symbol)
    .order("date", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({
    date:      r.date as string,
    close_usd: Number(r.close_usd),
    close_ils: Number(r.close_ils),
  }));
}
