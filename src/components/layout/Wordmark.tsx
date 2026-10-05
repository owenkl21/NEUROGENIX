import { Logo } from "./Logo";

/**
 * The logo as used in the site chrome: NEURO and the line through the brain
 * in brand blue, the rest in brand black on light grounds and white on dark
 * ones (the dark theme, and the brand-black footer).
 */
export function Wordmark({ tone = "ink", className = "" }: { tone?: "ink" | "light"; className?: string }) {
  return (
    <Logo
      tone={tone === "light" ? "colour" : "auto"}
      className={`block h-10 w-auto shrink-0 sm:h-12 ${tone === "light" ? "text-on-deep" : "text-ink"} ${className}`}
    />
  );
}
