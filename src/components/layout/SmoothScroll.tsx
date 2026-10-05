"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import { MotionConfig } from "motion/react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.085, wheelMultiplier: 0.95, autoRaf: true, stopInertiaOnNavigate: true }}>
      <HashOnLoad />
      {/* Reduced motion: Motion skips transform and layout animation site-wide. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ReactLenis>
  );
}

/*
 * Anchored sections stop clear of the sticky header through the
 * scroll-margin-top set in globals.css. Native jumps and Lenis both read it,
 * so no offset is passed here.
 */

/** Moves focus to a section's heading without scrolling, so the next Tab continues from there. */
function focusSection(el: HTMLElement) {
  const heading = el.matches("h1, h2") ? el : el.querySelector<HTMLElement>("h1, h2");
  if (!heading) return;
  heading.setAttribute("tabindex", "-1");
  heading.focus({ preventScroll: true });
}

/**
 * Scroll position at which an element rests clear of the header. Read from
 * layout offsets rather than the bounding box, so it ignores transforms that
 * are still settling (the route template lifts the new page in by 18px, and
 * a jump measured mid-lift would land short).
 */
function restingScroll(el: HTMLElement) {
  let y = 0;
  for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) y += node.offsetTop;
  return y - (Number.parseFloat(getComputedStyle(el).scrollMarginTop) || 0);
}

/**
 * After a route change to a URL with a hash, settle on that section. The
 * router has normally jumped there already; the glide only corrects for
 * anything that moved while the page was still arriving.
 */
function HashOnLoad() {
  const pathname = usePathname();
  const lenis = useLenis();
  const freshLoad = useRef(true);
  useEffect(() => {
    if (!lenis) return;
    const { hash } = window.location;
    if (!hash) {
      freshLoad.current = false;
      lenis.scrollTo(0, { immediate: true });
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    const t = window.setTimeout(() => {
      const fresh = freshLoad.current;
      freshLoad.current = false;
      const el = document.getElementById(id);
      if (!el) return;
      const target = restingScroll(el);
      if (Math.abs(window.scrollY - target) > 4) {
        // Lenis re-measures the page on a 250ms debounce, so it may still hold
        // the previous page's height and would clamp the glide short of it.
        lenis.resize();
        lenis.scrollTo(target, { duration: 1.2 });
      }
      // After a route change, focus would otherwise stay on the link that
      // brought us here (or drop to the top of the page), so it moves to the
      // section. A fresh load has nothing to carry over.
      if (!fresh) focusSection(el);
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
      if (lenis) lenis.scrollTo(el ?? 0, { duration: 1.4 });
      else (el ?? document.body).scrollIntoView({ behavior: "smooth" });
      if (hash) window.history.replaceState(null, "", `#${hash}`);
      if (el) focusSection(el);
      return true;
    },
    [lenis, pathname],
  );
}
