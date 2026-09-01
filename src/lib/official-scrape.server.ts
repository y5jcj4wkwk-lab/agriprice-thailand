import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Commodity, MarketPrice, MarketSource, OfficialBoard } from "./types";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

async function fetchText(url: string, timeoutMs = 20000): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7",
        Referer: "https://www.thainr.com/th/?detail=pr-local",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function strip(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function mean(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

const TH_MONTHS: Record<string, string> = {
  มกราคม: "01",
  กุมภาพันธ์: "02",
  มีนาคม: "03",
  เมษายน: "04",
  พฤษภาคม: "05",
  มิถุนายน: "06",
  กรกฎาคม: "07",
  กรกฏาคม: "07",
  สิงหาคม: "08",
  กันยายน: "09",
  ตุลาคม: "10",
  พฤศจิกายน: "11",
  ธันวาคม: "12",
};

function bangkokYearMonth(offsetMonths = 0): { year: string; month: string } {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value]),
  );
  const shifted = new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1 + offsetMonths, 1));
  return {
    year: String(shifted.getUTCFullYear()),
    month: String(shifted.getUTCMonth() + 1).padStart(2, "0"),
  };
}

async function fetchRubberHtml(): Promise<string | null> {
  const months = [0, -1].map((offset) => {
    const { year, month } = bangkokYearMonth(offset);
    return `https://www.thainr.com/th/?detail=pr-local&selectMonth=${month}&selectY=${year}`;
  });
  const pages = await Promise.all(months.map((url) => fetchText(url)));
  const joined = pages.filter(Boolean).join("\n");
  return joined.length > 0 ? joined : null;
}

function parseThaiDate(text: string): string | null {
  const m = text.match(
    /(\d{1,2})\s*(มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|กรกฏาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม)\s*(\d{4})/,
  );
  if (!m) return null;
  const year = Number(m[3]) > 2400 ? Number(m[3]) - 543 : Number(m[3]);
  const month = TH_MONTHS[m[2] ?? ""];
  if (!month) return null;
  return `${year}-${month}-${String(m[1]).padStart(2, "0")}`;
}

export const COMMODITIES: Commodity[] = [
  {
    id: "cmd-rice-hommali",
    code: "rice-hommali",
    name_th: "ข้าวหอมมะลิไทย (ข้าวสาร FOB)",
    name_en: "Thai Hom Mali — milled FOB",
    category: "Rice",
    standard_unit: "บาท/ตัน",
    is_active: true,
  },
  {
    id: "cmd-rice-white",
    code: "rice-white",
    name_th: "ข้าวขาว 5% (ข้าวสาร FOB)",
    name_en: "White Rice 5% — milled FOB",
    category: "Rice",
    standard_unit: "บาท/ตัน",
    is_active: true,
  },
  {
    id: "cmd-rice-sticky",
    code: "rice-sticky",
    name_th: "ข้าวเหนียวขาว 10% (ข้าวสาร FOB)",
    name_en: "Glutinous Rice 10% — milled FOB",
    category: "Rice",
    standard_unit: "บาท/ตัน",
    is_active: true,
  },
  {
    id: "cmd-rubber-rss3",
    code: "rubber-rss3",
    name_th: "ยางแผ่นดิบ",
    name_en: "Unsmoked Sheet (local TRA)",
    category: "Rubber",
    standard_unit: "บาท/กก.",
    is_active: true,
  },
  {
    id: "cmd-rubber-latex",
    code: "rubber-latex",
    name_th: "น้ำยางสด",
    name_en: "Fresh Latex (TRA reference)",
    category: "Rubber",
    standard_unit: "บาท/กก.",
    is_active: true,
  },
  {
    id: "cmd-palm-ffb",
    code: "palm-ffb",
    name_th: "ผลปาล์มน้ำมัน",
    name_en: "Oil Palm FFB",
    category: "Palm",
    standard_unit: "บาท/กก.",
    is_active: true,
  },
  {
    id: "cmd-cassava-root",
    code: "cassava-root",
    name_th: "หัวมันสำปะหลังสด",
    name_en: "Fresh Cassava Root (30% starch)",
    category: "Cassava",
    standard_unit: "บาท/กก.",
    is_active: true,
  },
  {
    id: "cmd-corn-feed",
    code: "corn-feed",
    name_th: "ข้าวโพดเลี้ยงสัตว์",
    name_en: "Feed Corn (factory)",
    category: "Corn",
    standard_unit: "บาท/กก.",
    is_active: true,
  },
];

