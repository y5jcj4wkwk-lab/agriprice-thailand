const BANGKOK = "Asia/Bangkok";

export function formatBaht(value: number, digits = 2): string {
  return value.toLocaleString("th-TH", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatPrice(value: number, unit: string): string {
  const digits = value >= 100 ? 2 : 2;
  return `${formatBaht(value, digits)} ${unit}`;
}

export function formatPct(value: number): string {
  if (Math.abs(value) < 0.005) {
    return "0.00%";
  }
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1, 5, 0, 0));
}

export function formatDateThai(iso: string, options?: Intl.DateTimeFormatOptions): string {
  return parseISODate(iso).toLocaleDateString("th-TH", {
    timeZone: BANGKOK,
    ...options,
  });
}

export function formatDateLong(iso: string): string {
  return formatDateThai(iso, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(iso: string): string {
  return formatDateThai(iso, {
    day: "numeric",
    month: "short",
  });
}

export function formatDateChart(iso: string): string {
  return formatDateThai(iso, {
    day: "numeric",
    month: "short",
  });
}

export const CATEGORY_LABEL: Record<string, string> = {
  Rice: "ข้าว",
  Rubber: "ยางพารา",
  Palm: "ปาล์ม",
  Cassava: "มันสำปะหลัง",
  Corn: "ข้าวโพด",
};

export const REGION_LABEL: Record<string, string> = {
  North: "ภาคเหนือ",
  Northeast: "ภาคตะวันออกเฉียงเหนือ",
  Central: "ภาคกลาง",
  South: "ภาคใต้",
};

export const TREND_LABEL: Record<"up" | "down" | "stable", string> = {
  up: "แนวโน้มขาขึ้น",
  down: "แนวโน้มขาลง",
  stable: "แนวโน้มทรงตัว",
};

export const SOURCE_TYPE_LABEL: Record<string, string> = {
  DIT: "กรมการค้าภายใน",
  RAOT: "การยางแห่งประเทศไทย",
  OAE: "สำนักงานเศรษฐกิจการเกษตร",
  MARKET: "ตลาดกลาง",
  TREA: "สมาคมผู้ส่งออกข้าวไทย",
  TRA: "สมาคมยางพาราไทย",
  TMTPA: "สมาคมพ่อค้าข้าวโพดฯ",
  NABC: "NABC",
  OIE: "สำนักงานเศรษฐกิจอุตสาหกรรม",
  NETTA: "สมาคมโรงงานมันสำปะหลังฯ",
};
