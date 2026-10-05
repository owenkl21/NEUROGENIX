import { practice } from "@/content/site";
import { ParallaxImage, Reveal } from "@/components/motion/primitives";
import { SectionTitle, TextLink } from "@/components/ui";
import { ValueRows } from "./practice/ValueRows";

/**
 * The practice. An image-led split: a tall photograph of reception on the
 * left, and the copy set lower on the right so the two columns never start on
 * the same line. Below 1024px the photograph leads and the copy follows.
 */
export function Practice() {
  const [captionLabel, captionText] = practice.caption;
  const [lede, body] = practice.body;

  return (
    <section id="practice" aria-labelledby="practice-heading" className="section-y">
      <div className="container-x grid gap-y-14 md:gap-y-20 lg:grid-cols-12 lg:gap-x-10">
        <figure className="lg:col-span-6 xl:col-span-7">
          <ParallaxImage
            src={practice.image.src}
            alt={practice.image.alt}
            width={practice.image.width}
            height={practice.image.height}
            sizes="(min-width: 1320px) 720px, (min-width: 1280px) 56vw, (min-width: 1024px) 46vw, 100vw"
            intensity={5}
            className="aspect-[4/5] rounded-surface bg-paper-2 sm:aspect-[4/3] lg:aspect-[3/4] xl:aspect-[5/6]"
            imgClassName="object-[64%_50%]"
          />
          <figcaption className="mt-5 flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8 lg:flex-col lg:gap-1.5 xl:flex-row xl:gap-8">
            <span className="label text-muted">{captionLabel}</span>
            <span className="text-[0.9375rem] text-ink">{captionText}</span>
          </figcaption>
        </figure>

        <div className="lg:col-span-6 lg:pt-24 xl:col-span-5 xl:pt-28">
          <SectionTitle id="practice-heading" lines={practice.title} />
          <Reveal className="mt-8 md:mt-10">
            <p className="lede max-w-[44ch] text-ink">{lede}</p>
            <p className="mt-5 max-w-[50ch] text-muted">{body}</p>
          </Reveal>

          <div className="mt-12 md:mt-14">
            <ValueRows values={practice.values} />
          </div>

          <Reveal className="mt-10" y={12}>
            <TextLink href={practice.link.href} className="min-h-11">
              {practice.link.label}
            </TextLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
