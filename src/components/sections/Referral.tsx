import { Reveal } from "@/components/motion/primitives";
import { ReferralSteps } from "./referral/ReferralSteps";
import { ReferralPack } from "./referral/ReferralPack";
import { ReferralFacts } from "./referral/ReferralFacts";

/**
 * The body of /for-doctors, labelled by the page H1 (`labelledBy`). The
 * referral pack waits in a sticky navy aside while the three steps fill a
 * brass line as they are read. The open questions close the section as ruled
 * rows whose two columns line up with the pack and the steps above.
 *
 * Below 1024px everything stacks in reading order: steps (line on the left),
 * the pack, then the open questions. The single track is minmax(0, 1fr), so
 * nothing inside can widen the page past a narrow screen. The aside only
 * sticks on large, tall screens and never under reduced motion.
 */
export function Referral({ labelledBy }: { labelledBy: string }) {
  return (
    <section id="referring-doctors" aria-labelledby={labelledBy} className="section-y pt-12 md:pt-16">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-x-12">
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
