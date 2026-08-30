//#region \0tanstack-start-manifest:v
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "/workspace/src/routes/__root.tsx",
		children: [
			"/",
			"/map",
			"/commodity/$code"
		],
		preloads: [
			"/assets/index-D8Idg9qq.js",
			"/assets/rolldown-runtime-hePW80VL.js",
			"/assets/search-LTc7iX4e.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-D8Idg9qq.js"
		} }]
	},
	"/": {
		filePath: "/workspace/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-DDhQcm7-.js",
			"/assets/app-shell-30zXv7Ix.js",
			"/assets/trend-rpFpq1Xi.js"
		]
	},
	"/map": {
		filePath: "/workspace/src/routes/map.tsx",
		children: void 0,
		preloads: ["/assets/map-B11CfsGK.js", "/assets/app-shell-30zXv7Ix.js"]
	},
	"/commodity/$code": {
		filePath: "/workspace/src/routes/commodity.$code.tsx",
		children: void 0,
		preloads: [
			"/assets/commodity._code-DaM9BRJL.js",
			"/assets/app-shell-30zXv7Ix.js",
			"/assets/trend-rpFpq1Xi.js"
		]
	}
} });
//#endregion
export { tsrStartManifest };
