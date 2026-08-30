import { d as formatDateLong } from "./search-D_PQg664.js";
import { Link, useRouterState } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronLeft, ChevronRight, LayoutGrid, MapPinned } from "lucide-react";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
//#region src/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region src/components/ui/badge.tsx
var badgeVariants = cva("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", {
	variants: { variant: {
		default: "bg-sage text-ink-soft",
		official: "bg-primary-soft text-primary-dark",
		up: "bg-up-soft text-up",
		down: "bg-down-soft text-down",
		stable: "bg-stable-soft text-stable",
		ai: "bg-ai-soft text-ai"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ jsx("span", {
		className: cn(badgeVariants({
			variant,
			className
		})),
		...props
	});
}
//#endregion
//#region src/components/logo.tsx
function LogoMark({ className }) {
	return /* @__PURE__ */ jsxs("svg", {
		viewBox: "0 0 32 32",
		className: cn("size-8", className),
		"aria-hidden": "true",
		fill: "none",
		children: [
			/* @__PURE__ */ jsx("rect", {
				width: "32",
				height: "32",
				rx: "8",
				className: "fill-primary"
			}),
			/* @__PURE__ */ jsx("path", {
				d: "M16 24V13.5",
				stroke: "white",
				strokeWidth: "1.8",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ jsx("path", {
				d: "M16 18.5C16 18.5 12.2 17.2 10.4 13.8C8.8 10.8 10.6 8 10.6 8C10.6 8 13.8 9.2 15.2 12.4C16 14.2 16 16.2 16 18.5Z",
				fill: "white",
				fillOpacity: "0.95"
			}),
			/* @__PURE__ */ jsx("path", {
				d: "M16 17.2C16 17.2 19.6 15.6 21.2 12.4C22.6 9.6 21.1 7.2 21.1 7.2C21.1 7.2 18.2 8.6 16.8 11.6C16.2 13.2 16 15 16 17.2Z",
				fill: "white",
				fillOpacity: "0.82"
			})
		]
	});
}
function Wordmark({ compact = false }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-2.5",
		children: [/* @__PURE__ */ jsx(LogoMark, {}), /* @__PURE__ */ jsxs("div", {
			className: "leading-tight",
			children: [/* @__PURE__ */ jsx("div", {
				className: "text-[15px] font-semibold tracking-tight text-ink",
				children: "AgriPrice"
			}), !compact ? /* @__PURE__ */ jsx("div", {
				className: "text-[11px] font-medium text-muted",
				children: "ประเทศไทย"
			}) : null]
		})]
	});
}
//#endregion
//#region src/components/ui/button.tsx
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[background-color,color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50 active:not-disabled:scale-[0.96] [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-fg shadow-sm hover:bg-primary-dark",
			secondary: "bg-sage text-ink hover:bg-sunken",
			outline: "bg-surface text-ink shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			ghost: "text-ink-soft hover:bg-sage hover:text-ink",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-10 px-4",
			sm: "h-8 rounded-sm px-3 text-xs",
			lg: "h-11 px-5",
			icon: "size-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ jsx(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
//#endregion
//#region src/components/app-shell.tsx
var NAV = [{
	to: "/",
	label: "ภาพรวม",
	icon: LayoutGrid
}, {
	to: "/map",
	label: "แผนที่ตลาด",
	icon: MapPinned
}];
function AppShell({ children, date, dates, onDateChange, flush, meta }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	function step(delta) {
		if (!date || !dates || !onDateChange) return;
		const next = dates[dates.indexOf(date) + delta];
		if (next) onDateChange(next);
	}
	const canPrev = Boolean(date && dates && dates.indexOf(date) > 0);
	const canNext = Boolean(date && dates && dates.indexOf(date) < (dates?.length ?? 0) - 1);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-dvh bg-bg text-ink",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur-md",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6",
					children: [
						/* @__PURE__ */ jsx(Link, {
							to: "/",
							className: "shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							children: /* @__PURE__ */ jsx(Wordmark, {})
						}),
						/* @__PURE__ */ jsx("nav", {
							className: "ml-2 hidden items-center gap-1 sm:flex",
							children: NAV.map((item) => {
								const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
								return /* @__PURE__ */ jsxs(Link, {
									to: item.to,
									className: cn("inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors duration-150", active ? "bg-sage text-ink" : "text-muted hover:bg-sage/70 hover:text-ink"),
									children: [/* @__PURE__ */ jsx(item.icon, { className: "size-4" }), item.label]
								}, item.to);
							})
						}),
						/* @__PURE__ */ jsx("div", {
							className: "ml-auto flex min-w-0 items-center gap-2",
							children: date ? /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ jsx(Button, {
										variant: "ghost",
										size: "icon",
										className: "size-10 shrink-0",
										disabled: !canPrev,
										onClick: () => step(-1),
										"aria-label": "วันก่อนหน้า",
										children: /* @__PURE__ */ jsx(ChevronLeft, {})
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "hidden min-w-0 text-right sm:block",
										children: [/* @__PURE__ */ jsx("div", {
											className: "truncate text-sm font-medium text-ink",
											children: formatDateLong(date)
										}), /* @__PURE__ */ jsx("div", {
											className: "text-[11px] text-muted",
											children: "วันที่มีรายงานทางการ"
										})]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-center text-xs font-medium text-ink sm:hidden",
										children: formatDateLong(date)
									}),
									/* @__PURE__ */ jsx(Button, {
										variant: "ghost",
										size: "icon",
										className: "size-10 shrink-0",
										disabled: !canNext,
										onClick: () => step(1),
										"aria-label": "วันถัดไป",
										children: /* @__PURE__ */ jsx(ChevronRight, {})
									})
								]
							}) : null
						})
					]
				}), /* @__PURE__ */ jsx("nav", {
					className: "flex gap-1 border-t border-line px-2 py-1 sm:hidden",
					children: NAV.map((item) => {
						const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
						return /* @__PURE__ */ jsxs(Link, {
							to: item.to,
							className: cn("flex h-11 flex-1 items-center justify-center gap-2 rounded-md text-sm font-medium", active ? "bg-sage text-ink" : "text-muted"),
							children: [/* @__PURE__ */ jsx(item.icon, { className: "size-4" }), item.label]
						}, item.to);
					})
				})]
			}),
			meta ? /* @__PURE__ */ jsxs("div", {
				className: "border-b border-line bg-primary-soft/60 px-4 py-1.5 text-center text-[12px] text-primary-dark",
				children: [
					meta.live ? "ราคาทางการล่าสุด" : "ราคาทางการที่ตรวจสอบได้ล่าสุด",
					" · ",
					formatDateLong(meta.asOf),
					" ·",
					" ",
					meta.sources.slice(0, 4).join(" · ")
				]
			}) : null,
			/* @__PURE__ */ jsx("div", {
				className: cn("mx-auto max-w-6xl px-4 sm:px-6", flush ? "pb-4 pt-4" : "pb-16 pt-6"),
				children
			})
		]
	});
}
//#endregion
export { Badge as n, cn as r, AppShell as t };
