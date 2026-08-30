import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as Sparkles, d as ArrowLeft } from "../_libs/lucide-react.mjs";
import { a as CATEGORY_LABEL, c as TREND_LABEL, f as formatDateShort, l as formatBaht, n as Route, o as REGION_LABEL, s as SOURCE_TYPE_LABEL, u as formatDateChart } from "./router-DQz3v30J.mjs";
import { n as Badge, r as cn, t as AppShell } from "./app-shell-D2A1VjWD.mjs";
import { n as TrendIcon, t as ChangeBadge } from "./trend-cJN8RGr5.mjs";
import { a as Line, c as Tooltip, i as Area, n as YAxis, o as CartesianGrid, r as XAxis, s as ResponsiveContainer, t as ComposedChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/commodity._code-CnvKMrep.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AiInsightBox({ insight }) {
	if (!insight) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-sm font-semibold text-ink",
			children: "บทวิเคราะห์แนวโน้ม"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "ยังไม่มีบทวิเคราะห์สำหรับวันที่เลือก"
		})]
	});
	const bullets = insight.summary_th.split("\n").filter(Boolean);
	const pct = Math.round(insight.confidence_score * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden rounded-xl bg-surface p-5 shadow-[var(--shadow-ai)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -right-8 -top-10 size-36 rounded-full bg-ai/10" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-ai",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "บทวิเคราะห์จากราคาทางการ"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: "ai",
					children: [
						"ความเชื่อมั่น ",
						pct,
						"%"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative mt-4 flex items-center gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5 rounded-full bg-ai-soft px-3 py-1 text-sm font-semibold text-ai",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendIcon, { direction: insight.trend_direction }), TREND_LABEL[insight.trend_direction]]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "relative mt-4 space-y-2 text-sm leading-6 text-ink-soft",
				children: bullets.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2 size-1.5 shrink-0 rounded-full bg-ai" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: line })]
				}, line))
			}),
			insight.key_drivers.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative mt-4 flex flex-wrap gap-2",
				children: insight.key_drivers.map((driver) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-ai-soft/70 px-3 py-1 text-xs font-medium text-ai",
					children: driver
				}, driver))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "relative mt-5 border-t border-line pt-3 text-[11px] leading-5 text-faint",
				children: ["คำนวณจากชุดราคาทางการย้อนหลัง · ไม่ใช่คำแนะนำการซื้อขาย · ", insight.model_version]
			})
		]
	});
}
function MarketTable({ rows, nationalAvg }) {
	if (rows.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-sm font-semibold text-ink",
			children: "ราคาแยกตามแหล่ง"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "ไม่มีรายงานราคาในวันที่เลือก"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-b border-line px-5 py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold text-ink",
				children: "ราคาแยกตามแหล่ง"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "ตัวเลขจากเว็บทางการตามจุดที่รายงาน — ไม่ได้ประมาณส่วนต่างรายจังหวัด"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[640px] text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-sage/60 text-xs font-medium text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-5 py-3 font-medium",
							children: "ตลาด / จังหวัด"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-medium",
							children: "แหล่งข้อมูล"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 text-right font-medium",
							children: "ต่ำสุด"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 text-right font-medium",
							children: "เฉลี่ย"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 text-right font-medium",
							children: "สูงสุด"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 text-right font-medium",
							children: "เปลี่ยน"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-5 py-3 text-right font-medium",
							children: "เทียบค่าเฉลี่ย"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map(({ source, price, prev }) => {
					const change = prev && prev.avg_price !== 0 ? (price.avg_price - prev.avg_price) / prev.avg_price * 100 : null;
					const vs = nationalAvg ? (price.avg_price - nationalAvg) / nationalAvg * 100 : 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-line",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-5 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium text-ink",
										children: source.province
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted",
										children: source.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-faint",
										children: REGION_LABEL[source.region] ?? source.region
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 text-xs text-muted",
								children: SOURCE_TYPE_LABEL[source.source_type] ?? source.source_type
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 text-right tabular",
								children: formatBaht(price.min_price)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 text-right tabular font-medium",
								children: formatBaht(price.avg_price)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 text-right tabular",
								children: formatBaht(price.max_price)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangeBadge, { value: change })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3 text-right text-xs tabular text-muted",
								children: Math.abs(vs) < .005 ? "เท่าเฉลี่ย" : `${vs > 0 ? "+" : ""}${vs.toFixed(2)}%`
							})
						]
					}, source.id);
				}) })]
			})
		})]
	});
}
var PERIODS = [
	{
		id: "7d",
		label: "7 วัน",
		days: 7
	},
	{
		id: "30d",
		label: "30 วัน",
		days: 30
	},
	{
		id: "90d",
		label: "3 เดือน",
		days: 90
	}
];
function PriceChart({ series, unit, asOf }) {
	const [period, setPeriod] = (0, import_react.useState)("30d");
	const sliced = (0, import_react.useMemo)(() => {
		const days = PERIODS.find((p) => p.id === period)?.days ?? 30;
		return series.filter((p) => p.date <= asOf).slice(-days);
	}, [
		series,
		period,
		asOf
	]);
	const yDomain = (0, import_react.useMemo)(() => {
		if (sliced.length === 0) return [0, 1];
		const lo = Math.min(...sliced.map((p) => p.min));
		const hi = Math.max(...sliced.map((p) => p.max));
		const pad = (hi - lo || lo * .04 || 1) * .18;
		return [lo - pad, hi + pad];
	}, [sliced]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold text-ink",
				children: "กราฟราคาย้อนหลัง"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted",
				children: ["ค่าเฉลี่ยจากตลาดที่มีรายงาน · ", unit]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex rounded-full bg-sage p-1",
				children: PERIODS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setPeriod(p.id),
					className: cn("h-8 rounded-full px-3 text-xs font-medium transition-colors duration-150", period === p.id ? "bg-surface text-ink shadow-[var(--shadow-border)]" : "text-muted"),
					children: p.label
				}, p.id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 h-72 w-full",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
					data: sliced,
					margin: {
						top: 8,
						right: 8,
						left: 0,
						bottom: 0
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
							id: "avgFill",
							x1: "0",
							y1: "0",
							x2: "0",
							y2: "1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "0%",
								stopColor: "var(--color-primary)",
								stopOpacity: .22
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "100%",
								stopColor: "var(--color-primary)",
								stopOpacity: .02
							})]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							stroke: "var(--color-line)",
							vertical: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "date",
							tickFormatter: formatDateChart,
							tick: {
								fill: "var(--color-muted)",
								fontSize: 11
							},
							axisLine: false,
							tickLine: false,
							minTickGap: 28
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							tickFormatter: (v) => formatBaht(v, v >= 100 ? 0 : 2),
							tick: {
								fill: "var(--color-muted)",
								fontSize: 11
							},
							axisLine: false,
							tickLine: false,
							width: 72,
							domain: yDomain,
							tickCount: 5
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: ({ active, payload, label }) => {
							if (!active || !payload?.length) return null;
							const row = payload[0]?.payload;
							if (!row) return null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-md bg-surface px-3 py-2 text-xs shadow-[var(--shadow-border)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium text-ink",
										children: formatDateChart(String(label))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 tabular text-ink",
										children: [
											"เฉลี่ย ",
											formatBaht(row.avg),
											" ",
											unit
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "tabular text-muted",
										children: [
											"ต่ำสุด ",
											formatBaht(row.min),
											" · สูงสุด ",
											formatBaht(row.max)
										]
									})
								]
							});
						} }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
							type: "monotone",
							dataKey: "avg",
							stroke: "none",
							fill: "url(#avgFill)",
							isAnimationActive: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
							type: "monotone",
							dataKey: "avg",
							stroke: "var(--color-primary)",
							strokeWidth: 2,
							dot: false,
							isAnimationActive: false
						})
					]
				})
			})
		})]
	});
}
function CommodityPage() {
	const data = Route.useLoaderData();
	const navigate = Route.useNavigate();
	const { commodity, snapshot, series, insight, markets } = data;
	const stale = snapshot.asOfDate !== data.date;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		date: data.date,
		dates: data.dates,
		onDateChange: (next) => navigate({ search: { date: next } }),
		meta: data.meta,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				search: data.date ? { date: data.date } : void 0,
				className: "inline-flex h-10 items-center gap-2 text-sm font-medium text-muted hover:text-ink",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "กลับภาพรวม"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mt-2 flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-medium tracking-wide text-muted",
						children: CATEGORY_LABEL[commodity.category]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl",
						children: commodity.name_th
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: commodity.name_en
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "official",
								children: snapshot.sourceLabel
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "default",
								children: snapshot.unit
							}),
							stale ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "default",
								children: ["ข้อมูล ณ ", formatDateShort(snapshot.asOfDate)]
							}) : null
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-3xl font-semibold tabular tracking-tight text-ink",
							children: formatBaht(snapshot.avg)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex items-center justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangeBadge, { value: snapshot.changePct }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: "จากรายงานทางการก่อนหน้า"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 text-xs text-muted",
							children: [
								"ช่วง ",
								formatBaht(snapshot.min),
								" – ",
								formatBaht(snapshot.max)
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceChart, {
					series,
					unit: snapshot.unit,
					asOf: snapshot.asOfDate
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiInsightBox, { insight })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketTable, {
					rows: markets,
					nationalAvg: snapshot.avg
				})
			})
		]
	});
}
//#endregion
export { CommodityPage as component };
