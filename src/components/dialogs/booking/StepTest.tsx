"use client";

import type { Ref } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { CheckCircle, Circle } from "@phosphor-icons/react";
import { booking } from "@/content/site";
import { Button } from "@/components/ui";
import { SignalTrace } from "@/components/signal/SignalTrace";
import type { SignalKind } from "@/lib/signals";
import { ActionBar, Field, FieldError, SCROLL_CLEAR_BOTTOM, Select } from "./fields";
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

      {/* A radiogroup carries the required state for its radios (a native
          required on each radio would be announced as invalid before anyone
          has answered, since the form validates itself). */}
      <fieldset
        role="radiogroup"
        aria-required="true"
        aria-invalid={errors.test ? true : undefined}
        aria-describedby={errors.test ? TEST_ERROR_ID : undefined}
        className="mt-6 md:[@media(max-height:860px)]:mt-5"
      >
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

      {/* From sm the referral question rides in the action bar beside
          Continue, so the whole step can be answered without scrolling past
          the cards. A phone is too narrow for both on one row, so there the
          question closes the step and the bar carries Continue alone: each
          bar steps aside (display: contents) where the other one applies. */}
      <ActionBar className="max-sm:contents sm:grid sm:grid-cols-2 sm:items-start sm:gap-3">
        <Field id="booking-referral" label={s.referralLabel} error={errors.referral} className="mt-7 sm:mt-0">
          <Select
            id="booking-referral"
            value={form.referral}
            onChange={onReferral}
            options={s.referralOptions}
            placeholder={s.referralPlaceholder}
            invalid={Boolean(errors.referral)}
            required
            inputRef={referralRef}
            // In the action bar from sm it is always in view; no scroll room needed.
            className="sm:scroll-m-0"
          />
        </Field>
        <ActionBar className="sm:contents">
          <div className="sm:mt-8 sm:justify-self-end">
            <Button type="submit" className="w-full sm:w-auto">
              {s.continue}
            </Button>
          </div>
        </ActionBar>
      </ActionBar>
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
        className={`peer absolute inset-0 z-[1] m-0 size-full cursor-pointer appearance-none rounded-surface opacity-0 scroll-mt-24 ${SCROLL_CLEAR_BOTTOM}`}
      />
      <span
        className={`flex h-full flex-col rounded-surface border bg-surface px-5 pb-4 pt-5 transition-[border-color,box-shadow] duration-300 ease-calm md:[@media(max-height:860px)]:pb-3 md:[@media(max-height:860px)]:pt-4 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-brass-ink ${
          checked ? "border-ink shadow-[inset_0_0_0_1px_var(--ink)]" : invalid ? "border-brass-ink" : "border-line-strong group-hover:border-ink-2"
        }`}
      >
        <span className="flex items-start justify-between gap-4">
          <span className="min-w-0">
            <span className="block text-[1.0625rem] font-medium leading-snug text-ink">{choice.title}</span>
            <span className="mt-1 block text-[0.875rem] leading-snug text-muted">{choice.sub}</span>
          </span>
          <span aria-hidden="true" className="relative grid size-6 shrink-0 place-items-center">
            <Circle size={24} weight="light" className={`absolute inset-0 text-muted transition-[opacity,color] group-hover:text-ink-2 duration-300 ${checked ? "opacity-0" : "opacity-100"}`} />
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
          className="mt-4 md:[@media(max-height:860px)]:mt-3 md:[@media(max-height:860px)]:h-4!"
        />
      </span>
    </label>
  );
}
