import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as TrendingDown, o as Minus, r as TrendingUp } from "../_libs/lucide-react.mjs";
import { p as formatPct } from "./router-DQz3v30J.mjs";
import { r as cn } from "./app-shell-D2A1VjWD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trend-cJN8RGr5.js
var import_jsx_runtime = require_jsx_runtime();
function toneFromChange(changePct) {
	if (changePct == null) return "stable";
	if (changePct > .15) return "up";
	if (changePct < -.15) return "down";
	return "stable";
}
function TrendIcon({ direction, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(direction === "up" ? TrendingUp : direction === "down" ? TrendingDown : Minus, {
		className: cn("size-4", className),
		strokeWidth: 2.2
	});
}
function ChangeBadge({ value, className }) {
	if (value == null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("text-xs text-faint", className),
		children: "—"
	});
	const tone = toneFromChange(value);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1 text-sm font-medium tabular", tone === "up" && "text-up", tone === "down" && "text-down", tone === "stable" && "text-muted", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendIcon, {
			direction: tone,
			className: "size-3.5"
		}), formatPct(value)]
	});
}
//#endregion
export { TrendIcon as n, toneFromChange as r, ChangeBadge as t };
