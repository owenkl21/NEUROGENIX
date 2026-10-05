import { FocusBand } from "./hero/FocusBand";

/**
 * A calm band between the hero and the services: one statement, lit word by
 * word as it scrolls through, framed by hairlines. No eyebrow; the plain
 * sentence-case label beside it is deliberately not an uppercase label.
 */
export function FocusStrip() {
  return (
    <section aria-labelledby="focus-heading" className="container-x">
      <FocusBand />
    </section>
  );
}
