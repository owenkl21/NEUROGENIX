import { site } from "@/content/site";

/**
 * The practice signage set in type: wide-tracked caps over a small mono
 * descriptor, beside a simple N mark drawn as a single continuous stroke.
 */
export function Wordmark({ tone = "ink", className = "" }: { tone?: "ink" | "light"; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Mark tone={tone} />
      <span className="flex flex-col leading-none">
        <span className={`text-[1.0625rem] font-semibold tracking-[0.2em] ${tone === "light" ? "text-on-navy" : "text-ink"}`}>{site.wordmark}</span>
        <span className={`mt-1.5 font-mono text-[0.5625rem] tracking-[0.34em] ${tone === "light" ? "text-on-navy-muted" : "text-muted"}`}>{site.descriptor}</span>
      </span>
    </span>
  );
}

export function Mark({ tone = "ink", size = 34 }: { tone?: "ink" | "light"; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden="true" focusable="false" className="shrink-0">
      <rect width="34" height="34" rx="9" fill={tone === "light" ? "var(--on-navy)" : "var(--navy)"} />
      <path d="M11 24V10.5L23 23.5V10" fill="none" stroke="var(--brass)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
