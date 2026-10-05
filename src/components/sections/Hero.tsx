import { hero } from "@/content/site";
import {BookButton, TextLink} from "@/components/ui";
import { Magnetic, MaskLines } from "@/components/motion/primitives";
import { SignalTrace } from "@/components/signal/SignalTrace";
import { Stage } from "./hero/Stage";
import { HeroFigure } from "./hero/HeroFigure";

/**
 * Full-width type over a wide image, with a live EEG trace as the seam between
 * them. On load it plays as one composed entrance: eyebrow, the two headline
 * sentences, the trace switching on, the copy and actions, then the image.
 *
 * Phones read in a different order (copy and actions straight after the
 * headline, then the trace and image), handled with flex order so the DOM
 * keeps one reading order for assistive technology.
 *
 * On short desktop screens (a 1280x720 or 1366x768 laptop) the vertical
 * spacing tightens so the booking button lands above the fold.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="container-x pb-24 pt-10 md:pb-32 lg:pt-14 lg:[@media(max-height:52rem)]:pt-8">
      <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-x-6">
        <div className="order-1 lg:order-none lg:col-span-12">
          <MaskLines
            as="h1"
            id="hero-heading"
            trigger="mount"
            delay={0.12}
            lines={hero.title}
            className="display-1"
          />
        </div>

        {/* Edge to edge: the stage breaks out of the container so the sweep runs
            the full width of the screen. The trace keeps a constant rhythm per
            pixel, so one instance serves every screen size. */}
        <Stage cue={0.5} effect="wipe" className="order-3 ml-[calc(50%-50vw)] mt-10 w-screen max-w-none md:mt-16 lg:order-none lg:col-span-12 lg:mb-10 lg:mt-9 lg:[@media(max-height:52rem)]:mb-6 lg:[@media(max-height:52rem)]:mt-5">
          <SignalTrace kind="eeg" height={84} amplitude={0.3} strokeWidth={1.35} color="var(--brass-ink)" />
        </Stage>

        <div className="order-2 mt-8 lg:order-none lg:col-span-4 lg:mt-0">
          <Stage cue={0.66}>
            <p className="lede max-w-[34ch] text-muted">{hero.body}</p>
          </Stage>
          <Stage cue={0.78} className="mt-9 lg:[@media(max-height:52rem)]:mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-8 lg:flex-col lg:items-start lg:gap-4">
            <Magnetic className="w-full sm:w-auto">
              <BookButton size="lg" className="w-full justify-between! sm:w-auto" />
            </Magnetic>
            {/* Stacked, the link starts where the button's label starts (28px in). */}
            <TextLink href={hero.secondary.href} className="ml-7 min-h-11 self-start sm:ml-0 lg:ml-7">
              {hero.secondary.label}
            </TextLink>
          </Stage>
        </div>

        <HeroFigure className="order-4 mt-10 md:mt-12 lg:order-none lg:col-span-8 lg:mt-0" />
      </div>
    </section>
  );
}
