"use client";

import { footer, site } from "@/content/site";
import { BookButton, SmartLink } from "@/components/ui";
import { useDialogs } from "@/components/dialogs/DialogProvider";
import { MaskLines, Reveal } from "@/components/motion/primitives";
import { SignalTrace } from "@/components/signal/SignalTrace";
import { Wordmark } from "./Wordmark";

/** Closing navy block, the same navy as the practice's feature wall. */
export function Footer() {
  const { openPrivacy } = useDialogs();
  const year = new Date().getFullYear();

  return (
    <footer className="on-navy relative overflow-hidden bg-navy text-on-navy">
      <div className="container-x pb-10 pt-24 md:pt-32">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <MaskLines as="p" lines={site.tagline} className="display-2 md:col-span-8" />
          <Reveal className="md:col-span-4 md:justify-self-end">
            <BookButton variant="brass" size="lg" />
          </Reveal>
        </div>

        <SignalTrace kind="eeg" height={88} amplitude={0.4} className="mt-16 md:mt-24" speed={0.8} />

        <div className="mt-10 grid gap-10 border-t border-on-navy-line pt-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <SmartLink href="/#" aria-label={`${site.name} home`} className="inline-flex rounded-md">
              <Wordmark tone="light" />
            </SmartLink>
          </div>
          <nav aria-label="Footer" className="md:col-span-7 md:justify-self-end">
            <ul className="flex flex-wrap gap-x-8 gap-y-3 text-[0.9375rem]">
              {footer.links.map((link) => (
                <li key={link.href}>
                  <SmartLink href={link.href} className="text-on-navy-muted transition-colors duration-300 hover:text-on-navy">
                    {link.label}
                  </SmartLink>
                </li>
              ))}
              <li>
                <button type="button" onClick={openPrivacy} className="text-on-navy-muted transition-colors duration-300 hover:text-on-navy">
                  {footer.privacy}
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-2 text-[0.8125rem] text-on-navy-muted md:flex-row md:items-center md:justify-between">
          <span>
            © {year} {footer.rights}
          </span>
          <span>{footer.disclaimer}</span>
        </div>
      </div>
    </footer>
  );
}
