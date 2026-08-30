import { createServerFn } from "@tanstack/react-start";
import type { OfficialBoard } from "./types";

export const getOfficialBoard = createServerFn({ method: "GET" }).handler(async () => {
  const { scrapeOfficialBoard } = await import("./official-scrape.server");
  return scrapeOfficialBoard();
});

export type { OfficialBoard };
