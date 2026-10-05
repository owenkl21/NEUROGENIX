"use client";

import { Clock, X } from "@phosphor-icons/react";
import { locations, type Practice } from "@/content/site";
import { TestChips } from "./PracticeBits";

/**
 * What a map popup says about one practice. It is rendered by React into the
 * element Leaflet shows, so it uses the site's own type, tokens and icons.
 */
export function PracticePopup({ practice, onClose }: { practice: Practice; onClose: () => void }) {
  return (
    <div className="relative px-5 pb-5 pt-[18px] text-ink">
      <p className="pr-10 text-[1.0625rem] font-medium leading-snug tracking-[-0.01em]">{practice.name}</p>
      <p className="mt-0.5 text-[0.875rem] text-muted">
        {practice.city}, {practice.province}
      </p>

      <div className="mt-4 border-t border-line pt-4">
        <TestChips tests={practice.tests} />
        <p className="mt-3 flex items-center gap-2 text-[0.8125rem] text-muted">
          <Clock size={16} weight="regular" aria-hidden="true" className="shrink-0 text-brass-ink" />
          <span className="sr-only">{locations.hoursLabel}: </span>
          {practice.hours}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label={locations.closeDetails}
        className="absolute right-3 top-3 grid size-9 place-items-center rounded-full text-muted transition-colors duration-300 ease-calm before:absolute before:-inset-1 before:content-[''] hover:bg-paper-2 hover:text-ink"
      >
        <X size={16} weight="regular" aria-hidden="true" />
      </button>
    </div>
  );
}
