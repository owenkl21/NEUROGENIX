import { practice } from "@/content/site";
import { Reveal } from "@/components/motion/primitives";
import { SectionTitle, TextLink } from "@/components/ui";
import { ValueRows } from "./practice/ValueRows";

/**
 * The practice, and home's handover to Your visit. Text only on purpose: the
 * rooms have just been shown in A look inside, so this section adds what a
 * photograph cannot, how a referral shapes the assessment, then points on.
 * An editorial split above 1024px (headline left, the copy and ruled values
 * right); one column below it, headline first.
 */
export function Practice() {
  const [lede, ...rest] = practice.body;

  return (
    <section id="practice" aria-labelledby="practice-heading" className="section-y">
      <div className="container-x grid gap-y-10 md:gap-y-12 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-5">
          <SectionTitle id="practice-heading" lines={practice.title} />
        </div>

        <div className="lg:col-span-6 lg:col-start-7 lg:pt-2">
          <Reveal>
            <p className="lede max-w-[44ch] text-ink">{lede}</p>
            {rest.map((paragraph) => (
              <p key={paragraph} className="mt-5 max-w-[50ch] text-muted">
                {paragraph}
              </p>
            ))}
          </Reveal>

          <div className="mt-12 md:mt-14">
            <ValueRows values={practice.values} />
          </div>

          <Reveal className="mt-10" y={12}>
            <TextLink href={practice.link.href} className="min-h-11">
              {practice.link.label}
            </TextLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
