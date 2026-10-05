"use client";

import { Clock } from "@phosphor-icons/react";
import { locations, practices } from "@/content/site";
import { RevealGroup, RevealItem } from "@/components/motion/primitives";
import { PinGlyph, TestChips } from "./PracticeBits";

type Props = {
  active: string | null;
  onSelect: (id: string) => void;
  onHighlight: (id: string | null) => void;
  className?: string;
};

/**
 * The practices as a list of buttons: the accessible way to everything the
 * map shows. Choosing one flies the map there; choosing a marker on the map
 * marks its entry here (aria-pressed). The selected entry lifts onto a
 * surface and its pin breathes, the same pin the map draws.
 */
export function PracticeList({ active, onSelect, onHighlight, className = "" }: Props) {
  return (
    <RevealGroup as="ul" amount={0.15} className={`grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-1 ${className}`}>
      {practices.map((p) => {
        const on = p.id === active;
        return (
          <RevealItem as="li" key={p.id}>
            <button
              type="button"
              aria-pressed={on}
              onClick={() => onSelect(p.id)}
              onPointerEnter={() => onHighlight(p.id)}
              onPointerLeave={() => onHighlight(null)}
              onFocus={() => onHighlight(p.id)}
              onBlur={() => onHighlight(null)}
              className={`group flex w-full items-start gap-4 rounded-surface p-4 text-left transition-[background-color,box-shadow] duration-500 ease-calm sm:p-5 ${
                on ? "bg-surface shadow-soft" : "hover:bg-paper-2"
              }`}
            >
              <span className="pt-px">
                <PinGlyph active={on} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[1.0625rem] font-medium leading-snug tracking-[-0.01em] text-ink">{p.name}</span>
                <span className="mt-0.5 block text-[0.9375rem] text-muted">
                  {p.city}, {p.province}
                </span>
                <span className="mt-3 flex flex-col items-start gap-2.5 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-4">
                  <TestChips tests={p.tests} />
                  <span className="inline-flex items-center gap-1.5 text-[0.8125rem] text-muted">
                    <Clock size={16} weight="regular" aria-hidden="true" className="shrink-0 text-brass-ink" />
                    <span className="sr-only">{locations.hoursLabel}: </span>
                    {p.hours}
                  </span>
                </span>
              </span>
            </button>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
