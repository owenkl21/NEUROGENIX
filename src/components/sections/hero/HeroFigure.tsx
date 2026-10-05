"use client";

import { ShieldCheck } from "@phosphor-icons/react";
import { hero } from "@/content/site";
import { ParallaxImage } from "@/components/motion/primitives";
import { Stage } from "./Stage";

/**
 * The waiting room, opened from a soft inset as the last beat of the hero's
 * entrance, then drifting gently with the scroll. The caption sits under the
 * image, never on it.
 */
export function HeroFigure({ className = "" }: { className?: string }) {
  const [lead, soft] = hero.caption.text;

  return (
    <figure className={className}>
      <Stage cue={0.72} effect="unclip">
        <ParallaxImage
          src={hero.image.src}
          alt={hero.image.alt}
          width={hero.image.width}
          height={hero.image.height}
          sizes="(min-width: 1320px) 816px, (min-width: 1024px) 62vw, 100vw"
          priority
          reveal={false}
          intensity={5}
          className="rounded-surface aspect-[4/5] bg-paper-2 sm:aspect-[3/2] lg:aspect-[16/10]"
          imgClassName="object-[50%_42%]"
        />
      </Stage>

      <Stage
        as="figcaption"
        cue={1}
        className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10 md:mt-7"
      >
        <div>
          <p className="font-mono text-[0.8125rem] leading-snug tracking-[0.01em] text-muted">{hero.caption.label}</p>
          <p className="title-3 mt-2.5">
            {lead} <span className="headline-soft">{soft}</span>
          </p>
        </div>
        <p className="flex items-start gap-2.5 text-[0.875rem] leading-normal text-muted sm:items-center sm:pb-0.5">
          <ShieldCheck size={20} weight="light" aria-hidden="true" className="shrink-0 text-ink-2" />
          {hero.note}
        </p>
      </Stage>
    </figure>
  );
}
