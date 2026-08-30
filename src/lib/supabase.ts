import type { AiMarketInsight, Commodity, MarketPrice, MarketSource } from "./types";
import {
  aiMarketInsights,
  commodities as mockCommodities,
  marketPrices as mockPrices,
  marketSources as mockSources,
} from "./mock-data";

type Env = Record<string, string | undefined>;

function readEnv() {
  const env = import.meta.env as Env;
  const url =
    env.VITE_SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL ?? env.VITE_PUBLIC_SUPABASE_URL;
  const key =
    env.VITE_SUPABASE_ANON_KEY ??
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    env.VITE_PUBLIC_SUPABASE_ANON_KEY;
  return { url: url?.trim() || "", key: key?.trim() || "" };
}

const { url: SUPABASE_URL, key: SUPABASE_KEY } = readEnv();

export const isMockData = !SUPABASE_URL || !SUPABASE_KEY;

async function rest<T>(table: string, query: string): Promise<T[] | null> {
  if (isMockData) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as T[];
  } catch {
    return null;
  }
}

export async function fetchCommodities(): Promise<Commodity[]> {
  const rows = await rest<Commodity>("commodities", "is_active=eq.true&order=name_th.asc");
  return rows && rows.length > 0 ? rows : mockCommodities.filter((c) => c.is_active);
}

export async function fetchMarketSources(): Promise<MarketSource[]> {
  const rows = await rest<MarketSource>("market_sources", "order=province.asc");
  return rows && rows.length > 0 ? rows : mockSources;
}

export async function fetchMarketPrices(filters: {
  commodityId?: string;
  sourceId?: string;
  from?: string;
  to?: string;
  date?: string;
}): Promise<MarketPrice[]> {
  const qs: string[] = ["order=price_date.asc"];
  if (filters.commodityId) qs.push(`commodity_id=eq.${filters.commodityId}`);
  if (filters.sourceId) qs.push(`source_id=eq.${filters.sourceId}`);
  if (filters.date) qs.push(`price_date=eq.${filters.date}`);
  if (filters.from) qs.push(`price_date=gte.${filters.from}`);
  if (filters.to) qs.push(`price_date=lte.${filters.to}`);
  const rows = await rest<MarketPrice>("market_prices", qs.join("&"));
  if (rows && rows.length > 0) return rows;
  return mockPrices.filter((p) => {
    if (filters.commodityId && p.commodity_id !== filters.commodityId) return false;
    if (filters.sourceId && p.source_id !== filters.sourceId) return false;
    if (filters.date && p.price_date !== filters.date) return false;
    if (filters.from && p.price_date < filters.from) return false;
    if (filters.to && p.price_date > filters.to) return false;
    return true;
  });
}

export async function fetchInsights(filters: {
  commodityId?: string;
  date?: string;
}): Promise<AiMarketInsight[]> {
  const qs: string[] = ["order=insight_date.desc"];
  if (filters.commodityId) qs.push(`commodity_id=eq.${filters.commodityId}`);
  if (filters.date) qs.push(`insight_date=eq.${filters.date}`);
  const rows = await rest<AiMarketInsight>("ai_market_insights", qs.join("&"));
  if (rows && rows.length > 0) return rows;
  return aiMarketInsights.filter((i) => {
    if (filters.commodityId && i.commodity_id !== filters.commodityId) return false;
    if (filters.date && i.insight_date !== filters.date) return false;
    return true;
  });
}
