"use client";

import Image from "next/image";
import { motion, useIsPresent, type PanInfo, type Variants } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { gallery } from "@/content/site";
import { EASE } from "@/components/motion/primitives";

export type Photo = (typeof gallery.photos)[number];

/** Vertical room reserved for the top bar, caption and thumbnail strip. */
const RESERVED = "260px";

const slideVariants: Variants = {
  enter: ({ dir, reduce }: { dir: number; reduce: boolean }) => (reduce ? { opacity: 0 } : { opacity: 0, x: dir * 40, scale: 1.03 }),
  center: ({ reduce }: { dir: number; reduce: boolean }) =>
    reduce
      ? { opacity: 1, transition: { duration: 0.25 } }
      : { opacity: 1, x: 0, scale: 1, transition: { duration: 0.9, ease: EASE, opacity: { duration: 0.55, ease: EASE } } },
  exit: ({ dir, reduce }: { dir: number; reduce: boolean }) =>
    reduce ? { opacity: 0, transition: { duration: 0.2 } } : { opacity: 0, x: dir * -40, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

/**
 * One photo on the stage. It slides in from the side it is coming from and
 * settles from a hair above full size; the outgoing photo crossfades away
 * beneath it. Dragging sideways past a threshold, or flicking, turns the page.
 */
export function Slide({
  photo,
  custom,
  onNext,
  onPrev,
}: {
  photo: Photo;
  custom: { dir: number; reduce: boolean };
  onNext: () => void;
  onPrev: () => void;
}) {
  const isPresent = useIsPresent();
  const ratio = photo.width / photo.height;

  const onDragEnd = (_: PointerEvent | MouseEvent | TouchEvent, { offset, velocity }: PanInfo) => {
    if (offset.x < -80 || velocity.x < -400) onNext();
    else if (offset.x > 80 || velocity.x > 400) onPrev();
  };

  return (
    <motion.div
      custom={custom}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      drag={isPresent ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.22}
      dragMomentum={false}
      onDragEnd={onDragEnd}
      className={`flex w-full cursor-grab justify-center [grid-area:1/1] active:cursor-grabbing ${isPresent ? "" : "pointer-events-none"}`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes="100vw"
        loading="eager"
        draggable={false}
        className="h-auto select-none rounded-surface"
        style={{ width: `min(100%, calc((100dvh - ${RESERVED}) * ${ratio.toFixed(4)}))` }}
      />
    </motion.div>
  );
}

/** Round previous and next controls; labels read "Previous photo" and "Next photo". */
export function NavButton({ direction, onClick, className = "" }: { direction: "previous" | "next"; onClick: () => void; className?: string }) {
  const Icon = direction === "previous" ? CaretLeft : CaretRight;
  const label = direction === "previous" ? gallery.previousLabel : gallery.nextLabel;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`group size-11 shrink-0 place-items-center rounded-full md:size-12 border border-on-deep-line text-on-deep transition-[border-color,background-color] duration-300 ease-calm hover:border-on-deep hover:bg-on-deep/5 active:translate-y-px ${className}`}
    >
      <Icon
        size={20}
        aria-hidden="true"
        className={`transition-transform duration-500 ease-calm ${direction === "previous" ? "group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5"}`}
      />
    </button>
  );
}

/** The four photos as small buttons. A signal ring glides to the active one. */
export function Thumbnails({ photos, current, onSelect }: { photos: readonly Photo[]; current: number; onSelect: (index: number) => void }) {
  const reduce = useReducedMotion();
  return (
    <ul className="flex min-w-0 items-center gap-2 md:gap-3">
      {photos.map((photo, i) => {
        const active = i === current;
        return (
          <li key={`${photo.src}-${i}`} className="relative min-w-0 basis-12 min-[400px]:basis-14 md:basis-16">
            {active ? (
              <motion.span
                layoutId="gallery-thumb-ring"
                aria-hidden="true"
                className="pointer-events-none absolute -inset-[5px] rounded-[17px] border-[1.5px] border-signal"
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
              />
            ) : null}
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-label={photo.caption}
              aria-current={active ? "true" : undefined}
              className={`relative block h-11 w-full overflow-hidden rounded-[12px] transition-opacity duration-500 ease-calm md:h-12 ${
                active ? "opacity-100" : "opacity-45 hover:opacity-85"
              }`}
            >
              <Image src={photo.src} alt="" width={photo.width} height={photo.height} sizes="64px" draggable={false} className="h-full w-full object-cover" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** Hidden copies of the neighbouring photos so the next turn is already decoded. */
export function Preload({ photos }: { photos: Photo[] }) {
  return (
    <div aria-hidden="true" className="hidden">
      {photos.map((photo, i) => (
        <Image key={`${photo.src}-${i}`} src={photo.src} alt="" width={photo.width} height={photo.height} sizes="100vw" loading="eager" />
      ))}
    </div>
  );
}
