"use client";

import type { ComponentType, InputHTMLAttributes, ReactNode, Ref } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { CaretDown, Check, WarningCircle, type IconProps } from "@phosphor-icons/react";
import { EASE } from "@/components/motion/primitives";

/*
 * Form building blocks for the request walkthrough. Labels sit above their
 * controls, every control is 48px tall with the 12px input radius, and an
 * error is announced through aria-describedby on the field it belongs to.
 * There is no red in the palette, so errors use signal ink with an icon: calm,
 * clearly different from the resting state, and AA on both themes.
 */

/**
 * Resting outline of a form control. The hairline tokens are for decoration
 * and sit near 1.7:1 on the panel; a control's edge has to reach 3:1 (WCAG
 * 1.4.11), and muted at 75% gives 3.4:1 on light and 3.8:1 on dark.
 */
export const CONTROL_BORDER = "border-muted/75";

/**
 * Room a control keeps around itself when Tab or an error scrolls it into
 * view, so it never lands under the panel's sticky bars. Above: the top bar
 * (72px, 80px from md) plus the field's own label. Below: the action bar plus
 * the field's message and the home indicator. These sit on the in-flow
 * controls rather than as scroll padding on the panel, so a control that
 * lives in a bar is already in view and focusing it never moves the step.
 */
export const SCROLL_CLEAR_BOTTOM = "scroll-mb-[calc(9rem+env(safe-area-inset-bottom))]";
const CONTROL_SCROLL = `scroll-mt-30 ${SCROLL_CLEAR_BOTTOM}`;

export function controlClass(invalid?: boolean) {
  return `h-12 w-full ${CONTROL_SCROLL} rounded-[12px] border bg-surface px-4 text-base transition-colors duration-300 ease-calm placeholder:text-muted ${
    invalid ? "border-signal-ink" : `${CONTROL_BORDER} hover:border-ink-2`
  }`;
}

export function errorId(id: string) {
  return `${id}-error`;
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.p
          key="error"
          id={id}
          className="flex items-start gap-2 pt-2 text-[0.875rem] leading-snug text-signal-ink"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          transition={{ duration: reduce ? 0.15 : 0.4, ease: EASE }}
        >
          <WarningCircle size={16} aria-hidden="true" className="mt-px shrink-0" />
          <span>{message}</span>
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}

export function Field({
  id,
  label,
  optional,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  optional?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-[0.9375rem] font-medium leading-6 text-ink">
        {label}
        {optional ? <span className="ml-1.5 font-normal text-muted">{optional}</span> : null}
      </label>
      {children}
      <FieldError id={errorId(id)} message={error} />
    </div>
  );
}

type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "id"> & {
  id: string;
  invalid?: boolean;
  inputRef?: Ref<HTMLInputElement>;
};

export function TextInput({ id, invalid, inputRef, ...rest }: TextInputProps) {
  return (
    <input
      id={id}
      ref={inputRef}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? errorId(id) : undefined}
      className={`${controlClass(invalid)} text-ink data-[empty=true]:text-muted [&::-webkit-date-and-time-value]:text-left`}
      {...rest}
    />
  );
}

export function Select({
  id,
  value,
  onChange,
  options,
  placeholder,
  invalid,
  required,
  inputRef,
  className = "",
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  invalid?: boolean;
  required?: boolean;
  inputRef?: Ref<HTMLSelectElement>;
  className?: string;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId(id) : undefined}
        className={`${controlClass(invalid)} cursor-pointer appearance-none pr-12 [&>option]:text-ink ${value === "" ? "text-muted" : "text-ink"} ${className}`}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <CaretDown size={16} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-2" />
    </div>
  );
}

/**
 * Custom 22px box drawn under a real, transparent checkbox that covers the
 * whole row: the row is the target, and focus scrolling brings the full row
 * and its message into view rather than a single hidden pixel.
 */
export function Checkbox({
  id,
  checked,
  onChange,
  label,
  invalid,
  required,
  inputRef,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  invalid?: boolean;
  required?: boolean;
  inputRef?: Ref<HTMLInputElement>;
}) {
  const reduce = useReducedMotion();
  return (
    <label htmlFor={id} className="group relative flex min-h-11 cursor-pointer items-start gap-3.5 py-1">
      <input
        id={id}
        ref={inputRef}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId(id) : undefined}
        className={`peer absolute inset-0 z-[1] m-0 size-full cursor-pointer appearance-none opacity-0 scroll-mt-24 ${SCROLL_CLEAR_BOTTOM}`}
      />
      <span
        aria-hidden="true"
        className={`mt-[2px] grid size-[22px] shrink-0 place-items-center rounded-[6px] border transition-colors duration-300 ease-calm peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-signal-ink ${
          checked ? "border-ink bg-ink text-surface" : invalid ? "border-signal-ink bg-surface" : `${CONTROL_BORDER} bg-surface group-hover:border-ink-2`
        }`}
      >
        <AnimatePresence initial={false}>
          {checked ? (
            <motion.span
              key="check"
              className="grid place-items-center"
              initial={reduce ? false : { scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 26 }}
            >
              <Check size={14} weight="bold" />
            </motion.span>
          ) : null}
        </AnimatePresence>
      </span>
      <span className="text-[0.9375rem] leading-relaxed text-ink">{label}</span>
    </label>
  );
}

/**
 * The step's actions. While the step is taller than the panel the bar holds
 * to the bottom edge and the step scrolls beneath it, so the way forward is
 * always in reach on a laptop or phone; at the end of the step it settles
 * into place as the panel's footer. It runs edge to edge over the panel's
 * side padding, and on phones it clears the home indicator.
 */
export function ActionBar({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={`sticky bottom-0 z-10 -mx-6 mt-7 border-t border-line bg-surface px-6 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 md:-mx-10 md:px-10 md:pb-7 md:pt-5 md:[@media(max-height:860px)]:mt-6 md:[@media(max-height:860px)]:pb-5 md:[@media(max-height:860px)]:pt-4 ${className}`}
    >
      {children}
    </div>
  );
}

/** A quiet inset note on the paper tone, with a small Phosphor icon. */
export function Inset({
  id,
  icon: Icon,
  className = "",
  children,
}: {
  id?: string;
  icon: ComponentType<IconProps>;
  className?: string;
  children: ReactNode;
}) {
  return (
    <p id={id} className={`flex items-start gap-3 rounded-[12px] bg-paper-2 px-4 py-3 text-[0.875rem] leading-relaxed text-muted ${className}`}>
      <Icon size={18} aria-hidden="true" className="mt-[2px] shrink-0 text-ink-2" />
      <span>{children}</span>
    </p>
  );
}