export const SOURCES: MarketSource[] = [
  {
    id: "src-trea",
    name: "สมาคมผู้ส่งออกข้าวไทย (FOB กรุงเทพ)",
    source_type: "TREA",
    province: "กรุงเทพมหานคร",
    region: "Central",
    latitude: 13.7211,
    longitude: 100.543,
  },
  {
    id: "src-songkhla",
    name: "ตลาดท้องถิ่นหาดใหญ่",
    source_type: "TRA",
    province: "สงขลา",
    region: "South",
    latitude: 7.0086,
    longitude: 100.4747,
  },
  {
    id: "src-surat",
    name: "ตลาดท้องถิ่นสุราษฎร์ธานี",
    source_type: "TRA",
    province: "สุราษฎร์ธานี",
    region: "South",
    latitude: 9.1401,
    longitude: 99.3331,
  },
  {
    id: "src-trang",
    name: "ตลาดท้องถิ่นตรัง",
    source_type: "TRA",
    province: "ตรัง",
    region: "South",
    latitude: 7.5594,
    longitude: 99.6111,
  },
  {
    id: "src-phuket",
    name: "ตลาดท้องถิ่นภูเก็ต",
    source_type: "TRA",
    province: "ภูเก็ต",
    region: "South",
    latitude: 7.8804,
    longitude: 98.3923,
  },
  {
    id: "src-bangna",
    name: "ซีพี บางนา",
    source_type: "TMTPA",
    province: "สมุทรปราการ",
    region: "Central",
    latitude: 13.5965,
    longitude: 100.704,
  },
  {
    id: "src-sriracha",
    name: "ซีพี ศรีราชา",
    source_type: "TMTPA",
    province: "ชลบุรี",
    region: "Central",
    latitude: 13.174,
    longitude: 100.928,
  },
  {
    id: "src-ratchaburi",
    name: "ซีพี ราชบุรี",
    source_type: "TMTPA",
    province: "ราชบุรี",
    region: "Central",
    latitude: 13.5282,
    longitude: 99.8134,
  },
  {
    id: "src-tharuea",
    name: "ซีพี ท่าเรือ",
    source_type: "TMTPA",
    province: "พระนครศรีอยุธยา",
    region: "Central",
    latitude: 14.567,
    longitude: 100.725,
  },
  {
    id: "src-korat",
    name: "ซีพี นครราชสีมา",
    source_type: "TMTPA",
    province: "นครราชสีมา",
    region: "Northeast",
    latitude: 14.9799,
    longitude: 102.0978,
  },
  {
    id: "src-chumphon",
    name: "ราคารับซื้อผลปาล์ม (สศก.)",
    source_type: "OAE",
    province: "ชุมพร",
    region: "South",
    latitude: 10.493,
    longitude: 99.18,
  },
  {
    id: "src-cassava",
    name: "โรงแป้งนครราชสีมา (เชื้อแป้ง 30%)",
    source_type: "NETTA",
    province: "นครราชสีมา",
    region: "Northeast",
    latitude: 14.93,
    longitude: 102.1,
  },
];

