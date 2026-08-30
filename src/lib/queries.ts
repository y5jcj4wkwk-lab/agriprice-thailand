import { loadOfficialBoard } from "./board";
import { formatBaht } from "./format";
import type {
  AiMarketInsight,
  Commodity,
  CommoditySnapshot,
  DailySeriesPoint,
  MarketPrice,
  MarketSource,
  OfficialBoard,
  OfficialMeta,
  TrendDirection,
} from "./types";

export type DashboardPayload = {
  date: string;
  dates: string[];
  snapshots: CommoditySnapshot[];
  sources: MarketSource[];
  meta: OfficialMeta;
};

export type CommodityDetailPayload = {
  commodity: Commodity;
  date: string;
  dates: string[];
  snapshot: CommoditySnapshot;
  series: DailySeriesPoint[];
  insight: AiMarketInsight | null;
  markets: Array<{
    source: MarketSource;
    price: MarketPrice;
    prev: MarketPrice | null;
  }>;
  meta: OfficialMeta;
};

export type MapPayload = {
  date: string;
  dates: string[];
  sources: MarketSource[];
  prices: MarketPrice[];
  commodities: Commodity[];
  meta: OfficialMeta;
};

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

function previousDate(dates: string[], current: string): string | null {
  const i = dates.indexOf(current);
  if (i <= 0) return null;
  return dates[i - 1] ?? null;
}

function availableDates(prices: MarketPrice[]): string[] {
  return [...new Set(prices.map((p) => p.price_date))].sort();
}

function pickDate(dates: string[], requested?: string): string {
  if (requested && dates.includes(requested)) return requested;
  if (requested) {
    const earlier = dates.filter((d) => d <= requested);
    if (earlier.length) return earlier[earlier.length - 1] ?? dates[dates.length - 1] ?? requested;
  }
  return dates[dates.length - 1] ?? requested ?? "";
}

function datesForCommodity(prices: MarketPrice[], commodityId: string): string[] {
  return availableDates(prices.filter((p) => p.commodity_id === commodityId));
}

function latestOnOrBefore(dates: string[], selected: string): string | null {
  const hit = dates.filter((d) => d <= selected);
  return hit[hit.length - 1] ?? null;
}

function dailySeries(prices: MarketPrice[]): DailySeriesPoint[] {
  const byDate = new Map<string, MarketPrice[]>();
  for (const p of prices) {
    const list = byDate.get(p.price_date) ?? [];
    list.push(p);
    byDate.set(p.price_date, list);
  }
  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, rows]) => ({
      date,
      avg: mean(rows.map((r) => r.avg_price)),
      min: Math.min(...rows.map((r) => r.min_price)),
      max: Math.max(...rows.map((r) => r.max_price)),
    }));
}

function sourceLabelFor(commodity: Commodity, prices: MarketPrice[], sources: MarketSource[]): string {
  const types = new Set(
    prices
      .map((p) => sources.find((s) => s.id === p.source_id)?.source_type)
      .filter((t): t is string => Boolean(t)),
  );
  const labels: Record<string, string> = {
    TREA: "TREA FOB",
    TRA: "TRA",
    TMTPA: "TMTPA",
    OAE: "สศก.",
    NETTA: "NETTA",
    NABC: "NABC",
    OIE: "OIE",
  };
  if (types.size === 0) return "ราคาทางการ";
  return [...types].map((t) => labels[t] ?? t).join(" · ");
}

function trendOf(values: number[]): TrendDirection {
  if (values.length < 2) return "stable";
  const first = values[0] ?? 0;
  const last = values[values.length - 1] ?? 0;
  if (first === 0) return "stable";
  const pct = (last - first) / first;
  if (pct > 0.008) return "up";
  if (pct < -0.008) return "down";
  return "stable";
}

