import type { Metadata } from "next";
import { pages, site } from "@/content/site";
import { PageIntro } from "@/components/layout/PageIntro";
import { Referral } from "@/components/sections/Referral";

export const metadata: Metadata = { title: pages.doctors.metaTitle, description: site.metaDescription };

export default function ForDoctorsPage() {
  return (
    <>
      <PageIntro page="doctors" />
      <Referral labelledBy="doctors-heading" />
    </>
  );
}
