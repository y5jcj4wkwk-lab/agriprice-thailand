import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-8", className)}
      aria-hidden="true"
      fill="none"
    >
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <path
        d="M16 24V13.5"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16 18.5C16 18.5 12.2 17.2 10.4 13.8C8.8 10.8 10.6 8 10.6 8C10.6 8 13.8 9.2 15.2 12.4C16 14.2 16 16.2 16 18.5Z"
        fill="white"
        fillOpacity="0.95"
      />
      <path
        d="M16 17.2C16 17.2 19.6 15.6 21.2 12.4C22.6 9.6 21.1 7.2 21.1 7.2C21.1 7.2 18.2 8.6 16.8 11.6C16.2 13.2 16 15 16 17.2Z"
        fill="white"
        fillOpacity="0.82"
      />
    </svg>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark />
      <div className="leading-tight">
        <div className="text-[15px] font-semibold tracking-tight text-ink">
          AgriPrice
        </div>
        {!compact ? (
          <div className="text-[11px] font-medium text-muted">ประเทศไทย</div>
        ) : null}
      </div>
    </div>
  );
}
