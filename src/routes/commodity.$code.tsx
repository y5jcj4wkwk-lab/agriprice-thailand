import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AiInsightBox } from "@/components/ai-insight-box";
import { AppShell } from "@/components/app-shell";
import { MarketTable } from "@/components/market-table";
import { PriceChart } from "@/components/price-chart";
import { Badge } from "@/components/ui/badge";
import { ChangeBadge } from "@/components/trend";
import { CATEGORY_LABEL, formatBaht, formatDateShort } from "@/lib/format";
import { loadCommodityDetail } from "@/lib/queries";
import { validateDateSearch } from "@/lib/search";

export const Route = createFileRoute("/commodity/$code")({
  validateSearch: validateDateSearch,
  loaderDeps: ({ search }) => ({ date: search.date }),
  loader: async ({ params, deps }) => {
    const data = await loadCommodityDetail(params.code, deps.date);
    if (!data) throw notFound();
    return data;
  },
  component: CommodityPage,
});

function CommodityPage() {
  const data = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const { commodity, snapshot, series, insight, markets } = data;
  const stale = snapshot.asOfDate !== data.date;

  return (
    <AppShell
      date={data.date}
      dates={data.dates}
      onDateChange={(next) => navigate({ search: { date: next } })}
      meta={data.meta}
    >
      <Link
        to="/"
        search={data.date ? { date: data.date } : undefined}
        className="inline-flex h-10 items-center gap-2 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        กลับภาพรวม
      </Link>

      <header className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-medium tracking-wide text-muted">
            {CATEGORY_LABEL[commodity.category]}
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {commodity.name_th}
          </h1>
          <p className="text-sm text-muted">{commodity.name_en}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="official">{snapshot.sourceLabel}</Badge>
            <Badge variant="default">{snapshot.unit}</Badge>
            {stale ? <Badge variant="default">ข้อมูล ณ {formatDateShort(snapshot.asOfDate)}</Badge> : null}
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-semibold tabular tracking-tight text-ink">
            {formatBaht(snapshot.avg)}
          </div>
          <div className="mt-1 flex items-center justify-end gap-2">
            <ChangeBadge value={snapshot.changePct} />
            <span className="text-xs text-muted">จากรายงานทางการก่อนหน้า</span>
          </div>
          <div className="mt-1 text-xs text-muted">
            ช่วง {formatBaht(snapshot.min)} – {formatBaht(snapshot.max)}
          </div>
        </div>
      </header>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <PriceChart series={series} unit={snapshot.unit} asOf={snapshot.asOfDate} />
        <AiInsightBox insight={insight} />
      </div>

      <div className="mt-4">
        <MarketTable rows={markets} nationalAvg={snapshot.avg} />
      </div>
    </AppShell>
  );
}
