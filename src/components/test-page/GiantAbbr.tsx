"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { EASE } from "@/components/motion/primitives";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

/**
 * The test's abbreviation set huge, condensed and outlined in a hairline, as
 * the second layer of the page title. It rises out of a mask just after the
 * headline lands, then drifts a touch slower than the page as the intro
 * scrolls away. Purely decorative, so it is hidden from assistive tech.
 *
 * Under reduced motion it remounts in its resting state, with no drift.
 */
export function GiantAbbr({ text, className = "" }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const drift = useTransform(scrollY, [0, 720], [0, 40]);

  return (
    <motion.span
      key={reduce ? "still" : "motion"}
      aria-hidden="true"
      className={`pointer-events-none block select-none whitespace-nowrap ${className}`}
      initial={reduce ? false : { clipPath: "inset(100% -8% -30% -8%)", y: 36 }}
      animate={{ clipPath: "inset(-30% -8% -30% -8%)", y: 0 }}
      transition={{ duration: 1.5, ease: EASE, delay: 0.3 }}
    >
      <motion.span className="block" style={reduce ? undefined : { y: drift }}>
        {text}
      </motion.span>
    </motion.span>
  );
}
