export type DateSearch = { date?: string };

export function validateDateSearch(search: Record<string, unknown>): DateSearch {
  const raw = search.date;
  if (typeof raw === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return { date: raw };
  }
  return {};
}
