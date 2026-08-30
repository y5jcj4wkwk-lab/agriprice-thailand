//#region src/lib/board.ts
function snapshotPath() {
	const base = "/";
	return `${base.endsWith("/") ? base : `${base}/`}data/official-board.json`;
}
async function loadSnapshot() {
	if (typeof window !== "undefined") {
		const res = await fetch(snapshotPath());
		if (!res.ok) throw new Error("ไม่พบไฟล์ราคา official-board.json");
		return res.json();
	}
	{
		const { readFileSync } = await import("node:fs");
		const { join } = await import("node:path");
		const file = join(process.cwd(), "public/data/official-board.json");
		return JSON.parse(readFileSync(file, "utf8"));
	}
}
/** Live scrape when a server is present; JSON snapshot on GitHub Pages. */
async function loadOfficialBoard() {
	return loadSnapshot();
}
//#endregion
//#region src/lib/format.ts
var BANGKOK = "Asia/Bangkok";
function formatBaht(value, digits = 2) {
	return value.toLocaleString("th-TH", {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	});
}
function formatPct(value) {
	if (Math.abs(value) < .005) return "0.00%";
	return `${value > 0 ? "+" : ""}${value.toLocaleString("th-TH", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	})}%`;
}
function parseISODate(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1, 5, 0, 0));
}
function formatDateThai(iso, options) {
	return parseISODate(iso).toLocaleDateString("th-TH", {
		timeZone: BANGKOK,
		...options
	});
}
function formatDateLong(iso) {
	return formatDateThai(iso, {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric"
	});
}
function formatDateShort(iso) {
	return formatDateThai(iso, {
		day: "numeric",
		month: "short"
	});
}
function formatDateChart(iso) {
	return formatDateThai(iso, {
		day: "numeric",
		month: "short"
	});
}
var CATEGORY_LABEL = {
	Rice: "ข้าว",
	Rubber: "ยางพารา",
	Palm: "ปาล์ม",
	Cassava: "มันสำปะหลัง",
	Corn: "ข้าวโพด"
};
var REGION_LABEL = {
	North: "ภาคเหนือ",
	Northeast: "ภาคตะวันออกเฉียงเหนือ",
	Central: "ภาคกลาง",
	South: "ภาคใต้"
};
var TREND_LABEL = {
	up: "แนวโน้มขาขึ้น",
	down: "แนวโน้มขาลง",
	stable: "แนวโน้มทรงตัว"
};
var SOURCE_TYPE_LABEL = {
	DIT: "กรมการค้าภายใน",
	RAOT: "การยางแห่งประเทศไทย",
	OAE: "สำนักงานเศรษฐกิจการเกษตร",
	MARKET: "ตลาดกลาง",
	TREA: "สมาคมผู้ส่งออกข้าวไทย",
	TRA: "สมาคมยางพาราไทย",
	TMTPA: "สมาคมพ่อค้าข้าวโพดฯ",
	NABC: "NABC",
	OIE: "สำนักงานเศรษฐกิจอุตสาหกรรม",
	NETTA: "สมาคมโรงงานมันสำปะหลังฯ"
};
//#endregion
//#region src/lib/queries.ts
function mean(values) {
	if (values.length === 0) return 0;
	return values.reduce((s, v) => s + v, 0) / values.length;
}
function previousDate(dates, current) {
	const i = dates.indexOf(current);
	if (i <= 0) return null;
	return dates[i - 1] ?? null;
}
function availableDates(prices) {
	return [...new Set(prices.map((p) => p.price_date))].sort();
}
function pickDate(dates, requested) {
	if (requested && dates.includes(requested)) return requested;
	if (requested) {
		const earlier = dates.filter((d) => d <= requested);
		if (earlier.length) return earlier[earlier.length - 1] ?? dates[dates.length - 1] ?? requested;
	}
	return dates[dates.length - 1] ?? requested ?? "";
}
function datesForCommodity(prices, commodityId) {
	return availableDates(prices.filter((p) => p.commodity_id === commodityId));
}
function latestOnOrBefore(dates, selected) {
	const hit = dates.filter((d) => d <= selected);
	return hit[hit.length - 1] ?? null;
}
function dailySeries(prices) {
	const byDate = /* @__PURE__ */ new Map();
	for (const p of prices) {
		const list = byDate.get(p.price_date) ?? [];
		list.push(p);
		byDate.set(p.price_date, list);
	}
	return [...byDate.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, rows]) => ({
		date,
		avg: mean(rows.map((r) => r.avg_price)),
		min: Math.min(...rows.map((r) => r.min_price)),
		max: Math.max(...rows.map((r) => r.max_price))
	}));
}
function sourceLabelFor(commodity, prices, sources) {
	const types = new Set(prices.map((p) => sources.find((s) => s.id === p.source_id)?.source_type).filter((t) => Boolean(t)));
	const labels = {
		TREA: "TREA FOB",
		TRA: "TRA",
		TMTPA: "TMTPA",
		OAE: "สศก.",
		NETTA: "NETTA",
		NABC: "NABC",
		OIE: "OIE"
	};
	if (types.size === 0) return "ราคาทางการ";
	return [...types].map((t) => labels[t] ?? t).join(" · ");
}
function trendOf(values) {
	if (values.length < 2) return "stable";
	const first = values[0] ?? 0;
	const last = values[values.length - 1] ?? 0;
	if (first === 0) return "stable";
	const pct = (last - first) / first;
	if (pct > .008) return "up";
	if (pct < -.008) return "down";
	return "stable";
}
function insightFor(commodity, series, asOf) {
	const recent = series.filter((p) => p.date <= asOf).slice(-5);
	const direction = trendOf(recent.map((p) => p.avg));
	const last = recent[recent.length - 1];
	const first = recent[0];
	const pct = first && first.avg !== 0 && last ? (last.avg - first.avg) / first.avg * 100 : 0;
	const lastStr = last ? formatBaht(last.avg) : "–";
	const unit = commodity.standard_unit;
	const span = recent.length >= 2 ? `${recent[0]?.date} → ${recent[recent.length - 1]?.date}` : asOf;
	const move = direction === "up" ? "ปรับขึ้น" : direction === "down" ? "ปรับลง" : "ทรงตัว";
	const pctStr = `${pct > 0 ? "+" : ""}${pct.toFixed(2)}%`;
	let lines = [];
	let drivers = [];
	if (commodity.category === "Rice") {
		lines = [
			`${commodity.name_th} ล่าสุด ${lastStr} ${unit} (${move} ${pctStr} ในช่วง ${span})`,
			"คิดจากราคา FOB ดอลลาร์/ตัน ของสมาคมผู้ส่งออกข้าวไทย คูณอัตราขายบาทของธนาคารแห่งประเทศไทย",
			"ตัวเลขนี้เป็นข้าวสารส่งออก ไม่ใช่ราคาข้าวเปลือกที่นา"
		];
		drivers = [
			"ราคา FOB สมาคมผู้ส่งออกข้าวไทย",
			"อัตราขายบาท ธปท.",
			"ไม่ใช่ราคาข้าวเปลือก"
		];
	} else if (commodity.category === "Rubber") {
		lines = [`${commodity.name_th} ล่าสุด ${lastStr} ${unit} (${move} ${pctStr} ในช่วง ${span})`, "อ้างอิงตารางราคายางตลาดท้องถิ่นของสมาคมยางพาราไทย — ไม่ได้ประมาณราคาต่างจังหวัด"];
		drivers = commodity.code === "rubber-latex" ? ["คอลัมน์น้ำยาง TRA", "อ้างอิงสมาคมน้ำยางข้นไทย"] : ["ยางแผ่นดิบตลาดท้องถิ่น TRA", "หาดใหญ่ สุราษฎร์ฯ ตรัง ภูเก็ต"];
	} else if (commodity.category === "Corn") {
		lines = [`ข้าวโพดเลี้ยงสัตว์โรงงาน ล่าสุดเฉลี่ย ${lastStr} ${unit} (${move} ${pctStr})`, "ราคารับซื้อโรงงานซีพีตามประกาศสมาคมพ่อค้าข้าวโพดและพืชพันธุ์ไทย"];
		drivers = ["ราคาโรงงาน TMTPA", "ซีพีบางนา ศรีราชา ราชบุรี ท่าเรือ โคราช"];
	} else if (commodity.category === "Palm") {
		lines = [`ผลปาล์มน้ำมันล่าสุด ${lastStr} ${unit} ช่วง ${last ? formatBaht(last.min) : "–"}–${last ? formatBaht(last.max) : "–"} (${move} ${pctStr})`, "อ้างอิงราคารับซื้อทะลายสดจากข้อมูล สศก. — หน้า DIT รายวันยังไม่เปิด"];
		drivers = ["ราคารับซื้อผลปาล์ม สศก.", "ช่วงต่ำสุด–สูงสุดตามจังหวัด"];
	} else {
		lines = [`หัวมันสดเชื้อแป้ง 30% โรงแป้งนครราชสีมา ล่าสุด ${lastStr} ${unit} (${move} ${pctStr})`, "อ้างอิงราคารับซื้อของสมาคมโรงงานผู้ผลิตมันสำปะหลังภาคตะวันออกเฉียงเหนือ"];
		drivers = ["โรงแป้งนครราชสีมา NETTA", "เกณฑ์เชื้อแป้ง 30%"];
	}
	const mag = Math.abs(pct) / 100;
	const confidence = Math.round(Math.min(.92, .62 + mag * 3 + recent.length / 5 * .12) * 100) / 100;
	return {
		id: `ai-${commodity.id}-${asOf}`,
		commodity_id: commodity.id,
		insight_date: asOf,
		trend_direction: direction,
		summary_th: lines.join("\n"),
		key_drivers: drivers,
		confidence_score: confidence,
		model_version: "official-series-v1"
	};
}
function snapshotFor(commodity, selected, prices, sources) {
	const cmdPrices = prices.filter((p) => p.commodity_id === commodity.id);
	const cmdDates = datesForCommodity(prices, commodity.id);
	const asOfDate = latestOnOrBefore(cmdDates, selected) ?? cmdDates[cmdDates.length - 1] ?? selected;
	const today = cmdPrices.filter((p) => p.price_date === asOfDate);
	const prevIso = previousDate(cmdDates, asOfDate);
	const yesterday = prevIso ? cmdPrices.filter((p) => p.price_date === prevIso) : [];
	const avg = mean(today.map((r) => r.avg_price));
	const prevAvg = yesterday.length ? mean(yesterday.map((r) => r.avg_price)) : null;
	const changePct = prevAvg && prevAvg !== 0 ? (avg - prevAvg) / prevAvg * 100 : null;
	const sparkline = cmdDates.filter((d) => d <= asOfDate).slice(-7).map((d) => {
		return mean(cmdPrices.filter((p) => p.price_date === d).map((r) => r.avg_price));
	});
	const insight = insightFor(commodity, dailySeries(cmdPrices), asOfDate);
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
		sourceLabel: sourceLabelFor(commodity, today, sources)
	};
}
async function board() {
	return loadOfficialBoard();
}
async function loadDashboard(date) {
	const data = await board();
	const dates = availableDates(data.prices);
	const selected = pickDate(dates, date);
	return {
		date: selected,
		dates,
		snapshots: data.commodities.filter((c) => c.is_active).map((c) => snapshotFor(c, selected, data.prices, data.sources)),
		sources: data.sources,
		meta: data.meta
	};
}
async function loadCommodityDetail(code, date) {
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
	const markets = cmdPrices.filter((p) => p.price_date === asOf).map((price) => {
		const source = sourceById.get(price.source_id);
		if (!source) return null;
		return {
			source,
			price,
			prev: prevIso ? cmdPrices.find((p) => p.source_id === price.source_id && p.price_date === prevIso) ?? null : null
		};
	}).filter((row) => row !== null).sort((a, b) => a.source.province.localeCompare(b.source.province, "th"));
	return {
		commodity,
		date: selected,
		dates,
		snapshot: snap,
		series: dailySeries(cmdPrices),
		insight: snap.insight,
		markets,
		meta: data.meta
	};
}
async function loadMap(date) {
	const data = await board();
	const dates = availableDates(data.prices);
	const selected = pickDate(dates, date);
	const latest = [];
	for (const source of data.sources) for (const commodity of data.commodities) {
		const rows = data.prices.filter((p) => p.source_id === source.id && p.commodity_id === commodity.id && p.price_date <= selected).sort((a, b) => a.price_date.localeCompare(b.price_date));
		const last = rows[rows.length - 1];
		if (last) latest.push(last);
	}
	const activeSourceIds = new Set(latest.map((p) => p.source_id));
	return {
		date: selected,
		dates,
		sources: data.sources.filter((s) => activeSourceIds.has(s.id)),
		commodities: data.commodities,
		prices: latest,
		meta: data.meta
	};
}
//#endregion
//#region src/lib/search.ts
function validateDateSearch(search) {
	const raw = search.date;
	if (typeof raw === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw)) return { date: raw };
	return {};
}
//#endregion
export { CATEGORY_LABEL as a, TREND_LABEL as c, formatDateLong as d, formatDateShort as f, loadMap as i, formatBaht as l, loadCommodityDetail as n, REGION_LABEL as o, formatPct as p, loadDashboard as r, SOURCE_TYPE_LABEL as s, validateDateSearch as t, formatDateChart as u };
