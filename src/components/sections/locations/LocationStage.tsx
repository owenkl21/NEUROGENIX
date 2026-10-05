"use client";

import { useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { Clock } from "@phosphor-icons/react";
import { locations } from "@/content/site";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/primitives";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { PracticeList } from "./PracticeList";
import { PracticeMap, type PracticeMapHandle } from "./PracticeMap";
import { TravelCheck } from "./TravelCheck";

/**
 * The practices, the map and the appointment detail panel.
 *
 * From 1024px the list holds the left five columns and the map stands tall
 * in the right seven, with the detail panel running full width beneath both.
 * Below that the map comes first, then the list, then the panel. Choosing a
 * practice in the list brings the map back into view if it has scrolled
 * away (it sits above the list on phones) and flies it there.
 */
export function LocationStage() {
  const [active, setActive] = useState<string | null>(null);
  const mapRef = useRef<PracticeMapHandle>(null);
  const mapBoxRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const reduce = useReducedMotion();

  const select = (id: string) => {
    const box = mapBoxRef.current;
    if (box) {
      const r = box.getBoundingClientRect();
      const header = Number.parseFloat(getComputedStyle(box).scrollMarginTop) || 0;
      const hidden = r.top < header - 1 || r.bottom > window.innerHeight + 1;
      if (hidden) {
        if (lenis) lenis.scrollTo(box, { duration: 1, immediate: reduce });
        else box.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      }
    }
    mapRef.current?.focusPractice(id);
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-8 xl:gap-x-12">
        <Reveal className="lg:col-span-5 lg:row-start-1">
          <h2 className="title-3 text-ink">{locations.listHeading}</h2>
          <p className="mt-2 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted">{locations.sampleNote}</p>
        </Reveal>

        <div ref={mapBoxRef} className="mt-6 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:mt-0">
          <PracticeMap ref={mapRef} active={active} setActive={setActive} className="h-[360px] sm:h-[440px] lg:h-[620px]" />
        </div>

        <PracticeList
          active={active}
          onSelect={select}
          onHighlight={(id) => mapRef.current?.highlight(id)}
          className="-mx-4 mt-5 sm:-mx-5 lg:row-start-2 lg:col-span-5 lg:mt-7"
        />
      </div>

      <Reveal y={32} amount={0.25} className="mt-12 rounded-surface border border-line bg-surface p-6 sm:p-9 md:mt-16 lg:mt-20 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-8">
          {/* Heading first, then its status: never a label sitting above the heading. */}
          <div className="lg:col-span-5">
            <h2 className="title-3 text-ink">{locations.heading}</h2>
            <p className="mt-4 inline-flex min-h-8 items-center gap-2 rounded-full border border-line py-1 pl-2.5 pr-3.5 text-[0.8125rem] leading-none text-muted">
              <Clock size={16} weight="regular" aria-hidden="true" className="shrink-0 text-brass-ink" />
              {locations.status}
            </p>
          </div>

          <RevealGroup as="dl" amount={0.4} className="mt-7 grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2 sm:gap-y-7 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:mt-0">
            {locations.fields.map((field) => (
              <RevealItem key={field.term} className="border-t border-line pt-4">
                <dt className="text-[0.8125rem] leading-snug text-muted">{field.term}</dt>
                <dd className="mt-1.5 italic text-ink-2">{field.value}</dd>
              </RevealItem>
            ))}
          </RevealGroup>

          <TravelCheck question={locations.check.q} answer={locations.check.a} className="mt-7 lg:col-span-5 lg:row-start-2 lg:mt-8 lg:self-end" />
        </div>
      </Reveal>
    </div>
  );
}
