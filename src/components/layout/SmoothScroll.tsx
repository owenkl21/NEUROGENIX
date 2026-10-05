"use client";

import { useCallback, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import { MotionConfig } from "motion/react";

/** Offset that keeps anchored headings clear of the sticky header. */
export const ANCHOR_OFFSET = -96;

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.085, wheelMultiplier: 0.95, autoRaf: true, stopInertiaOnNavigate: true }}>
      <HashOnLoad />
      {/* Reduced motion: Motion skips transform and layout animation site-wide. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ReactLenis>
  );
}

/** After a route change to a URL with a hash, glide to that section. */
function HashOnLoad() {
  const pathname = usePathname();
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    const { hash } = window.location;
    if (!hash) {
      lenis.scrollTo(0, { immediate: true });
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    const t = window.setTimeout(() => {
      const el = document.getElementById(id);
      if (el) lenis.scrollTo(el, { offset: ANCHOR_OFFSET, duration: 1.2 });
    }, 120);
    return () => window.clearTimeout(t);
  }, [pathname, lenis]);
  return null;
}

/**
 * Returns a click handler for internal links. Same-page hash links glide with
 * Lenis instead of jumping; everything else falls through to normal routing.
 */
export function useHashNavigation() {
  const lenis = useLenis();
  const pathname = usePathname();
  return useCallback(
    (href: string, event?: { preventDefault: () => void }) => {
      const [path, hash] = href.split("#");
      const samePage = path === "" || path === pathname;
      if (!samePage) return false;
      if (hash === undefined) {
        // A link to the page you are already on glides back to the top.
        event?.preventDefault();
        if (lenis) lenis.scrollTo(0, { duration: 1.2 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
        return true;
      }
      const el = hash ? document.getElementById(hash) : null;
      event?.preventDefault();
      if (lenis) lenis.scrollTo(el ?? 0, { offset: el ? ANCHOR_OFFSET : 0, duration: 1.4 });
      else (el ?? document.body).scrollIntoView({ behavior: "smooth" });
      if (hash) window.history.replaceState(null, "", `#${hash}`);
      if (el) {
        const heading = el.querySelector<HTMLElement>("h1, h2");
        if (heading) {
          heading.setAttribute("tabindex", "-1");
          heading.focus({ preventScroll: true });
        }
      }
      return true;
    },
    [lenis, pathname],
  );
}
