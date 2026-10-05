import { fees } from "@/content/site";
import { Eyebrow, SectionTitle } from "@/components/ui";
import { Reveal } from "@/components/motion/primitives";
import { FeesTimeline } from "./fees/FeesTimeline";
import { FeesNote } from "./fees/FeesNote";

/**
 * Fees and medical aid. A stacked header under its eyebrow (the section the
 * test pages' "Fees and medical aid" link lands on, so it names itself), then
 * the three arrangements on a timeline that draws itself on entering view,
 * then the caveat in a quiet panel. Below 1024px the timeline turns vertical.
 * On /your-visit it is the only section eyebrow below the intro's, so no two
 * neighbouring sections carry one.
 */
export function Fees() {
  return (
    <section id="fees" aria-labelledby="fees-heading" className="section-y">
      <div className="container-x">
        <div className="max-w-[60rem]">
          <Reveal y={10}>
            <Eyebrow>{fees.eyebrow}</Eyebrow>
          </Reveal>
          <SectionTitle id="fees-heading" lines={fees.title} className="mt-7" />
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
