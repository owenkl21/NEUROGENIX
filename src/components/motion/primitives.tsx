"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, useMotionValue, useScroll, useSpring, useTransform, type Variants } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

/**
 * Motion grammar for the whole site. One easing, two durations, one stagger.
 * - Reveals: content rises 28px and fades in once, as it enters the viewport.
 * - Headlines: each sentence slides up out of a mask.
 * - Media: images unclip from a soft inset, then drift with the scroll.
 * Everything collapses to static under prefers-reduced-motion.
 * Reveals carry `data-reveal` and headline lines `mask-line`, so the layout
 * can show them when JS never runs. A reveal also shows the moment anything
 * inside it takes keyboard focus, so focus never lands on faded content.
 */
export const EASE = [0.22, 1, 0.36, 1] as const;
export const DURATION = { base: 0.9, slow: 1.2 };
export const STAGGER = 0.08;

type Tag = "div" | "section" | "article" | "aside" | "header" | "figure" | "li" | "ul" | "ol" | "p" | "span" | "dl" | "dd" | "dt" | "blockquote";

type RevealProps = {
  as?: Tag;
  children?: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
  id?: string;
};

export function Reveal({ as = "div", children, className, delay = 0, y = 28, amount = 0.2, id }: RevealProps) {
  const reduce = useReducedMotion();
  const [focused, setFocused] = useState(false);
  const Comp = motion[as as "div"];
  return (
    <Comp
      id={id}
      data-reveal=""
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      animate={focused ? { opacity: 1, y: 0 } : undefined}
      onFocusCapture={focused ? undefined : () => setFocused(true)}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: DURATION.base, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

const groupVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE } },
};

/** Parent for staggered children. Children must be RevealItem. */
export function RevealGroup({ as = "div", children, className, amount = 0.2 }: Omit<RevealProps, "delay" | "y">) {
  const reduce = useReducedMotion();
  const [focused, setFocused] = useState(false);
  const Comp = motion[as as "div"];
  return (
    <Comp
      className={className}
      variants={groupVariants}
      initial={reduce ? false : "hidden"}
      animate={focused ? "show" : undefined}
      onFocusCapture={focused ? undefined : () => setFocused(true)}
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </Comp>
  );
}

export function RevealItem({ as = "div", children, className }: Omit<RevealProps, "delay" | "y" | "amount">) {
  const Comp = motion[as as "div"];
  return (
    <Comp data-reveal="" className={className} variants={itemVariants}>
      {children}
    </Comp>
  );
}

type MaskLinesProps = {
  lines: string[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  /** Index from which lines get the soft italic treatment. Use lines.length to disable. */
  softFrom?: number;
  delay?: number;
  /** "view" animates when scrolled into view, "mount" animates immediately (hero). */
  trigger?: "view" | "mount";
  id?: string;
};

const lineVariants: Variants = {
  hidden: { y: "112%" },
  show: (i: number) => ({ y: "0%", transition: { duration: DURATION.slow, ease: EASE, delay: i * 0.1 } }),
};

/** Same end state, reached at once. */
const lineVariantsStill: Variants = {
  hidden: { y: "112%" },
  show: { y: "0%", transition: { duration: 0 } },
};

/**
 * A headline whose sentences slide up out of masks. Lines are block spans so
 * each sentence keeps its own line on wide screens and wraps naturally on
 * narrow ones. The mask reserves descender room so italic g, p and y never clip.
 *
 * Each entry in `lines` is a whole sentence. A one-sentence headline is a
 * single entry and wraps on its own; never split a sentence across entries.
 *
 * Every render, on the server and after hydration, keeps the hidden initial
 * state and a target to animate to, so the hidden state is never stranded.
 * Reduced motion only changes the timing: the lines show at once, without
 * waiting for the viewport, and the `mask-line` class keeps them visible
 * before hydration (and without JS, see the layout).
 */
export function MaskLines({ lines, as = "h2", className = "", softFrom = 1, delay = 0, trigger = "view", id }: MaskLinesProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  const animateProps =
    trigger === "mount" || reduce
      ? { initial: "hidden", animate: "show" }
      : { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.5 } };

  return (
    <Comp id={id} className={className} {...animateProps}>
      {lines.map((line, i) => (
        <span key={i} className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
          <motion.span
            className={`mask-line block ${i >= softFrom ? "headline-soft" : ""}`}
            variants={reduce ? lineVariantsStill : lineVariants}
            custom={i + delay * 10}
          >
            {line}
            {i < lines.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Comp>
  );
}

type ParallaxImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Percentage the image drifts either way as it crosses the viewport. */
  intensity?: number;
  /** Unclip from a soft inset when first seen. */
  reveal?: boolean;
  imgClassName?: string;
};

/**
 * Image that unclips when it enters the viewport and drifts gently with the
 * scroll. The wrapper sets the shape (aspect ratio, radius); the image is
 * scaled just enough that the drift never exposes an edge.
 */
export function ParallaxImage({ src, alt, width, height, sizes, priority, className = "", intensity = 6, reveal = true, imgClassName = "" }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${intensity}%`, `${intensity}%`]);
  const scale = 1 + (intensity * 2.2) / 100;

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      initial={reduce || !reveal ? false : { clipPath: "inset(9% 7% 9% 7% round 28px)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.4, ease: EASE }}
    >
      <motion.div className="absolute inset-0" style={reduce ? undefined : { y, scale }}>
        <Image src={src} alt={alt} width={width} height={height} sizes={sizes} loading={priority ? "eager" : undefined} fetchPriority={priority ? "high" : undefined} className={`h-full w-full object-cover ${imgClassName}`} />
      </motion.div>
    </motion.div>
  );
}

/** Pulls its child toward the pointer. Fine pointers only, never under reduced motion. */
export function Magnetic({ children, strength = 0.28, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  if (reduce) return <div className={`inline-flex ${className}`}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={`inline-flex ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
