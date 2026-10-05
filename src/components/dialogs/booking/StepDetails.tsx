"use client";

import { useState, type Ref } from "react";
import { booking } from "@/content/site";
import { Button } from "@/components/ui";
import { Checkbox, Field, FieldError, Select, TextInput, errorId } from "./fields";
import { PHONE_PATTERN, todayInJohannesburg, type BookingErrors, type BookingForm } from "./model";

type DetailsKey = "name" | "phone" | "email" | "date" | "method";

/** Step two: how the practice should make contact. Sample details only. */
export function StepDetails({
  form,
  errors,
  onField,
  onAck,
  onBack,
  onSubmit,
  headingRef,
  nameRef,
  phoneRef,
  emailRef,
  ackRef,
}: {
  form: BookingForm;
  errors: BookingErrors;
  onField: (key: DetailsKey, value: string) => void;
  onAck: (checked: boolean) => void;
  onBack: () => void;
  onSubmit: () => void;
  headingRef: Ref<HTMLHeadingElement>;
  nameRef: Ref<HTMLInputElement>;
  phoneRef: Ref<HTMLInputElement>;
  emailRef: Ref<HTMLInputElement>;
  ackRef: Ref<HTMLInputElement>;
}) {
  const s = booking.step2;
  // Earliest selectable date, fixed for the life of this step.
  const [today] = useState(todayInJohannesburg);

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <h3 ref={headingRef} tabIndex={-1} className="title-3 outline-none">
        {s.heading}
      </h3>

      <div className="mt-6 grid gap-x-4 gap-y-5 sm:grid-cols-2">
        <Field id="booking-name" label={s.name.label} error={errors.name} className="sm:col-span-2">
          <TextInput
            id="booking-name"
            inputRef={nameRef}
            type="text"
            value={form.name}
            onChange={(e) => onField("name", e.target.value)}
            placeholder={s.name.placeholder}
            maxLength={100}
            autoComplete="off"
            invalid={Boolean(errors.name)}
          />
        </Field>
        <Field id="booking-phone" label={s.phone.label} error={errors.phone}>
          <TextInput
            id="booking-phone"
            inputRef={phoneRef}
            type="tel"
            value={form.phone}
            onChange={(e) => onField("phone", e.target.value)}
            placeholder={s.phone.placeholder}
            pattern={PHONE_PATTERN}
            maxLength={25}
            autoComplete="off"
            invalid={Boolean(errors.phone)}
          />
        </Field>
        <Field id="booking-email" label={s.email.label} error={errors.email}>
          <TextInput
            id="booking-email"
            inputRef={emailRef}
            type="email"
            value={form.email}
            onChange={(e) => onField("email", e.target.value)}
            placeholder={s.email.placeholder}
            maxLength={150}
            autoComplete="off"
            spellCheck={false}
            invalid={Boolean(errors.email)}
          />
        </Field>
        <Field id="booking-date" label={s.date.label} optional={s.date.optional}>
          <TextInput id="booking-date" type="date" value={form.date} min={today} data-empty={form.date === ""} onChange={(e) => onField("date", e.target.value)} />
        </Field>
        <Field id="booking-method" label={s.method.label}>
          <Select id="booking-method" value={form.method} onChange={(v) => onField("method", v)} options={s.method.options} />
        </Field>
      </div>

      <p className="mt-6 text-[0.875rem] leading-relaxed text-muted">{s.hint}</p>

      <div className="mt-4">
        <Checkbox id="booking-ack" inputRef={ackRef} checked={form.ack} onChange={onAck} label={s.ack} invalid={Boolean(errors.ack)} />
        <FieldError id={errorId("booking-ack")} message={errors.ack} />
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="outline" icon={null} onClick={onBack} className="w-full sm:w-auto">
          {s.back}
        </Button>
        <Button type="submit" className="w-full sm:w-auto">
          {s.submit}
        </Button>
      </div>
    </form>
  );
}
