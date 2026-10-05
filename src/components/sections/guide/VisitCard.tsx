import { Check } from "@phosphor-icons/react/dist/ssr";
import { patientGuide } from "@/content/site";
import { BookButton } from "@/components/ui";

/**
 * The deep essentials card that stays beside whichever guide is open: what to
 * bring to every visit, regardless of the test.
 */
export function VisitCard() {
  const { visit } = patientGuide;
  return (
    <div className="on-deep rounded-surface bg-deep p-7 text-on-deep sm:p-10 lg:p-9 dark:ring-1 dark:ring-on-deep-line">
      <h2 className="display-3 md:mt-5">
        {visit.title.map((line, i) => (
          <span key={line} className={`block ${i > 0 ? "headline-soft" : ""}`}>
            {line}
          </span>
        ))}
      </h2>

      {/* Two columns wherever the card is wide enough (tablet, and beside the guide from 1280px); one in the narrower 1024px column. */}
      <ul className="mt-7 border-y border-on-deep-line md:mt-9 md:grid md:grid-cols-2 md:gap-x-10 lg:grid-cols-1 xl:grid-cols-2">
        {visit.items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-4 border-b border-on-deep-line py-4 last:border-b-0 md:[&:nth-last-child(2)]:border-b-0 lg:[&:nth-last-child(2)]:border-b xl:[&:nth-last-child(2)]:border-b-0"
          >
            <Check size={16} weight="regular" aria-hidden="true" className="relative top-[3px] shrink-0 text-signal" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6 max-w-[44ch] text-[0.9375rem] md:mt-8 leading-relaxed text-on-deep-muted">{visit.body}</p>
      <BookButton variant="signal" className="mt-6 md:mt-8" />
    </div>
  );
}
