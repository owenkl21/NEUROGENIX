"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { EASE } from "@/components/motion/primitives";

/**
 * True until the first page has hydrated. The first page arrives as server
 * HTML and must paint straight away, so only later, client side route changes
 * get the settle. On the server this never flips, so the HTML is never hidden.
 */
let firstPaint = true;

/** Route change: the incoming page settles up into place. */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  useEffect(() => {
    firstPaint = false;
  }, []);
  return (
    <motion.div initial={firstPaint || reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
      {children}
    </motion.div>
  );
}
