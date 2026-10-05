"use client";

import type { FocusEvent } from "react";
import Image from "next/image";
import { gallery } from "@/content/site";
import { useDialogs } from "@/components/dialogs/DialogProvider";

type Props = {
  index: number;
  sizes: string;
  className?: string;
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
};

/** A practice photo as a button that opens the gallery at that photo. */
export function GalleryThumb({ index, sizes, className = "", onFocus }: Props) {
  const { openGallery } = useDialogs();
  const photo = gallery.photos[index];

  return (
    <button
      type="button"
      onClick={() => openGallery(index)}
      onFocus={onFocus}
      aria-label={`${gallery.openPhoto}: ${photo.caption}`}
      className={`group relative isolate block overflow-hidden rounded-surface-sm bg-deep-2 ${className}`}
    >
      <Image
        src={photo.src}
        alt=""
        width={photo.width}
        height={photo.height}
        sizes={sizes}
        className="h-full w-full object-cover transition-transform duration-700 ease-calm group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-on-deep/15 transition-[box-shadow] duration-500 ease-calm group-hover:ring-on-deep/55"
      />
    </button>
  );
}
