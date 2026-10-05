import type { TestSlug } from "@/content/site";
import { testPages } from "@/content/site";

// STUB: replaced by the test page builder. Keep the export name and props.
export function TestPageView({ slug }: { slug: TestSlug }) {
  const page = testPages[slug];
  return (
    <section className="section-y container-x">
      <h1 className="display-1">{page.name}</h1>
    </section>
  );
}
