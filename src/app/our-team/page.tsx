import type { Metadata } from "next";
import { pages, site } from "@/content/site";
import { PageIntro } from "@/components/layout/PageIntro";
import { Team } from "@/components/sections/Team";

export const metadata: Metadata = { title: pages.team.metaTitle, description: site.metaDescription };

export default function OurTeamPage() {
  return (
    <>
      <PageIntro page="team" />
      <Team labelledBy="team-heading" />
    </>
  );
}
