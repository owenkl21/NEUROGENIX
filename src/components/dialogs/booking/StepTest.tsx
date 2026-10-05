"use client";

import type { Ref } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { CheckCircle, Circle } from "@phosphor-icons/react";
import { booking } from "@/content/site";
import { Button } from "@/components/ui";
import { SignalTrace } from "@/components/signal/SignalTrace";
import type { SignalKind } from "@/lib/signals";
import { Field, FieldError, Select } from "./fields";
import type { BookingErrors, BookingForm } from "./model";

const TEST_ERROR_ID = "booking-test-error";
type Choice = (typeof booking.step1.choices)[number];

/**
 * Step one: which test is on the referral. Each choice carries the signal its
 * test records. At rest the trace is a still pencil line; once chosen it is
 * recorded again in brass ink, so the selection is felt as well as seen.
 */
export function StepTest({
  form,
  errors,
  onTest,
  onReferral,
  onContinue,
  headingRef,
  testRef,
  referralRef,
}: {
  form: BookingForm;
  errors: BookingErrors;
  onTest: (value: string) => void;
  onReferral: (value: string) => void;
  onContinue: () => void;
  headingRef: Ref<HTMLHeadingElement>;
  testRef: Ref<HTMLInputElement>;
  referralRef: Ref<HTMLSelectElement>;
}) {
  const s = booking.step1;
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onContinue();
      }}
    >
      <h3 ref={headingRef} tabIndex={-1} className="title-3 outline-none">
        {s.heading}
      </h3>
      <p className="mt-2 max-w-[58ch] text-[0.9375rem] leading-relaxed text-muted">{s.process}</p>

      <fieldset className="mt-6" aria-describedby={errors.test ? TEST_ERROR_ID : undefined}>
        <legend className="sr-only">{s.heading}</legend>
        <div className="grid gap-3 min-[480px]:grid-cols-2">
          {s.choices.map((choice, i) => (
            <ChoiceCard
              key={choice.value}
              choice={choice}
              checked={form.test === choice.value}
              invalid={Boolean(errors.test)}
              onSelect={onTest}
              inputRef={i === 0 ? testRef : undefined}
            />
          ))}
        </div>
        <FieldError id={TEST_ERROR_ID} message={errors.test} />
      </fieldset>

      <div className="mt-7 grid gap-6 sm:grid-cols-2 sm:items-start sm:gap-3">
        <Field id="booking-referral" label={s.referralLabel} error={errors.referral}>
          <Select
            id="booking-referral"
            value={form.referral}
            onChange={onReferral}
            options={s.referralOptions}
            placeholder={s.referralPlaceholder}
            invalid={Boolean(errors.referral)}
            inputRef={referralRef}
          />
        </Field>
        <div className="sm:mt-8 sm:justify-self-end">
          <Button type="submit" className="w-full sm:w-auto">
            {s.continue}
          </Button>
        </div>
      </div>
    </form>
  );
}

function ChoiceCard({
  choice,
  checked,
  invalid,
  onSelect,
  inputRef,
}: {
  choice: Choice;
  checked: boolean;
  invalid: boolean;
  onSelect: (value: string) => void;
  inputRef?: Ref<HTMLInputElement>;
}) {
  const reduce = useReducedMotion();
  const kind: SignalKind = choice.slug ?? "calm";

  return (
    <label className="group relative block cursor-pointer">
      <input
        ref={inputRef}
        type="radio"
        name="booking-test"
        value={choice.value}
        checked={checked}
        onChange={() => onSelect(choice.value)}
        aria-describedby={invalid ? TEST_ERROR_ID : undefined}
        className="peer sr-only scroll-mt-28"
      />
      <span
        className={`flex h-full flex-col rounded-surface border bg-surface px-5 pb-4 pt-5 transition-[border-color,box-shadow] duration-300 ease-calm peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-brass-ink ${
          checked ? "border-ink shadow-[inset_0_0_0_1px_var(--ink)]" : invalid ? "border-line-strong" : "border-line group-hover:border-line-strong"
        }`}
      >
        <span className="flex items-start justify-between gap-4">
          <span className="min-w-0">
            <span className="block text-[1.0625rem] font-medium leading-snug text-ink">{choice.title}</span>
            <span className="mt-1 block text-[0.875rem] leading-snug text-muted">{choice.sub}</span>
          </span>
          <span aria-hidden="true" className="relative grid size-6 shrink-0 place-items-center">
            <Circle size={24} weight="light" className={`absolute inset-0 text-line-strong transition-opacity duration-300 ${checked ? "opacity-0" : "opacity-100"}`} />
            <AnimatePresence initial={false}>
              {checked ? (
                <motion.span
                  key="checked"
                  className="absolute inset-0 grid place-items-center text-ink"
                  initial={reduce ? false : { scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 480, damping: 26 }}
                >
                  <CheckCircle size={24} weight="fill" />
                </motion.span>
              ) : null}
            </AnimatePresence>
          </span>
        </span>
        <SignalTrace
          key={checked ? "recorded" : "resting"}
          kind={kind}
          mode={checked ? "draw" : "still"}
          height={22}
          amplitude={0.42}
          strokeWidth={checked ? 1.5 : 1.25}
          color={checked ? "var(--brass-ink)" : "var(--line-strong)"}
          className="mt-4"
        />
      </span>
    </label>
  );
}
