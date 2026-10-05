"use client";

import { Info } from "@phosphor-icons/react";
import { Reveal } from "@/components/motion/primitives";

/**
 * The quiet caveat under the fee steps. From 1280px each sentence keeps its own
 * line so the note breaks where the thought does; below that it flows.
 */
export function FeesNote({ text, className = "" }: { text: string; className?: string }) {
  const sentences = text.split(/(?<=\.)\s+/);
  return (
    <Reveal className={`flex items-start gap-4 rounded-surface bg-paper-2 p-6 md:gap-5 md:p-8 ${className}`}>
      <Info size={24} weight="light" aria-hidden="true" className="shrink-0 text-signal-ink" />
      <p className="max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-2 md:text-base">
        {sentences.map((sentence, i) => (
          <span key={i} className="xl:block">
            {sentence}
            {i < sentences.length - 1 ? " " : ""}
          </span>
        ))}
      </p>
    </Reveal>
  );
}
