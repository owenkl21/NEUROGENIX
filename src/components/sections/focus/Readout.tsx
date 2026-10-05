"use client";

import { useCallback, useSyncExternalStore } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { services } from "@/content/site";
import { SignalTrace } from "@/components/signal/SignalTrace";

/**
 * A three channel monitor beside the focus statement: one channel per test,
 * in the order the statement names what they record (brain, nerves, muscles).
 * Each channel waits on standby, faint and frozen, and comes alive with a
 * live sweep at the moment its word lights in the statement. Both are driven
 * by the statement's own scroll progress, so word and channel never drift.
 *
 * The readout repeats nothing a listener needs (the heading carries the
 * sentence), so the whole thing is hidden from assistive technology.
 *
 * On large screens each channel is exactly one statement line tall: the
 * container takes the display-2 size and every row is 1.04em, the heading's
 * line height. Below that the channels sit above the statement as a compact
 * row of three.
 */

/** Opacity of a channel on standby. A little brighter than a dim word, so the labels stay legible. */
const STANDBY = 0.3;

/*
 * Seconds of signal a short live trace shows across its width (SignalTrace's
 * minimum window for each kind, which is what it uses below ~460px). The still
 * standby trace is drawn at the same density, so the trace keeps its character
 * when it switches between still and live.
 */
const WINDOW = { eeg: 0.55, ncs: 1.2, emg: 0.9 } as const;
/* EMG bursts sum several motor units, so it gets a little less headroom to stay inside its row. */
const AMPLITUDE = { eeg: 0.42, ncs: 0.42, emg: 0.3 } as const;

export type Channel = {
  /** Scroll progress window over which this channel's word lights. */
  range: [number, number];
};

export function Readout({ progress, channels, lit }: { progress: MotionValue<number>; channels: Channel[]; lit: boolean }) {
  return (
    <div aria-hidden="true" className="display-2 grid grid-cols-3 gap-x-4 sm:gap-x-6 lg:grid-cols-1 lg:gap-x-0">
      {services.items.map((item, i) => (
        <Row key={item.slug} item={item} progress={progress} range={channels[i].range} lit={lit} />
      ))}
    </div>
  );
}

/** True once the motion value has passed `at`. Re-renders only when that flips, never per frame. */
function usePassed(value: MotionValue<number>, at: number, enabled: boolean) {
  const subscribe = useCallback((onChange: () => void) => value.on("change", onChange), [value]);
  return useSyncExternalStore(
    subscribe,
    () => enabled && value.get() >= at,
    () => false,
  );
}

function Row({
  item,
  progress,
  range,
  lit,
}: {
  item: (typeof services.items)[number];
  progress: MotionValue<number>;
  range: [number, number];
  lit: boolean;
}) {
  const opacity = useTransform(progress, range, [STANDBY, 1]);
  // The sweep starts halfway through the word's lighting, as it becomes the brightest thing on the line.
  const live = usePassed(progress, (range[0] + range[1]) / 2, lit);
  const kind = item.slug;

  return (
    <motion.div
      className="flex min-w-0 flex-col gap-3 lg:grid lg:h-[1.04em] lg:grid-cols-[6.25rem_minmax(0,1fr)] lg:items-center lg:gap-x-4 xl:grid-cols-[7.25rem_minmax(0,1fr)] xl:gap-x-5"
      style={{ opacity: lit ? opacity : 1 }}
    >
      <p className="flex flex-col gap-1 text-[0.75rem] font-normal leading-tight tracking-normal xl:text-[0.8125rem]">
        <span className="font-mono text-[0.8125rem] text-ink [letter-spacing:0.02em] xl:text-[0.875rem]">{item.abbr}</span>
        <span className="text-muted">{item.type}</span>
      </p>
      {/* On standby the frozen trace sits a step further back than its label, so
          switching to the live sweep reads as the channel powering on. */}
      <div className={`transition-opacity duration-700 ease-calm ${lit && !live ? "opacity-50" : "opacity-100"}`}>
        <SignalTrace
          kind={kind}
          mode={live ? "live" : "still"}
          window={WINDOW[kind]}
          amplitude={AMPLITUDE[kind]}
          height={36}
          strokeWidth={1.25}
          color="var(--brass-ink)"
        />
      </div>
    </motion.div>
  );
}
