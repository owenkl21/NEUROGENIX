"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { Plus } from "@phosphor-icons/react";
import { EASE } from "@/components/motion/primitives";

/**
 * Single disclosure. The answer stays in the DOM so aria-controls always
 * points at a real element; while closed it is collapsed to zero height and
 * made inert, so it is neither focusable nor announced.
 */
export function TravelCheck({ question, answer, className = "" }: { question: string; answer: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const id = useId();
  const buttonId = `${id}-trigger`;
  const panelId = `${id}-answer`;

  return (
    <div className={`border-t border-line ${className}`}>
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="group flex min-h-16 w-full items-center justify-between gap-6 pt-4 text-left text-[0.9375rem] font-medium text-ink"
      >
        <span>{question}</span>
        <span
          aria-hidden="true"
          className={`grid size-10 shrink-0 place-items-center rounded-full border transition-colors duration-500 ease-calm ${
            open ? "border-ink bg-ink text-paper" : "border-line-strong text-ink group-hover:border-ink"
          }`}
        >
          <motion.span
            className="grid place-items-center"
            initial={false}
            animate={{ rotate: open ? 45 : 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.6, ease: EASE }}
          >
            <Plus size={16} weight="regular" />
          </motion.span>
        </span>
      </button>

      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        inert={!open}
        className="overflow-hidden"
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={
          reduce
            ? { duration: 0 }
            : {
                height: { duration: 0.7, ease: EASE },
                opacity: { duration: open ? 0.5 : 0.25, ease: EASE, delay: open ? 0.12 : 0 },
              }
        }
      >
        <p className="max-w-[46ch] pb-1 pt-3 text-[0.9375rem] leading-relaxed text-muted">{answer}</p>
      </motion.div>
    </div>
  );
}