function insightFor(
  commodity: Commodity,
  series: DailySeriesPoint[],
  asOf: string,
): AiMarketInsight {
  const recent = series.filter((p) => p.date <= asOf).slice(-5);
  const values = recent.map((p) => p.avg);
  const direction = trendOf(values);
  const last = recent[recent.length - 1];
  const first = recent[0];
  const pct =
    first && first.avg !== 0 && last ? ((last.avg - first.avg) / first.avg) * 100 : 0;
  const lastStr = last ? formatBaht(last.avg) : "–";
  const unit = commodity.standard_unit;
  const span = recent.length >= 2 ? `${recent[0]?.date} → ${recent[recent.length - 1]?.date}` : asOf;
  const move =
    direction === "up" ? "ปรับขึ้น" : direction === "down" ? "ปรับลง" : "ทรงตัว";
  const pctStr = `${pct > 0 ? "+" : ""}${pct.toFixed(2)}%`;

  let lines: string[] = [];
  let drivers: string[] = [];
  if (commodity.category === "Rice") {
    lines = [
      `${commodity.name_th} ล่าสุด ${lastStr} ${unit} (${move} ${pctStr} ในช่วง ${span})`,
      "คิดจากราคา FOB ดอลลาร์/ตัน ของสมาคมผู้ส่งออกข้าวไทย คูณอัตราขายบาทของธนาคารแห่งประเทศไทย",
      "ตัวเลขนี้เป็นข้าวสารส่งออก ไม่ใช่ราคาข้าวเปลือกที่นา",
    ];
    drivers = ["ราคา FOB สมาคมผู้ส่งออกข้าวไทย", "อัตราขายบาท ธปท.", "ไม่ใช่ราคาข้าวเปลือก"];
  } else if (commodity.category === "Rubber") {
    lines = [
      `${commodity.name_th} ล่าสุด ${lastStr} ${unit} (${move} ${pctStr} ในช่วง ${span})`,
      "อ้างอิงตารางราคายางตลาดท้องถิ่นของสมาคมยางพาราไทย — ไม่ได้ประมาณราคาต่างจังหวัด",
    ];
    drivers =
      commodity.code === "rubber-latex"
        ? ["คอลัมน์น้ำยาง TRA", "อ้างอิงสมาคมน้ำยางข้นไทย"]
        : ["ยางแผ่นดิบตลาดท้องถิ่น TRA", "หาดใหญ่ สุราษฎร์ฯ ตรัง ภูเก็ต"];
  } else if (commodity.category === "Corn") {
    lines = [
      `ข้าวโพดเลี้ยงสัตว์โรงงาน ล่าสุดเฉลี่ย ${lastStr} ${unit} (${move} ${pctStr})`,
      "ราคารับซื้อโรงงานซีพีตามประกาศสมาคมพ่อค้าข้าวโพดและพืชพันธุ์ไทย",
    ];
    drivers = ["ราคาโรงงาน TMTPA", "ซีพีบางนา ศรีราชา ราชบุรี ท่าเรือ โคราช"];
  } else if (commodity.category === "Palm") {
    lines = [
      `ผลปาล์มน้ำมันล่าสุด ${lastStr} ${unit} ช่วง ${last ? formatBaht(last.min) : "–"}–${last ? formatBaht(last.max) : "–"} (${move} ${pctStr})`,
      "อ้างอิงราคารับซื้อทะลายสดจากข้อมูล สศก. — หน้า DIT รายวันยังไม่เปิด",
    ];
    drivers = ["ราคารับซื้อผลปาล์ม สศก.", "ช่วงต่ำสุด–สูงสุดตามจังหวัด"];
  } else {
    lines = [
      `หัวมันสดเชื้อแป้ง 30% โรงแป้งนครราชสีมา ล่าสุด ${lastStr} ${unit} (${move} ${pctStr})`,
      "อ้างอิงราคารับซื้อของสมาคมโรงงานผู้ผลิตมันสำปะหลังภาคตะวันออกเฉียงเหนือ",
    ];
    drivers = ["โรงแป้งนครราชสีมา NETTA", "เกณฑ์เชื้อแป้ง 30%"];
  }

  const mag = Math.abs(pct) / 100;
  const confidence = Math.round(Math.min(0.92, 0.62 + mag * 3 + (recent.length / 5) * 0.12) * 100) / 100;
  return {
    id: `ai-${commodity.id}-${asOf}`,
    commodity_id: commodity.id,
    insight_date: asOf,
    trend_direction: direction,
    summary_th: lines.join("\n"),
    key_drivers: drivers,
    confidence_score: confidence,
    model_version: "official-series-v1",
  };
}

