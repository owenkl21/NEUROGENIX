"use client";

import { Clock } from "@phosphor-icons/react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/primitives";
import { SignalTrace } from "@/components/signal/SignalTrace";
import { team } from "@/content/site";

const { profile } = team;

/**
 * The practitioner profile, honestly shown in its pending state: a quiet
 * low trace across the top (a line still waiting for its signal), the
 * heading, a status pill and the fields that will be filled once the practice
 * supplies them.
 */
export function TeamProfile() {
  return (
    <Reveal className="rounded-surface border border-line bg-surface p-7 shadow-soft sm:p-10">
      <SignalTrace kind="calm" mode="live" height={40} amplitude={0.1} speed={0.6} strokeWidth={1.25} color="var(--signal-ink)" baseline />

      <h2 className="title-3 mt-7">{profile.title}</h2>
      <p className="mt-3 max-w-[42ch] text-muted">{profile.body}</p>

      {/* The status follows the heading as a fact about the fields below, never as a label above it. */}
      <p className="mt-6 inline-flex min-h-8 items-center gap-2 rounded-full border border-line px-3.5 py-1 text-[0.8125rem] text-ink-2">
        <Clock size={16} aria-hidden="true" className="shrink-0 text-signal-ink" />
        {profile.status}
      </p>

      <RevealGroup as="dl" className="@container mt-7">
        {profile.fields.map((field) => (
          <RevealItem key={field.term} className="flex flex-col gap-1 border-t border-line py-4 @sm:flex-row @sm:items-baseline @sm:justify-between @sm:gap-6">
            <dt className="text-[0.875rem] text-muted">{field.term}</dt>
            <dd className="shrink-0 italic text-ink-2">{field.value}</dd>
          </RevealItem>
        ))}
      </RevealGroup>
    </Reveal>
  );
}
