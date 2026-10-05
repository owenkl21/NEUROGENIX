"use client";

import type { Ref } from "react";
import { motion, type Variants } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { CheckCircle, LockSimple } from "@phosphor-icons/react";
import { booking } from "@/content/site";
import { Button } from "@/components/ui";
import { EASE } from "@/components/motion/primitives";
import { Inset } from "./fields";
import { formatPreferredDate, type BookingForm } from "./model";

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.25 } },
};
const row: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** Step three: the request read back, line by line. Nothing has been sent. */
export function StepPreview({
  form,
  onEdit,
  onDone,
  headingRef,
}: {
  form: BookingForm;
  onEdit: () => void;
  onDone: () => void;
  headingRef: Ref<HTMLHeadingElement>;
}) {
  const reduce = useReducedMotion();
  const s = booking.step3;
  const rows: [string, string][] = [
    [s.rows.test, form.test],
    [s.rows.referral, form.referral],
    [s.rows.name, form.name.trim()],
    [s.rows.phone, form.phone.trim()],
    [s.rows.email, form.email.trim()],
    [s.rows.date, formatPreferredDate(form.date)],
    [s.rows.method, form.method],
  ];

  return (
    <div>
      <motion.div
        className="text-brass-ink"
        initial={reduce ? false : { scale: 0.5, opacity: 0, rotate: -12 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 16, delay: 0.1 }}
      >
        <CheckCircle size={56} weight="light" aria-hidden="true" />
      </motion.div>
      <h3 ref={headingRef} tabIndex={-1} className="title-3 mt-4 outline-none">
        {s.heading}
      </h3>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{s.hint}</p>

      <motion.dl className="mt-6 border-t border-line" variants={list} initial={reduce ? false : "hidden"} animate="show">
        {rows.map(([term, value]) => (
          <motion.div
            key={term}
            variants={row}
            className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)] gap-4 border-b border-line py-3.5 sm:grid-cols-[10rem_minmax(0,1fr)]"
          >
            <dt className="text-[0.9375rem] text-muted">{term}</dt>
            <dd className="text-[0.9375rem] text-ink [overflow-wrap:anywhere]">{value}</dd>
          </motion.div>
        ))}
      </motion.dl>

      <Inset icon={LockSimple} className="mt-6">
        {s.note}
      </Inset>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="outline" icon={null} onClick={onEdit} className="w-full sm:w-auto">
          {s.edit}
        </Button>
        <Button icon={null} onClick={onDone} className="w-full sm:w-auto">
          {s.done}
        </Button>
      </div>
    </div>
  );
}
