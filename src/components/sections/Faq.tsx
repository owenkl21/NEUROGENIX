import { faq } from "@/content/site";
import { SectionTitle } from "@/components/ui";
import { Reveal } from "@/components/motion/primitives";
import { FaqAccordion } from "./faq/FaqAccordion";

/**
 * Questions. An offset composition: the headline holds the top left, the
 * answers step in from column five beneath it, so the section reads on a
 * diagonal. Below 768px it is a single column with a full-width list.
 */
export function Faq() {
  return (
    <section id="questions" aria-labelledby="faq-heading" className="section-y">
      <div className="container-x grid grid-cols-1 gap-y-14 md:grid-cols-12 md:gap-x-8 md:gap-y-20 lg:gap-y-24">
        <div className="md:col-span-7 lg:col-span-5">
          <SectionTitle id="faq-heading" lines={faq.title} />
          <Reveal as="p" delay={0.15} className="lede mt-6 max-w-[38ch] text-muted md:mt-8">
            {faq.body}
          </Reveal>
        </div>
        <div className="md:col-span-10 md:col-start-3 lg:col-span-8 lg:col-start-5">
          <FaqAccordion items={faq.items} />
        </div>
      </div>
    </section>
  );
}
