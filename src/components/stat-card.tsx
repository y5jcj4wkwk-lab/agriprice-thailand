import { Link } from "@tanstack/react-router";
import { ChangeBadge } from "@/components/trend";
import { formatBaht, formatDateShort } from "@/lib/format";
import type { CommoditySnapshot } from "@/lib/types";

export function StatCard({ snap, date }: { snap: CommoditySnapshot; date?: string }) {
  const stale = snap.asOfDate !== snap.date;
  return (
    <Link
      to="/commodity/$code"
      params={{ code: snap.commodity.code }}
      search={date ? { date } : undefined}
      className="block rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 ease-out hover:shadow-[var(--shadow-border-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="text-xs font-medium tracking-wide text-muted">{snap.commodity.name_th}</div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="text-2xl font-semibold tabular tracking-tight text-ink">
          {formatBaht(snap.avg)}
        </div>
        <ChangeBadge value={snap.changePct} />
      </div>
      <div className="mt-1 text-xs text-muted">
        {formatBaht(snap.min)} – {formatBaht(snap.max)} {snap.unit}
      </div>
      <div className="mt-1 text-[11px] text-faint">
        {snap.sourceLabel}
        {stale ? ` · ณ ${formatDateShort(snap.asOfDate)}` : ""}
      </div>
    </Link>
  );
}
