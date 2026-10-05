"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, type Transition, type Variants } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { Plus } from "@phosphor-icons/react";
import { DURATION, EASE, STAGGER } from "@/components/motion/primitives";

type Item = { q: string; a: string };

/*
 * Rows rise in sequence and the hairline under each one draws from the left,
 * so the list reads as a ruled page being set out, one line at a time.
 * Variants are built per motion preference: the initial state is identical on
 * the server and the client (so hydration matches), and under reduced motion
 * every transition is instant.
 */
function buildVariants(reduce: boolean) {
  const t = (transition: Transition): Transition => (reduce ? { duration: 0 } : transition);
  return {
    list: {
      hidden: {},
      show: { transition: reduce ? {} : { staggerChildren: STAGGER, delayChildren: 0.05 } },
    } satisfies Variants,
    row: {
      hidden: { opacity: 0, y: 24 },
      show: { opacity: 1, y: 0, transition: t({ duration: DURATION.base, ease: EASE }) },
    } satisfies Variants,
    rule: {
      hidden: { scaleX: 0 },
      show: { scaleX: 1, transition: t({ duration: DURATION.slow, ease: EASE, delay: 0.12 }) },
    } satisfies Variants,
    panelIn: t({ height: { duration: 0.7, ease: EASE }, opacity: { duration: 0.5, ease: EASE, delay: 0.1 } }),
    panelOut: t({ height: { duration: 0.55, ease: EASE }, opacity: { duration: 0.25, ease: EASE } }),
    settle: t({ duration: 0.7, ease: EASE }),
  };
}

/**
 * Disclosure list. Each question is a real button inside an h3; any number of
 * answers can be open at once. Arrow keys, Home and End move between questions.
 */
export function FaqAccordion({ items }: { items: Item[] }) {
  const reduce = useReducedMotion() ?? false;
  const v = useMemo(() => buildVariants(reduce), [reduce]);
  const [open, setOpen] = useState<boolean[]>(() => items.map((_, i) => i === 0));
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const toggle = (index: number) => setOpen((prev) => prev.map((value, i) => (i === index ? !value : value)));

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = items.length - 1;
    const keys: Record<string, number> = {
      ArrowDown: index === last ? 0 : index + 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    buttons.current[keys[event.key]]?.focus();
  };

  return (
    <motion.ul
      variants={v.list}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      {items.map((item, i) => {
        const isOpen = open[i];
        const headerId = `faq-q-${i}`;
        const panelId = `faq-a-${i}`;
        return (
          <motion.li key={item.q} variants={v.row} className="relative">
            {i === 0 && (
              <motion.span aria-hidden="true" variants={v.rule} className="absolute inset-x-0 top-0 h-px origin-left bg-line" />
            )}
            <h3 className="title-3">
              <button
                ref={(el) => {
                  buttons.current[i] = el;
                }}
                id={headerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                onKeyDown={(event) => onKeyDown(event, i)}
                className="group flex min-h-11 w-full items-center justify-between gap-6 py-5 text-left md:gap-10 md:py-8"
              >
                <span className="transition-transform duration-500 ease-calm group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0">
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  className={`grid size-10 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                    isOpen ? "border-brass-ink text-brass-ink" : "border-line-strong text-ink group-hover:border-ink"
                  }`}
                >
                  <Plus size={16} weight="regular" className={`transition-transform duration-500 ease-calm ${isOpen ? "rotate-45" : "rotate-0"}`} />
                </span>
              </button>
            </h3>

            <div id={panelId}>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="answer"
                    role="region"
                    aria-labelledby={headerId}
                    className="overflow-hidden"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1, transition: v.panelIn }}
                    exit={{ height: 0, opacity: 0, transition: v.panelOut }}
                  >
                    <motion.p
                      className="max-w-[62ch] pb-6 pr-12 text-muted md:pb-10 md:pr-20"
                      initial={{ y: -10 }}
                      animate={{ y: 0 }}
                      transition={v.settle}
                    >
                      {item.a}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.span aria-hidden="true" variants={v.rule} className="absolute inset-x-0 bottom-0 h-px origin-left bg-line" />
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
