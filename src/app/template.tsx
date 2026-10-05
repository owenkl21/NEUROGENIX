"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@/components/motion/primitives";

/** Route change: the incoming page settles up into place. */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
      {children}
    </motion.div>
  );
}
