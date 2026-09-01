export type CommodityCategory = "Rice" | "Rubber" | "Palm" | "Cassava" | "Corn";

export type TrendDirection = "up" | "down" | "stable";

export type Commodity = {
  id: string;
  code: string;
  name_th: string;
  name_en: string;
  category: CommodityCategory;
  standard_unit: string;
  is_active: boolean;
};

export type MarketSource = {
  id: string;
  name: string;
  source_type: string;
  province: string;
  region: string;
  latitude: number;
  longitude: number;
};

export type MarketPrice = {
  id: string;
  commodity_id: string;
  source_id: string;
  price_date: string;
  min_price: number;
  max_price: number;
  avg_price: number;
  unit: string;
  status: string;
};

export type AiMarketInsight = {
  id: string;
  commodity_id: string;
  insight_date: string;
  trend_direction: TrendDirection;
  summary_th: string;
  key_drivers: string[];
  confidence_score: number;
  model_version: string;
};

export type DailySeriesPoint = {
  date: string;
  avg: number;
  min: number;
  max: number;
};

export type OfficialMeta = {
  asOf: string;
  scrapedAt?: string;
  live: boolean;
  sources: string[];
  notes: string[];
};

export type OfficialBoard = {
  meta: OfficialMeta;
  commodities: Commodity[];
  sources: MarketSource[];
  prices: MarketPrice[];
};

export type CommoditySnapshot = {
  commodity: Commodity;
  date: string;
  asOfDate: string;
  avg: number;
  min: number;
  max: number;
  unit: string;
  changePct: number | null;
  sparkline: number[];
  insight: AiMarketInsight | null;
  status: string;
  sourceLabel: string;
};
