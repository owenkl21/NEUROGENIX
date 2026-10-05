"use client";

import { useLayoutEffect, useRef, type FocusEvent } from "react";
import Image from "next/image";
import { cubicBezier, motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { lookInside } from "@/content/site";
import { useDialogs } from "@/components/dialogs/DialogProvider";
import { SectionTitle, TextLink } from "@/components/ui";
import { GalleryThumb } from "./GalleryThumb";
import { thumbIndexes } from "./photos";

/** Insets of the resting card inside the pinned stage, in px, the pan that
    centres the photograph's subject inside that card, and the starting zoom. */
type Geometry = { t: number; r: number; b: number; l: number; dx: number; s0: number };

/* How much of the photograph's width the resting card should show. The
   starting zoom is derived from it, then kept to a gentle pull back. */
const CARD_SHOWS = 0.42;
const ZOOM: [number, number] = [1.04, 1.15];
const IMAGE_RATIO = lookInside.image.width / lookInside.image.height;

/* Scroll choreography, as fractions of the pinned distance. The copy is read
   while the section scrolls in, then steps back first and is gone before the
   photograph's left edge reaches its column, so the room never cuts across
   words that are still legible. Then the room opens up around the reader
   (clip, pan and scale share one curve), then the photo row arrives. */
const COPY_OUT: [number, number] = [0.03, 0.15];
const OPEN: [number, number] = [0.08, 0.62];
const ROW_IN: [number, number] = [0.62, 0.82];
/* Responds the moment the reader scrolls, then settles slowly into full bleed. */
const opening = cubicBezier(0.4, 0, 0.25, 1);
const swift = cubicBezier(0.65, 0, 0.35, 1);

/**
 * Desktop with motion allowed. The section is 240vh tall (set on the section
 * itself so the page height is right before hydration); this stage pins for
 * the extra 140vh. The testing room starts as a rounded card right of centre
 * and grows until it fills the viewport, the copy steps back just ahead of it,
 * and a scrim brings in the other practice photos and the gallery link (the
 * scene's only link to the gallery, so it is never offered twice).
 */
export function InsidePinned() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const { openGallery } = useDialogs();
  const lenis = useLenis();

  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start start", "end end"] });
  const geo = useMotionValue<Geometry>({ t: 0, r: 0, b: 0, l: 0, dx: 0, s0: ZOOM[1] });

  // The card's resting shape comes from an invisible slot in the page grid, so
  // it lines up with the container at every width.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const slot = slotRef.current;
    if (!stage || !slot) return;
    const measure = () => {
      const s = stage.getBoundingClientRect();
      const c = slot.getBoundingClientRect();
      // Width the photograph renders at when it covers the whole stage.
      const rendered = Math.max(s.width, s.height * IMAGE_RATIO);
      const s0 = Math.min(ZOOM[1], Math.max(ZOOM[0], c.width / (rendered * CARD_SHOWS)));
      geo.set({
        t: c.top - s.top,
        r: s.right - c.right,
        b: s.bottom - c.bottom,
        l: c.left - s.left,
        dx: ((c.left + c.right) / 2 - (s.left + s.right) / 2) * 0.85,
        s0,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    observer.observe(slot);
    return () => observer.disconnect();
  }, [geo]);

  const open = useTransform(scrollYProgress, OPEN, [0, 1], { ease: opening });
  const clipPath = useTransform(() => {
    const g = geo.get();
    const k = 1 - open.get();
    return `inset(${(g.t * k).toFixed(2)}px ${(g.r * k).toFixed(2)}px ${(g.b * k).toFixed(2)}px ${(g.l * k).toFixed(2)}px round ${(24 * k).toFixed(2)}px)`;
  });
  const imageX = useTransform(() => geo.get().dx * (1 - open.get()));
  const imageScale = useTransform(() => {
    const { s0 } = geo.get();
    return s0 + (1 - s0) * open.get();
  });

  const copyOpacity = useTransform(scrollYProgress, COPY_OUT, [1, 0]);
  const copyX = useTransform(scrollYProgress, COPY_OUT, [0, -80]);

  const rowOpacity = useTransform(scrollYProgress, ROW_IN, [0, 1]);
  const rowY = useTransform(scrollYProgress, ROW_IN, [24, 0], { ease: swift });
  const rowEvents = useTransform(scrollYProgress, (v) => (v > ROW_IN[0] + 0.08 ? "auto" : "none"));

  // Keyboard users: focusing something that is faded out scrolls the scene to
  // the moment where it is visible, so focus is never on an invisible control.
  // Pointer focus is left alone; a click already happens where things are seen.
  const scrollToProgress = (target: number) => {
    const root = rootRef.current;
    if (!root) return;
    const top = root.getBoundingClientRect().top + window.scrollY;
    const y = top + target * (root.offsetHeight - window.innerHeight);
    if (lenis) lenis.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y });
  };
  const byKeyboard = (event: FocusEvent<HTMLElement>) => event.target instanceof HTMLElement && event.target.matches(":focus-visible");
  const revealRow = (event: FocusEvent<HTMLElement>) => {
    if (byKeyboard(event) && scrollYProgress.get() < ROW_IN[1]) scrollToProgress(0.92);
  };

  return (
    <div ref={rootRef} className="relative h-full">
      <div ref={stageRef} className="sticky top-0 h-dvh overflow-hidden">
        {/* Copy and the card's resting slot share the page grid. */}
        <div className="container-x grid h-full grid-cols-12 items-center gap-x-10">
          <motion.div className="col-span-6 xl:col-span-5" style={{ opacity: copyOpacity, x: copyX }}>
            <SectionTitle id="inside-heading" lines={lookInside.title} />
            <p className="lede mt-8 max-w-[40ch] text-on-navy-muted">{lookInside.body}</p>
          </motion.div>
          <div ref={slotRef} aria-hidden="true" className="col-span-6 col-start-7 aspect-[5/4] max-h-[76dvh] xl:col-span-7 xl:col-start-6" />
        </div>

        {/* The testing room. */}
        <motion.div className="absolute inset-0 overflow-hidden bg-navy-2" style={{ clipPath }}>
          <motion.div className="absolute inset-0 will-change-transform" style={{ x: imageX, scale: imageScale }}>
            <Image src={lookInside.image.src} alt={lookInside.image.alt} fill sizes="100vw" className="object-cover object-[45%_55%]" />
          </motion.div>
        </motion.div>

        {/* Scrim and the photo row, once the room fills the screen. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-linear-to-t from-navy-3/90 via-navy-3/45 to-transparent"
          style={{ opacity: rowOpacity }}
        />
        <motion.div className="absolute inset-x-0 bottom-0" style={{ opacity: rowOpacity, y: rowY, pointerEvents: rowEvents }}>
          <div className="container-x flex items-center justify-between gap-10 pb-12 xl:pb-14">
            <ul className="flex gap-3">
              {thumbIndexes.map((index) => (
                <li key={index}>
                  <GalleryThumb index={index} sizes="128px" className="h-[84px] w-28" onFocus={revealRow} />
                </li>
              ))}
            </ul>
            {/* React focus events bubble, so the wrapper hears the link's focus. */}
            <div className="shrink-0" onFocus={revealRow}>
              <TextLink tone="light" onClick={() => openGallery(0)} className="min-h-11 whitespace-nowrap">
                {lookInside.cta}
              </TextLink>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
