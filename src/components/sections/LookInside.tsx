import { InsideScene } from "./inside/InsideScene";

/**
 * A look inside. The page's one full-bleed navy block. On desktop with motion
 * allowed the section is 240vh tall and its stage pins while the testing room
 * opens to fill the screen; the height lives here, in CSS, so the page is the
 * right length before any script runs and anchors below never jump.
 */
export function LookInside() {
  return (
    <section id="look-inside" aria-labelledby="inside-heading" className="on-navy relative bg-navy text-on-navy lg:motion-safe:h-[240vh]">
      <InsideScene />
    </section>
  );
}
