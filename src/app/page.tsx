import { Hero } from "@/components/sections/Hero";
import { FocusStrip } from "@/components/sections/FocusStrip";
import { Services } from "@/components/sections/Services";
import { Referral } from "@/components/sections/Referral";
import { Team } from "@/components/sections/Team";
import { Practice } from "@/components/sections/Practice";
import { PatientGuide } from "@/components/sections/PatientGuide";
import { LookInside } from "@/components/sections/LookInside";
import { Faq } from "@/components/sections/Faq";
import { Fees } from "@/components/sections/Fees";
import { Locations } from "@/components/sections/Locations";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <FocusStrip />
      <Services />
      <Referral />
      <Team />
      <Practice />
      <PatientGuide />
      <LookInside />
      <Faq />
      <Fees />
      <Locations />
      <Contact />
    </>
  );
}
