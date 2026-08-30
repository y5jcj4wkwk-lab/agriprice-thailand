import { p as formatPct } from "./search-D_PQg664.js";
import { r as cn } from "./app-shell-B4UUwD9K.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
//#region src/components/trend.tsx
function toneFromChange(changePct) {
	if (changePct == null) return "stable";
	if (changePct > .15) return "up";
	if (changePct < -.15) return "down";
	return "stable";
}
function TrendIcon({ direction, className }) {
	return /* @__PURE__ */ jsx(direction === "up" ? TrendingUp : direction === "down" ? TrendingDown : Minus, {
		className: cn("size-4", className),
		strokeWidth: 2.2
	});
}
function ChangeBadge({ value, className }) {
	if (value == null) return /* @__PURE__ */ jsx("span", {
		className: cn("text-xs text-faint", className),
		children: "—"
	});
	const tone = toneFromChange(value);
	return /* @__PURE__ */ jsxs("span", {
		className: cn("inline-flex items-center gap-1 text-sm font-medium tabular", tone === "up" && "text-up", tone === "down" && "text-down", tone === "stable" && "text-muted", className),
		children: [/* @__PURE__ */ jsx(TrendIcon, {
			direction: tone,
			className: "size-3.5"
		}), formatPct(value)]
	});
}
//#endregion
export { TrendIcon as n, toneFromChange as r, ChangeBadge as t };
