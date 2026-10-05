"use client";

import { useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { gallery } from "@/content/site";
import { EASE } from "@/components/motion/primitives";
import { CloseButton, Modal } from "./Modal";
import { NavButton, Preload, Slide, Thumbnails } from "./gallery/parts";

/**
 * Full-screen photo viewer on the deepest navy, like a dimmed room. Photos
 * turn with the arrow buttons, the arrow keys, a sideways drag or the
 * thumbnail strip, and always move in the direction you asked them to.
 */
export function GalleryDialog({ open, index, onIndexChange, onClose }: { open: boolean; index: number; onIndexChange: (index: number) => void; onClose: () => void }) {
  const reduce = Boolean(useReducedMotion());
  const photos = gallery.photos;
  const count = photos.length;
  const current = ((index % count) + count) % count;
  const [direction, setDirection] = useState<1 | -1>(1);

  const goTo = (target: number, dir: 1 | -1) => {
    const next = ((target % count) + count) % count;
    if (next === current) return;
    setDirection(dir);
    onIndexChange(next);
  };
  const next = () => goTo(current + 1, 1);
  const previous = () => goTo(current - 1, -1);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      previous();
    }
  };

  const photo = photos[current];
  const custom = { dir: direction, reduce };
  const [place, ...rest] = photo.caption.split(" · ");
  const description = rest.join(" · ");

  return (
    <Modal open={open} onClose={onClose} labelledBy="gallery-title" variant="fullscreen" panelClassName="on-navy bg-navy-3 text-on-navy">
      <div className="flex h-full flex-col" onKeyDown={onKeyDown}>
        <div className="container-x flex h-[72px] shrink-0 items-center justify-between gap-6">
          <h2 id="gallery-title" className="title-3">
            {gallery.title}
          </h2>
          <div className="flex items-center gap-5 md:gap-7">
            <p aria-live="polite" aria-atomic="true" className="numeral text-[0.875rem] text-on-navy-muted">
              <span className="text-brass">{current + 1}</span> / {count}
            </p>
            <CloseButton onClick={onClose} label={gallery.close} tone="light" />
          </div>
        </div>

        {/* Photo row and caption row, centred as one block. From md the round
            controls flank the photo row, so they sit on the photo's centre line. */}
        <figure className="container-x grid min-h-0 flex-1 grid-cols-1 content-center md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-x-8">
          <NavButton direction="previous" onClick={previous} className="hidden self-center md:col-start-1 md:row-start-1 md:grid" />

          <div className="grid w-full min-w-0 touch-pan-y place-items-center md:col-start-2 md:row-start-1">
            <AnimatePresence initial={false} custom={custom}>
              <Slide key={current} photo={photo} custom={custom} onNext={next} onPrev={previous} />
            </AnimatePresence>
          </div>

          <NavButton direction="next" onClick={next} className="hidden self-center md:col-start-3 md:row-start-1 md:grid" />

          <figcaption className="mx-auto mt-5 min-h-12 max-w-[56ch] text-balance text-center text-[0.9375rem] leading-relaxed md:col-start-2 md:row-start-2 md:min-h-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={current}
                className="block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: reduce ? 0.15 : 0.5, ease: EASE, delay: reduce ? 0 : 0.1 } }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                {description ? (
                  <>
                    <span className="text-on-navy">{place}</span>
                    <span className="text-on-navy-muted">
                      {" · "}
                      {description}
                    </span>
                  </>
                ) : (
                  <span className="text-on-navy-muted">{photo.caption}</span>
                )}
              </motion.span>
            </AnimatePresence>
          </figcaption>
        </figure>

        <div className="container-x flex shrink-0 items-center justify-between gap-3 pb-6 pt-5 md:justify-center md:pb-8">
          <NavButton direction="previous" onClick={previous} className="grid md:hidden" />
          <Thumbnails photos={photos} current={current} onSelect={(i) => goTo(i, i > current ? 1 : -1)} />
          <NavButton direction="next" onClick={next} className="grid md:hidden" />
        </div>

        <Preload photos={[photos[(current + 1) % count], photos[(current - 1 + count) % count]]} />
      </div>
    </Modal>
  );
}
