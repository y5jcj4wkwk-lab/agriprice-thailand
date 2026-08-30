import { ChangeBadge } from "@/components/trend";
import { formatBaht, REGION_LABEL, SOURCE_TYPE_LABEL } from "@/lib/format";
import type { MarketPrice, MarketSource } from "@/lib/types";

export function MarketTable({
  rows,
  nationalAvg,
}: {
  rows: Array<{ source: MarketSource; price: MarketPrice; prev: MarketPrice | null }>;
  nationalAvg: number;
}) {
  if (rows.length === 0) {
    return (
      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h2 className="text-sm font-semibold text-ink">ราคาแยกตามแหล่ง</h2>
        <p className="mt-2 text-sm text-muted">ไม่มีรายงานราคาในวันที่เลือก</p>
      </section>
    );
  }
  return (
    <section className="overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]">
      <div className="border-b border-line px-5 py-4">
        <h2 className="text-sm font-semibold text-ink">ราคาแยกตามแหล่ง</h2>
        <p className="text-xs text-muted">ตัวเลขจากเว็บทางการตามจุดที่รายงาน — ไม่ได้ประมาณส่วนต่างรายจังหวัด</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-sage/60 text-xs font-medium text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">ตลาด / จังหวัด</th>
              <th className="px-3 py-3 font-medium">แหล่งข้อมูล</th>
              <th className="px-3 py-3 text-right font-medium">ต่ำสุด</th>
              <th className="px-3 py-3 text-right font-medium">เฉลี่ย</th>
              <th className="px-3 py-3 text-right font-medium">สูงสุด</th>
              <th className="px-3 py-3 text-right font-medium">เปลี่ยน</th>
              <th className="px-5 py-3 text-right font-medium">เทียบค่าเฉลี่ย</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ source, price, prev }) => {
              const change =
                prev && prev.avg_price !== 0
                  ? ((price.avg_price - prev.avg_price) / prev.avg_price) * 100
                  : null;
              const vs = nationalAvg ? ((price.avg_price - nationalAvg) / nationalAvg) * 100 : 0;
              return (
                <tr key={source.id} className="border-t border-line">
                  <td className="px-5 py-3">
                    <div className="font-medium text-ink">{source.province}</div>
                    <div className="text-xs text-muted">{source.name}</div>
                    <div className="text-[11px] text-faint">{REGION_LABEL[source.region] ?? source.region}</div>
                  </td>
                  <td className="px-3 py-3 text-xs text-muted">
                    {SOURCE_TYPE_LABEL[source.source_type] ?? source.source_type}
                  </td>
                  <td className="px-3 py-3 text-right tabular">{formatBaht(price.min_price)}</td>
                  <td className="px-3 py-3 text-right tabular font-medium">{formatBaht(price.avg_price)}</td>
                  <td className="px-3 py-3 text-right tabular">{formatBaht(price.max_price)}</td>
                  <td className="px-3 py-3 text-right">
                    <ChangeBadge value={change} />
                  </td>
                  <td className="px-5 py-3 text-right text-xs tabular text-muted">
                    {Math.abs(vs) < 0.005 ? "เท่าเฉลี่ย" : `${vs > 0 ? "+" : ""}${vs.toFixed(2)}%`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
