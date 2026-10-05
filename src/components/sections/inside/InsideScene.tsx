"use client";

import { useMediaQuery } from "./useMediaQuery";
import { InsidePinned } from "./InsidePinned";
import { InsideStatic } from "./InsideStatic";

/** Must match the section's `lg:motion-safe:` height in LookInside.tsx. */
const PINNED = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/** Pinned, scroll-driven scene on desktop; a plain band everywhere else. */
export function InsideScene() {
  const pinned = useMediaQuery(PINNED);
  return pinned ? <InsidePinned /> : <InsideStatic />;
}
