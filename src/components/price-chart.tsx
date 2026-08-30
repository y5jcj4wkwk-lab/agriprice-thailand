import { useMemo, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatBaht, formatDateChart } from "@/lib/format";
import type { DailySeriesPoint } from "@/lib/types";
import { cn } from "@/lib/utils";

type Period = "7d" | "30d" | "90d";

const PERIODS: Array<{ id: Period; label: string; days: number }> = [
  { id: "7d", label: "7 วัน", days: 7 },
  { id: "30d", label: "30 วัน", days: 30 },
  { id: "90d", label: "3 เดือน", days: 90 },
];

export function PriceChart({
  series,
  unit,
  asOf,
}: {
  series: DailySeriesPoint[];
  unit: string;
  asOf: string;
}) {
  const [period, setPeriod] = useState<Period>("30d");
  const sliced = useMemo(() => {
    const days = PERIODS.find((p) => p.id === period)?.days ?? 30;
    return series.filter((p) => p.date <= asOf).slice(-days);
  }, [series, period, asOf]);

  const yDomain = useMemo<[number, number]>(() => {
    if (sliced.length === 0) return [0, 1];
    const lo = Math.min(...sliced.map((p) => p.min));
    const hi = Math.max(...sliced.map((p) => p.max));
    const span = hi - lo || lo * 0.04 || 1;
    const pad = span * 0.18;
    return [lo - pad, hi + pad];
  }, [sliced]);

  return (
    <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">กราฟราคาย้อนหลัง</h2>
          <p className="text-xs text-muted">ค่าเฉลี่ยจากตลาดที่มีรายงาน · {unit}</p>
        </div>
        <div className="flex rounded-full bg-sage p-1">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              className={cn(
                "h-8 rounded-full px-3 text-xs font-medium transition-colors duration-150",
                period === p.id ? "bg-surface text-ink shadow-[var(--shadow-border)]" : "text-muted",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={sliced} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="avgFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.22} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--color-line)" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDateChart}
              tick={{ fill: "var(--color-muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              minTickGap={28}
            />
            <YAxis
              tickFormatter={(v: number) => formatBaht(v, v >= 100 ? 0 : 2)}
              tick={{ fill: "var(--color-muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={72}
              domain={yDomain}
              tickCount={5}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const row = payload[0]?.payload as DailySeriesPoint | undefined;
                if (!row) return null;
                return (
                  <div className="rounded-md bg-surface px-3 py-2 text-xs shadow-[var(--shadow-border)]">
                    <div className="font-medium text-ink">{formatDateChart(String(label))}</div>
                    <div className="mt-1 tabular text-ink">
                      เฉลี่ย {formatBaht(row.avg)} {unit}
                    </div>
                    <div className="tabular text-muted">
                      ต่ำสุด {formatBaht(row.min)} · สูงสุด {formatBaht(row.max)}
                    </div>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="avg"
              stroke="none"
              fill="url(#avgFill)"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="avg"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
