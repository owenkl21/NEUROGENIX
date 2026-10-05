"use client";

import { footer, site } from "@/content/site";
import { BookButton, SmartLink } from "@/components/ui";
import { useDialogs } from "@/components/dialogs/DialogProvider";
import { MaskLines, Reveal } from "@/components/motion/primitives";
import { SignalTrace } from "@/components/signal/SignalTrace";
import { Wordmark } from "./Wordmark";

/** Closing deep block, the same deep as the practice's feature wall. */
export function Footer() {
  const { openPrivacy } = useDialogs();
  const year = new Date().getFullYear();

  return (
    <footer className="on-deep relative overflow-hidden bg-deep text-on-deep">
      <div className="container-x pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-16 md:pt-32">
        <div className="grid gap-8 md:grid-cols-12 md:items-end md:gap-10">
          <MaskLines as="p" lines={site.tagline} className="display-2 md:col-span-8" />
          <Reveal className="md:col-span-4 md:justify-self-end">
            <BookButton variant="signal" size="lg" />
          </Reveal>
        </div>

        <SignalTrace kind="eeg" bleed height={96} amplitude={0.36} className="mt-8 md:mt-24" />

        {/* Phones and tablets stack the wordmark over the links, so all six sit in even rows (three and three on a phone, one row on a tablet). */}
        <div className="mt-6 grid gap-8 border-t border-on-deep-line pt-8 md:mt-10 md:gap-10 md:pt-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SmartLink href="/" aria-label={`${site.name} home`} className="inline-flex rounded-md">
              <Wordmark tone="light" />
            </SmartLink>
          </div>
          <nav aria-label="Footer" className="lg:col-span-8 lg:justify-self-end">
            <ul className="flex flex-wrap gap-x-8 gap-y-3 text-[0.9375rem] lg:gap-x-6 xl:gap-x-8">
              {footer.links.map((link) => (
                <li key={link.href}>
                  <SmartLink href={link.href} className="inline-flex min-h-11 items-center text-on-deep-muted transition-colors duration-300 hover:text-on-deep">
                    {link.label}
                  </SmartLink>
                </li>
              ))}
              <li>
                <button type="button" onClick={openPrivacy} className="inline-flex min-h-11 items-center text-on-deep-muted transition-colors duration-300 hover:text-on-deep">
                  {footer.privacy}
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 md:mt-14 text-[0.8125rem] text-on-deep-muted md:flex-row md:items-center md:justify-between">
          <span>
            © {year} {footer.rights}
          </span>
          <span>{footer.disclaimer}</span>
        </div>
      </div>
    </footer>
  );
}
