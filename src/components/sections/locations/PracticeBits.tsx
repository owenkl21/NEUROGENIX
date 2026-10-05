import { locations, services, type Practice, type TestSlug } from "@/content/site";
import styles from "./map.module.css";

/** The short test names (EEG, NCS, EMG), taken from the services copy. */
const abbr = Object.fromEntries(services.items.map((s) => [s.slug, s.abbr])) as Record<TestSlug, string>;

/** Small pills naming the tests a practice offers. */
export function TestChips({ tests, className = "" }: { tests: Practice["tests"]; className?: string }) {
  return (
    <span className={`flex flex-wrap gap-1.5 ${className}`}>
      <span className="sr-only">{locations.testsLabel}: </span>
      {tests.map((t) => (
        <span key={t} className="inline-flex h-6 items-center rounded-full border border-line-strong/70 px-2.5 text-[0.75rem] font-medium leading-none text-ink-2">
          {abbr[t]}
        </span>
      ))}
    </span>
  );
}

/** The map pin, drawn inline: the list's echo of the marker it controls. */
export function PinGlyph({ active }: { active: boolean }) {
  return (
    <span aria-hidden="true" className={active ? styles.isActive : undefined}>
      <span className={styles.pin}>
        <span className={styles.pulse} />
        <span className={styles.dot} />
      </span>
    </span>
  );
}
