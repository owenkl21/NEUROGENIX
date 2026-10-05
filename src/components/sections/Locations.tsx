import { LocationStage } from "./locations/LocationStage";

/**
 * The body of /locations, labelled by the page H1 (`labelledBy`): the list of
 * practices beside a themed map of where they are, then the appointment
 * detail panel that still awaits the practice's confirmed details.
 */
export function Locations({ labelledBy }: { labelledBy: string }) {
  return (
    <section id="locations" aria-labelledby={labelledBy} className="section-y pt-10 md:pt-16">
      <div className="container-x">
        <LocationStage />
      </div>
    </section>
  );
}