/** Last verified official prints — used only if a live scrape is down. */
const FALLBACK = {
  riceUsd: {
    dates: ["2026-07-22", "2026-07-30", "2026-08-13", "2026-08-19", "2026-08-26"],
    fxSell: [33.9161, 33.7199, 33.2647, 33.2885, 32.8734],
    hommali: [1184, 1192, 1195, 1177, 1176],
    white: [462, 465, 466, 471, 477],
    sticky: [793, 798, 810, 839, 849],
  },
  rubber: [
    { date: "2026-08-24", hatyai: 81, trang: 82, phuket: 83, surat: 82.5, latex: 74.5 },
    { date: "2026-08-25", hatyai: 82, trang: 82, phuket: 83, surat: 83, latex: 75.6 },
    { date: "2026-08-26", hatyai: 82, trang: 82, phuket: 82.5, surat: 82.5, latex: 76 },
    { date: "2026-08-27", hatyai: 82, trang: 82, phuket: 82, surat: 82, latex: 76.8 },
    { date: "2026-08-28", hatyai: 81, trang: 82, phuket: 82, surat: 82, latex: 77 },
  ],
  corn: [
    {
      date: "2026-08-27",
      plants: [
        { sourceId: "src-bangna", avg: 9.9 },
        { sourceId: "src-sriracha", avg: 10.0 },
        { sourceId: "src-ratchaburi", avg: 9.8 },
        { sourceId: "src-tharuea", avg: 9.7 },
        { sourceId: "src-korat", avg: 9.85 },
      ],
    },
    {
      date: "2026-08-28",
      plants: [
        { sourceId: "src-bangna", avg: 9.85 },
        { sourceId: "src-sriracha", avg: 10.0 },
        { sourceId: "src-ratchaburi", avg: 9.8 },
        { sourceId: "src-tharuea", avg: 9.7 },
        { sourceId: "src-korat", avg: 9.85 },
      ],
    },
  ],
  palm: [
    { date: "2026-08-24", avg: 8.45, min: 8.0, max: 9.0 },
    { date: "2026-08-25", avg: 8.47, min: 8.0, max: 9.1 },
    { date: "2026-08-26", avg: 8.4, min: 8.0, max: 9.1 },
    { date: "2026-08-27", avg: 8.38, min: 8.0, max: 9.0 },
    { date: "2026-08-28", avg: 8.37, min: 8.0, max: 8.9 },
  ],
  cassava: [{ date: "2026-08-28", avg: 4.35, min: 3.75, max: 4.8 }],
};

type RiceSeries = typeof FALLBACK.riceUsd;
type RubberDay = (typeof FALLBACK.rubber)[number];
type CornDay = (typeof FALLBACK.corn)[number];
type RangeDay = { date: string; avg: number; min: number; max: number };

function parseRice(html: string | null): RiceSeries | null {
  if (!html) return null;
  const text = strip(html);
  const dateHits = [...text.matchAll(/(\d{1,2})\s+(Jul|Aug|Sep|Oct)\s+2026/g)];
  const months: Record<string, string> = { Jul: "07", Aug: "08", Sep: "09", Oct: "10" };
  const dates: string[] = [];
  for (const m of dateHits) {
    const iso = `2026-${months[m[2] ?? ""]}-${String(m[1]).padStart(2, "0")}`;
    if (!dates.includes(iso) && months[m[2] ?? ""]) dates.push(iso);
  }
  const takeRow = (label: string) => {
    const idx = text.indexOf(label);
    if (idx < 0) return null;
    const slice = text.slice(idx, idx + 220);
    const nums = [...slice.matchAll(/\b(\d{3,4})\b/g)].map((x) => Number(x[1]));
    return nums.slice(0, 5);
  };
  const fxIdx = text.indexOf("Average Selling Rates");
  const fxNums =
    fxIdx >= 0
      ? [...text.slice(fxIdx, fxIdx + 180).matchAll(/(\d+\.\d{4})/g)].map((x) => Number(x[1]))
      : [];
  const hommali = takeRow("68/69") ?? takeRow("2025/26");
  const white = takeRow("White Rice 5%");
  const sticky = takeRow("White Glutinous Rice 10%");
  if (
    dates.length >= 4 &&
    hommali &&
    hommali.length >= 4 &&
    white &&
    sticky &&
    fxNums.length >= 4
  ) {
    return {
      dates: dates.slice(0, 5),
      fxSell: fxNums.slice(0, 5),
      hommali: hommali.slice(0, 5),
      white: white.slice(0, 5),
      sticky: sticky.slice(0, 5),
    };
  }
  return null;
}

