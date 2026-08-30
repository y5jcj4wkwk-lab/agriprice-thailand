import type {
  AiMarketInsight,
  Commodity,
  MarketPrice,
  MarketSource,
  TrendDirection,
} from "./types";

const ANCHOR = "2026-08-28";

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function weekdaysInclusive(from: string, to: string): string[] {
  const out: string[] = [];
  const start = Date.parse(`${from}T00:00:00Z`);
  const end = Date.parse(`${to}T00:00:00Z`);
  for (let t = start; t <= end; t += 86_400_000) {
    const dow = new Date(t).getUTCDay();
    if (dow !== 0 && dow !== 6) {
      out.push(new Date(t).toISOString().slice(0, 10));
    }
  }
  return out;
}

export const commodities: Commodity[] = [
  {
    id: "cmd-rice-hommali",
    code: "rice-hommali",
    name_th: "ข้าวหอมมะลิ 105",
    name_en: "Hom Mali 105",
    category: "Rice",
    standard_unit: "บาท/ตัน",
    is_active: true,
  },
  {
    id: "cmd-rice-white",
    code: "rice-white",
    name_th: "ข้าวขาว 5%",
    name_en: "White Rice 5%",
    category: "Rice",
    standard_unit: "บาท/ตัน",
    is_active: true,
  },
  {
    id: "cmd-rice-sticky",
    code: "rice-sticky",
    name_th: "ข้าวเหนียว กข.6",
    name_en: "Sticky Rice RD6",
    category: "Rice",
    standard_unit: "บาท/ตัน",
    is_active: true,
  },
  {
    id: "cmd-rubber-rss3",
    code: "rubber-rss3",
    name_th: "ยางแผ่นรมควัน ชั้น 3",
    name_en: "RSS3",
    category: "Rubber",
    standard_unit: "บาท/กก.",
    is_active: true,
  },
  {
    id: "cmd-rubber-latex",
    code: "rubber-latex",
    name_th: "น้ำยางสด",
    name_en: "Fresh Latex",
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
    name_en: "Fresh Cassava Root",
    category: "Cassava",
    standard_unit: "บาท/กก.",
    is_active: true,
  },
  {
    id: "cmd-corn-feed",
    code: "corn-feed",
    name_th: "ข้าวโพดเลี้ยงสัตว์",
    name_en: "Feed Corn",
    category: "Corn",
    standard_unit: "บาท/กก.",
    is_active: true,
  },
];

export const marketSources: MarketSource[] = [
  {
    id: "src-surat",
    name: "ตลาดกลางยางพารา สุราษฎร์ธานี",
    source_type: "RAOT",
    province: "สุราษฎร์ธานี",
    region: "South",
    latitude: 9.1401,
    longitude: 99.3331,
  },
  {
    id: "src-songkhla",
    name: "ตลาดกลางยางพารา สงขลา",
    source_type: "RAOT",
    province: "สงขลา",
    region: "South",
    latitude: 7.1756,
    longitude: 100.614,
  },
  {
    id: "src-surin",
    name: "ตลาดกลางข้าว สุรินทร์",
    source_type: "DIT",
    province: "สุรินทร์",
    region: "Northeast",
    latitude: 14.8818,
    longitude: 103.4936,
  },
  {
    id: "src-nonthaburi",
    name: "ตลาดกลางสินค้าเกษตร นนทบุรี",
    source_type: "DIT",
    province: "นนทบุรี",
    region: "Central",
    latitude: 13.8591,
    longitude: 100.5217,
  },
  {
    id: "src-taladthai",
    name: "ตลาดไท ปทุมธานี",
    source_type: "MARKET",
    province: "ปทุมธานี",
    region: "Central",
    latitude: 14.0818,
    longitude: 100.6234,
  },
  {
    id: "src-korat",
    name: "ลานมันสำปะหลัง นครราชสีมา",
    source_type: "OAE",
    province: "นครราชสีมา",
    region: "Northeast",
    latitude: 14.9799,
    longitude: 102.0978,
  },
  {
    id: "src-chumphon",
    name: "ลานประมูลปาล์ม ชุมพร",
    source_type: "DIT",
    province: "ชุมพร",
    region: "South",
    latitude: 10.493,
    longitude: 99.18,
  },
  {
    id: "src-sawan",
    name: "ตลาดข้าวโพด นครสวรรค์",
    source_type: "OAE",
    province: "นครสวรรค์",
    region: "North",
    latitude: 15.703,
    longitude: 100.1368,
  },
];

