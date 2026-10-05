import type { Metadata } from "next";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { breadcrumbHome, pages, type PageKey } from "@/content/site";
import { Eyebrow, SmartLink } from "@/components/ui";
import { MaskLines, Reveal } from "@/components/motion/primitives";

/**
 * Opening of every inner page: breadcrumb, eyebrow, the page H1 rising out of
 * its masks and the lede. It is deliberately compact so the page's own content
 * (the guide, the referral steps, the profile, the location) starts on the
 * first screen. From 1024px the lede moves into the right-hand column and
 * settles on the headline's last line; below that it follows the headline.
 *
 * No signal trace here: the inner pages are about a visit, a referral, a team
 * and a place, not a recording, so a trace would only be decoration.
 */
export function PageIntro({ page }: { page: PageKey }) {
  const p = pages[page];
  return (
    <header className="container-x pt-6 md:pt-8">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
          <li>
            <SmartLink href="/" className="-mx-1 inline-flex min-h-11 items-center rounded-full px-1 transition-colors duration-300 hover:text-ink">
              {breadcrumbHome}
            </SmartLink>
          </li>
          <li aria-hidden="true" className="text-line-strong">
            <CaretRight size={12} />
          </li>
          <li aria-current="page" className="text-ink">
            {p.crumb}
          </li>
        </ol>
      </nav>

      <div className="mt-8 grid grid-cols-1 gap-y-7 md:mt-12 lg:grid-cols-12 lg:items-end lg:gap-x-8">
        <div className="lg:col-span-7">
          <Reveal delay={0.05} y={10}>
            <Eyebrow>{p.eyebrow}</Eyebrow>
          </Reveal>
          <MaskLines as="h1" id={`${page}-heading`} trigger="mount" delay={0.12} lines={p.title} className="display-2 mt-6" />
        </div>
        <Reveal delay={0.4} y={16} className="lg:col-span-5 lg:col-start-8 xl:col-span-4 xl:col-start-9">
          <p className="lede max-w-[52ch] text-muted">{p.body}</p>
        </Reveal>
      </div>
    </header>
  );
}

/**
 * Per-route metadata for the inner pages. The page's own title and lede
 * describe it, so a shared link previews this page rather than the home page.
 * Open Graph is replaced, not merged, by Next, so the site-wide fields from
 * the root layout are repeated here.
 */
export function pageMetadata(page: PageKey): Metadata {
  const p = pages[page];
  return {
    title: p.metaTitle,
    description: p.body,
    openGraph: { title: p.metaTitle, description: p.body, type: "website", locale: "en_ZA" },
  };
}
