import { Reveal } from "@/components/motion/primitives";
import { GuideTabs } from "./guide/GuideTabs";
import { VisitCard } from "./guide/VisitCard";

/**
 * The body of /your-visit, labelled by the page H1 (`labelledBy`). Choose your
 * test on the left (a short summary that hands over to the test's own page)
 * and, beside it on large screens, the navy card of essentials for every
 * visit. Below 1024px the card follows the tabs in the normal flow.
 *
 * Both reveals fire as soon as any part enters view: the tabs and the card's
 * button take keyboard focus, and the browser scrolls a focused control only
 * just into view, so a larger threshold could leave it focused but invisible.
 */
export function PatientGuide({ labelledBy }: { labelledBy: string }) {
  return (
    <section id="patient-guide" aria-labelledby={labelledBy} className="section-y pt-10 md:pt-16">
      <div className="container-x grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-10">
        <Reveal className="lg:col-span-6 lg:flex lg:flex-col" amount={0}>
          <GuideTabs />
        </Reveal>

        {/* The top padding lines the card up with the sheet, under the 58px tab track. */}
        <div className="lg:col-span-6 lg:pt-[82px]">
          <Reveal delay={0.12} amount={0}>
            <VisitCard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
