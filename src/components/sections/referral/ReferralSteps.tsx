"use client";

import { useEffect, useRef, type RefObject } from "react";
import { motion, useMotionTemplate, useScroll, useTransform, type MotionValue } from "motion/react";
import { Reveal } from "@/components/motion/primitives";
import { referral } from "@/content/site";

const steps = referral.steps;

/**
 * The three referral steps beside a hairline track. A brass line fills the
 * track top to bottom as the reader moves through the steps, and each numeral
 * warms from muted to brass the moment the fill reaches it. Positions are
 * measured from the layout, so the numeral lights exactly as the line passes.
 *
 * Reduced motion is handled in CSS (motion-reduce variants) rather than by
 * branching on useReducedMotion(), so server and client markup always match:
 * the line shows fully drawn and every numeral rests in brass, with no motion.
 */
export function ReferralSteps() {
  const listRef = useRef<HTMLOListElement>(null);
  const numeralRefs = useRef<(HTMLSpanElement | null)[]>([]);
  // Fraction of the track height at which each numeral's centre sits.
  const thresholds = useRef<number[]>(steps.map((_, i) => i / steps.length + 0.02));
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 65%", "end 55%"] });

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const height = list.offsetHeight || 1;
      thresholds.current = numeralRefs.current.map((el, i) => {
        const item = el?.parentElement;
        if (!el || !item) return i / steps.length;
        return (item.offsetTop + el.offsetTop + el.offsetHeight / 2) / height;
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  return (
    <ol ref={listRef} className="relative">
      <span aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px bg-line">
        <motion.span className="absolute inset-0 origin-top bg-brass-ink motion-reduce:transform-none!" style={{ scaleY: scrollYProgress }} />
      </span>

      {steps.map((step, i) => (
        <li key={step.number} className={`relative pl-10 sm:pl-14 ${i < steps.length - 1 ? "pb-16 sm:pb-20 lg:min-h-[min(40vh,26rem)] lg:pb-24" : ""}`}>
          <StepNumeral
            index={i}
            progress={scrollYProgress}
            thresholds={thresholds}
            setRef={(el) => {
              numeralRefs.current[i] = el;
            }}
          >
            {step.number}
          </StepNumeral>
          <Reveal className="mt-5 sm:mt-7">
            <h2 className="title-3">{step.title}</h2>
            <p className="mt-3 max-w-[46ch] text-muted">{step.body}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

function StepNumeral({
  index,
  progress,
  thresholds,
  setRef,
  children,
}: {
  index: number;
  progress: MotionValue<number>;
  thresholds: RefObject<number[]>;
  setRef: (el: HTMLSpanElement | null) => void;
  children: string;
}) {
  // 0 to 100: how much brass is mixed into the numeral. Lights over a short
  // stretch of scroll centred on the moment the fill reaches the numeral.
  const lit = useTransform(progress, (p) => {
    const at = thresholds.current[index] ?? 0;
    return Math.min(1, Math.max(0, (p - at + 0.015) / 0.04)) * 100;
  });
  const color = useMotionTemplate`color-mix(in oklab, var(--brass-ink) ${lit}%, var(--muted))`;

  return (
    <motion.span
      ref={setRef}
      aria-hidden="true"
      className="block font-sans text-[clamp(2.5rem,1.9rem+1.6vw,3.5rem)] font-normal leading-none tracking-[-0.03em] tabular-nums motion-reduce:text-brass-ink!"
      style={{ color }}
    >
      {children}
    </motion.span>
  );
}
