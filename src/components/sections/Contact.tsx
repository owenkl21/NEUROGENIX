import { contact } from "@/content/site";
import { SectionTitle, TextLink } from "@/components/ui";
import { Reveal } from "@/components/motion/primitives";

/**
 * Contact: the quiet close of /locations. The headline holds the left and the
 * lede, with its one way on to the patient guide, settles on the headline's
 * last line from 1024px, the same two columns the page opens with.
 *
 * It carries no booking button of its own: the footer's signal "Request an
 * appointment" follows directly on every page, so a second one here would be
 * the same closing statement twice. The practice details are not repeated
 * either; the location panel above already lists them as awaiting
 * confirmation.
 */
export function Contact() {
  const { info } = contact;

  return (
    <section id="contact" aria-labelledby="contact-heading" className="section-y">
      <div className="container-x grid grid-cols-1 gap-y-6 md:gap-y-8 lg:grid-cols-12 lg:items-end lg:gap-x-8">
        <SectionTitle id="contact-heading" lines={contact.title} className="max-w-[16ch] lg:col-span-7" />
        <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8 xl:col-span-4 xl:col-start-9">
          <p className="lede max-w-[50ch] text-muted">{contact.body}</p>
          <TextLink href={info.link.href} className="mt-5">
            {info.link.label}
          </TextLink>
        </Reveal>
      </div>
    </section>
  );
}
