"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { Clock } from "@phosphor-icons/react";
import { locations } from "@/content/site";
import { ParallaxImage, Reveal, RevealGroup, RevealItem } from "@/components/motion/primitives";
import { TravelCheck } from "./TravelCheck";
import { useMediaQuery } from "./useMediaQuery";

/**
 * The wide practice image with the appointment detail panel laid over its
 * lower right corner. On large screens the panel travels a little faster than
 * the image as the reader scrolls, so it reads as a separate layer resting on
 * the photograph. Phones and reduced motion get a still, stacked layout.
 */
export function LocationStage() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const wide = useMediaQuery("(min-width: 1024px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [48, -48]);
  const float = wide && !reduce;

  return (
    <div ref={ref} className="mt-14 md:mt-20">
      <ParallaxImage
        src={locations.image.src}
        alt={locations.image.alt}
        width={locations.image.width}
        height={locations.image.height}
        sizes="(min-width: 1320px) 1224px, (min-width: 1024px) calc(100vw - 96px), (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)"
        intensity={5}
        className="aspect-[4/3] w-full rounded-surface md:aspect-[16/9] lg:aspect-[21/9]"
        imgClassName="object-[50%_38%]"
      />

      <motion.div
        style={float ? { y } : undefined}
        className="relative z-10 -mt-8 px-3 md:-mt-24 md:ml-auto md:mr-8 md:w-[520px] md:px-0 lg:-mt-[120px] lg:mr-12 lg:w-[568px]"
      >
        <Reveal y={40} delay={0.2} amount={0.3} className="rounded-surface bg-surface p-7 shadow-soft sm:p-9 md:p-10 lg:p-12">
          <p className="inline-flex min-h-8 items-center gap-2 rounded-full border border-line py-1 pl-2.5 pr-3.5 text-[0.8125rem] leading-none text-muted">
            <Clock size={16} weight="regular" aria-hidden="true" className="shrink-0 text-brass-ink" />
            {locations.status}
          </p>

          <h3 className="title-3 mt-6 text-ink">{locations.heading}</h3>

          <RevealGroup as="dl" amount={0.4} className="mt-8 grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2 md:gap-y-7">
            {locations.fields.map((field) => (
              <RevealItem key={field.term} className="border-t border-line pt-4">
                <dt className="text-[0.8125rem] leading-snug text-muted">{field.term}</dt>
                <dd className="mt-1.5 italic text-ink-2">{field.value}</dd>
              </RevealItem>
            ))}
          </RevealGroup>

          <TravelCheck question={locations.check.q} answer={locations.check.a} className="mt-8 md:mt-10" />
        </Reveal>
      </motion.div>
    </div>
  );
}