function parseRubber(html: string | null): RubberDay[] | null {
  if (!html) return null;
  const rows: RubberDay[] = [];
  const re = /StartDate=(\d{4}-\d{2}-\d{2})[\s\S]*?<\/TD>([\s\S]*?)<\/TR>/gi;
  for (const m of html.matchAll(re)) {
    const date = m[1];
    const chunk = m[2] ?? "";
    const cells = [...chunk.matchAll(/<TD\b([^>]*)>([\s\S]*?)<\/TD>/gi)];
    const visible: number[] = [];
    for (const c of cells) {
      if (/display:\s*none/i.test(c[1] ?? "")) continue;
      const n = Number((c[2] ?? "").replace(/<[^>]+>/g, "").trim());
      if (Number.isFinite(n) && n > 20 && n < 200) visible.push(n);
    }
    if (!date || visible.length < 9) continue;
    rows.push({
      date,
      hatyai: visible[0] ?? 0,
      trang: visible[2] ?? 0,
      phuket: visible[3] ?? 0,
      surat: visible[4] ?? 0,
      latex: visible[8] ?? 0,
    });
  }
  const recent = rows
    .filter((r) => r.date >= "2026-07-01" && r.hatyai > 0 && r.latex > 0)
    .sort((a, b) => a.date.localeCompare(b.date));
  const uniq = new Map<string, RubberDay>();
  for (const r of recent) uniq.set(r.date, r);
  const out = [...uniq.values()];
  return out.length >= 3 ? out : null;
}

const CORN_PLANTS: Array<{ label: string; sourceId: string }> = [
  { label: "ซีพีบางนา", sourceId: "src-bangna" },
  { label: "ซีพีศรีราชา", sourceId: "src-sriracha" },
  { label: "ซีพีราชบุรี", sourceId: "src-ratchaburi" },
  { label: "ซีพีท่าเรือ", sourceId: "src-tharuea" },
  { label: "ซีพีโคราช", sourceId: "src-korat" },
];

function parseCorn(html: string | null, date: string): CornDay | null {
  if (!html) return null;
  const text = strip(html);
  const plants: CornDay["plants"] = [];
  for (const plant of CORN_PLANTS) {
    const m = text.match(new RegExp(plant.label + "[^\\d]{0,20}(\\d+\\.\\d{1,2})"));
    if (m) plants.push({ sourceId: plant.sourceId, avg: Number(m[1]) });
  }
  if (plants.length < 3) return null;
  return { date, plants };
}

function parseTmtpaListing(html: string | null): Array<{ id: string; date: string }> {
  if (!html) return [];
  const found: Array<{ id: string; date: string }> = [];
  const re =
    /id=(\d+)(?::[^"'"]*)?[^>]*>\s*ราคาสินค้าเกษตร\s*(\d{1,2})\s*([ก-๙]+)\s*(\d{4})/g;
  for (const m of html.matchAll(re)) {
    const date = parseThaiDate(`${m[2]} ${m[3]} ${m[4]}`);
    if (!date || !m[1]) continue;
    if (!found.some((x) => x.id === m[1])) found.push({ id: m[1], date });
  }
  return found.sort((a, b) => b.date.localeCompare(a.date));
}

