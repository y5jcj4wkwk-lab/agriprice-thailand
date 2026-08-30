import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatBaht, SOURCE_TYPE_LABEL } from "@/lib/format";
import type { Commodity, MarketPrice, MarketSource } from "@/lib/types";

type LeafletNS = typeof import("leaflet");

export function ThailandMap({
  sources,
  prices,
  commodities,
}: {
  sources: MarketSource[];
  prices: MarketPrice[];
  commodities: Commodity[];
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedIdRef = useRef<string | null>(null);
  selectedIdRef.current = selectedId;

  const bySource = useMemo(() => {
    const map = new Map<string, MarketPrice[]>();
    for (const p of prices) {
      const list = map.get(p.source_id) ?? [];
      list.push(p);
      map.set(p.source_id, list);
    }
    return map;
  }, [prices]);

  const commodityById = useMemo(
    () => new Map(commodities.map((c) => [c.id, c])),
    [commodities],
  );

  const selected = sources.find((s) => s.id === selectedId) ?? null;
  const selectedPrices = selected ? (bySource.get(selected.id) ?? []) : [];

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    let map: import("leaflet").Map | null = null;
    let cancelled = false;
    const markers: import("leaflet").Marker[] = [];

    (async () => {
      const leafletMod = await import("leaflet");
      const L = (leafletMod.default ?? leafletMod) as LeafletNS;
      if (cancelled || !hostRef.current) return;

      map = L.map(hostRef.current, {
        center: [13.6, 101.2],
        zoom: 6,
        minZoom: 5,
        maxZoom: 11,
        zoomControl: true,
        attributionControl: true,
        maxBounds: L.latLngBounds([4.8, 96.8], [21.2, 106.2]),
        maxBoundsViscosity: 0.8,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; OpenStreetMap &copy; CARTO",
        subdomains: "abcd",
      }).addTo(map);

      requestAnimationFrame(() => {
        map?.invalidateSize();
      });

      function iconFor(source: MarketSource, active: boolean) {
        return L.divIcon({
          className: "market-pin-wrap",
          html: `<div class="market-pin"><div class="market-pin-head" data-active="${active ? "true" : "false"}"></div><div class="market-pin-label">${source.province}</div></div>`,
          iconSize: [88, 42],
          iconAnchor: [44, 10],
        });
      }

      for (const source of sources) {
        const marker = L.marker([source.latitude, source.longitude], {
          icon: iconFor(source, selectedIdRef.current === source.id),
          keyboard: true,
          title: source.name,
        }).addTo(map);
        marker.on("click", () => setSelectedId(source.id));
        markers.push(marker);
      }
    })();

    return () => {
      cancelled = true;
      for (const m of markers) m.remove();
      map?.remove();
    };
  }, [sources]);

  return (
    <div className="relative h-[calc(100dvh-9.5rem)] min-h-[420px] overflow-hidden rounded-xl shadow-[var(--shadow-border)]">
      <div ref={hostRef} className="absolute inset-0" />
      {selected ? (
        <>
          <button
            type="button"
            className="absolute inset-0 z-10 bg-ink/20 md:bg-transparent"
            aria-label="ปิดรายละเอียดตลาด"
            onClick={() => setSelectedId(null)}
          />
          <aside className="absolute inset-x-0 bottom-0 z-20 max-h-[70%] overflow-y-auto rounded-t-2xl bg-surface p-5 shadow-[var(--shadow-border-hover)] md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-[380px] md:rounded-none">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wide text-faint">
                  {selected.province}
                </div>
                <h2 className="mt-0.5 text-base font-semibold text-ink">{selected.name}</h2>
                <p className="mt-1 text-xs text-muted">
                  {SOURCE_TYPE_LABEL[selected.source_type] ?? selected.source_type}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="flex size-10 items-center justify-center rounded-md text-muted hover:bg-sage hover:text-ink"
                aria-label="ปิด"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="mt-4 space-y-2">
              {selectedPrices.length === 0 ? (
                <p className="text-sm text-muted">ไม่มีรายงานราคา ณ วันที่เลือก</p>
              ) : (
                selectedPrices.map((price) => {
                  const cmd = commodityById.get(price.commodity_id);
                  if (!cmd) return null;
                  return (
                    <div
                      key={price.id}
                      className="flex items-center justify-between gap-3 rounded-md bg-sage/70 px-3 py-3"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-ink">{cmd.name_th}</div>
                        <div className="text-[11px] text-muted">{cmd.name_en}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold tabular text-ink">
                          {formatBaht(price.avg_price)}
                        </div>
                        <div className="text-[11px] text-muted">{price.unit}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="mt-4">
              <Badge variant="official">ราคาซื้อ ณ ตลาดนี้</Badge>
            </div>
          </aside>
        </>
      ) : (
        <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-md bg-surface/95 px-3 py-2 text-xs text-muted shadow-[var(--shadow-border)]">
          แตะหมุดเพื่อดูราคาซื้อ ณ ตลาดกลาง
        </div>
      )}
    </div>
  );
}
