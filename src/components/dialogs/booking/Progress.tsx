"use client";

import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { Check } from "@phosphor-icons/react";
import { booking } from "@/content/site";
import { EASE } from "@/components/motion/primitives";
import type { Step } from "./model";

/**
 * Three numbered rings joined by hairlines. As the reader advances, the line
 * behind them fills with brass ink, like a signal travelling to the next
 * electrode, and the ring it leaves resolves into a check.
 * Phones: labels sit under the rings. From md: labels sit beside them.
 */
export function Progress({ step }: { step: Step }) {
  const reduce = useReducedMotion();
  const last = booking.progress.length - 1;

  return (
    <ol aria-label={booking.progressLabel} className="flex">
      {booking.progress.map((label, i) => {
        const done = i < step;
        const current = i === step;
        return (
          <li
            key={label}
            aria-current={current ? "step" : undefined}
            className={`relative flex flex-col md:flex-row md:items-center ${i < last ? "flex-1" : "shrink-0"}`}
          >
            <span
              aria-hidden="true"
              className={`relative grid size-8 shrink-0 place-items-center rounded-full border transition-colors duration-500 ease-calm ${
                current ? "border-ink bg-ink text-surface delay-300" : done ? "border-brass-ink text-brass-ink" : "border-line-strong text-muted"
              }`}
            >
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={done ? "done" : "number"}
                  className="grid place-items-center"
                  initial={reduce ? false : { scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 26 }}
                >
                  {done ? <Check size={14} weight="bold" /> : <span className="numeral text-[0.75rem] leading-none">{i + 1}</span>}
                </motion.span>
              </AnimatePresence>
            </span>
            <span
              className={`mt-3 block whitespace-nowrap text-[0.8125rem] leading-tight transition-colors duration-500 md:ml-3 md:mt-0 md:text-[0.875rem] ${
                current ? "font-medium text-ink" : "text-muted"
              }`}
            >
              {label}
            </span>
            {i < last ? (
              <span aria-hidden="true" className="absolute left-[calc(2rem+10px)] right-2.5 top-4 h-px bg-line md:relative md:inset-auto md:mx-5 md:flex-1">
                <motion.span
                  className="absolute inset-0 origin-left bg-brass-ink"
                  initial={false}
                  animate={{ scaleX: done ? 1 : 0 }}
                  transition={{ duration: reduce ? 0 : 0.9, ease: EASE }}
                />
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
