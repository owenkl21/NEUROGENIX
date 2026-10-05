"use client";

import { useEffect, useId, useMemo, useRef } from "react";
import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { defaultWindow, sample, staticPath, type SignalKind } from "@/lib/signals";

type Props = {
  kind: SignalKind;
  /**
   * live: sweeps like a clinical monitor. Each point is written once by the
   * moving head and then stays put until the next sweep overwrites it.
   * Only runs while on screen.
   * draw: a still trace that draws itself once when it scrolls into view.
   * still: a still trace, no motion at all.
   */
  mode?: "live" | "draw" | "still";
  /** Height of the drawing area in CSS pixels (width is always 100%). */
  height?: number;
  /** Fraction of the height the signal may use either side of the baseline. */
  amplitude?: number;
  /** Sweep speed multiplier for live mode. 1 is the calm house pace. */
  speed?: number;
  /** Samples across the width for still and draw modes. Live mode sizes itself to the width. */
  points?: number;
  strokeWidth?: number;
  /** Any CSS colour; defaults to the signal accent. */
  color?: string;
  /** Show the write head dot in live mode. */
  head?: boolean;
  /** Draw a faint baseline under the trace. */
  baseline?: boolean;
  /** Break out of the container and run edge to edge across the viewport. */
  bleed?: boolean;
  className?: string;
  /** Seconds of signal across the width, for still and draw modes. Live mode keeps a constant density per pixel instead. */
  window?: number;
  /** Delay before a draw-mode trace starts, in seconds. */
  delay?: number;
};

/** Live traces keep the same visual density at every width: this many pixels per second of signal. */
const PX_PER_SECOND: Record<SignalKind, number> = { eeg: 1250, ncs: 640, emg: 520, calm: 240 };
const MIN_WINDOW: Record<SignalKind, number> = { eeg: 0.55, ncs: 1.2, emg: 0.9, calm: 3 };
/** Seconds of signal written per real second at speed 1. Slow enough to follow comfortably. */
const BASE_RATE = 0.22;
/** Blank gap ahead of the head, as a fraction of the width (the "erase bar" of a monitor). */
const GAP = 0.03;

