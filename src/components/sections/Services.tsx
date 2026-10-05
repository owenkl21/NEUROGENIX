import { services } from "@/content/site";
import { Reveal } from "@/components/motion/primitives";
import { SectionTitle } from "@/components/ui";
import { ServiceStack } from "./services/ServiceStack";
import { ServicesFootnote } from "./services/ServicesFootnote";

/**
 * The three tests as a deck of navy panels, each with its own live readout.
 * The header stays a server component; motion lives in the leaf components.
 */
export function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="section-y">
      <div className="container-x">
        <div className="mb-14 md:mb-20">
          <SectionTitle id="services-heading" lines={services.title} />
          <Reveal as="p" delay={0.15} className="lede mt-6 max-w-[46ch] text-muted md:mt-8">
            {services.body}
          </Reveal>
        </div>
        <ServiceStack />
        <ServicesFootnote />
      </div>
    </section>
  );
}
