import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Sparkline } from "@/components/sparkline";
import { ChangeBadge, toneFromChange } from "@/components/trend";
import { CATEGORY_LABEL, formatBaht, formatDateShort, TREND_LABEL } from "@/lib/format";
import type { CommoditySnapshot } from "@/lib/types";

export function CommodityCard({ snap, date }: { snap: CommoditySnapshot; date?: string }) {
  const tone = snap.insight?.trend_direction ?? toneFromChange(snap.changePct);
  const preview = snap.insight?.summary_th.split("\n")[0] ?? "ยังไม่มีบทวิเคราะห์สำหรับรายการนี้";
  const stale = snap.asOfDate !== snap.date;
  return (
    <Link
      to="/commodity/$code"
      params={{ code: snap.commodity.code }}
      search={date ? { date } : undefined}
      className="group flex flex-col rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 ease-out hover:shadow-[var(--shadow-border-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-medium uppercase tracking-wide text-faint">
            {CATEGORY_LABEL[snap.commodity.category]}
          </div>
          <h3 className="mt-0.5 truncate text-base font-semibold text-ink">
            {snap.commodity.name_th}
          </h3>
          <p className="truncate text-xs text-muted">{snap.commodity.name_en}</p>
        </div>
        <Sparkline data={snap.sparkline} tone={tone === "stable" ? "neutral" : tone} />
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <div className="text-2xl font-semibold tabular tracking-tight text-ink">
            {formatBaht(snap.avg)}
          </div>
          <div className="text-xs text-muted">{snap.unit}</div>
        </div>
        <ChangeBadge value={snap.changePct} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant="official">{snap.sourceLabel}</Badge>
        {stale ? <Badge variant="default">ณ {formatDateShort(snap.asOfDate)}</Badge> : null}
        {snap.insight ? (
          <Badge variant={snap.insight.trend_direction === "stable" ? "stable" : snap.insight.trend_direction}>
            {TREND_LABEL[snap.insight.trend_direction]}
          </Badge>
        ) : null}
      </div>
      <p className="mt-3 line-clamp-2 text-xs leading-5 text-muted">{preview}</p>
    </Link>
  );
}
