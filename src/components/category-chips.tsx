import { CATEGORY_LABEL } from "@/lib/format";
import type { CommodityCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const OPTIONS: Array<{ id: "all" | CommodityCategory; label: string }> = [
  { id: "all", label: "ทั้งหมด" },
  { id: "Rice", label: CATEGORY_LABEL.Rice },
  { id: "Rubber", label: CATEGORY_LABEL.Rubber },
  { id: "Palm", label: CATEGORY_LABEL.Palm },
  { id: "Cassava", label: CATEGORY_LABEL.Cassava },
  { id: "Corn", label: CATEGORY_LABEL.Corn },
];

export function CategoryChips({
  value,
  onChange,
}: {
  value: "all" | CommodityCategory;
  onChange: (next: "all" | CommodityCategory) => void;
}) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
      {OPTIONS.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              "h-10 shrink-0 rounded-full px-4 text-sm font-medium transition-colors duration-150",
              active
                ? "bg-ink text-primary-fg"
                : "bg-surface text-ink-soft shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
