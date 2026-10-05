import { Hero } from "@/components/sections/Hero";
import { FocusStrip } from "@/components/sections/FocusStrip";
import { Services } from "@/components/sections/Services";
import { LookInside } from "@/components/sections/LookInside";
import { Practice } from "@/components/sections/Practice";

/**
 * Home is the overview and nothing on it is repeated elsewhere: what the
 * practice does, the three tests (each opening its own page), a look inside,
 * and the practice itself, which hands over to Your visit. Everything else
 * has one home of its own: /your-visit, /for-doctors, /our-team, /locations.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <FocusStrip />
      <Services />
      <LookInside />
      <Practice />
    </>
  );
}
