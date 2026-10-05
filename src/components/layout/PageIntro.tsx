import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { breadcrumbHome, pages, type PageKey } from "@/content/site";
import { Eyebrow, SmartLink } from "@/components/ui";
import { MaskLines, Reveal } from "@/components/motion/primitives";
import { SignalTrace } from "@/components/signal/SignalTrace";

/**
 * Opening of every inner page: breadcrumb, eyebrow, the page H1 rising out of
 * its masks, the lede, then the live trace running edge to edge as the seam
 * into the page, echoing the home hero.
 */
export function PageIntro({ page }: { page: PageKey }) {
  const p = pages[page];
  return (
    <header className="container-x pt-8 md:pt-12">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-muted">
          <li>
            <SmartLink href="/" className="transition-colors duration-300 hover:text-ink">
              {breadcrumbHome}
            </SmartLink>
          </li>
          <li aria-hidden="true">
            <CaretRight size={12} />
          </li>
          <li aria-current="page" className="text-ink">
            {p.crumb}
          </li>
        </ol>
      </nav>
      <Reveal delay={0.05} y={10} className="mt-14 md:mt-20">
        <Eyebrow>{p.eyebrow}</Eyebrow>
      </Reveal>
      <MaskLines as="h1" id={`${page}-heading`} trigger="mount" delay={0.12} lines={p.title} className="display-1 mt-6 md:mt-7" />
      <Reveal delay={0.45} className="mt-8 md:mt-10">
        <p className="lede max-w-[52ch] text-muted">{p.body}</p>
      </Reveal>
      <Reveal delay={0.6} y={0} className="ml-[calc(50%-50vw)] mt-14 w-screen max-w-none md:mt-20">
        <SignalTrace kind={p.trace} height={84} amplitude={p.trace === "calm" ? 0.36 : 0.3} strokeWidth={1.35} color="var(--brass-ink)" />
      </Reveal>
    </header>
  );
}