function parsePalm(html: string | null): RangeDay[] | null {
  if (!html) return null;
  const m = html.match(/rows:\s*(\[[\s\S]*?\])/);
  if (!m?.[1]) return null;
  try {
    const rows = JSON.parse(m[1]) as Array<{
      date: string;
      minPrice: number;
      avgPrice: number;
      maxPrice: number;
      estimated?: boolean;
    }>;
    const days = rows
      .filter((r) => r && !r.estimated && r.date && r.avgPrice > 0)
      .map((r) => ({
        date: r.date,
        avg: r.avgPrice,
        min: r.minPrice,
        max: r.maxPrice,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
    return days.length >= 3 ? days : null;
  } catch {
    return null;
  }
}

function parseCassava(html: string | null): RangeDay[] | null {
  if (!html) return null;
  const blocks = [
    ...html.matchAll(
      /<h2>[\s\S]*?วันที่\s+(\d{1,2})\s+([ก-๙]+)\s+(\d{4})[\s\S]*?(<table[\s\S]*?<\/table>)/gi,
    ),
  ];
  const days: RangeDay[] = [];
  for (const b of blocks) {
    const date = parseThaiDate(`${b[1]} ${b[2]} ${b[3]}`);
    const table = b[4] ?? "";
    if (!date || !/เชื้อแป้ง 30%/.test(table) && !/เชื้อแป้ง\s*30%/.test(table)) {
      if (!date) continue;
    }
    const rows = [...table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];
    const lows: number[] = [];
    const highs: number[] = [];
    const mids: number[] = [];
    for (const row of rows) {
      const inner = row[1] ?? "";
      if (/อำเภอ|เชื้อแป้ง|กำลังการผลิต/.test(inner)) continue;
      const cells = [...inner.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map((c) =>
        strip(c[1] ?? ""),
      );
      if (cells.length < 2) continue;
      const priceCell = cells[1] ?? "";
      const nums = [...priceCell.matchAll(/(\d+\.\d{1,2})/g)].map((x) => Number(x[1]));
      if (nums.length === 0) continue;
      const lo = nums[0] ?? 0;
      const hi = nums[1] ?? lo;
      if (lo < 2 || hi > 12) continue;
      lows.push(lo);
      highs.push(hi);
      mids.push((lo + hi) / 2);
    }
    if (mids.length >= 3) {
      days.push({
        date,
        avg: round2(mean(mids)),
        min: round2(Math.min(...lows)),
        max: round2(Math.max(...highs)),
      });
    }
  }
  const uniq = new Map<string, RangeDay>();
  for (const d of days) uniq.set(d.date, d);
  const out = [...uniq.values()].sort((a, b) => a.date.localeCompare(b.date));
  return out.length >= 1 ? out : null;
}

function row(
  id: string,
  commodityId: string,
  sourceId: string,
  date: string,
  avg: number,
  unit: string,
  min?: number,
  max?: number,
): MarketPrice {
  return {
    id,
    commodity_id: commodityId,
    source_id: sourceId,
    price_date: date,
    min_price: round2(min ?? avg),
    max_price: round2(max ?? avg),
    avg_price: round2(avg),
    unit,
    status: "official",
  };
}

function loadPreviousBoard(): OfficialBoard | null {
  try {
    const file = join(process.cwd(), "public/data/official-board.json");
    if (!existsSync(file)) return null;
    return JSON.parse(readFileSync(file, "utf8")) as OfficialBoard;
  } catch {
    return null;
  }
}

function maxDate(prices: MarketPrice[], commodityId: string): string {
  return prices
    .filter((p) => p.commodity_id === commodityId)
    .reduce((max, p) => (p.price_date > max ? p.price_date : max), "");
}

/** Never let a thin / fallback scrape wipe a newer print we already published. */
function mergeWithPrevious(fresh: MarketPrice[], previous: MarketPrice[] | undefined): MarketPrice[] {
  if (!previous?.length) return fresh;
  const ids = new Set([...fresh, ...previous].map((p) => p.commodity_id));
  const out: MarketPrice[] = [];
  for (const id of ids) {
    const a = fresh.filter((p) => p.commodity_id === id);
    const b = previous.filter((p) => p.commodity_id === id);
    out.push(...(maxDate(b, id) > maxDate(a, id) ? b : a.length ? a : b));
  }
  return out;
}

let cache: { at: number; board: OfficialBoard } | null = null;

export async function scrapeOfficialBoard(): Promise<OfficialBoard> {
  if (cache && Date.now() - cache.at < 10 * 60 * 1000) return cache.board;

  const notes: string[] = [];
  const used = new Set<string>();
  let live = false;

  const [riceHtml, rubberHtml, cornListHtml, palmHtml, cassavaHtml] = await Promise.all([
    fetchText("http://www.thairiceexporters.or.th/price.htm"),
    fetchRubberHtml(),
    fetchText(
      "https://www.thaimaizeandproduce.org/index.php?option=com_content&view=category&id=14&Itemid=284",
    ),
    fetchText(
      "https://rakakaset.com/%E0%B8%9B%E0%B8%B2%E0%B8%A5%E0%B9%8C%E0%B8%A1%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%A1%E0%B8%B1%E0%B8%99/",
    ),
    fetchText("https://www.nettathai.org/2012-02-06-06-49-09.html"),
  ]);

  const rice = parseRice(riceHtml) ?? FALLBACK.riceUsd;
  if (riceHtml && parseRice(riceHtml)) {
    live = true;
    used.add("สมาคมผู้ส่งออกข้าวไทย");
  } else {
    used.add("สมาคมผู้ส่งออกข้าวไทย");
    notes.push("ข้าว: ใช้ชุดราคา FOB ล่าสุดที่ตรวจสอบได้ หากหน้าเว็บสมาคมไม่ตอบ");
  }
  notes.push(
    "ข้าวเป็นราคาข้าวสารส่งออก FOB กรุงเทพ (ดอลลาร์/ตัน × อัตราขายบาท ธปท.) ไม่ใช่ราคาข้าวเปลือกที่นา",
  );

  const rubber = parseRubber(rubberHtml) ?? FALLBACK.rubber;
  if (rubberHtml && parseRubber(rubberHtml)) {
    live = true;
    used.add("สมาคมยางพาราไทย");
  } else {
    used.add("สมาคมยางพาราไทย");
    notes.push("ยาง: ใช้ราคาตลาดท้องถิ่นล่าสุดที่ตรวจสอบได้ หากหน้าเว็บสมาคมไม่ตอบ");
  }
  notes.push("น้ำยางอ้างอิงคอลัมน์น้ำยางของสมาคมยางพาราไทย (* สมาคมน้ำยางข้นไทย)");

  const listing = parseTmtpaListing(cornListHtml);
  const cornTargets =
    listing.length > 0
      ? listing.slice(0, 4)
      : [
          { id: "3566", date: "2026-08-28" },
          { id: "3565", date: "2026-08-27" },
          { id: "3561", date: "2026-08-26" },
        ];
  const cornPages = await Promise.all(
    cornTargets.map(async (item) => {
      const html = await fetchText(
        `https://www.thaimaizeandproduce.org/index.php?option=com_content&view=article&id=${item.id}&catid=14&Itemid=284`,
      );
      return parseCorn(html, item.date);
    }),
  );
  let cornDays = cornPages.filter((d): d is CornDay => Boolean(d));
  if (cornDays.length > 0) {
    live = true;
    used.add("สมาคมพ่อค้าข้าวโพดและพืชพันธุ์ไทย");
  } else {
    cornDays = FALLBACK.corn;
    used.add("สมาคมพ่อค้าข้าวโพดและพืชพันธุ์ไทย");
    notes.push("ข้าวโพด: ใช้ราคาโรงงานล่าสุดที่ตรวจสอบได้");
  }

  const palm = parsePalm(palmHtml) ?? FALLBACK.palm;
  if (palmHtml && parsePalm(palmHtml)) {
    live = true;
    used.add("สำนักงานเศรษฐกิจการเกษตร (ผ่านราคาเกษตรไทย)");
  } else {
    used.add("สำนักงานเศรษฐกิจการเกษตร");
    notes.push("ปาล์ม: หน้า DIT รายวันไม่เปิด — ใช้ราคารับซื้อล่าสุดที่อ้างอิง สศก.");
  }
  notes.push("ผลปาล์มเป็นราคารับซื้อทะลายสดอ้างอิง สศก. ไม่ใช่ราคาน้ำมันปาล์มดิบ");

  const cassava = parseCassava(cassavaHtml) ?? FALLBACK.cassava;
  if (cassavaHtml && parseCassava(cassavaHtml)) {
    live = true;
    used.add("สมาคมโรงงานผู้ผลิตมันสำปะหลังภาคตะวันออกเฉียงเหนือ");
  } else {
    used.add("สมาคมโรงงานผู้ผลิตมันสำปะหลังภาคตะวันออกเฉียงเหนือ");
    notes.push("มันสำปะหลัง: ใช้ราคารับซื้อโรงแป้งนครราชสีมาล่าสุดที่ตรวจสอบได้");
  }

  const prices: MarketPrice[] = [];
  let n = 0;

  rice.dates.forEach((date, i) => {
    const fx = rice.fxSell[i] ?? 33;
    prices.push(
      row(`px-${++n}`, "cmd-rice-hommali", "src-trea", date, (rice.hommali[i] ?? 0) * fx, "บาท/ตัน"),
    );
    prices.push(
      row(`px-${++n}`, "cmd-rice-white", "src-trea", date, (rice.white[i] ?? 0) * fx, "บาท/ตัน"),
    );
    prices.push(
      row(`px-${++n}`, "cmd-rice-sticky", "src-trea", date, (rice.sticky[i] ?? 0) * fx, "บาท/ตัน"),
    );
  });

  for (const r of rubber) {
    prices.push(row(`px-${++n}`, "cmd-rubber-rss3", "src-songkhla", r.date, r.hatyai, "บาท/กก."));
    prices.push(row(`px-${++n}`, "cmd-rubber-rss3", "src-surat", r.date, r.surat, "บาท/กก."));
    prices.push(row(`px-${++n}`, "cmd-rubber-rss3", "src-trang", r.date, r.trang, "บาท/กก."));
    prices.push(row(`px-${++n}`, "cmd-rubber-rss3", "src-phuket", r.date, r.phuket, "บาท/กก."));
    prices.push(row(`px-${++n}`, "cmd-rubber-latex", "src-songkhla", r.date, r.latex, "บาท/กก."));
  }

  for (const c of cornDays) {
    for (const p of c.plants) {
      prices.push(row(`px-${++n}`, "cmd-corn-feed", p.sourceId, c.date, p.avg, "บาท/กก."));
    }
  }

  for (const p of palm) {
    prices.push(
      row(`px-${++n}`, "cmd-palm-ffb", "src-chumphon", p.date, p.avg, "บาท/กก.", p.min, p.max),
    );
  }

  for (const c of cassava) {
    prices.push(
      row(
        `px-${++n}`,
        "cmd-cassava-root",
        "src-cassava",
        c.date,
        c.avg,
        "บาท/กก.",
        c.min,
        c.max,
      ),
    );
  }

  const previous = loadPreviousBoard();
  const merged = mergeWithPrevious(prices, previous?.prices);
  if (merged !== prices && previous) {
    const rubberPrev = maxDate(previous.prices, "cmd-rubber-rss3");
    const rubberNow = maxDate(prices, "cmd-rubber-rss3");
    if (rubberPrev > rubberNow) {
      notes.push(`ยาง: ตารางเดือนปัจจุบันยังว่าง — คงราคาประกาศล่าสุด ${rubberPrev}`);
    }
  }

  const asOf = merged.reduce((max, p) => (p.price_date > max ? p.price_date : max), "2026-08-26");
  const board: OfficialBoard = {
    meta: {
      asOf,
      scrapedAt: new Date().toISOString(),
      live,
      sources: [...used],
      notes,
    },
    commodities: COMMODITIES,
    sources: SOURCES,
    prices: merged,
  };
  cache = { at: Date.now(), board };
  return board;
}
