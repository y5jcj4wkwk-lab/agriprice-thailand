import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as createRootRoute, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, y as useRouter, z as notFound } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-NuoEu-5s.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getOfficialBoard = createServerFn({ method: "GET" }).handler(createSsrRpc("dd3738db5a46b2429c9340e602ce6e45072d3289cfb4c666c8f08958eba36d1d"));
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
	try {
		const live = await getOfficialBoard();
		if (live?.prices?.length) return live;
	} catch {}
	return loadSnapshot();
}
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
function validateDateSearch(search) {
	const raw = search.date;
	if (typeof raw === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw)) return { date: raw };
	return {};
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-DQz3v30J.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function PendingScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-bg px-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "กำลังโหลดราคาพืชผล…"
		})
	});
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function AppProviders({ children }) {
	const [client] = (0, import_react.useState)(() => new QueryClient({ defaultOptions: { queries: {
		staleTime: 6e4,
		refetchOnWindowFocus: false,
		retry: 1
	} } }));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client,
		children
	});
}
var styles_default = "/assets/styles-CrckxuL-.css";
var APP_NAME = "AgriPrice Thailand";
var BASE = "/";
var asset = (path) => `${BASE}${path.replace(/^\//, "")}`;
var Route$3 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "ระบบติดตามราคาพืชผลทางการเกษตรและวิเคราะห์แนวโน้มตลาดด้วย AI"
			},
			{
				name: "theme-color",
				content: "#16a34a"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: asset("favicon.svg")
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: asset("__grok/manifest.webmanifest")
			},
			{
				rel: "apple-touch-icon",
				href: asset("__grok/icon-180.png")
			}
		]
	}),
	errorComponent: AppErrorComponent,
	component: RootDocument
});
function RootDocument() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "th",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppProviders, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$2 = () => import("./routes-fb4XblCd.mjs");
var Route$2 = createFileRoute("/")({
	validateSearch: validateDateSearch,
	loaderDeps: ({ search }) => ({ date: search.date }),
	loader: ({ deps }) => loadDashboard(deps.date),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./map-CZ4cYPXX.mjs");
var Route$1 = createFileRoute("/map")({
	validateSearch: validateDateSearch,
	loaderDeps: ({ search }) => ({ date: search.date }),
	loader: ({ deps }) => loadMap(deps.date),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./commodity._code-CnvKMrep.mjs");
var Route = createFileRoute("/commodity/$code")({
	validateSearch: validateDateSearch,
	loaderDeps: ({ search }) => ({ date: search.date }),
	loader: async ({ params, deps }) => {
		const data = await loadCommodityDetail(params.code, deps.date);
		if (!data) throw notFound();
		return data;
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$2.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$3
	}),
	MapRoute: Route$1.update({
		id: "/map",
		path: "/map",
		getParentRoute: () => Route$3
	}),
	CommodityCodeRoute: Route.update({
		id: "/commodity/$code",
		path: "/commodity/$code",
		getParentRoute: () => Route$3
	})
};
var routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent,
		defaultPendingComponent: PendingScreen,
		defaultPreload: "intent",
		scrollRestoration: true
	});
}
//#endregion
export { CATEGORY_LABEL as a, TREND_LABEL as c, formatDateLong as d, formatDateShort as f, Route$2 as i, formatBaht as l, Route as n, REGION_LABEL as o, formatPct as p, Route$1 as r, SOURCE_TYPE_LABEL as s, router_exports as t, formatDateChart as u };
