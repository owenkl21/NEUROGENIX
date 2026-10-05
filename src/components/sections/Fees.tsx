import { fees } from "@/content/site";
import { SectionTitle } from "@/components/ui";
import { Reveal } from "@/components/motion/primitives";
import { FeesTimeline } from "./fees/FeesTimeline";
import { FeesNote } from "./fees/FeesNote";

/**
 * Fees and medical aid. A stacked header, then the three arrangements on a
 * timeline that draws itself on entering view, then the caveat in a quiet
 * panel. Below 1024px the timeline turns vertical.
 */
export function Fees() {
  return (
    <section id="fees" aria-labelledby="fees-heading" className="section-y">
      <div className="container-x">
        <div className="max-w-[60rem]">
          <SectionTitle id="fees-heading" lines={fees.title} />
          <Reveal as="p" delay={0.15} className="lede mt-6 max-w-[52ch] text-muted md:mt-8">
            {fees.body}
          </Reveal>
        </div>

        <FeesTimeline steps={fees.steps} className="mt-20 md:mt-28" />

        <FeesNote text={fees.footnote} className="mt-16 md:mt-24 lg:w-2/3" />
      </div>
    </section>
  );
}
