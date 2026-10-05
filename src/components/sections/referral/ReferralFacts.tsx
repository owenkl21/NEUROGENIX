"use client";

import { ClipboardText, LockKey, Phone } from "@phosphor-icons/react";
import { RevealGroup, RevealItem } from "@/components/motion/primitives";
import { referral } from "@/content/site";

const icons = [ClipboardText, LockKey, Phone];

/**
 * Three open questions for referrers, set as columns divided by hairlines
 * rather than cards. Phones stack them, each under its own top hairline.
 */
export function ReferralFacts() {
  return (
    <RevealGroup as="ul" className="grid md:grid-cols-3">
      {referral.facts.map((fact, i) => {
        const Icon = icons[i] ?? ClipboardText;
        return (
          <RevealItem
            as="li"
            key={fact.title}
            className="flex gap-5 border-t border-line py-7 md:flex-col md:gap-7 md:border-l md:border-t-0 md:px-8 md:py-1 md:first:border-l-0 md:first:pl-0 lg:px-12"
          >
            <Icon size={28} weight="light" aria-hidden="true" className="mt-0.5 shrink-0 text-ink-2 md:mt-0" />
            <div>
              <h3 className="font-medium text-ink">{fact.title}</h3>
              <p className="mt-1.5 text-[0.9375rem] text-muted">{fact.body}</p>
            </div>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
