import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/official-feed-4N1j67gK.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getOfficialBoard_createServerFn_handler = createServerRpc({
	id: "dd3738db5a46b2429c9340e602ce6e45072d3289cfb4c666c8f08958eba36d1d",
	name: "getOfficialBoard",
	filename: "src/lib/official-feed.ts"
}, (opts) => getOfficialBoard.__executeServer(opts));
var getOfficialBoard = createServerFn({ method: "GET" }).handler(getOfficialBoard_createServerFn_handler, async () => {
	const { scrapeOfficialBoard } = await import("./official-scrape.server-3Fwh_mqC.mjs");
	return scrapeOfficialBoard();
});
//#endregion
export { getOfficialBoard_createServerFn_handler };
