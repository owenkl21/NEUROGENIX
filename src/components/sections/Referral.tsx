import { referral } from "@/content/site";
import { Eyebrow, SectionTitle } from "@/components/ui";
import { Reveal } from "@/components/motion/primitives";
import { ReferralSteps } from "./referral/ReferralSteps";
import { ReferralPack } from "./referral/ReferralPack";
import { ReferralFacts } from "./referral/ReferralFacts";

/**
 * For referring doctors. The headline and lede open the section; below them
 * the referral pack waits in a sticky navy aside while the three steps fill a
 * brass line as they are read. Open questions close the section as a ruled row.
 *
 * Below 1024px everything stacks in reading order: heading, lede, steps (line
 * on the left), the pack, then the facts, each under its own hairline. The
 * aside only sticks on large, tall screens and never under reduced motion. *
 * On an inner page that opens with PageIntro, pass `labelledBy` (the page H1
 * id): the section then drops its own headline and sits closer to the intro.
 */
export function Referral({ labelledBy }: { labelledBy?: string } = {}) {
  const lead = Boolean(labelledBy);
  return (
    <section id="referring-doctors" aria-labelledby={labelledBy ?? "referral-heading"} className={`section-y ${lead ? "pt-16 md:pt-24" : ""}`}>
      <div className="container-x">
        {!lead && <div className="max-w-[52rem]">
          <Reveal>
            <Eyebrow>{referral.eyebrow}</Eyebrow>
          </Reveal>
          <SectionTitle id="referral-heading" lines={referral.title} className="mt-7" />
          <Reveal as="p" className="lede mt-7 max-w-[56ch] text-muted">
            {referral.body}
          </Reveal>
        </div>}

        <div className={`${lead ? "" : "mt-16 sm:mt-20 lg:mt-28"} grid gap-16 lg:grid-cols-12 lg:gap-x-12`}>
          <div className="lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:pt-2">
            <ReferralSteps />
          </div>
          <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:self-start lg:top-[calc(var(--header-h)_+_40px)] lg:motion-safe:[@media(min-height:46rem)]:sticky">
            <Reveal>
              <ReferralPack />
            </Reveal>
          </div>
        </div>

        <div className="mt-20 md:mt-28 lg:mt-36">
          <ReferralFacts />
        </div>
      </div>
    </section>
  );
}