type Spec = {
  commodityId: string;
  sourceId: string;
  base: number;
  bias: number;
  drift: number;
  vol: number;
  unit: string;
};

const SPECS: Spec[] = [
  { commodityId: "cmd-rice-hommali", sourceId: "src-surin", base: 16820, bias: 0.985, drift: 0.075, vol: 0.01, unit: "บาท/ตัน" },
  { commodityId: "cmd-rice-hommali", sourceId: "src-nonthaburi", base: 16820, bias: 1.02, drift: 0.075, vol: 0.009, unit: "บาท/ตัน" },
  { commodityId: "cmd-rice-hommali", sourceId: "src-taladthai", base: 16820, bias: 1.035, drift: 0.075, vol: 0.011, unit: "บาท/ตัน" },
  { commodityId: "cmd-rice-white", sourceId: "src-surin", base: 13180, bias: 0.99, drift: 0.012, vol: 0.007, unit: "บาท/ตัน" },
  { commodityId: "cmd-rice-white", sourceId: "src-nonthaburi", base: 13180, bias: 1.015, drift: 0.012, vol: 0.007, unit: "บาท/ตัน" },
  { commodityId: "cmd-rice-white", sourceId: "src-taladthai", base: 13180, bias: 1.028, drift: 0.012, vol: 0.008, unit: "บาท/ตัน" },
  { commodityId: "cmd-rice-sticky", sourceId: "src-surin", base: 14640, bias: 0.97, drift: -0.045, vol: 0.01, unit: "บาท/ตัน" },
  { commodityId: "cmd-rice-sticky", sourceId: "src-taladthai", base: 14640, bias: 1.02, drift: -0.045, vol: 0.011, unit: "บาท/ตัน" },
  { commodityId: "cmd-rubber-rss3", sourceId: "src-surat", base: 71.8, bias: 1.015, drift: -0.11, vol: 0.016, unit: "บาท/กก." },
  { commodityId: "cmd-rubber-rss3", sourceId: "src-songkhla", base: 71.8, bias: 0.992, drift: -0.11, vol: 0.015, unit: "บาท/กก." },
  { commodityId: "cmd-rubber-latex", sourceId: "src-surat", base: 54.4, bias: 1.01, drift: -0.095, vol: 0.018, unit: "บาท/กก." },
  { commodityId: "cmd-rubber-latex", sourceId: "src-songkhla", base: 54.4, bias: 0.988, drift: -0.095, vol: 0.017, unit: "บาท/กก." },
  { commodityId: "cmd-palm-ffb", sourceId: "src-surat", base: 5.55, bias: 1.02, drift: 0.09, vol: 0.014, unit: "บาท/กก." },
  { commodityId: "cmd-palm-ffb", sourceId: "src-chumphon", base: 5.55, bias: 0.975, drift: 0.09, vol: 0.013, unit: "บาท/กก." },
  { commodityId: "cmd-cassava-root", sourceId: "src-korat", base: 3.02, bias: 0.97, drift: 0.07, vol: 0.012, unit: "บาท/กก." },
  { commodityId: "cmd-cassava-root", sourceId: "src-surin", base: 3.02, bias: 0.99, drift: 0.07, vol: 0.012, unit: "บาท/กก." },
  { commodityId: "cmd-cassava-root", sourceId: "src-taladthai", base: 3.02, bias: 1.04, drift: 0.07, vol: 0.013, unit: "บาท/กก." },
  { commodityId: "cmd-corn-feed", sourceId: "src-sawan", base: 9.28, bias: 0.96, drift: 0.008, vol: 0.01, unit: "บาท/กก." },
  { commodityId: "cmd-corn-feed", sourceId: "src-taladthai", base: 9.28, bias: 1.03, drift: 0.008, vol: 0.01, unit: "บาท/กก." },
  { commodityId: "cmd-corn-feed", sourceId: "src-nonthaburi", base: 9.28, bias: 1.018, drift: 0.008, vol: 0.009, unit: "บาท/กก." },
];

const DATES = weekdaysInclusive("2026-05-29", ANCHOR);

