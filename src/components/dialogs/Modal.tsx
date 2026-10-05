"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { useLenis } from "lenis/react";
import { X } from "@phosphor-icons/react";
import { EASE } from "@/components/motion/primitives";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  describedBy?: string;
  children: ReactNode;
  /** panel: centred card on desktop, bottom sheet on phones. fullscreen: edge to edge. */
  variant?: "panel" | "fullscreen";
  panelClassName?: string;
  /** Called once the exit animation has finished and the dialog is closed. */
  onClosed?: () => void;
};

/**
 * Native <dialog> shell. showModal() gives focus trapping, Escape and an inert
 * page for free; Motion handles the enter and exit, and the dialog only truly
 * closes after the exit animation completes. Smooth scrolling pauses while open.
 */
export function Modal({ open, onClose, labelledBy, describedBy, children, variant = "panel", panelClassName = "", onClosed }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const lenis = useLenis();
  const reduce = useReducedMotion();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
      lenis?.stop();
    }
  }, [open, lenis]);

  const finishClose = () => {
    const dialog = ref.current;
    if (dialog?.open) dialog.close();
    lenis?.start();
    if (returnFocus.current?.isConnected) returnFocus.current.focus({ preventScroll: true });
    onClosed?.();
  };

  const panelMotion = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 } }
    : variant === "fullscreen"
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.45, ease: EASE } }
      : { initial: { opacity: 0, y: 48 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 32 }, transition: { duration: 0.6, ease: EASE } };

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      data-lenis-prevent
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClose={() => {
        // The browser can force-close (a second Escape); keep state in sync.
        if (open) onClose();
        lenis?.start();
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-transparent p-0 text-ink open:block"
    >
      <AnimatePresence onExitComplete={finishClose}>
        {open && (
          <motion.div key="backdrop" className="fixed inset-0 bg-navy-3/60 backdrop-blur-[6px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} onClick={onClose} />
        )}
        {open &&
          (variant === "fullscreen" ? (
            <motion.div key="panel" className={`fixed inset-0 ${panelClassName}`} {...panelMotion}>
              {children}
            </motion.div>
          ) : (
            <div key="panel-wrap" className="pointer-events-none fixed inset-0 flex items-end justify-center md:items-center md:p-6">
              <motion.div
                tabIndex={-1}
                className={`pointer-events-auto relative outline-none max-h-[calc(100dvh-24px)] w-full overflow-y-auto overscroll-contain rounded-t-[24px] bg-surface shadow-soft md:max-h-[calc(100dvh-48px)] md:rounded-[24px] ${panelClassName}`}
                {...panelMotion}
              >
                {children}
              </motion.div>
            </div>
          ))}
      </AnimatePresence>
    </dialog>
  );
}

export function CloseButton({ onClick, label, tone = "ink", className = "" }: { onClick: () => void; label: string; tone?: "ink" | "light"; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`group grid size-11 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
        tone === "light" ? "border-on-navy-line text-on-navy hover:border-on-navy" : "border-line text-ink hover:border-ink"
      } ${className}`}
    >
      <X size={18} aria-hidden="true" className="transition-transform duration-500 ease-calm group-hover:rotate-90" />
    </button>
  );
}
