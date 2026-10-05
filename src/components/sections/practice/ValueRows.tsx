"use client";

import { motion, type Variants } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { DURATION, EASE } from "@/components/motion/primitives";

type Value = { number: string; title: string; body: string };

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

/** The practice's three values as ruled rows: numeral, title, one line of body. */
export function ValueRows({ values }: { values: Value[] }) {
  const reduce = useReducedMotion();

  return (
    <motion.div variants={list} initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true, amount: 0.35 }}>
      <ol>
        {values.map((value) => (
          <motion.li key={value.number} variants={row} className="relative grid grid-cols-[2.75rem_1fr] gap-x-3 py-6 md:py-7">
            <motion.span aria-hidden="true" variants={rule} className="absolute inset-x-0 top-0 h-px origin-left bg-line" />
            <motion.span variants={content} className="numeral pt-[0.3rem] text-[0.8125rem] leading-none text-brass-ink">
              {value.number}
            </motion.span>
            <motion.div variants={content}>
              <h3 className="text-[1.0625rem] font-medium leading-snug tracking-[-0.01em] text-ink md:text-[1.125rem]">{value.title}</h3>
              <p className="mt-1.5 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted md:text-base">{value.body}</p>
            </motion.div>
          </motion.li>
        ))}
      </ol>
      <motion.span aria-hidden="true" variants={rule} className="block h-px origin-left bg-line" />
    </motion.div>
  );
}
