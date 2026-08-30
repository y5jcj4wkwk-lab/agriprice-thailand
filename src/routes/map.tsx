import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ThailandMap } from "@/components/thailand-map";
import { loadMap } from "@/lib/queries";
import { validateDateSearch } from "@/lib/search";

export const Route = createFileRoute("/map")({
  validateSearch: validateDateSearch,
  loaderDeps: ({ search }) => ({ date: search.date }),
  loader: ({ deps }) => loadMap(deps.date),
  component: MapPage,
});

function MapPage() {
  const data = Route.useLoaderData();
  const navigate = Route.useNavigate();

  return (
    <AppShell
      date={data.date}
      dates={data.dates}
      onDateChange={(next) => navigate({ search: { date: next } })}
      flush
      meta={data.meta}
    >
      <div className="mb-3">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">แผนที่แหล่งราคา</h1>
        <p className="mt-1 text-sm text-muted">
          จุดที่มาของราคาทางการ — แตะหมุดเพื่อดูตัวเลขล่าสุด ณ จุดนั้น
        </p>
      </div>
      <ThailandMap sources={data.sources} prices={data.prices} commodities={data.commodities} />
    </AppShell>
  );
}
