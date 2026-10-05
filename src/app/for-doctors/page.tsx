import type { Metadata } from "next";
import { PageIntro, pageMetadata } from "@/components/layout/PageIntro";
import { Referral } from "@/components/sections/Referral";

export const metadata: Metadata = pageMetadata("doctors");

export default function ForDoctorsPage() {
  return (
    <>
      <PageIntro page="doctors" />
      <Referral labelledBy="doctors-heading" />
    </>
  );
}
