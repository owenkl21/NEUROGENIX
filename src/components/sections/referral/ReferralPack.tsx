"use client";

import { Warning } from "@phosphor-icons/react";
import { Button, SectionTitle, TextLink } from "@/components/ui";
import { referral } from "@/content/site";

const { pack } = referral;

/**
 * The referral pack: a deep panel the clinician acts on, kept at hand beside
 * the steps. On phones the download button takes the full width and its label
 * may wrap, so at 320px (400% zoom) it never forces the panel wider than the
 * screen.
 */
export function ReferralPack() {
  return (
    <aside aria-labelledby="referral-pack-title" className="on-deep rounded-surface bg-deep p-7 text-on-deep sm:p-10 xl:p-12 dark:ring-1 dark:ring-on-deep-line">
      <SectionTitle as="h2" size={3} id="referral-pack-title" lines={pack.title} />
      <p className="mt-5 max-w-[44ch] text-on-deep-muted">{pack.body}</p>

      <div className="mt-9 flex flex-col items-start gap-4">
        <Button
          variant="signal"
          icon="download"
          href={pack.download.href}
          download
          className="max-sm:h-auto max-sm:min-h-12 max-sm:w-full max-sm:shrink max-sm:justify-between max-sm:whitespace-normal max-sm:py-2 max-sm:text-left max-sm:[&>span:first-child]:leading-snug"
        >
          {pack.download.label}
        </Button>
        {/* Starts where the button's label starts (24px in), on one text axis. */}
        <TextLink tone="light" href={pack.contact.href} className="ml-6 min-h-11">
          {pack.contact.label}
        </TextLink>
      </div>

      <p className="mt-8 flex gap-3 border-t border-on-deep-line pt-6 text-[0.8125rem] leading-relaxed text-on-deep-muted">
        <Warning size={18} weight="light" aria-hidden="true" className="mt-px shrink-0 text-signal" />
        <span>{pack.note}</span>
      </p>
    </aside>
  );
}
