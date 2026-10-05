"use client";

import { gallery, lookInside } from "@/content/site";
import { useDialogs } from "@/components/dialogs/DialogProvider";
import { ParallaxImage, Reveal } from "@/components/motion/primitives";
import { SectionTitle, TextLink } from "@/components/ui";
import { GalleryThumb } from "./GalleryThumb";

/**
 * The unpinned version: phones, tablets and anyone who prefers reduced motion.
 * Copy, then the testing room, then the four photos as a contact sheet
 * (2 x 2 below 1024px; copy left and photos right above it).
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
          <Reveal className="mt-8" y={12}>
            <TextLink tone="light" onClick={() => openGallery(0)} className="min-h-11">
              {lookInside.cta}
            </TextLink>
          </Reveal>
        </div>

        <div className="mt-12 md:mt-16 lg:col-span-6 lg:mt-0 xl:col-span-7">
          <ParallaxImage
            src={lookInside.image.src}
            alt={lookInside.image.alt}
            width={lookInside.image.width}
            height={lookInside.image.height}
            sizes="(min-width: 1320px) 720px, (min-width: 1024px) 56vw, 100vw"
            intensity={4}
            className="aspect-[4/3] rounded-surface bg-navy-2"
          />
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-4">
            {gallery.photos.map((photo, i) => (
              <li key={photo.src + i}>
                <GalleryThumb index={i} sizes="(min-width: 1024px) 170px, 50vw" className="aspect-[4/3] w-full" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
