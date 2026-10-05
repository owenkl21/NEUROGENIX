"use client";

import { Printer } from "@phosphor-icons/react";

/**
 * Quiet outline pill beside the booking button. Same height, label roll and
 * press as the shared Button, so the pair reads as one control set.
 */
export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="group inline-flex h-14 w-full shrink-0 items-center justify-center gap-3 whitespace-nowrap rounded-full border border-line-strong px-7 text-[1.0625rem] font-medium text-ink transition-[border-color,transform] duration-300 ease-calm hover:border-ink active:translate-y-px sm:w-auto"
    >
      <Printer size={18} aria-hidden="true" className="shrink-0 transition-transform duration-500 ease-calm group-hover:-translate-y-0.5" />
      <span className="relative block overflow-hidden leading-none">
        <span className="block py-1 transition-transform duration-500 ease-calm group-hover:-translate-y-full motion-reduce:group-hover:translate-y-0">{label}</span>
        <span aria-hidden="true" className="absolute inset-0 block translate-y-full py-1 transition-transform duration-500 ease-calm group-hover:translate-y-0 motion-reduce:hidden">
          {label}
        </span>
      </span>
    </button>
  );
}
