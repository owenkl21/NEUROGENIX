"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * True while the media query matches. Discrete state only (it changes when the
 * query flips), so it never re-renders on scroll or resize ticks. The server
 * snapshot is false, which keeps the first paint on the simplest layout.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