export function SignalTrace({
  kind,
  mode = "live",
  height = 120,
  amplitude = 0.42,
  speed = 1,
  points = 300,
  strokeWidth = 1.5,
  color = "var(--signal)",
  head = true,
  baseline = false,
  bleed = false,
  className = "",
  window: windowSeconds,
  delay = 0,
}: Props) {
  const reduce = useReducedMotion();
  const live = mode === "live" && !reduce;
  const span = windowSeconds ?? defaultWindow[kind];
  const vbHeight = 100;

  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const freshRef = useRef<SVGPathElement>(null);
  const oldRef = useRef<SVGPathElement>(null);
  const headRef = useRef<HTMLSpanElement>(null);
  const gradRef = useRef<SVGLinearGradientElement>(null);
  // Observed on the unclipped wrapper: a fully clipped element never reports as in view.
  const inView = useInView(rootRef, { once: true, amount: 0.6 });

  const still = useMemo(() => staticPath(kind, points, vbHeight, amplitude, 1.35, span), [kind, points, amplitude, span]);
  const gradientId = `trace-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useEffect(() => {
    if (!live) return;
    const root = rootRef.current;
    const svg = svgRef.current;
    if (!root || !svg) return;

    const mid = vbHeight / 2;
    const geo = { n: 240, dt: 0.01, gap: 8 };
    const layout = () => {
      const width = Math.max(1, root.clientWidth);
      const n = Math.min(560, Math.max(90, Math.round(width / 3)));
      const seconds = Math.max(MIN_WINDOW[kind], width / PX_PER_SECOND[kind]);
      geo.n = n;
      geo.dt = seconds / (n - 1);
      geo.gap = Math.max(3, Math.round(n * GAP));
      svg.setAttribute("viewBox", `0 0 ${n - 1} ${vbHeight}`);
    };
    layout();

    const y = (t: number) => mid - sample(kind, t) * amplitude * vbHeight;

    let frame = 0;
    let visible = false;
    let last = performance.now();
    let clock = 1.35;
    let headY = 50;

    const render = (now: number) => {
      const elapsed = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += elapsed * speed * BASE_RATE;

      const { n, dt, gap } = geo;
      const exact = clock / dt;
      const step = Math.floor(exact);
      const frac = exact - step;
      const headIndex = step % n;

      // Points are sampled on a fixed time grid, so once written they never move.
      let fresh = "";
      let old = "";
      for (let i = 0; i < n; i++) {
        const age = (headIndex - i + n) % n;
        const ahead = (i - headIndex + n) % n;
        if (ahead > 0 && ahead <= gap) continue;
        const py = y((step - age) * dt).toFixed(2);
        if (i <= headIndex) fresh += `${fresh ? "L" : "M"}${i} ${py}`;
        else old += `${old ? "L" : "M"}${i} ${py}`;
      }
      // The newest sliver grows smoothly between grid points.
      const tipX = headIndex + frac;
      const tipY = y(clock);
      fresh += `L${tipX.toFixed(3)} ${tipY.toFixed(2)}`;

      freshRef.current?.setAttribute("d", fresh);
      oldRef.current?.setAttribute("d", old);
      if (gradRef.current) {
        gradRef.current.setAttribute("x1", String(tipX - n * 0.75));
        gradRef.current.setAttribute("x2", String(tipX));
      }
      if (headRef.current) {
        headY += (tipY - headY) * 0.35;
        headRef.current.style.transform = `translate3d(${(tipX / (n - 1)) * 100}cqw, ${headY}cqh, 0)`;
      }
      if (visible) frame = requestAnimationFrame(render);
    };

    const start = () => {
      if (frame) cancelAnimationFrame(frame);
      last = performance.now();
      frame = requestAnimationFrame(render);
    };

    const resize = new ResizeObserver(() => layout());
    resize.observe(root);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && document.visibilityState === "visible";
        if (visible) start();
        else if (frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { rootMargin: "120px" },
    );
    observer.observe(root);

    const onVisibility = () => {
      const rect = root.getBoundingClientRect();
      const onScreen = rect.bottom > 0 && rect.top < window.innerHeight;
      visible = document.visibilityState === "visible" && onScreen;
      if (visible) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      resize.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [live, kind, amplitude, speed]);

  const svgCommon = {
    preserveAspectRatio: "none" as const,
    className: "absolute inset-0 h-full w-full overflow-visible",
    "aria-hidden": true,
    focusable: false,
  };

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`pointer-events-none relative ${bleed ? "" : "w-full"} ${className}`}
      style={{ height, containerType: "size", ...(bleed ? { width: "100vw", marginInline: "calc(50% - 50vw)" } : null) }}
    >
      {baseline && <span className="absolute inset-x-0 top-1/2 h-px opacity-25" style={{ background: color }} />}

      {live ? (
        <>
          <svg ref={svgRef} viewBox={`0 0 ${points - 1} ${vbHeight}`} {...svgCommon}>
            <defs>
              <linearGradient id={gradientId} ref={gradRef} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={points} y2="0">
                <stop offset="0" stopColor={color} stopOpacity="0.06" />
                <stop offset="0.7" stopColor={color} stopOpacity="0.8" />
                <stop offset="1" stopColor={color} stopOpacity="1" />
              </linearGradient>
            </defs>
            <path ref={oldRef} d="" fill="none" stroke={color} strokeOpacity="0.16" strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
            <path ref={freshRef} d="" fill="none" stroke={`url(#${gradientId})`} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          {head && (
            <span ref={headRef} className="absolute left-0 top-0 block will-change-transform" style={{ transform: "translate3d(0, 50cqh, 0)" }}>
              <span className="absolute -left-[4.5px] -top-[4.5px] block size-[9px] rounded-full" style={{ background: color, boxShadow: `0 0 0 6px color-mix(in srgb, ${color} 16%, transparent)` }} />
            </span>
          )}
        </>
      ) : (
        // Draw mode wipes the finished trace on from the left. A clip reveal stays
        // exact with non-scaling strokes, where pathLength dashes would not.
        <motion.svg
          viewBox={`0 0 ${points - 1} ${vbHeight}`}
          {...svgCommon}
          initial={mode === "draw" ? { clipPath: "inset(-25% 100% -25% 0%)" } : false}
          animate={mode === "draw" && (inView || reduce) ? { clipPath: "inset(-25% 0% -25% 0%)" } : undefined}
          transition={reduce ? { duration: 0 } : { duration: 2, delay, ease: [0.65, 0, 0.35, 1] }}
        >
          <path d={still} fill="none" stroke={color} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
        </motion.svg>
      )}
    </div>
  );
}
