import { getOfficialBoard } from "./official-feed";
import type { OfficialBoard } from "./types";

function snapshotPath(): string {
  const base = import.meta.env.BASE_URL || "/";
  const prefix = base.endsWith("/") ? base : `${base}/`;
  return `${prefix}data/official-board.json`;
}

async function loadSnapshot(): Promise<OfficialBoard> {
  if (typeof window !== "undefined") {
    const res = await fetch(snapshotPath());
    if (!res.ok) throw new Error("ไม่พบไฟล์ราคา official-board.json");
    return res.json() as Promise<OfficialBoard>;
  }

  if (import.meta.env.SSR) {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const file = join(process.cwd(), "public/data/official-board.json");
    return JSON.parse(readFileSync(file, "utf8")) as OfficialBoard;
  }

  const res = await fetch(snapshotPath());
  if (!res.ok) throw new Error("ไม่พบไฟล์ราคา official-board.json");
  return res.json() as Promise<OfficialBoard>;
}

/** Live scrape when a server is present; JSON snapshot on GitHub Pages. */
export async function loadOfficialBoard(): Promise<OfficialBoard> {
  if (import.meta.env.VITE_PAGES !== "true") {
    try {
      const live = await getOfficialBoard();
      if (live?.prices?.length) return live;
    } catch {
      /* fall through to the committed snapshot */
    }
  }
  return loadSnapshot();
}
