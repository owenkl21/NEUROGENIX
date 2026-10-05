import { locations } from "@/content/site";
import { SectionTitle } from "@/components/ui";
import { Reveal } from "@/components/motion/primitives";
import { LocationStage } from "./locations/LocationStage";

/**
 * Locations: wide image with an overlapping detail panel. The headline and
 * lede sit top left, the photograph spans the container and the panel rests
 * on its lower right corner, so the eye travels in one diagonal. *
 * On an inner page that opens with PageIntro, pass `labelledBy` (the page H1
 * id): the section then drops its own headline and sits closer to the intro.
 */
export function Locations({ labelledBy }: { labelledBy?: string } = {}) {
  const lead = Boolean(labelledBy);
  return (
    <section id="locations" aria-labelledby={labelledBy ?? "locations-heading"} className={`section-y ${lead ? "pt-2 md:pt-4" : ""}`}>
      <div className="container-x">
        {!lead && (
          <header className="max-w-[46rem]">
            <SectionTitle id="locations-heading" lines={locations.title} />
            <Reveal as="p" delay={0.1} className="lede mt-6 max-w-[52ch] text-muted md:mt-8">
              {locations.body}
            </Reveal>
          </header>
        )}

        <LocationStage />
      </div>
    </section>
  );
}
