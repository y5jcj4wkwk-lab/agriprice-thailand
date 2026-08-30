import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TrendIcon } from "@/components/trend";
import { TREND_LABEL } from "@/lib/format";
import type { AiMarketInsight } from "@/lib/types";

export function AiInsightBox({ insight }: { insight: AiMarketInsight | null }) {
  if (!insight) {
    return (
      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h2 className="text-sm font-semibold text-ink">บทวิเคราะห์แนวโน้ม</h2>
        <p className="mt-2 text-sm text-muted">ยังไม่มีบทวิเคราะห์สำหรับวันที่เลือก</p>
      </section>
    );
  }
  const bullets = insight.summary_th.split("\n").filter(Boolean);
  const pct = Math.round(insight.confidence_score * 100);
  return (
    <section className="relative overflow-hidden rounded-xl bg-surface p-5 shadow-[var(--shadow-ai)]">
      <div className="pointer-events-none absolute -right-8 -top-10 size-36 rounded-full bg-ai/10" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-ai">
          <Sparkles className="size-4" />
          <h2 className="text-sm font-semibold">บทวิเคราะห์จากราคาทางการ</h2>
        </div>
        <Badge variant="ai">ความเชื่อมั่น {pct}%</Badge>
      </div>
      <div className="relative mt-4 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ai-soft px-3 py-1 text-sm font-semibold text-ai">
          <TrendIcon direction={insight.trend_direction} />
          {TREND_LABEL[insight.trend_direction]}
        </span>
      </div>
      <ul className="relative mt-4 space-y-2 text-sm leading-6 text-ink-soft">
        {bullets.map((line) => (
          <li key={line} className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-ai" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
      {insight.key_drivers.length > 0 ? (
        <div className="relative mt-4 flex flex-wrap gap-2">
          {insight.key_drivers.map((driver) => (
            <span
              key={driver}
              className="rounded-full bg-ai-soft/70 px-3 py-1 text-xs font-medium text-ai"
            >
              {driver}
            </span>
          ))}
        </div>
      ) : null}
      <p className="relative mt-5 border-t border-line pt-3 text-[11px] leading-5 text-faint">
        คำนวณจากชุดราคาทางการย้อนหลัง · ไม่ใช่คำแนะนำการซื้อขาย · {insight.model_version}
      </p>
    </section>
  );
}