function snapshotFor(
  commodity: Commodity,
  selected: string,
  prices: MarketPrice[],
  sources: MarketSource[],
): CommoditySnapshot {
  const cmdPrices = prices.filter((p) => p.commodity_id === commodity.id);
  const cmdDates = datesForCommodity(prices, commodity.id);
  const asOfDate = latestOnOrBefore(cmdDates, selected) ?? cmdDates[cmdDates.length - 1] ?? selected;
  const today = cmdPrices.filter((p) => p.price_date === asOfDate);
  const prevIso = previousDate(cmdDates, asOfDate);
  const yesterday = prevIso ? cmdPrices.filter((p) => p.price_date === prevIso) : [];
  const avg = mean(today.map((r) => r.avg_price));
  const prevAvg = yesterday.length ? mean(yesterday.map((r) => r.avg_price)) : null;
  const changePct = prevAvg && prevAvg !== 0 ? ((avg - prevAvg) / prevAvg) * 100 : null;
  const sparkDates = cmdDates.filter((d) => d <= asOfDate).slice(-7);
  const sparkline = sparkDates.map((d) => {
    const rows = cmdPrices.filter((p) => p.price_date === d);
    return mean(rows.map((r) => r.avg_price));
  });
  const series = dailySeries(cmdPrices);
  const insight = insightFor(commodity, series, asOfDate);
  return {
    commodity,
    date: selected,
    asOfDate,
    avg,
    min: today.length ? Math.min(...today.map((r) => r.min_price)) : 0,
    max: today.length ? Math.max(...today.map((r) => r.max_price)) : 0,
    unit: today[0]?.unit ?? commodity.standard_unit,
    changePct,
    sparkline,
    insight,
    status: today[0]?.status ?? "official",
    sourceLabel: sourceLabelFor(commodity, today, sources),
  };
}

async function board(): Promise<OfficialBoard> {
  return loadOfficialBoard();
}

export async function loadDashboard(date?: string): Promise<DashboardPayload> {
  const data = await board();
  const dates = availableDates(data.prices);
  const selected = pickDate(dates, date);
  const snapshots = data.commodities
    .filter((c) => c.is_active)
    .map((c) => snapshotFor(c, selected, data.prices, data.sources));
  return { date: selected, dates, snapshots, sources: data.sources, meta: data.meta };
}

export async function loadCommodityDetail(
  code: string,
  date?: string,
): Promise<CommodityDetailPayload | null> {
  const data = await board();
  const commodity = data.commodities.find((c) => c.code === code);
  if (!commodity) return null;
  const cmdPrices = data.prices.filter((p) => p.commodity_id === commodity.id);
  const dates = datesForCommodity(data.prices, commodity.id);
  const selected = pickDate(dates, date);
  const snap = snapshotFor(commodity, selected, data.prices, data.sources);
  const asOf = snap.asOfDate;
  const prevIso = previousDate(dates, asOf);
  const sourceById = new Map(data.sources.map((s) => [s.id, s]));
  const todayRows = cmdPrices.filter((p) => p.price_date === asOf);
  const markets = todayRows
    .map((price) => {
      const source = sourceById.get(price.source_id);
      if (!source) return null;
      const prev = prevIso
        ? (cmdPrices.find((p) => p.source_id === price.source_id && p.price_date === prevIso) ?? null)
        : null;
      return { source, price, prev };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null)
    .sort((a, b) => a.source.province.localeCompare(b.source.province, "th"));
  return {
    commodity,
    date: selected,
    dates,
    snapshot: snap,
    series: dailySeries(cmdPrices),
    insight: snap.insight,
    markets,
    meta: data.meta,
  };
}

export async function loadMap(date?: string): Promise<MapPayload> {
  const data = await board();
  const dates = availableDates(data.prices);
  const selected = pickDate(dates, date);
  const latest: MarketPrice[] = [];
  for (const source of data.sources) {
    for (const commodity of data.commodities) {
      const rows = data.prices
        .filter(
          (p) =>
            p.source_id === source.id &&
            p.commodity_id === commodity.id &&
            p.price_date <= selected,
        )
        .sort((a, b) => a.price_date.localeCompare(b.price_date));
      const last = rows[rows.length - 1];
      if (last) latest.push(last);
    }
  }
  const activeSourceIds = new Set(latest.map((p) => p.source_id));
  return {
    date: selected,
    dates,
    sources: data.sources.filter((s) => activeSourceIds.has(s.id)),
    commodities: data.commodities,
    prices: latest,
    meta: data.meta,
  };
}
