"use client";

import { useMemo } from "react";
import { motion, type Transition, type Variants } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { EASE } from "@/components/motion/primitives";

type Step = { number: string; title: string; body: string };

/*
 * The line travels node to node like a signal along a nerve: it leaves each
 * node, arrives at the next, and the node lights the moment it is reached.
 * Every part shares one clock so the line, the nodes and the copy stay in
 * step. Total run is about 1.6s.
 */
const START = 0.1;
const LEG = 0.45;
const TAIL = 0.6;
const LINE_EASE = [0.5, 0, 0.25, 1] as const;
const reached = (i: number) => START + i * LEG;

/**
 * Variants are built per motion preference. The initial state is the same on
 * the server and the client (so hydration matches); under reduced motion every
 * transition is instant, so the timeline simply appears complete.
 */
function buildVariants(reduce: boolean) {
  const t = (transition: Transition): Transition => (reduce ? { duration: 0 } : transition);
  const legTransition = (i: number) => t({ duration: LEG, ease: LINE_EASE, delay: reached(i) });
  return {
    legX: {
      hidden: { scaleX: 0 },
      show: (i: number) => ({ scaleX: 1, transition: legTransition(i) }),
    } satisfies Variants,
    legY: {
      hidden: { scaleY: 0 },
      show: (i: number) => ({ scaleY: 1, transition: legTransition(i) }),
    } satisfies Variants,
    tail: {
      hidden: { scaleX: 0 },
      show: (i: number) => ({ scaleX: 1, transition: t({ duration: TAIL, ease: EASE, delay: reached(i) }) }),
    } satisfies Variants,
    lit: {
      hidden: { opacity: 0, scale: 0.86 },
      show: (i: number) => ({ opacity: 1, scale: 1, transition: t({ duration: 0.5, ease: EASE, delay: reached(i) }) }),
    } satisfies Variants,
    halo: {
      hidden: { opacity: 0, scale: 1 },
      show: (i: number) =>
        reduce
          ? { opacity: 0, scale: 1, transition: { duration: 0 } }
          : {
              opacity: [0, 0.55, 0],
              scale: [1, 1.15, 1.85],
              transition: { duration: 1.1, ease: "easeOut", times: [0, 0.2, 1], delay: reached(i) },
            },
    } satisfies Variants,
    copy: {
      hidden: { opacity: 0, y: 16 },
      show: (i: number) => ({ opacity: 1, y: 0, transition: t({ duration: 0.9, ease: EASE, delay: reached(i) + 0.06 }) }),
    } satisfies Variants,
  };
}

const timeline: Variants = { hidden: {}, show: {} };

/**
 * Three steps on a hairline track. From 1024px the steps sit in a row and the
 * signal line draws left to right through their nodes. Below that (phones and
 * portrait tablets) the track runs down the left edge and the nodes stack.
 */
export function FeesTimeline({ steps, className = "" }: { steps: Step[]; className?: string }) {
  const reduce = useReducedMotion() ?? false;
  const v = useMemo(() => buildVariants(reduce), [reduce]);
  const last = steps.length - 1;

  return (
    <motion.ol
      className={`relative grid grid-cols-1 lg:grid-cols-3 ${className}`}
      variants={timeline}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
    >
      {/* Row track: from the first node's centre to the right edge, fading out past the last step. */}
      <span
        aria-hidden="true"
        className="absolute left-6 right-0 top-6 hidden h-px bg-line [mask-image:linear-gradient(to_right,var(--ink)_78%,transparent)] lg:block"
      />

      {steps.map((step, i) => (
        <li key={step.number} className="relative grid grid-cols-[3rem_1fr] gap-x-5 pb-10 last:pb-0 sm:gap-x-7 md:pb-12 lg:block lg:pb-0 lg:pr-16">
          {/* Signal leg from this node to the next, or the fading tail after the last. */}
          {i < last ? (
            <>
              <motion.span aria-hidden="true" variants={v.legX} custom={i} className="absolute left-6 top-6 hidden h-px w-full origin-left bg-signal-ink lg:block" />
              <span aria-hidden="true" className="absolute -bottom-6 left-6 top-6 w-px bg-line lg:hidden" />
              <motion.span aria-hidden="true" variants={v.legY} custom={i} className="absolute -bottom-6 left-6 top-6 w-px origin-top bg-signal-ink lg:hidden" />
            </>
          ) : (
            <motion.span
              aria-hidden="true"
              variants={v.tail}
              custom={i}
              className="absolute left-6 right-0 top-6 hidden h-px origin-left bg-signal-ink [mask-image:linear-gradient(to_right,var(--ink)_20%,transparent)] lg:block"
            />
          )}

          {/* The list carries the order for assistive tech, so the numerals are visual only. */}
          <div aria-hidden="true" className="relative size-12">
            <span className="numeral absolute inset-0 grid place-items-center rounded-full border border-line bg-paper text-[0.8125rem] text-muted">{step.number}</span>
            <motion.span variants={v.halo} custom={i} className="absolute inset-0 rounded-full border border-signal-ink opacity-0" />
            <motion.span
              variants={v.lit}
              custom={i}
              className="numeral absolute inset-0 grid place-items-center rounded-full border border-signal-ink bg-paper text-[0.8125rem] text-signal-ink"
            >
              {step.number}
            </motion.span>
          </div>

          <motion.div variants={v.copy} custom={i} className="pt-2.5 lg:mt-9 lg:pt-0">
            <h3 className="title-3">{step.title}</h3>
            <p className="mt-3 max-w-[34ch] text-muted">{step.body}</p>
          </motion.div>
        </li>
      ))}
    </motion.ol>
  );
}
