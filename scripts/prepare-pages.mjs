#!/usr/bin/env node
/**
 * Collect TanStack Start / Vite client output into pages-dist/ for GitHub Pages.
 * Copies index.html → 404.html so deep links (/map, /commodity/...) boot the SPA.
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dest = join(root, "pages-dist");

const candidates = [
  join(root, "dist/client"),
  join(root, "dist"),
  join(root, ".output/public"),
  join(root, "client"),
];

function looksLikeSite(dir) {
  if (!existsSync(dir)) return false;
  try {
    const names = readdirSync(dir);
    return names.includes("index.html") || names.includes("_shell.html") || names.includes("assets");
  } catch {
    return false;
  }
}

const src = candidates.find(looksLikeSite);
if (!src) {
  console.error("prepare-pages: no client output found. Looked in:");
  for (const c of candidates) console.error("  -", c);
  process.exit(1);
}

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });

const indexHtml = join(dest, "index.html");
const shellHtml = join(dest, "_shell.html");
if (!existsSync(indexHtml) && existsSync(shellHtml)) {
  cpSync(shellHtml, indexHtml);
}

const assetsDir = join(dest, "assets");
const cssFile = existsSync(assetsDir)
  ? readdirSync(assetsDir).find((n) => n.startsWith("styles-") && n.endsWith(".css"))
  : null;

function rewriteHtml(file) {
  if (!existsSync(file)) return false;
  let html = readFileSync(file, "utf8");
  if (cssFile) {
    html = html.replace(/assets\/styles-[^"']+\.css/g, `assets/${cssFile}`);
  }
  if (!html.includes("Cache-Control")) {
    html = html.replace(
      "<head>",
      '<head>\n    <meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate" />',
    );
  }
  writeFileSync(file, html);
  return true;
}

rewriteHtml(indexHtml);
rewriteHtml(shellHtml);

if (existsSync(indexHtml)) {
  cpSync(indexHtml, join(dest, "404.html"));
}

writeFileSync(join(dest, ".nojekyll"), "");

const jsonSrc = join(root, "public/data/official-board.json");
const jsonDestDir = join(dest, "data");
if (existsSync(jsonSrc)) {
  mkdirSync(jsonDestDir, { recursive: true });
  cpSync(jsonSrc, join(jsonDestDir, "official-board.json"));
}

console.log(
  JSON.stringify(
    {
      from: src.replace(`${root}/`, ""),
      to: "pages-dist",
      hasIndex: existsSync(indexHtml),
      has404: existsSync(join(dest, "404.html")),
      hasBoard: existsSync(join(jsonDestDir, "official-board.json")),
      css: cssFile ?? null,
    },
    null,
    2,
  ),
);
