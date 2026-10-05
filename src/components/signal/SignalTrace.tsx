"use client";

import { useEffect, useId, useMemo, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { defaultWindow, sample, staticPath, type SignalKind } from "@/lib/signals";

type Props = {
  kind: SignalKind;
  /**
   * live: sweeps like a monitor, new signal written left to right over the
   * faded previous sweep. Only runs while on screen.
   * draw: a still trace that draws itself once when it scrolls into view.
   * still: a still trace, no motion at all.
   */
  mode?: "live" | "draw" | "still";
  /** Height of the drawing area in CSS pixels (width is always 100%). */
  height?: number;
  /** Fraction of the height the signal may use either side of the baseline. */
  amplitude?: number;
  /** Playback speed multiplier for live mode. */
  speed?: number;
  /** Samples across the width. More is smoother but costs more per frame. */
  points?: number;
  strokeWidth?: number;
  /** Any CSS colour; defaults to the brass accent. */
  color?: string;
  /** Show the write head dot in live mode. */
  head?: boolean;
  /** Draw a faint baseline under the trace. */
  baseline?: boolean;
  className?: string;
  /** Seconds of signal across the width. */
  window?: number;
  /** Delay before a draw-mode trace starts, in seconds. */
  delay?: number;
};

const GAP = 0.035;

export function SignalTrace({
  kind,
  mode = "live",
  height = 120,
  amplitude = 0.42,
  speed = 1,
  points = 300,
  strokeWidth = 1.5,
  color = "var(--brass)",
  head = true,
  baseline = false,
  className = "",
  window: windowSeconds,
  delay = 0,
}: Props) {
  const reduce = useReducedMotion();
  const live = mode === "live" && !reduce;
  const span = windowSeconds ?? defaultWindow[kind];
  const vbHeight = 100;

  const rootRef = useRef<HTMLDivElement>(null);
  const freshRef = useRef<SVGPathElement>(null);
  const oldRef = useRef<SVGPathElement>(null);
  const headRef = useRef<HTMLSpanElement>(null);
  const gradRef = useRef<SVGLinearGradientElement>(null);

  const still = useMemo(() => staticPath(kind, points, vbHeight, amplitude, 1.35, span), [kind, points, amplitude, span]);
  const gradientId = `trace-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useEffect(() => {
    if (!live) return;
    const root = rootRef.current;
    if (!root) return;

    let frame = 0;
    let visible = false;
    let last = performance.now();
    let clock = 1.35;
    const dt = span / (points - 1);
    const gap = Math.max(4, Math.round(points * GAP));
    const mid = vbHeight / 2;

    const render = (now: number) => {
      const elapsed = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += elapsed * speed;

      const headIndex = Math.floor(clock / dt) % points;
      let fresh = "";
      let old = "";
      for (let i = 0; i < points; i++) {
        const age = (headIndex - i + points) % points;
        const ahead = (i - headIndex + points) % points;
        if (ahead > 0 && ahead <= gap) continue;
        const t = clock - age * dt;
        const y = (mid - sample(kind, t) * amplitude * vbHeight).toFixed(2);
        if (i <= headIndex) fresh += `${fresh ? "L" : "M"}${i} ${y}`;
        else old += `${old ? "L" : "M"}${i} ${y}`;
      }
      freshRef.current?.setAttribute("d", fresh);
      oldRef.current?.setAttribute("d", old);

      const headX = (headIndex / (points - 1)) * 100;
      if (gradRef.current) {
        gradRef.current.setAttribute("x1", String(headIndex - points * 0.7));
        gradRef.current.setAttribute("x2", String(headIndex));
      }
      if (headRef.current) {
        const headY = 50 - sample(kind, clock) * amplitude * 100;
        headRef.current.style.transform = `translate3d(${headX}cqw, ${headY}cqh, 0)`;
      }
      if (visible) frame = requestAnimationFrame(render);
    };

    const start = () => {
      if (frame) cancelAnimationFrame(frame);
      last = performance.now();
      frame = requestAnimationFrame(render);
    };

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
      document.removeEventListener("visibilitychange", onVisibility);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [live, kind, points, amplitude, speed, span]);

  const svgCommon = {
    viewBox: `0 0 ${points - 1} ${vbHeight}`,
    preserveAspectRatio: "none" as const,
    className: "absolute inset-0 h-full w-full overflow-visible",
    "aria-hidden": true,
    focusable: false,
  };

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`pointer-events-none relative w-full ${className}`}
      style={{ height, containerType: "size" }}
    >
      {baseline && <span className="absolute inset-x-0 top-1/2 h-px opacity-25" style={{ background: color }} />}

      {live ? (
        <>
          <svg {...svgCommon}>
            <defs>
              <linearGradient id={gradientId} ref={gradRef} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={points} y2="0">
                <stop offset="0" stopColor={color} stopOpacity="0.08" />
                <stop offset="0.75" stopColor={color} stopOpacity="0.85" />
                <stop offset="1" stopColor={color} stopOpacity="1" />
              </linearGradient>
            </defs>
            <path ref={oldRef} d={still} fill="none" stroke={color} strokeOpacity="0.16" strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
            <path ref={freshRef} d="" fill="none" stroke={`url(#${gradientId})`} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          {head && (
            <span ref={headRef} className="absolute left-0 top-0 block will-change-transform" style={{ transform: "translate3d(0, 50cqh, 0)" }}>
              <span className="absolute -left-[5px] -top-[5px] block size-[10px] rounded-full" style={{ background: color, boxShadow: `0 0 0 6px color-mix(in srgb, ${color} 18%, transparent)` }} />
            </span>
          )}
        </>
      ) : (
        <svg {...svgCommon}>
          {mode === "draw" && !reduce ? (
            <motion.path
              d={still}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0.4 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 2.2, delay, ease: [0.65, 0, 0.35, 1] }}
            />
          ) : (
            <path d={still} fill="none" stroke={color} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
          )}
        </svg>
      )}
    </div>
  );
}

