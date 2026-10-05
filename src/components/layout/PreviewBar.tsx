"use client";

import { usePathname } from "next/navigation";
import { previewBar } from "@/content/site";

/** Honest status strip: this is a review build and nothing is sent. */
export function PreviewBar() {
  const pathname = usePathname();
  const [lead, detail] = pathname.startsWith("/tests") ? previewBar.test : previewBar.home;
  return (
    <div data-preview-bar className="on-deep bg-deep-3 pt-[env(safe-area-inset-top)] text-on-deep-muted">
      <p className="container-x flex min-h-9 flex-wrap items-center justify-center gap-x-3 gap-y-0.5 py-2 text-center text-[0.78rem] leading-snug">
        <span className="font-medium text-on-deep">{lead}</span>
        <span aria-hidden="true" className="hidden h-3 w-px bg-on-deep-line sm:block" />
        <span>{detail}</span>
      </p>
    </div>
  );
}
