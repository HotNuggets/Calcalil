// @ts-nocheck
// supabase/functions/fetch-market-data/index.ts
// Deploy with: npx supabase functions deploy fetch-market-data
//
// Secrets needed (supabase secrets set KEY=value):
//   ALPHA_VANTAGE_KEY  – your Alpha Vantage API key
//   SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY – auto-provided by Supabase

/// <reference lib="deno.ns" />
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALPHA_BASE = "https://www.alphavantage.co/query";
const SYMBOLS    = ["SPY", "QQQ"] as const;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

type Row = {
  symbol:    string;
  date:      string;
  close_usd: number;
  close_ils: number;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const json  = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });

async function fetchDailySeries(symbol: string, apiKey: string) {
  const url = `${ALPHA_BASE}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
  const res  = await fetch(url);
  const data = await res.json();
  const series = data["Time Series (Daily)"];
  if (!series) throw new Error(`No data for ${symbol}: ${JSON.stringify(data)}`);
  return series as Record<string, Record<string, string>>;
}

async function fetchFXSeries(apiKey: string) {
  const url = `${ALPHA_BASE}?function=FX_DAILY&from_symbol=USD&to_symbol=ILS&apikey=${apiKey}`;
  const res  = await fetch(url);
  const data = await res.json();
  const series = data["Time Series FX (Daily)"];
  if (!series) throw new Error(`No FX data: ${JSON.stringify(data)}`);
  return series as Record<string, Record<string, string>>;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    const apiKey = Deno.env.get("ALPHA_VANTAGE_KEY");
    if (!apiKey) throw new Error("ALPHA_VANTAGE_KEY secret is not set");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // ── Staleness check: skip if we already have today's data ─────────────
    // (today = most recent weekday since markets are closed weekends)
    const today = new Date().toISOString().slice(0, 10);
    const { data: existing } = await supabase
      .from("market_data")
      .select("date")
      .eq("symbol", "SPY")
      .eq("date", today)
      .maybeSingle();

    if (existing) {
      console.log("Data already up to date for", today);
      return json({ ok: true, summary: "already up to date", skipped: true });
    }

    // ── 1. Fetch FX rates ──────────────────────────────────────────────────
    console.log("Fetching USD/ILS FX rates…");
    const fxSeries = await fetchFXSeries(apiKey);
    await sleep(1300);

    // ── 2. Fetch each symbol ───────────────────────────────────────────────
    const allRows: Row[] = [];

    for (const symbol of SYMBOLS) {
      console.log(`Fetching ${symbol}…`);
      const priceSeries = await fetchDailySeries(symbol, apiKey);
      await sleep(1300);

      for (const date of Object.keys(priceSeries)) {
        const closeUSD = Number(priceSeries[date]["4. close"]);
        const fx       = Number(fxSeries[date]?.["4. close"]);
        if (!fx || !closeUSD) continue;
        allRows.push({ symbol, date, close_usd: closeUSD, close_ils: closeUSD * fx });
      }
    }

    if (allRows.length === 0) throw new Error("No rows to insert");

    // ── 3. Delete old + insert fresh (per symbol) ─────────────────────────
    for (const symbol of SYMBOLS) {
      const rows = allRows.filter((r) => r.symbol === symbol);

      const { error: deleteError } = await supabase
        .from("market_data")
        .delete()
        .eq("symbol", symbol);
      if (deleteError) throw new Error(`Delete failed for ${symbol}: ${deleteError.message}`);

      const { error: insertError } = await supabase
        .from("market_data")
        .insert(rows);
      if (insertError) throw new Error(`Insert failed for ${symbol}: ${insertError.message}`);

      console.log(`${symbol}: inserted ${rows.length} rows`);
    }

    const summary = SYMBOLS.map(
      (s) => `${s}: ${allRows.filter((r) => r.symbol === s).length} rows`
    ).join(", ");

    return json({ ok: true, summary });

  } catch (err) {
    console.error("Edge function error:", err);
    return json({ ok: false, error: String(err) }, 500);
  }
});
