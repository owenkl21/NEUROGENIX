import { team } from "@/content/site";
import { SectionTitle } from "@/components/ui";
import { Reveal } from "@/components/motion/primitives";
import { TeamProfile } from "./team/TeamProfile";

/**
 * Our team. An editorial statement on the left and, set lower on the right for
 * an asymmetric rhythm, the practitioner profile in its awaiting-approval
 * state. Below 1024px it is a single column with the profile at full width. *
 * On an inner page that opens with PageIntro, pass `labelledBy` (the page H1
 * id): the section then drops its own headline and sits closer to the intro.
 * The intro carries the first paragraph, so only the scope note remains here.
 */
export function Team({ labelledBy }: { labelledBy?: string } = {}) {
  const lead = Boolean(labelledBy);
  return (
    <section id="clinical-team" aria-labelledby={labelledBy ?? "team-heading"} className={`section-y ${lead ? "pt-16 md:pt-24" : ""}`}>
      <div className="container-x grid gap-y-16 sm:gap-y-20 lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-6">
          {!lead && (
            <>
              <SectionTitle id="team-heading" lines={team.title} />
              <Reveal as="p" className="lede mt-7 max-w-[52ch] text-muted">
                {team.body[0]}
              </Reveal>
            </>
          )}
          <Reveal as="p" delay={0.1} className={`${lead ? "" : "mt-10"} max-w-[48ch] border-l border-brass-ink pl-6 text-[0.9375rem] text-muted`}>
            {team.body[1]}
          </Reveal>
        </div>

        <div className={`lg:col-span-5 lg:col-start-8 ${lead ? "" : "lg:pt-36"}`}>
          <TeamProfile />
        </div>
      </div>
    </section>
  );
}
