import { patientGuide } from "@/content/site";
import { BookButton } from "@/components/ui";

/**
 * The navy essentials card that stays beside whichever guide is open: what to
 * bring to every visit, regardless of the test.
 */
export function VisitCard() {
  const { visit } = patientGuide;
  return (
    <div className="on-navy rounded-surface bg-navy p-7 text-on-navy sm:p-10 lg:p-9 dark:ring-1 dark:ring-on-navy-line">
      <p className="label text-brass">{visit.label}</p>
      {/* One step under the panel title at xl so "Your appointment" holds one line in the 4 column card. */}
      <h3 className="display-3 mt-5 xl:text-[2.25rem]">
        <span className="block">{visit.title[0]}</span>
        <span className="headline-soft block">{visit.title[1]}</span>
      </h3>

      <ol className="mt-9 border-y border-on-navy-line md:grid md:grid-cols-2 md:gap-x-10 lg:grid-cols-1">
        {visit.items.map((item, i) => (
          <li
            key={item}
            className="flex items-baseline gap-5 border-b border-on-navy-line py-4 last:border-b-0 md:[&:nth-last-child(2)]:border-b-0 lg:[&:nth-last-child(2)]:border-b"
          >
            <span aria-hidden="true" className="numeral w-6 shrink-0 text-[0.8125rem] text-brass">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>

      <p className="mt-8 max-w-[44ch] text-[0.9375rem] leading-relaxed text-on-navy-muted">{visit.body}</p>
      <BookButton variant="brass" className="mt-8" />
    </div>
  );
}
