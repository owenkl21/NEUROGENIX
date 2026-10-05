import { patientGuide, type Guide } from "@/content/site";

function node<K extends keyof HTMLElementTagNameMap>(tag: K, text?: string) {
  const el = document.createElement(tag);
  if (text !== undefined) el.textContent = text;
  return el;
}

/**
 * Prints one preparation guide on its own. The hidden #print-guide container
 * in the root layout is filled with a plain version of the guide (built with
 * createElement and textContent, so no string is ever parsed as markup), the
 * body is flagged so the print styles in globals.css show only that container,
 * and the flag is removed again once the print dialog closes.
 */
export function printGuide(guide: Guide) {
  const root = document.getElementById("print-guide");
  if (!root) return;

  const before = node("ul");
  guide.before.forEach((item) => before.append(node("li", item)));

  const { sources } = patientGuide;
  const credit = node("p");
  credit.append(sources.before);
  sources.links.forEach((link, i) => {
    if (i > 0) credit.append(sources.joiner);
    const a = node("a", link.label);
    a.href = link.href;
    // Paper cannot follow a link, so the address is printed beside its name.
    credit.append(a, ` (${link.href})`);
  });
  credit.append(sources.after);

  root.replaceChildren(
    node("h1", patientGuide.printTitle),
    node("p", patientGuide.printDisclaimer),
    node("h2", guide.title),
    node("p", guide.intro),
    node("h3", patientGuide.beforeHeading),
    before,
    node("h3", patientGuide.duringHeading),
    ...guide.during.map((paragraph) => node("p", paragraph)),
    node("p", guide.bottom),
    credit,
  );

  const body = document.body;
  const finish = () => {
    body.classList.remove("printing-guide");
    window.removeEventListener("afterprint", finish);
  };
  window.addEventListener("afterprint", finish);
  body.classList.add("printing-guide");
  window.print();
}
