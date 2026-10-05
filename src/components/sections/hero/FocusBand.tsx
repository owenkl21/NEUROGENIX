"use client";

import { Fragment, useRef, useSyncExternalStore } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { focus } from "@/content/site";
import { TextLink } from "@/components/ui";

/**
 * The scroll-lit statement. As the band travels up the viewport each word of
 * the sentence brightens in turn, carrying the eye from "Understanding"
 * through to "brain, nerves and muscles." It is the only scroll-lit text on
 * the site.
 *
 * The heading stays one ordinary sentence for assistive technology: words are
 * plain inline spans, only their opacity changes. The server (and readers
 * without JavaScript or with reduced motion) get every word at full strength.
 */

const DIM = 0.15;
/** How much of the scroll range each word takes to light, as a share of the whole. */
const SPREAD = 0.2;

type Token = { text: string; strong: boolean };

const tokens: Token[] = [
  ...focus.statement[0].split(" ").map((text) => ({ text, strong: false })),
  ...focus.statement[1].split(" ").map((text) => ({ text, strong: true })),
];

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
  const last = tokens.length - 1;

  return (
    <div className="grid gap-8 border-y border-line py-20 md:py-28 lg:grid-cols-12 lg:items-baseline lg:gap-x-6 lg:py-36">
      <p className="text-[0.875rem] leading-normal text-muted lg:col-span-3">
        <span aria-hidden="true" className="mr-3 inline-block h-px w-6 bg-brass-ink align-middle" />
        {focus.label}
      </p>

      <div className="lg:col-span-9">
        <h2 ref={ref} id="focus-heading" className="display-2 max-w-[22ch]">
          {tokens.map((token, i) => {
            // Consecutive, slightly overlapping windows across the scroll range.
            const start = (i / last) * (1 - SPREAD);
            return (
              <Fragment key={i}>
                <Word progress={scrollYProgress} range={[start, start + SPREAD]} lit={lit} strong={token.strong}>
                  {token.text}
                </Word>
                {i < last ? " " : null}
              </Fragment>
            );
          })}
        </h2>
        <TextLink href={focus.link.href} className="mt-10 min-h-11 md:mt-12">
          {focus.link.label}
        </TextLink>
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
