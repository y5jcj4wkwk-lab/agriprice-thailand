import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { CategoryChips } from "@/components/category-chips";
import { CommodityCard } from "@/components/commodity-card";
import { StatCard } from "@/components/stat-card";
import { loadDashboard } from "@/lib/queries";
import { validateDateSearch } from "@/lib/search";
import type { CommodityCategory } from "@/lib/types";

export const Route = createFileRoute("/")({
  validateSearch: validateDateSearch,
  loaderDeps: ({ search }) => ({ date: search.date }),
  loader: ({ deps }) => loadDashboard(deps.date),
  component: Home,
});

const FEATURED = ["rice-hommali", "rubber-rss3", "palm-ffb", "cassava-root"];

function Home() {
  const data = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const [category, setCategory] = useState<"all" | CommodityCategory>("all");

  const snapshots = useMemo(() => {
    if (category === "all") return data.snapshots;
    return data.snapshots.filter((s) => s.commodity.category === category);
  }, [data.snapshots, category]);

  const featured = useMemo(
    () =>
      FEATURED.map((code) => data.snapshots.find((s) => s.commodity.code === code)).filter(
        (s): s is NonNullable<typeof s> => Boolean(s),
      ),
    [data.snapshots],
  );

  return (
    <AppShell
      date={data.date}
      dates={data.dates}
      onDateChange={(next) => navigate({ search: { date: next } })}
      meta={data.meta}
    >
      <section>
        <p className="text-xs font-medium tracking-wide text-muted">
          TREA · TRA · TMTPA · สศก. · NETTA
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          ราคาพืชผลวันนี้
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          ราคารับซื้อและราคา FOB จากเว็บทางการล่าสุด — แยกจากบทวิเคราะห์แนวโน้ม
          ไม่ปนราคาข้าวเปลือกกับข้าวสาร และไม่สร้างส่วนต่างรายจังหวัดเอง
        </p>
      </section>

      {category === "all" ? (
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {featured.map((item) => (
            <StatCard key={item.commodity.id} snap={item} date={data.date} />
          ))}
        </div>
      ) : null}

      <div className="mt-6">
        <CategoryChips value={category} onChange={setCategory} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {snapshots.map((snap) => (
          <CommodityCard key={snap.commodity.id} snap={snap} date={data.date} />
        ))}
      </div>

      {snapshots.length === 0 ? (
        <p className="mt-8 text-sm text-muted">ไม่พบสินค้าในหมวดที่เลือก</p>
      ) : null}

      {data.meta.notes.length > 0 ? (
        <ul className="mt-8 space-y-1 text-[11px] leading-5 text-faint">
          {data.meta.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}
    </AppShell>
  );
}
