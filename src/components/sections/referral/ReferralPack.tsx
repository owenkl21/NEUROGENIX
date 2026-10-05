"use client";

import { Warning } from "@phosphor-icons/react";
import { Button, SectionTitle, TextLink } from "@/components/ui";
import { referral } from "@/content/site";

const { pack } = referral;

/** The referral pack: a navy panel the clinician acts on, kept at hand beside the steps. */
export function ReferralPack() {
  return (
    <aside aria-labelledby="referral-pack-title" className="on-navy rounded-surface bg-navy p-7 text-on-navy sm:p-10 xl:p-12">
      <p className="label text-brass">{pack.label}</p>
      <SectionTitle as="h3" size={3} id="referral-pack-title" lines={pack.title} className="mt-6" />
      <p className="mt-5 max-w-[44ch] text-on-navy-muted">{pack.body}</p>

      <div className="mt-9 flex flex-col items-start gap-4">
        <Button variant="brass" icon="download" href={pack.download.href} download className="max-sm:w-full max-sm:justify-between">
          {pack.download.label}
        </Button>
        <TextLink tone="light" href={pack.contact.href} className="min-h-11">
          {pack.contact.label}
        </TextLink>
      </div>

      <p className="mt-8 flex gap-3 border-t border-on-navy-line pt-6 text-[0.8125rem] leading-relaxed text-on-navy-muted">
        <Warning size={18} weight="light" aria-hidden="true" className="mt-px shrink-0 text-brass" />
        <span>{pack.note}</span>
      </p>
    </aside>
  );
}
