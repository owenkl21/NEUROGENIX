"use client";

import { RevealGroup, RevealItem } from "@/components/motion/primitives";
import { referral } from "@/content/site";

/**
 * The three open questions for referrers, as a ruled definition list: what
 * the question is on the left, where it stands on the right. From 768px the
 * two columns follow the twelve-column grid, so the terms sit under the pack
 * and the answers under the steps. Phones stack term over answer.
 */
export function ReferralFacts() {
  return (
    <RevealGroup as="dl" className="border-b border-line">
      {referral.facts.map((fact) => (
        <RevealItem key={fact.title} className="grid grid-cols-1 gap-1.5 border-t border-line py-6 md:grid-cols-12 md:items-baseline md:gap-x-12 md:py-7">
          <dt className="font-medium text-ink md:col-span-5">{fact.title}</dt>
          <dd className="text-muted md:col-span-7 lg:col-span-6 lg:col-start-7">{fact.body}</dd>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
