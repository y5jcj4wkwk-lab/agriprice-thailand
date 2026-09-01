#!/usr/bin/env node
/**
 * Pull official Thai crop prices and write public/data/official-board.json.
 * Used by GitHub Actions on a weekday cron (and locally via `npm run scrape:prices`).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const scrapeUrl = pathToFileURL(join(root, "src/lib/official-scrape.server.ts")).href;
const { scrapeOfficialBoard } = await import(scrapeUrl);

const board = await scrapeOfficialBoard();
const outDir = join(root, "public/data");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "official-board.json"), `${JSON.stringify(board, null, 2)}\n`);

const lastByCommodity = {};
for (const p of board.prices) {
  const prev = lastByCommodity[p.commodity_id];
  if (!prev || p.price_date > prev) lastByCommodity[p.commodity_id] = p.price_date;
}

const summary = {
  file: "public/data/official-board.json",
  asOf: board.meta.asOf,
  scrapedAt: board.meta.scrapedAt,
  live: board.meta.live,
  sources: board.meta.sources,
  prices: board.prices.length,
  lastByCommodity,
  notes: board.meta.notes,
};
console.log(JSON.stringify(summary, null, 2));
