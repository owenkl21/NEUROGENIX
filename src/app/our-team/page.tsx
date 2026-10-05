import type { Metadata } from "next";
import { PageIntro, pageMetadata } from "@/components/layout/PageIntro";
import { Team } from "@/components/sections/Team";

export const metadata: Metadata = pageMetadata("team");

export default function OurTeamPage() {
  return (
    <>
      <PageIntro page="team" />
      <Team labelledBy="team-heading" />
    </>
  );
}
