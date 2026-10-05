"use client";

import { Fragment } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { patientGuide } from "@/content/site";

/** Credit line for the general information the guides are adapted from. */
export function GuideSources({ className = "" }: { className?: string }) {
  const { sources } = patientGuide;
  return (
    <p className={`text-balance text-[0.8125rem] leading-relaxed text-muted ${className}`}>
      {sources.before}
      {sources.links.map((link, i) => (
        <Fragment key={link.href}>
          {i > 0 && sources.joiner}
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group whitespace-nowrap rounded-sm text-ink underline decoration-line-strong decoration-1 underline-offset-[3px] transition-[text-decoration-color] duration-300 hover:decoration-ink"
          >
            {link.label}
            <ArrowUpRight
              size={12}
              aria-hidden="true"
              className="ml-0.5 inline-block align-[-1px] transition-transform duration-500 ease-calm group-hover:-translate-y-px group-hover:translate-x-px"
            />
          </a>
        </Fragment>
      ))}
      {sources.after}
    </p>
  );
}
