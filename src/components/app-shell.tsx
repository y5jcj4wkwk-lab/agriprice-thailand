import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, MapPinned, LayoutGrid } from "lucide-react";
import type { ReactNode } from "react";
import { Wordmark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { formatDateLong, formatTimeBangkok, bangkokToday } from "@/lib/format";
import type { OfficialMeta } from "@/lib/types";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "ภาพรวม", icon: LayoutGrid },
  { to: "/map", label: "แผนที่ตลาด", icon: MapPinned },
] as const;

export function AppShell({
  children,
  date,
  dates,
  onDateChange,
  flush,
  meta,
}: {
  children: ReactNode;
  date?: string;
  dates?: string[];
  onDateChange?: (next: string) => void;
  flush?: boolean;
  meta?: OfficialMeta;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  function step(delta: number) {
    if (!date || !dates || !onDateChange) return;
    const i = dates.indexOf(date);
    const next = dates[i + delta];
    if (next) onDateChange(next);
  }

  const canPrev = Boolean(date && dates && dates.indexOf(date) > 0);
  const canNext = Boolean(date && dates && dates.indexOf(date) < (dates?.length ?? 0) - 1);

  return (
    <div className="min-h-dvh bg-bg text-ink">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Wordmark />
          </Link>
          <nav className="ml-2 hidden items-center gap-1 sm:flex">
            {NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors duration-150",
                    active ? "bg-sage text-ink" : "text-muted hover:bg-sage/70 hover:text-ink",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex min-w-0 items-center gap-2">
            {date ? (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-10 shrink-0"
                  disabled={!canPrev}
                  onClick={() => step(-1)}
                  aria-label="วันก่อนหน้า"
                >
                  <ChevronLeft />
                </Button>
                <div className="hidden min-w-0 text-right sm:block">
                  <div className="truncate text-sm font-medium text-ink">{formatDateLong(date)}</div>
                  <div className="text-[11px] text-muted">วันที่มีรายงานทางการ</div>
                </div>
                <div className="text-center text-xs font-medium text-ink sm:hidden">
                  {formatDateLong(date)}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-10 shrink-0"
                  disabled={!canNext}
                  onClick={() => step(1)}
                  aria-label="วันถัดไป"
                >
                  <ChevronRight />
                </Button>
              </div>
            ) : null}
          </div>
        </div>
        <nav className="flex gap-1 border-t border-line px-2 py-1 sm:hidden">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-11 flex-1 items-center justify-center gap-2 rounded-md text-sm font-medium",
                  active ? "bg-sage text-ink" : "text-muted",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      {meta ? (
        <div className="border-b border-line bg-primary-soft/60 px-4 py-1.5 text-center text-[12px] text-primary-dark">
          {meta.live ? "ราคาทางการล่าสุด" : "ราคาทางการที่ตรวจสอบได้ล่าสุด"} · {formatDateLong(meta.asOf)}
          {meta.asOf < bangkokToday() ? " · แหล่งยังไม่ประกาศครบวันนี้" : ""}
          {meta.scrapedAt ? ` · ดึงเมื่อ ${formatTimeBangkok(meta.scrapedAt)} น.` : ""} ·{" "}
          {meta.sources.slice(0, 4).join(" · ")}
        </div>
      ) : null}
      <div className={cn("mx-auto max-w-6xl px-4 sm:px-6", flush ? "pb-4 pt-4" : "pb-16 pt-6")}>{children}</div>
    </div>
  );
}
