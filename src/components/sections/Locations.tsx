import { LocationStage } from "./locations/LocationStage";

/**
 * The body of /locations, labelled by the page H1 (`labelledBy`): the wide
 * practice photograph with the appointment detail panel resting on its lower
 * right corner, so the eye travels from the headline down one diagonal.
 */
export function Locations({ labelledBy }: { labelledBy: string }) {
  return (
    <section id="locations" aria-labelledby={labelledBy} className="section-y pt-12 md:pt-16">
      <div className="container-x">
        <LocationStage />
      </div>
    </section>
  );
}
