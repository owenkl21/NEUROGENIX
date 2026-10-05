"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, type TargetAndTransition } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { EASE } from "@/components/motion/primitives";

/**
 * One beat of the hero's entrance. Each beat has a cue (seconds after the
 * page mounts) so the eyebrow, headline, trace, copy and image land as one
 * composed sequence. A beat that is off screen at load (the image on a phone)
 * plays the moment it is scrolled to, without waiting out its cue.
 *
 * The first render always matches the server (the "from" state), so hydration
 * stays clean; under reduced motion the beat settles instantly.
 */

type Effect = "rise" | "fade" | "wipe" | "unclip";

type State = {
  from: TargetAndTransition;
  to: TargetAndTransition;
  duration: number;
  /** A shorter fade that runs alongside a longer clip. */
  fade?: number;
};

const states: Record<Effect, State> = {
  rise: { from: { opacity: 0, y: 22 }, to: { opacity: 1, y: 0 }, duration: 0.9 },
  fade: { from: { opacity: 0, y: 8 }, to: { opacity: 1, y: 0 }, duration: 0.8 },
  // The trace switches on from the left, like a monitor beginning its sweep.
  // Negative top and bottom insets leave room for the write head's halo.
  wipe: {
    from: { opacity: 0, clipPath: "inset(-30% 100% -30% 0%)" },
    to: { opacity: 1, clipPath: "inset(-30% 0% -30% 0%)" },
    duration: 1.15,
  },
  // Media opens from a soft inset, matching ParallaxImage's own reveal. It
  // also fades up, so it cannot show ahead of its cue while the page loads.
  unclip: {
    from: { opacity: 0, clipPath: "inset(8% 6% 8% 6% round 28px)" },
    to: { opacity: 1, clipPath: "inset(0% 0% 0% 0% round 0px)" },
    duration: 1.1,
    fade: 0.6,
  },
};

type StageProps = {
  children: ReactNode;
  /** Cue in seconds from mount. */
  cue?: number;
  effect?: Effect;
  as?: "div" | "figcaption";
  className?: string;
};

export function Stage({ children, cue = 0, effect = "rise", as = "div", className }: StageProps) {
  const reduce = useReducedMotion();
  const mountedAt = useRef(0);
  const [delay, setDelay] = useState<number | null>(null);
  const { from, to, duration, fade } = states[effect];
  const Comp = motion[as];

  useEffect(() => {
    mountedAt.current = performance.now();
  }, []);

  const target = reduce || delay !== null ? to : undefined;
  const wait = delay ?? 0;
  const transition = reduce
    ? { duration: 0 }
    : { duration, ease: EASE, delay: wait, ...(fade ? { opacity: { duration: fade, ease: "easeOut" as const, delay: wait } } : {}) };
  // A wiped element starts fully clipped, which also hides it from the
  // viewport observer, so the wipe runs on an inner layer instead.
  const inner = effect === "wipe";

  return (
    <Comp
      className={className}
      initial={inner ? undefined : from}
      animate={inner ? undefined : target}
      transition={transition}
      viewport={{ once: true, amount: 0.15 }}
      onViewportEnter={() => {
        if (reduce || delay !== null) return;
        const now = performance.now();
        // If the observer reports before the mount effect has run, count from now.
        if (!mountedAt.current) mountedAt.current = now;
        const elapsed = (now - mountedAt.current) / 1000;
        setDelay(Math.max(0, cue - elapsed));
      }}
    >
      {inner ? (
        <motion.div initial={from} animate={target} transition={transition}>
          {children}
        </motion.div>
      ) : (
        children
      )}
    </Comp>
  );
}
