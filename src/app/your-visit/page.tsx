import type { Metadata } from "next";
import { pages, site } from "@/content/site";
import { PageIntro } from "@/components/layout/PageIntro";
import { PatientGuide } from "@/components/sections/PatientGuide";
import { Fees } from "@/components/sections/Fees";
import { Faq } from "@/components/sections/Faq";

export const metadata: Metadata = { title: pages.visit.metaTitle, description: site.metaDescription };

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
