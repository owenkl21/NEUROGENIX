"use client";

import { Fragment, useRef, useSyncExternalStore } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { focus } from "@/content/site";
import { Readout, type Channel } from "../focus/Readout";

/**
 * The scroll-lit statement. As the band travels up the viewport each word of
 * the sentence brightens in turn, carrying the eye from "Understanding"
 * through to "brain, nerves and muscles." It is the only scroll-lit text on
 * the site.
 *
 * Beside it (above it on phones) a three channel readout follows the same
 * progress: EEG, NCS and EMG each wake with a live sweep as "brain", "nerves"
 * and "muscles" light, so the sentence and the instruments tell one story.
 *
 * The heading stays one ordinary sentence for assistive technology: words are
 * plain inline spans, only their opacity changes. The server (and readers
 * without JavaScript or with reduced motion) get every word at full strength
 * and every channel visible and still.
 *
 * The band is a statement and nothing else. It carries no link: the one way
 * on to Your visit from home is the practice section at the end of the page.
 */

const DIM = 0.15;
/** How much of the scroll range each word takes to light, as a share of the whole. */
const SPREAD = 0.2;

type Token = { text: string; strong: boolean };

const tokens: Token[] = [
  ...focus.statement[0].split(" ").map((text) => ({ text, strong: false })),
  ...focus.statement[1].split(" ").map((text) => ({ text, strong: true })),
];
const last = tokens.length - 1;

/** Consecutive, slightly overlapping windows across the scroll range, one per word. */
const wordRange = (i: number): [number, number] => {
  const start = (i / last) * (1 - SPREAD);
  return [start, start + SPREAD];
};

/*
 * The channels follow the three things the second sentence names, in order:
 * its first word (brain), its second (nerves) and its last (muscles), which
 * is also the order of the tests in services.items (EEG, NCS, EMG).
 */
const strongStart = tokens.findIndex((token) => token.strong);
const channels: Channel[] = [strongStart, strongStart + 1, last].map((i) => ({ range: wordRange(i) }));

const subscribe = () => () => {};
const useHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

export function FocusBand() {
  // The scroll range follows the sentence itself rather than the padded band,
  // so the last word lights while the statement sits just above the middle of
  // the screen, where it is being read, instead of after it has passed.
  const ref = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  const lit = hydrated && !reduce;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });

  return (
    <div className="grid gap-12 border-y border-line py-16 md:gap-14 md:py-24 lg:grid-cols-12 lg:items-start lg:gap-x-6 lg:py-36">
      {/* Columns 1 to 4 and 5 to 12, the same split as the hero's copy and image above. */}
      <div className="lg:col-span-4 lg:pr-8 xl:pr-16">
        <Readout progress={scrollYProgress} channels={channels} lit={lit} />
      </div>

      <div className="lg:col-span-8">
        <h2 ref={ref} id="focus-heading" className="display-2 max-w-[22ch]">
          {tokens.map((token, i) => (
            <Fragment key={i}>
              <Word progress={scrollYProgress} range={wordRange(i)} lit={lit} strong={token.strong}>
                {token.text}
              </Word>
              {i < last ? " " : null}
            </Fragment>
          ))}
        </h2>
      </div>
    </div>
  );
}

function Word({
  progress,
  range,
  lit,
  strong,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  lit: boolean;
  strong: boolean;
  children: string;
}) {
  const opacity = useTransform(progress, range, [DIM, 1]);
  return (
    <motion.span className={strong ? "font-medium text-ink" : "font-normal text-ink-2"} style={{ opacity: lit ? opacity : 1 }}>
      {children}
    </motion.span>
  );
}
