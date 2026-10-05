import { contact } from "@/content/site";
import { BookButton, SectionTitle, TextLink } from "@/components/ui";
import { Magnetic, Reveal } from "@/components/motion/primitives";

/**
 * Contact: the closing statement. A confident headline and the one booking
 * action on the left, the practice information panel on the right, its foot
 * level with the button so both columns land on the same line. The navy
 * footer follows directly, so this section stays light and quiet.
 */
export function Contact() {
  const { info } = contact;

  return (
    <section id="contact" aria-labelledby="contact-heading" className="section-y">
      <div className="container-x grid grid-cols-1 gap-14 md:gap-16 lg:grid-cols-12 lg:items-end lg:gap-x-6 lg:gap-y-0">
        <div className="lg:col-span-7">
          <SectionTitle id="contact-heading" lines={contact.title} />
          <Reveal as="p" delay={0.1} className="lede mt-6 max-w-[50ch] text-muted md:mt-8">
            {contact.body}
          </Reveal>
          <Reveal delay={0.2} className="mt-10 md:mt-12">
            <Magnetic>
              <BookButton size="lg" />
            </Magnetic>
          </Reveal>
        </div>

        <Reveal delay={0.15} y={40} className="md:max-w-[34rem] lg:col-span-5 lg:max-w-none">
          <div className="rounded-surface border border-line bg-surface p-8 md:p-10 lg:p-8 xl:p-10">
            <h3 className="title-3 text-ink">{info.heading}</h3>
            <p className="mt-3 text-muted">{info.body}</p>

            <div className="mt-8 rounded-[12px] bg-paper-2 p-5">
              <p className="label text-brass-ink">{info.statusLabel}</p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink">{info.status}</p>
            </div>

            <div className="mt-6">
              <TextLink href={info.link.href} className="min-h-11">
                {info.link.label}
              </TextLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
