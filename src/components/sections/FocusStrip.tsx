import { FocusBand } from "./hero/FocusBand";

/**
 * A calm band between the hero and the services: one statement, lit word by
 * word as it scrolls through, framed by hairlines, with a three channel signal
 * readout (EEG, NCS, EMG) that wakes in step with "brain, nerves and muscles".
 * No eyebrow and no label above the statement.
 */
export function FocusStrip() {
  return (
    <section aria-labelledby="focus-heading" className="container-x">
      <FocusBand />
    </section>
  );
}
