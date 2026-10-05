"use client";

import { lookInside } from "@/content/site";
import { useDialogs } from "@/components/dialogs/DialogProvider";
import { ParallaxImage, Reveal } from "@/components/motion/primitives";
import { SectionTitle, TextLink } from "@/components/ui";
import { GalleryThumb } from "./GalleryThumb";
import { thumbIndexes } from "./photos";

/**
 * The unpinned version: phones, tablets and anyone who prefers reduced motion.
 * Copy, then the testing room, then the other practice photos as a contact
 * strip of three under it (copy left and photographs right above 1024px).
 * The testing room is not repeated in the strip.
 */
export function InsideStatic() {
  const { openGallery } = useDialogs();

  return (
    <div className="container-x section-y">
      <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-10">
        <div className="lg:col-span-6 xl:col-span-5">
          <SectionTitle id="inside-heading" lines={lookInside.title} />
          <Reveal className="mt-6 md:mt-8">
            <p className="lede max-w-[44ch] text-on-navy-muted">{lookInside.body}</p>
          </Reveal>
          <Reveal className="mt-6 md:mt-8" y={12}>
            <TextLink tone="light" onClick={() => openGallery(0)} className="min-h-11">
              {lookInside.cta}
            </TextLink>
          </Reveal>
        </div>

        <div className="mt-10 md:mt-16 lg:col-span-6 lg:mt-0 xl:col-span-7">
          <ParallaxImage
            src={lookInside.image.src}
            alt={lookInside.image.alt}
            width={lookInside.image.width}
            height={lookInside.image.height}
            sizes="(min-width: 1320px) 720px, (min-width: 1024px) 56vw, 100vw"
            intensity={4}
            className="aspect-[4/3] rounded-surface bg-navy-2"
          />
          <ul className="mt-3 grid grid-cols-3 gap-3 sm:mt-4 sm:gap-4">
            {thumbIndexes.map((index) => (
              <li key={index}>
                <GalleryThumb index={index} sizes="(min-width: 1320px) 230px, (min-width: 1024px) 18vw, 33vw" className="aspect-[4/3] w-full" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
