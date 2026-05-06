// supabase/functions/fetch-market-data/index.ts
// Deploy with: npx supabase functions deploy fetch-market-data
//
// Required secrets (set via Supabase dashboard → Edge Functions → Secrets,
// or: npx supabase secrets set ALPHA_VANTAGE_KEY=your_key):
//   ALPHA_VANTAGE_KEY   – your Alpha Vantage API key
//   SUPABASE_URL        – auto-provided by Supabase runtime
//   SUPABASE_SERVICE_ROLE_KEY – auto-provided by Supabase runtime

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALPHA_BASE = "https://www.alphavantage.co/query";
const SYMBOLS    = ["SPY", "QQQ"] as const;

type Row = {
  symbol:    string;
  date:      string;
  close_usd: number;
  close_ils: number;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchDailySeries(symbol: string, apiKey: string) {
  const url = `${ALPHA_BASE}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
  const res  = await fetch(url);
  const json = await res.json();

  const series = json["Time Series (Daily)"];
  if (!series) throw new Error(`No data for ${symbol}: ${JSON.stringify(json)}`);
  return series as Record<string, Record<string, string>>;
}

async function fetchFXSeries(apiKey: string) {
  const url = `${ALPHA_BASE}?function=FX_DAILY&from_symbol=USD&to_symbol=ILS&apikey=${apiKey}`;
  const res  = await fetch(url);
  const json = await res.json();

  const series = json["Time Series FX (Daily)"];
  if (!series) throw new Error(`No FX data: ${JSON.stringify(json)}`);
  return series as Record<string, Record<string, string>>;
}

Deno.serve(async (_req) => {
  try {
    const apiKey = Deno.env.get("ALPHA_VANTAGE_KEY");
    if (!apiKey) throw new Error("ALPHA_VANTAGE_KEY secret is not set");

    // Use service role so we can delete + insert (bypasses RLS)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // ── 1. Fetch FX rates ──────────────────────────────────────────────────
    console.log("Fetching USD/ILS FX rates…");
    const fxSeries = await fetchFXSeries(apiKey);
    await sleep(1300); // respect Alpha Vantage 5 req/min on free tier

    // ── 2. Fetch each symbol and build rows ───────────────────────────────
    const allRows: Row[] = [];

    for (const symbol of SYMBOLS) {
      console.log(`Fetching ${symbol}…`);
      const priceSeries = await fetchDailySeries(symbol, apiKey);
      await sleep(1300);

      for (const date of Object.keys(priceSeries)) {
        const closeUSD = Number(priceSeries[date]["4. close"]);
        const fx       = Number(fxSeries[date]?.["4. close"]);
        if (!fx || !closeUSD) continue;

        allRows.push({
          symbol,
          date,
          close_usd: closeUSD,
          close_ils: closeUSD * fx,
        });
      }

      console.log(`${symbol}: ${allRows.filter(r => r.symbol === symbol).length} rows built`);
    }

    if (allRows.length === 0) throw new Error("No rows to insert");

    // ── 3. Delete old data, insert fresh rows (per symbol) ────────────────
    for (const symbol of SYMBOLS) {
      const rows = allRows.filter((r) => r.symbol === symbol);

      console.log(`Deleting old ${symbol} rows…`);
      const { error: deleteError } = await supabase
        .from("market_data")
        .delete()
        .eq("symbol", symbol);

      if (deleteError) throw new Error(`Delete failed for ${symbol}: ${deleteError.message}`);

      console.log(`Inserting ${rows.length} rows for ${symbol}…`);
      const { error: insertError } = await supabase
        .from("market_data")
        .insert(rows);

      if (insertError) throw new Error(`Insert failed for ${symbol}: ${insertError.message}`);
    }

    const summary = SYMBOLS.map(
      (s) => `${s}: ${allRows.filter((r) => r.symbol === s).length} rows`
    ).join(", ");

    console.log(`Done! ${summary}`);
    return new Response(JSON.stringify({ ok: true, summary }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ ok: false, error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