function buildPrices(): MarketPrice[] {
  const rows: MarketPrice[] = [];
  let n = 0;
  for (const spec of SPECS) {
    const rnd = mulberry32(hashCode(spec.commodityId + spec.sourceId));
    let walk = 0;
    DATES.forEach((date, i) => {
      const t = i / Math.max(1, DATES.length - 1);
      walk += (rnd() - 0.48) * spec.vol;
      walk *= 0.86;
      const seasonal = Math.sin(t * Math.PI * 2) * spec.vol * 0.55;
      const avg = spec.base * spec.bias * (1 + spec.drift * t + walk + seasonal);
      const spread = 0.008 + rnd() * 0.018;
      const min = avg * (1 - spread);
      const max = avg * (1 + spread * (0.7 + rnd() * 0.5));
      rows.push({
        id: `px-${(++n).toString(36)}`,
        commodity_id: spec.commodityId,
        source_id: spec.sourceId,
        price_date: date,
        min_price: round2(min),
        max_price: round2(max),
        avg_price: round2(avg),
        unit: spec.unit,
        status: "official",
      });
    });
  }
  return rows;
}

function hashCode(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const marketPrices: MarketPrice[] = buildPrices();

const INSIGHT_COPY: Record<
  string,
  Record<TrendDirection, { summary: string; drivers: string[] }>
> = {
  "cmd-rice-hommali": {
    up: {
      summary:
        "ราคาข้าวหอมมะลิปรับขึ้นต่อเนื่องจากคำสั่งซื้อส่งออกไปจีนและฮ่องกงที่กลับมา\nโรงสีในภาคอีสานเร่งรับซื้อเพื่อส่งมอบสัญญาช่วงไตรมาสสาม\nปริมาณผลผลิตในแปลงนาสุรินทร์–ร้อยเอ็ดต่ำกว่าปีก่อนเล็กน้อยจากฝนทิ้งช่วง",
      drivers: [
        "ความต้องการส่งออกเพิ่มขึ้น",
        "ปริมาณฝนลดลงในพื้นที่เพาะปลูก",
        "สต็อกโรงสีอยู่ในระดับต่ำ",
      ],
    },
    down: {
      summary:
        "ราคาข้าวหอมมะลิอ่อนตัวลงหลังผู้ส่งออกชะลอรับซื้อ\nผลผลิตใหม่เริ่มออกสู่ตลาดในบางจังหวัดอีสานใต้",
      drivers: ["ผลผลิตใหม่เข้าสู่ตลาด", "ผู้ส่งออกชะลอคำสั่งซื้อ"],
    },
    stable: {
      summary: "ราคาข้าวหอมมะลิทรงตัวในกรอบแคบ ผู้ซื้อและผู้ขายรอความชัดเจนของโควตาส่งออก",
      drivers: ["อุปสงค์-อุปทานสมดุล", "ผู้ประกอบการรอดูทิศทางตลาด"],
    },
  },
  "cmd-rice-white": {
    up: {
      summary: "ข้าวขาว 5% ขยับขึ้นตามข้าวหอมมะลิ โรงสีคงราคารับซื้อเพื่อรักษาปริมาณสต็อก",
      drivers: ["ราคาข้าวหอมมะลิหนุน", "ความต้องการในประเทศทรงตัว"],
    },
    down: {
      summary: "ข้าวขาว 5% ปรับลดเล็กน้อยจากปริมาณข้าวในคลังที่ยังสูง",
      drivers: ["สต็อกในประเทศสูง", "การส่งออกแข่งขันกับเวียดนาม"],
    },
    stable: {
      summary:
        "ข้าวขาว 5% เคลื่อนไหวในกรอบแคบ\nคำสั่งซื้อในประเทศจากผู้ประกอบการอาหารยังสม่ำเสมอ\nส่วนต่างกับข้าวหอมมะลิอยู่ในระดับปกติ",
      drivers: ["อุปสงค์ในประเทศคงที่", "สต็อกเพียงพอ", "ส่วนต่างเกรดทรงตัว"],
    },
  },
  "cmd-rice-sticky": {
    up: {
      summary: "ข้าวเหนียวขยับขึ้นจากความต้องการในภาคตะวันออกเฉียงเหนือช่วงเทศกาล",
      drivers: ["อุปสงค์ตามฤดูกาล", "ผลผลิตในนาปีออกช้า"],
    },
    down: {
      summary:
        "ข้าวเหนียว กข.6 อ่อนตัวลงต่อเนื่อง\nผลผลิตในนาน้ำฝนออกสู่ตลาดหนาแน่นกว่าที่คาด\nผู้ค้าชะลอการเก็บสต็อกเพราะสภาพอากาศเอื้อต่อการเก็บรักษาในแปลง",
      drivers: ["ผลผลิตออกสู่ตลาดหนาแน่น", "ผู้ค้าชะลอเก็บสต็อก", "ความต้องการส่งออกลดลง"],
    },
    stable: {
      summary: "ข้าวเหนียวทรงตัว ผู้ซื้อรายใหญ่รอดูปริมาณผลผลิตในรอบถัดไป",
      drivers: ["ตลาดรอข้อมูลผลผลิต"],
    },
  },
  "cmd-rubber-rss3": {
    up: {
      summary: "RSS3 ฟื้นตัวตามราคายางตลาดโลกและค่าเงินบาทที่อ่อนลง",
      drivers: ["ราคายางโลกปรับขึ้น", "ค่าเงินบาทอ่อน"],
    },
    down: {
      summary:
        "ยางแผ่นรมควันชั้น 3 ปรับลดต่อเนื่องจากความต้องการรถยนต์โลกที่ชะลอ\nโรงงานยางล้อในจีนลดปริมาณซื้อล่วงหน้า\nน้ำยางออกสู่ตลาดภาคใต้ปริมาณสูงหลังฝนทิ้งช่วงสิ้นสุด",
      drivers: [
        "อุปสงค์ยางล้อโลกชะลอ",
        "โรงงานจีนลดคำสั่งซื้อ",
        "ปริมาณน้ำยางออกสู่ตลาดสูง",
      ],
    },
    stable: {
      summary: "RSS3 ทรงตัวในกรอบแคบ ตลาดรอดูตัวเลขสต็อกท่าเรือจีน",
      drivers: ["สต็อกท่าเรือทรงตัว", "ค่าเงินบาทแกว่งตัวแคบ"],
    },
  },
  "cmd-rubber-latex": {
    up: {
      summary: "น้ำยางสดขยับตามแผ่นรมควัน ผู้ประกอบการถุงมือยางเริ่มกลับมารับซื้อ",
      drivers: ["โรงงานถุงมือเพิ่มกำลังผลิต", "ราคายางแผ่นหนุน"],
    },
    down: {
      summary:
        "น้ำยางสดอ่อนตัวสอดคล้องกับ RSS3\nโรงงานในสงขลาและสุราษฎร์ฯ รับซื้อในปริมาณจำกัด\nชาวสวนเร่งกรีดหลังฝนทิ้งช่วง ทำให้ปริมาณเข้าตลาดหนาแน่น",
      drivers: ["โรงงานรับซื้อจำกัด", "ปริมาณน้ำยางเข้าตลาดสูง", "ราคายางแผ่นปรับลง"],
    },
    stable: {
      summary: "น้ำยางสดทรงตัว โรงงานรับซื้อตามแผนเดิม",
      drivers: ["กำลังผลิตโรงงานคงที่"],
    },
  },
  "cmd-palm-ffb": {
    up: {
      summary:
        "ผลปาล์มน้ำมันปรับขึ้นต่อเนื่องจากน้ำมันปาล์มดิบในตลาดโลกที่แข็งตัว\nผลผลิตในชุมพร–สุราษฎร์ฯ ออกน้อยกว่าฤดูเดียวกันของปีก่อน\nโรงสกัดแย่งรับซื้อเพื่อรักษาอัตรากำลังการผลิต",
      drivers: [
        "ราคาน้ำมันปาล์มดิบโลกปรับขึ้น",
        "ผลผลิตในภาคใต้ลดลง",
        "โรงสกัดเร่งรับซื้อ",
      ],
    },
    down: {
      summary: "ผลปาล์มอ่อนตัวตามราคาน้ำมันปาล์มดิบที่ปรับลงในตลาดภูมิภาค",
      drivers: ["สต็อก CPO สูง", "ผลผลิตออกสู่ตลาดมากขึ้น"],
    },
    stable: {
      summary: "ผลปาล์มทรงตัว โรงสกัดรักษาราคารับซื้อเพื่อรักษาฐานเกษตรกร",
      drivers: ["อุปทานสมดุล", "นโยบายราคาอ้างอิงทรงตัว"],
    },
  },
  "cmd-cassava-root": {
    up: {
      summary:
        "หัวมันสำปะหลังสดปรับขึ้นจากความต้องการแป้งมันและมันเส้นส่งออกจีน\nลานรับซื้อในนครราชสีมายกแผงราคาเพื่อแย่งปริมาณ\nความชื้นในหัวมันอยู่ในเกณฑ์ดี ลดส่วนลดความชื้น",
      drivers: [
        "ความต้องการส่งออกไปจีนเพิ่มขึ้น",
        "ลานรับซื้อแข่งขันราคา",
        "ความชื้นหัวมันอยู่ในเกณฑ์ดี",
      ],
    },
    down: {
      summary: "หัวมันอ่อนตัวจากปริมาณรถเข้าลานที่หนาแน่นในช่วงเก็บเกี่ยว",
      drivers: ["ฤดูเก็บเกี่ยวหนาแน่น", "โรงแป้งเต็มกำลัง"],
    },
    stable: {
      summary: "หัวมันทรงตัว ลานรับซื้อรักษาระดับราคาใกล้เคียงวันก่อน",
      drivers: ["ปริมาณเข้าลานสม่ำเสมอ"],
    },
  },
  "cmd-corn-feed": {
    up: {
      summary: "ข้าวโพดเลี้ยงสัตว์ขยับขึ้นเล็กน้อยตามต้นทุนอาหารสัตว์",
      drivers: ["ฟาร์มสัตว์ปีกเพิ่มการสั่งซื้อ", "ผลผลิตภาคเหนือออกช้า"],
    },
    down: {
      summary: "ข้าวโพดอ่อนตัวจากข้าวโพดนำเข้าที่ราคาแข่งขันได้",
      drivers: ["ปริมาณนำเข้าสูง", "สต็อกในนครสวรรค์เพียงพอ"],
    },
    stable: {
      summary:
        "ข้าวโพดเลี้ยงสัตว์เคลื่อนไหวแคบ\nผู้ผลิตอาหารสัตว์ซื้อตามแผน ไม่เร่งสะสมสต็อก\nผลผลิตในนครสวรรค์–เพชรบูรณ์ออกสู่ตลาดตามปกติ",
      drivers: ["ผู้ผลิตอาหารสัตว์ซื้อตามแผน", "ผลผลิตตามฤดูกาล", "ราคาทดแทนทรงตัว"],
    },
  },
};

function trendOf(values: number[]): TrendDirection {
  if (values.length < 2) return "stable";
  const first = values[0] ?? 0;
  const last = values[values.length - 1] ?? 0;
  if (first === 0) return "stable";
  const pct = (last - first) / first;
  if (pct > 0.012) return "up";
  if (pct < -0.012) return "down";
  return "stable";
}

function nationalSeries(commodityId: string): { date: string; avg: number }[] {
  const byDate = new Map<string, number[]>();
  for (const row of marketPrices) {
    if (row.commodity_id !== commodityId) continue;
    const list = byDate.get(row.price_date) ?? [];
    list.push(row.avg_price);
    byDate.set(row.price_date, list);
  }
  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, vals]) => ({
      date,
      avg: vals.reduce((s, v) => s + v, 0) / vals.length,
    }));
}

function buildInsights(): AiMarketInsight[] {
  return commodities.map((c) => {
    const series = nationalSeries(c.id);
    const last7 = series.slice(-7).map((p) => p.avg);
    const direction = trendOf(last7);
    const copy = INSIGHT_COPY[c.id]?.[direction] ?? {
      summary: "แนวโน้มราคาอยู่ในเกณฑ์ปกติจากข้อมูลย้อนหลัง",
      drivers: ["ข้อมูลราคาย้อนหลัง"],
    };
    const last = last7[last7.length - 1] ?? 0;
    const first = last7[0] ?? last;
    const mag = first === 0 ? 0 : Math.abs(last - first) / first;
    const confidence = round2(Math.min(0.91, 0.58 + mag * 4 + (last7.length / 7) * 0.08));
    return {
      id: `ai-${c.id}`,
      commodity_id: c.id,
      insight_date: ANCHOR,
      trend_direction: direction,
      summary_th: copy.summary,
      key_drivers: copy.drivers,
      confidence_score: confidence,
      model_version: "gemini-2.5-pro",
    };
  });
}

export const aiMarketInsights: AiMarketInsight[] = buildInsights();

export const LATEST_DATE = ANCHOR;

export const tradingDates = DATES;
