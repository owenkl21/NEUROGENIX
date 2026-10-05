"use client";

import { Clock } from "@phosphor-icons/react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/primitives";
import { SignalTrace } from "@/components/signal/SignalTrace";
import { team } from "@/content/site";

const { profile } = team;

/**
 * The practitioner profile, honestly shown in its pending state: a quiet
 * low trace across the top (a line still waiting for its signal), a status
 * pill, and the fields that will be filled once the practice supplies them.
 */
export function TeamProfile() {
  return (
    <Reveal className="rounded-surface border border-line bg-surface p-7 shadow-soft sm:p-10">
      <SignalTrace kind="calm" mode="live" height={40} amplitude={0.1} speed={0.6} strokeWidth={1.25} color="var(--brass-ink)" baseline />

      <p className="mt-7 inline-flex min-h-8 items-center gap-2 rounded-full border border-line px-3.5 py-1 text-[0.8125rem] text-ink-2">
        <Clock size={16} aria-hidden="true" className="shrink-0 text-brass-ink" />
        {profile.status}
      </p>

      <h2 className="title-3 mt-6">{profile.title}</h2>
      <p className="mt-3 max-w-[42ch] text-muted">{profile.body}</p>

      <RevealGroup as="dl" className="@container mt-9">
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
