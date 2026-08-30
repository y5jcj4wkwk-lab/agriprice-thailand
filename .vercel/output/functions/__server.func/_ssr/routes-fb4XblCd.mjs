import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as CATEGORY_LABEL, c as TREND_LABEL, f as formatDateShort, i as Route$2, l as formatBaht } from "./router-DQz3v30J.mjs";
import { n as Badge, r as cn, t as AppShell } from "./app-shell-D2A1VjWD.mjs";
import { r as toneFromChange, t as ChangeBadge } from "./trend-cJN8RGr5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-fb4XblCd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var OPTIONS = [
	{
		id: "all",
		label: "ทั้งหมด"
	},
	{
		id: "Rice",
		label: CATEGORY_LABEL.Rice
	},
	{
		id: "Rubber",
		label: CATEGORY_LABEL.Rubber
	},
	{
		id: "Palm",
		label: CATEGORY_LABEL.Palm
	},
	{
		id: "Cassava",
		label: CATEGORY_LABEL.Cassava
	},
	{
		id: "Corn",
		label: CATEGORY_LABEL.Corn
	}
];
function CategoryChips({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0",
		children: OPTIONS.map((opt) => {
			const active = value === opt.id;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onChange(opt.id),
				className: cn("h-10 shrink-0 rounded-full px-4 text-sm font-medium transition-colors duration-150", active ? "bg-ink text-primary-fg" : "bg-surface text-ink-soft shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]"),
				children: opt.label
			}, opt.id);
		})
	});
}
function Sparkline({ data, className, tone = "neutral" }) {
	const w = 112;
	const h = 36;
	const pad = 2;
	if (data.length < 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-9 w-28", className) });
	const min = Math.min(...data);
	const span = Math.max(...data) - min || 1;
	const pts = data.map((v, i) => {
		const x = pad + i / (data.length - 1) * 108;
		const y = 34 - (v - min) / span * 32;
		return `${x.toFixed(1)},${y.toFixed(1)}`;
	});
	const d = `M${pts.join(" L")}`;
	const area = `M${pad},34 L${pts.join(" L")} L110,34 Z`;
	const stroke = tone === "up" ? "var(--color-up)" : tone === "down" ? "var(--color-down)" : "var(--color-muted)";
	const fill = tone === "up" ? "color-mix(in oklab, var(--color-up) 18%, transparent)" : tone === "down" ? "color-mix(in oklab, var(--color-down) 16%, transparent)" : "color-mix(in oklab, var(--color-muted) 14%, transparent)";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: `0 0 ${w} ${h}`,
		className: cn("h-9 w-28 overflow-visible", className),
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: area,
			fill
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d,
			fill: "none",
			stroke,
			strokeWidth: "1.6",
			strokeLinejoin: "round",
			strokeLinecap: "round"
		})]
	});
}
function CommodityCard({ snap, date }) {
	const tone = snap.insight?.trend_direction ?? toneFromChange(snap.changePct);
	const preview = snap.insight?.summary_th.split("\n")[0] ?? "ยังไม่มีบทวิเคราะห์สำหรับรายการนี้";
	const stale = snap.asOfDate !== snap.date;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/commodity/$code",
		params: { code: snap.commodity.code },
		search: date ? { date } : void 0,
		className: "group flex flex-col rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 ease-out hover:shadow-[var(--shadow-border-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-medium uppercase tracking-wide text-faint",
							children: CATEGORY_LABEL[snap.commodity.category]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-0.5 truncate text-base font-semibold text-ink",
							children: snap.commodity.name_th
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-muted",
							children: snap.commodity.name_en
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, {
					data: snap.sparkline,
					tone: tone === "stable" ? "neutral" : tone
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-2xl font-semibold tabular tracking-tight text-ink",
					children: formatBaht(snap.avg)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted",
					children: snap.unit
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangeBadge, { value: snap.changePct })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "official",
						children: snap.sourceLabel
					}),
					stale ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "default",
						children: ["ณ ", formatDateShort(snap.asOfDate)]
					}) : null,
					snap.insight ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: snap.insight.trend_direction === "stable" ? "stable" : snap.insight.trend_direction,
						children: TREND_LABEL[snap.insight.trend_direction]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 line-clamp-2 text-xs leading-5 text-muted",
				children: preview
			})
		]
	});
}
function StatCard({ snap, date }) {
	const stale = snap.asOfDate !== snap.date;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/commodity/$code",
		params: { code: snap.commodity.code },
		search: date ? { date } : void 0,
		className: "block rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 ease-out hover:shadow-[var(--shadow-border-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs font-medium tracking-wide text-muted",
				children: snap.commodity.name_th
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-end justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-2xl font-semibold tabular tracking-tight text-ink",
					children: formatBaht(snap.avg)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangeBadge, { value: snap.changePct })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 text-xs text-muted",
				children: [
					formatBaht(snap.min),
					" – ",
					formatBaht(snap.max),
					" ",
					snap.unit
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 text-[11px] text-faint",
				children: [snap.sourceLabel, stale ? ` · ณ ${formatDateShort(snap.asOfDate)}` : ""]
			})
		]
	});
}
var FEATURED = [
	"rice-hommali",
	"rubber-rss3",
	"palm-ffb",
	"cassava-root"
];
function Home() {
	const data = Route$2.useLoaderData();
	const navigate = Route$2.useNavigate();
	const [category, setCategory] = (0, import_react.useState)("all");
	const snapshots = (0, import_react.useMemo)(() => {
		if (category === "all") return data.snapshots;
		return data.snapshots.filter((s) => s.commodity.category === category);
	}, [data.snapshots, category]);
	const featured = (0, import_react.useMemo)(() => FEATURED.map((code) => data.snapshots.find((s) => s.commodity.code === code)).filter((s) => Boolean(s)), [data.snapshots]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		date: data.date,
		dates: data.dates,
		onDateChange: (next) => navigate({ search: { date: next } }),
		meta: data.meta,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted",
					children: "TREA · TRA · TMTPA · สศก. · NETTA"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl",
					children: "ราคาพืชผลวันนี้"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm leading-6 text-muted",
					children: "ราคารับซื้อและราคา FOB จากเว็บทางการล่าสุด — แยกจากบทวิเคราะห์แนวโน้ม ไม่ปนราคาข้าวเปลือกกับข้าวสาร และไม่สร้างส่วนต่างรายจังหวัดเอง"
				})
			] }),
			category === "all" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: featured.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					snap: item,
					date: data.date
				}, item.commodity.id))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryChips, {
					value: category,
					onChange: setCategory
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-3 sm:grid-cols-2",
				children: snapshots.map((snap) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommodityCard, {
					snap,
					date: data.date
				}, snap.commodity.id))
			}),
			snapshots.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm text-muted",
				children: "ไม่พบสินค้าในหมวดที่เลือก"
			}) : null,
			data.meta.notes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 space-y-1 text-[11px] leading-5 text-faint",
				children: data.meta.notes.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: note }, note))
			}) : null
		]
	});
}
//#endregion
export { Home as component };
