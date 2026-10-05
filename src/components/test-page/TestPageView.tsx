import { Fragment, type CSSProperties } from "react";
import { guides, patientGuide, services, testPages, type TestSlug } from "@/content/site";
import type { SignalKind } from "@/lib/signals";
import { Magnetic, MaskLines, Reveal, RevealGroup, RevealItem } from "@/components/motion/primitives";
import {BookButton, SmartLink, TextLink} from "@/components/ui";
import { SignalTrace } from "@/components/signal/SignalTrace";
import { GiantAbbr } from "./GiantAbbr";
import { PrintButton } from "./PrintButton";
import { TestIcon } from "./icons";

const signalKind: Record<TestSlug, SignalKind> = { eeg: "eeg", ncs: "ncs", emg: "emg" };

/* Each recording peaks at a different size, so the band evens them out. */
const bandAmplitude: Record<TestSlug, number> = { eeg: 0.58, ncs: 0.46, emg: 0.34 };

/*
 * Instrument Sans at display-1 weight and tracking averages just under half an
 * em per letter. The headline shrinks below its display size only when its
 * longest single word (Electroencephalography) would otherwise overflow.
 */
const EM_PER_LETTER = 0.5;

/*
 * Advance width of each abbreviation in em, in the condensed cut. Below lg the
 * abbreviation is sized to a constant share of the screen, so EMG (the widest)
 * clears the breadcrumb just as EEG does.
 */
const abbrWidthEm: Record<TestSlug, number> = { eeg: 1.24, ncs: 1.36, emg: 1.53 };

/*
 * Print: once-only reveals that never entered the viewport still carry their
 * hidden start state inline, so printing forces them to their resting state.
 */
const printReveal = "print:[&_[style*=opacity]]:opacity-100! print:[&_[style*=transform]]:transform-none!";

/**
 * A single test page (/tests/eeg, /tests/ncs, /tests/emg): an editorial title
 * with the abbreviation as a second typographic layer, the test's own live
 * signal as the hero visual, the preparation guide beside a sticky results
 * card, then the way on to the visit and the other two tests.
 */
