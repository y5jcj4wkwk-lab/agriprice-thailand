import { l as formatBaht, s as SOURCE_TYPE_LABEL } from "./search-D_PQg664.js";
import { r as Route } from "./router-DVM26KWM.js";
import { n as Badge, t as AppShell } from "./app-shell-B4UUwD9K.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { X } from "lucide-react";
//#region src/components/thailand-map.tsx
function ThailandMap({ sources, prices, commodities }) {
	const hostRef = useRef(null);
	const [selectedId, setSelectedId] = useState(null);
	const selectedIdRef = useRef(null);
	selectedIdRef.current = selectedId;
	const bySource = useMemo(() => {
		const map = /* @__PURE__ */ new Map();
		for (const p of prices) {
			const list = map.get(p.source_id) ?? [];
			list.push(p);
			map.set(p.source_id, list);
		}
		return map;
	}, [prices]);
	const commodityById = useMemo(() => new Map(commodities.map((c) => [c.id, c])), [commodities]);
	const selected = sources.find((s) => s.id === selectedId) ?? null;
	const selectedPrices = selected ? bySource.get(selected.id) ?? [] : [];
	useEffect(() => {
		if (!hostRef.current) return;
		let map = null;
		let cancelled = false;
		const markers = [];
		(async () => {
			const leafletMod = await import("leaflet");
			const L = leafletMod.default ?? leafletMod;
			if (cancelled || !hostRef.current) return;
			map = L.map(hostRef.current, {
				center: [13.6, 101.2],
				zoom: 6,
				minZoom: 5,
				maxZoom: 11,
				zoomControl: true,
				attributionControl: true,
				maxBounds: L.latLngBounds([4.8, 96.8], [21.2, 106.2]),
				maxBoundsViscosity: .8
			});
			L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
				attribution: "&copy; OpenStreetMap &copy; CARTO",
				subdomains: "abcd"
			}).addTo(map);
			requestAnimationFrame(() => {
				map?.invalidateSize();
			});
			function iconFor(source, active) {
				return L.divIcon({
					className: "market-pin-wrap",
					html: `<div class="market-pin"><div class="market-pin-head" data-active="${active ? "true" : "false"}"></div><div class="market-pin-label">${source.province}</div></div>`,
					iconSize: [88, 42],
					iconAnchor: [44, 10]
				});
			}
			for (const source of sources) {
				const marker = L.marker([source.latitude, source.longitude], {
					icon: iconFor(source, selectedIdRef.current === source.id),
					keyboard: true,
					title: source.name
				}).addTo(map);
				marker.on("click", () => setSelectedId(source.id));
				markers.push(marker);
			}
		})();
		return () => {
			cancelled = true;
			for (const m of markers) m.remove();
			map?.remove();
		};
	}, [sources]);
	return /* @__PURE__ */ jsxs("div", {
		className: "relative h-[calc(100dvh-9.5rem)] min-h-[420px] overflow-hidden rounded-xl shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ jsx("div", {
			ref: hostRef,
			className: "absolute inset-0"
		}), selected ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
			type: "button",
			className: "absolute inset-0 z-10 bg-ink/20 md:bg-transparent",
			"aria-label": "ปิดรายละเอียดตลาด",
			onClick: () => setSelectedId(null)
		}), /* @__PURE__ */ jsxs("aside", {
			className: "absolute inset-x-0 bottom-0 z-20 max-h-[70%] overflow-y-auto rounded-t-2xl bg-surface p-5 shadow-[var(--shadow-border-hover)] md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-[380px] md:rounded-none",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("div", {
							className: "text-[11px] font-medium uppercase tracking-wide text-faint",
							children: selected.province
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "mt-0.5 text-base font-semibold text-ink",
							children: selected.name
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-xs text-muted",
							children: SOURCE_TYPE_LABEL[selected.source_type] ?? selected.source_type
						})
					] }), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setSelectedId(null),
						className: "flex size-10 items-center justify-center rounded-md text-muted hover:bg-sage hover:text-ink",
						"aria-label": "ปิด",
						children: /* @__PURE__ */ jsx(X, { className: "size-4" })
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-4 space-y-2",
					children: selectedPrices.length === 0 ? /* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted",
						children: "ไม่มีรายงานราคา ณ วันที่เลือก"
					}) : selectedPrices.map((price) => {
						const cmd = commodityById.get(price.commodity_id);
						if (!cmd) return null;
						return /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between gap-3 rounded-md bg-sage/70 px-3 py-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ jsx("div", {
									className: "truncate text-sm font-medium text-ink",
									children: cmd.name_th
								}), /* @__PURE__ */ jsx("div", {
									className: "text-[11px] text-muted",
									children: cmd.name_en
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "text-right",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-sm font-semibold tabular text-ink",
									children: formatBaht(price.avg_price)
								}), /* @__PURE__ */ jsx("div", {
									className: "text-[11px] text-muted",
									children: price.unit
								})]
							})]
						}, price.id);
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-4",
					children: /* @__PURE__ */ jsx(Badge, {
						variant: "official",
						children: "ราคาซื้อ ณ ตลาดนี้"
					})
				})
			]
		})] }) : /* @__PURE__ */ jsx("div", {
			className: "pointer-events-none absolute left-4 top-4 z-10 rounded-md bg-surface/95 px-3 py-2 text-xs text-muted shadow-[var(--shadow-border)]",
			children: "แตะหมุดเพื่อดูราคาซื้อ ณ ตลาดกลาง"
		})]
	});
}
//#endregion
//#region src/routes/map.tsx?tsr-split=component
function MapPage() {
	const data = Route.useLoaderData();
	const navigate = Route.useNavigate();
	return /* @__PURE__ */ jsxs(AppShell, {
		date: data.date,
		dates: data.dates,
		onDateChange: (next) => navigate({ search: { date: next } }),
		flush: true,
		meta: data.meta,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-3",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "text-2xl font-semibold tracking-tight text-ink",
				children: "แผนที่แหล่งราคา"
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-muted",
				children: "จุดที่มาของราคาทางการ — แตะหมุดเพื่อดูตัวเลขล่าสุด ณ จุดนั้น"
			})]
		}), /* @__PURE__ */ jsx(ThailandMap, {
			sources: data.sources,
			prices: data.prices,
			commodities: data.commodities
		})]
	});
}
//#endregion
export { MapPage as component };
