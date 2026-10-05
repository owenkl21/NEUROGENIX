"use client";

import { motion, type Variants } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { DURATION, EASE } from "@/components/motion/primitives";

type Value = { title: string; body: string };

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};

const row: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

/* The hairline is drawn first, from the left, then the row settles under it:
   the rule sets the measure, the words arrive on it. */
const rule: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: DURATION.slow, ease: EASE } },
};

const content: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE } },
};

/* Reduced motion: the same states, reached at once. The initial and target
   props never change between the server and the client, only the timing. */
const still = { duration: 0 };
const listStill: Variants = { hidden: {}, show: {} };
const ruleStill: Variants = { hidden: rule.hidden, show: { scaleX: 1, transition: still } };
const contentStill: Variants = { hidden: content.hidden, show: { opacity: 1, y: 0, transition: still } };

/**
 * The practice's values as ruled rows: a title and one line of body. They are
 * not a sequence, so they carry no numerals and sit in an unordered list.
 */
export function ValueRows({ values }: { values: Value[] }) {
  const reduce = useReducedMotion();
  const ruleV = reduce ? ruleStill : rule;
  const contentV = reduce ? contentStill : content;

  return (
    <motion.div
      variants={reduce ? listStill : list}
      initial="hidden"
      {...(reduce ? { animate: "show" } : { whileInView: "show", viewport: { once: true, amount: 0.35 } })}
    >
      <ul>
        {values.map((value) => (
          <motion.li key={value.title} variants={reduce ? listStill : row} className="relative py-6 md:py-7">
            <motion.span data-reveal="" aria-hidden="true" variants={ruleV} className="absolute inset-x-0 top-0 h-px origin-left bg-line" />
            <motion.div data-reveal="" variants={contentV}>
              <h3 className="text-[1.0625rem] font-medium leading-snug tracking-[-0.01em] text-ink md:text-[1.125rem]">{value.title}</h3>
              <p className="mt-1.5 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted md:text-base">{value.body}</p>
            </motion.div>
          </motion.li>
        ))}
      </ul>
      <motion.span data-reveal="" aria-hidden="true" variants={ruleV} className="block h-px origin-left bg-line" />
    </motion.div>
  );
}
