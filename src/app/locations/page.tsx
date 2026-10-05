import type { Metadata } from "next";
import { pages, site } from "@/content/site";
import { PageIntro } from "@/components/layout/PageIntro";
import { Locations } from "@/components/sections/Locations";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = { title: pages.locations.metaTitle, description: site.metaDescription };

export default function LocationsPage() {
  return (
    <>
      <PageIntro page="locations" />
      <Locations labelledBy="locations-heading" />
      <Contact />
    </>
  );
}
