import type { Metadata } from "next";
import { PageIntro, pageMetadata } from "@/components/layout/PageIntro";
import { Locations } from "@/components/sections/Locations";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = pageMetadata("locations");

export default function LocationsPage() {
  return (
    <>
      <PageIntro page="locations" />
      <Locations labelledBy="locations-heading" />
      <Contact />
    </>
  );
}
