import { team } from "@/content/site";
import { Reveal } from "@/components/motion/primitives";
import { TeamProfile } from "./team/TeamProfile";

/**
 * The body of /our-team, labelled by the page H1 (`labelledBy`). It keeps the
 * intro's two columns: the practitioner profile under the headline on the
 * left, and the scope note as a margin note on the right, in line with the
 * intro's lede above it. The intro carries the first paragraph, so only the
 * scope note is set here. Below 1024px the profile comes first at full width
 * and the note follows it.
 */
export function Team({ labelledBy }: { labelledBy: string }) {
  return (
    <section id="clinical-team" aria-labelledby={labelledBy} className="section-y pt-12 md:pt-16">
      <div className="container-x grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-7">
          <TeamProfile />
        </div>
        <Reveal
          as="p"
          delay={0.1}
          className="max-w-[48ch] border-l border-brass-ink pl-6 text-[0.9375rem] text-muted lg:col-span-5 lg:col-start-8 lg:mt-2 lg:self-start xl:col-span-4 xl:col-start-9"
        >
          {team.body[1]}
        </Reveal>
      </div>
    </section>
  );
}
