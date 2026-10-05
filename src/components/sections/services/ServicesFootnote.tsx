"use client";

import { Info } from "@phosphor-icons/react";
import { Reveal } from "@/components/motion/primitives";
import { services } from "@/content/site";

/** The quiet caveat under the stack: which test is right is the clinician's call. */
export function ServicesFootnote() {
  return (
    <Reveal as="p" className="mt-10 flex max-w-[62ch] items-start gap-3 text-[0.875rem] leading-relaxed text-muted md:mt-12">
      <Info size={18} weight="regular" aria-hidden="true" className="mt-[2px] shrink-0" />
      <span>{services.footnote}</span>
    </Reveal>
  );
}
