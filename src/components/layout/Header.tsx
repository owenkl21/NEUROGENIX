"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { useLenis } from "lenis/react";
import { ArrowRight } from "@phosphor-icons/react";
import { nav, routes, site } from "@/content/site";
import { BookButton, Button, SmartLink } from "@/components/ui";
import { useDialogs } from "@/components/dialogs/DialogProvider";
import { resumeSmoothScroll } from "@/components/dialogs/Modal";
import { EASE } from "@/components/motion/primitives";
import { Wordmark } from "./Wordmark";

/** Where the inline nav takes over from the menu. Matches `--breakpoint-nav` in globals.css. */
const NAV_QUERY = "(min-width: 67.5rem)";

/**
 * Sticky header. Transparent over the hero, then settles onto a frosted paper
 * bar once the page moves. It steps out of the way while reading downwards and
 * returns the moment the reader scrolls back up. The current page is marked
 * with a sliding signal underline.
 */
export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  // Pinned: scrolled past the preview bar, so the header sits at the very top.
  const [stuck, setStuck] = useState(false);
  const barHeight = useRef(0);
  const insetRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesInView, setServicesInView] = useState(false);
  const [shownPath, setShownPath] = useState(pathname);
  const lastY = useRef(0);
  const headerRef = useRef<HTMLElement>(null);
  // Where the header sits when the menu opens (below the preview bar at the
  // top of the page), so the close button lands exactly on the menu button.
  const [menuTop, setMenuTop] = useState(0);

  // Every page opens with the header in place, whatever the last one did.
  if (shownPath !== pathname) {
    setShownPath(pathname);
    setHidden(false);
  }

  useEffect(() => {
    lastY.current = window.scrollY;
  }, [pathname]);

  useEffect(() => {
    const measure = () => {
      barHeight.current = document.querySelector<HTMLElement>("[data-preview-bar]")?.offsetHeight ?? 0;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - lastY.current;
    lastY.current = y;
    const nextScrolled = y > 24;
    if (nextScrolled !== scrolled) setScrolled(nextScrolled);
    // The header pins once the preview bar has scrolled up to the status bar.
    const inset = insetRef.current?.offsetHeight ?? 0;
    const nextStuck = y >= barHeight.current - inset - 1;
    if (nextStuck !== stuck) setStuck(nextStuck);
    if (menuOpen) return;
    // Near the top the header is always there. Further down it follows the
    // reading direction, except for a jump this large: that is the page being
    // placed (an anchor, a route change), not someone reading, so it leaves
    // the header as it was.
    const jump = Math.abs(delta) > 300;
    const nextHidden = y < 480 ? false : jump ? hidden : delta > 4 ? true : delta < -4 ? false : hidden;
    if (nextHidden !== hidden) setHidden(nextHidden);
  });

  // Services lives on the home page, so it lights up while that section is on
  // screen (and on the test pages beneath it). Every other item is a page.
  useEffect(() => {
    if (!isHome) return;
    const el = document.getElementById("services");
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setServicesInView(entry.isIntersecting), { rootMargin: "-35% 0px -55% 0px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [isHome]);

  const activeHref =
    nav.find((n) => !n.href.includes("#") && (pathname === n.href || pathname.startsWith(`${n.href}/`)))?.href ??
    ((isHome && servicesInView) || pathname.startsWith("/tests") ? routes.services : null);

  return (
    <>
      {/* The status-bar area on phones with a notch or Dynamic Island (zero
          height everywhere else). Once the page scrolls it is filled in the
          header's frosted colour, so content never shows behind the clock and
          the header always sits just below it; it stays when the header steps
          away. At the top of the page the preview bar fills it instead. */}
      <div
        ref={insetRef}
        data-safe-top=""
        aria-hidden="true"
        className={`pointer-events-none fixed inset-x-0 top-0 z-[45] h-[env(safe-area-inset-top)] bg-paper/85 backdrop-blur-xl backdrop-saturate-150 transition-opacity duration-300 ${
          stuck ? "opacity-100" : "opacity-0"
        }`}
      />
      <motion.header
        ref={headerRef}
        className={`sticky top-[env(safe-area-inset-top)] z-40 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled ? "border-b border-line bg-paper/80 backdrop-blur-xl backdrop-saturate-150" : "border-b border-transparent"
        }`}
        animate={{ y: hidden && !reduce ? "-100%" : "0%" }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
          <SmartLink href="/" className="rounded-md" aria-label={`${site.name} home`}>
            <Wordmark />
          </SmartLink>

          <nav aria-label="Main navigation" className="hidden items-center gap-0.5 nav:flex">
            {nav.map((item) => {
              const isActive = activeHref === item.href;
              return (
                <SmartLink
                  key={item.href}
                  href={item.href}
                  aria-current={isActive && !item.href.includes("#") ? "page" : undefined}
                  className={`relative whitespace-nowrap rounded-full px-3.5 py-2 text-[0.9375rem] transition-colors duration-300 ${isActive ? "text-ink" : "text-muted hover:text-ink"}`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span layoutId="nav-active" className="absolute inset-x-3.5 -bottom-0.5 h-px bg-signal-ink" transition={{ type: "spring", stiffness: 380, damping: 34 }} />
                  )}
                </SmartLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block">
              <BookButton />
            </span>
            <button
              type="button"
              className="group grid size-11 place-items-center rounded-full border border-line nav:hidden"
              aria-label="Open navigation"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => {
                setMenuTop(Math.max(0, Math.round(headerRef.current?.getBoundingClientRect().top ?? 0)));
                setMenuOpen(true);
              }}
            >
              <span aria-hidden="true" className="flex w-[18px] flex-col gap-[5px]">
                <span className="h-px w-full bg-ink" />
                <span className="h-px w-2/3 bg-ink transition-[width] duration-300 group-hover:w-full" />
              </span>
            </button>
          </div>
        </div>
      </motion.header>
      <MobileMenu open={menuOpen} top={menuTop} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function MobileMenu({ open, top, onClose }: { open: boolean; top: number; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const { openBooking } = useDialogs();
  const reduce = useReducedMotion();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // The panel takes focus, not its first link (the logo), so opening the
      // menu never outlines the logo; Tab still reaches every link.
      panelRef.current?.focus({ preventScroll: true });
      lenis?.stop();
    }
  }, [open, lenis]);

  useEffect(() => {
    const mq = window.matchMedia(NAV_QUERY);
    const onChange = () => mq.matches && onClose();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      id="mobile-navigation"
      aria-label="Navigation"
      data-lenis-prevent
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClose={() => {
        if (open) onClose();
        resumeSmoothScroll(lenis);
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-ink open:block"
    >
      <AnimatePresence
        onExitComplete={() => {
          if (ref.current?.open) ref.current.close();
          resumeSmoothScroll(lenis);
        }}
      >
        {open && (
          <motion.div
            key="menu"
            ref={panelRef}
            tabIndex={-1}
            className="flex h-full flex-col overflow-y-auto bg-paper outline-none"
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="sticky top-0 z-10 shrink-0 bg-paper" style={{ paddingTop: top }}>
            <div className="container-x flex h-[var(--header-h)] items-center justify-between">
              <SmartLink href="/" onClick={onClose} aria-label={`${site.name} home`}>
                <Wordmark />
              </SmartLink>
              <button type="button" onClick={onClose} aria-label="Close navigation" className="grid size-11 place-items-center rounded-full border border-line">
                <span aria-hidden="true" className="relative block size-[18px]">
                  <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-ink" />
                  <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-ink" />
                </span>
              </button>
            </div>
            </div>
            <nav aria-label="Main navigation" className="container-x flex flex-1 flex-col justify-center pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-10">
              {/* Phones fill the width; from sm the list keeps a reading column and the CTA its own size. */}
              <ul className="flex flex-col sm:max-w-[560px]">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    className="border-b border-line"
                    initial={reduce ? false : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.18 + i * 0.06 }}
                  >
                    <SmartLink href={item.href} onClick={onClose} className="flex items-baseline justify-between py-5 text-[2rem] font-medium tracking-[-0.03em]">
                      {item.label}
                      <ArrowRight size={22} weight="light" aria-hidden="true" className="text-muted" />
                    </SmartLink>
                  </motion.li>
                ))}
              </ul>
              <motion.div className="mt-10" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}>
                {/* Close the menu first so the request opens on its own, not stacked over the menu. */}
                <Button
                  size="lg"
                  className="w-full justify-between! sm:w-auto"
                  onClick={() => {
                    onClose();
                    openBooking();
                  }}
                >
                  {site.bookLabel}
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
}