export function TestPageView({ slug }: { slug: TestSlug }) {
  const page = testPages[slug];
  const guide = guides[slug];
  const others = services.items.filter((item) => item.slug !== slug);
  const longestWord = Math.max(...page.name.split(" ").map((word) => word.length));
  const fit = { "--fit": (longestWord * EM_PER_LETTER).toFixed(2) } as CSSProperties;
  const abbrFit = { "--abbr-w": abbrWidthEm[slug] } as CSSProperties;

  return (
    <div className={printReveal}>
      {/* a) Intro */}
      <section aria-labelledby="test-title" className="container-x pt-10 md:pt-16 print:pt-0">
        <Reveal y={12} className="print-hide">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-2 text-[0.875rem] text-muted">
              <li>
                <SmartLink href={page.breadcrumbRoot.href} className="-mx-1 inline-flex min-h-11 items-center rounded-full px-1 transition-colors duration-300 hover:text-ink">
                  {page.breadcrumbRoot.label}
                </SmartLink>
              </li>
              <li className="flex items-center gap-x-2">
                <TestIcon name="caret" size={12} className="text-line-strong" />
                <span aria-current="page" className="text-ink">
                  {page.breadcrumb}
                </span>
              </li>
            </ol>
          </nav>
        </Reveal>

        <div className="relative mt-14 md:mt-16 print:mt-0" style={abbrFit}>
          <GiantAbbr
            text={page.abbr}
            className="print-hide absolute bottom-[calc(100%+0.625rem)] right-0 text-[length:min(11rem,calc(48vw/var(--abbr-w)))] leading-[0.74] font-medium tracking-[-0.02em] text-paper [font-variation-settings:'wdth'_75] [-webkit-text-stroke:2px_var(--line-strong)] [paint-order:stroke_fill] lg:bottom-0 lg:text-[clamp(16rem,25vw,23rem)]"
          />
          <div className="relative">
            <div className="display-1 @container" style={fit}>
              <MaskLines as="h1" id="test-title" trigger="mount" lines={[page.name]} softFrom={1} className="display-1 text-[length:min(1em,calc(100cqi/var(--fit)))]" />
            </div>
            <div className="mt-8 max-w-[52ch] md:mt-10">
              <Reveal delay={0.25} y={20}>
                <p className="lede text-muted">{page.intro}</p>
              </Reveal>
              <Reveal delay={0.35} y={20} className="print-hide mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Magnetic className="w-full sm:w-auto">
                  <BookButton test={slug} size="lg" className="w-full justify-between! sm:w-auto" />
                </Magnetic>
                <PrintButton label={page.print} />
              </Reveal>
              <Reveal delay={0.45} y={20}>
                <p className="mt-8 max-w-[48ch] text-[0.875rem] leading-relaxed text-muted">{page.footnote}</p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/*
       * b) Signal band: this test's own recording, the page's hero visual. Its
       * caption is set in sentence case like the home focus band label, not as
       * a mono caps label: the eyebrow above already uses that voice.
       */}
      <div className="print-hide mt-16 border-y border-line md:mt-24">
        <div className="container-x pt-5 md:pt-6">
          <p className="text-[0.875rem] leading-normal text-muted lowercase first-letter:uppercase">{guide.meta}</p>
        </div>
        <SignalTrace
          kind={signalKind[slug]}
          mode="live"
          height={184}
          amplitude={bandAmplitude[slug]}
          points={360}
          color="var(--brass-ink)"
          baseline
          className="mb-3 h-[120px]! md:mb-4 md:h-[184px]!"
        />
      </div>

      {/* c) Detail: the preparation guide beside a sticky results card */}
      <div className="container-x section-y print:py-10">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-x-10">
          <section aria-labelledby="guide-title" className="lg:col-span-7 xl:col-span-8 xl:pr-12">
            <MaskLines as="h2" id="guide-title" lines={[guide.title]} softFrom={1} className="display-3" />
            <Reveal>
              <p className="lede mt-6 max-w-[56ch] text-muted">{guide.intro}</p>
            </Reveal>

            <div className="mt-14 grid gap-12 md:mt-16 md:grid-cols-2 md:gap-10">
              <div className="border-t border-line pt-7">
                <h3 className="title-3">{patientGuide.beforeHeading}</h3>
                <RevealGroup as="ul" className="mt-6 space-y-5">
                  {guide.before.map((item) => (
                    <RevealItem as="li" key={item} className="flex gap-3.5 text-muted">
                      <TestIcon name="check" size={20} className="mt-[3px] shrink-0 text-brass-ink" />
                      <span>{item}</span>
                    </RevealItem>
                  ))}
                </RevealGroup>
              </div>
              <div className="border-t border-line pt-7">
                <h3 className="title-3">{patientGuide.duringHeading}</h3>
                <RevealGroup className="mt-6 space-y-4">
                  {guide.during.map((paragraph) => (
                    <RevealItem as="p" key={paragraph} className="text-muted">
                      {paragraph}
                    </RevealItem>
                  ))}
                </RevealGroup>
              </div>
            </div>

            <Reveal className="mt-12 flex gap-3.5 border-t border-line pt-7 md:mt-14">
              <TestIcon name="info" size={20} className="mt-[3px] shrink-0 text-brass-ink" />
              <p className="text-ink">{guide.bottom}</p>
            </Reveal>

            <p className="mt-10 max-w-[64ch] text-[0.8125rem] leading-relaxed text-muted">
              {page.sources.before}
              {page.sources.links.map((link, i) => (
                <Fragment key={link.href}>
                  {i > 0 && page.sources.joiner}
                  <SmartLink
                    href={link.href}
                    external
                    className="inline-flex items-baseline gap-0.5 text-ink underline decoration-line-strong underline-offset-[3px] transition-[text-decoration-color] duration-300 hover:decoration-ink"
                  >
                    {link.label}
                    <TestIcon name="external" size={11} className="translate-y-px self-center" />
                  </SmartLink>
                </Fragment>
              ))}
              {page.sources.after}
            </p>
          </section>

          <aside aria-labelledby="after-title" className="lg:col-span-5 xl:col-span-4">
            <Reveal className="on-navy rounded-surface bg-navy p-8 text-on-navy dark:ring-1 dark:ring-on-navy-line md:p-10 lg:top-28 lg:motion-safe:sticky print:rounded-none print:border-t print:border-line print:bg-transparent print:px-0 print:pb-0 print:pt-8 print:text-ink print:[&_.headline-soft]:text-ink-2">
              <MaskLines as="h2" id="after-title" lines={page.after.title} className="display-3 mt-6" />
              <p className="mt-5 text-on-navy-muted print:text-muted">{page.after.body}</p>
              {/* A quiet way on, not a second primary action: the card is written for patients. */}
              <div className="print-hide mt-7">
                <TextLink tone="light" href={page.after.cta.href}>
                  {page.after.cta.label}
                </TextLink>
              </div>
            </Reveal>
          </aside>
        </div>
      </div>

      {/* d) Before your visit */}
      <section aria-labelledby="next-title" className="bg-paper-2">
        <div className="container-x grid gap-12 py-24 md:py-32 lg:grid-cols-12 lg:items-end lg:gap-x-10 print:py-10">
          <div className="lg:col-span-7">
            <MaskLines as="h2" id="next-title" lines={[page.next.title]} softFrom={1} className="display-2" />
            <Reveal>
              <p className="lede mt-6 max-w-[46ch] text-muted">{page.next.body}</p>
            </Reveal>
          </div>
          <RevealGroup as="ul" className="print-hide border-t border-line-strong lg:col-span-4 lg:col-start-9">
            {page.next.links.map((link) => (
              <RevealItem as="li" key={link.href} className="border-b border-line-strong">
                <TextLink href={link.href} className="min-h-16 w-full justify-between py-4 text-[1.0625rem]">
                  {link.label}
                </TextLink>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* e) Other tests */}
      <nav aria-label={page.otherTests} className="print-hide container-x py-20 md:py-28">
        <RevealGroup className="grid border-y border-line md:grid-cols-2">
          {others.map((item, i) => (
            <RevealItem key={item.slug} className={i > 0 ? "border-t border-line md:border-l md:border-t-0" : ""}>
              <SmartLink href={`/tests/${item.slug}`} className={`group flex h-full flex-col py-10 md:py-14 ${i > 0 ? "md:pl-12" : "md:pr-12"}`}>
                <span
                  className="display-3 block text-ink transition-[font-variation-settings] duration-700 ease-calm [font-variation-settings:'wdth'_75] group-hover:[font-variation-settings:'wdth'_100]"
                >
                  {item.abbr}
                </span>
                <span className="mt-6 block text-[0.9375rem] text-muted">{item.type}</span>
                <span className="title-3 mt-1 block">{item.name}</span>
                <SignalTrace kind={signalKind[item.slug]} mode="draw" height={64} strokeWidth={1.25} color="var(--brass-ink)" delay={0.15 + i * 0.2} className="mt-8" />
                <span className="mt-8 inline-flex items-center gap-2 self-start font-medium text-ink">
                  <span className="bg-no-repeat pb-1 transition-[background-size] duration-500 ease-calm [background-image:linear-gradient(var(--line-strong),var(--line-strong)),linear-gradient(var(--ink),var(--ink))] [background-position:0_100%,0_100%] [background-size:100%_1px,0%_1px] group-hover:[background-size:100%_1px,100%_1px]">
                    {item.link}
                  </span>
                  <TestIcon name="arrow" size={16} className="shrink-0 transition-transform duration-500 ease-calm group-hover:translate-x-1.5" />
                </span>
              </SmartLink>
            </RevealItem>
          ))}
        </RevealGroup>
      </nav>
    </div>
  );
}
