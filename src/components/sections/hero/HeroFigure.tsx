"use client";

import { hero } from "@/content/site";
import { ParallaxImage } from "@/components/motion/primitives";
import { Stage } from "./Stage";

/**
 * The waiting room, opened from a soft inset as the last beat of the hero's
 * entrance, then drifting gently with the scroll. Nothing sits under it: the
 * hero says its piece in the eyebrow, headline, lede and actions, and the
 * photograph is left to speak for itself.
 */
export function HeroFigure({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
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
    </div>
  );
}
