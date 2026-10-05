import { patientGuide } from "@/content/site";
import { Eyebrow, SectionTitle } from "@/components/ui";
import { Reveal } from "@/components/motion/primitives";
import { GuideTabs } from "./guide/GuideTabs";
import { GuideSources } from "./guide/GuideSources";
import { VisitCard } from "./guide/VisitCard";

/**
 * Patient guide. Tabs for each test on the left, and a navy card of visit
 * essentials that stays in view beside them on large screens. Below 1024px
 * the card follows the guide in the normal flow. *
 * On an inner page that opens with PageIntro, pass `labelledBy` (the page H1
 * id): the section then drops its own headline and sits closer to the intro.
 */
export function PatientGuide({ labelledBy }: { labelledBy?: string } = {}) {
  const lead = Boolean(labelledBy);
  return (
    <section id="patient-guide" aria-labelledby={labelledBy ?? "guide-heading"} className={`section-y ${lead ? "pt-16 md:pt-24" : ""}`}>
      <div className="container-x">
        {!lead && <div>
          <Reveal>
            <Eyebrow>{patientGuide.eyebrow}</Eyebrow>
          </Reveal>
          <SectionTitle id="guide-heading" lines={patientGuide.title} className="mt-7" />
          <Reveal delay={0.15}>
            <p className="lede mt-7 max-w-[54ch] text-muted">{patientGuide.body}</p>
          </Reveal>
        </div>}

        <div className={`${lead ? "" : "mt-14 md:mt-20"} grid gap-6 md:gap-8 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-10`}>
          <Reveal className="lg:col-span-7 xl:col-span-8" amount={0.1}>
            <GuideTabs />
          </Reveal>

          {/* The column stretches to the row height so the card has room to stick.
              The top padding lines the card up with the sheet, under the 58px tab track. */}
          <div className="lg:col-span-5 lg:pt-[82px] xl:col-span-4">
            <div className="motion-safe:lg:sticky motion-safe:lg:top-[calc(var(--header-h)+32px)]">
              <Reveal delay={0.12} amount={0.1}>
                <VisitCard />
              </Reveal>
            </div>
          </div>
        </div>

        <Reveal className="mt-12 md:mt-14 lg:w-7/12 xl:w-8/12">
          <GuideSources />
        </Reveal>
      </div>
    </section>
  );
}
