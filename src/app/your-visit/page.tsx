import type { Metadata } from "next";
import { PageIntro, pageMetadata } from "@/components/layout/PageIntro";
import { PatientGuide } from "@/components/sections/PatientGuide";
import { Fees } from "@/components/sections/Fees";
import { Faq } from "@/components/sections/Faq";

export const metadata: Metadata = pageMetadata("visit");

export default function YourVisitPage() {
  return (
    <>
      <PageIntro page="visit" />
      <PatientGuide labelledBy="visit-heading" />
      <Fees />
      <Faq />
    </>
  );
}
