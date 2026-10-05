import { notFound } from "@/content/site";
import { Button } from "@/components/ui";
import { SignalTrace } from "@/components/signal/SignalTrace";

export default function NotFound() {
  const [lead, soft] = notFound.title;
  return (
    <section className="container-x flex min-h-[70dvh] flex-col justify-center py-24">
      <h1 className="display-2 max-w-[16ch]">
        {lead} <span className="headline-soft block">{soft}</span>
      </h1>
      <SignalTrace kind="calm" mode="live" height={80} className="my-12 max-w-3xl" color="var(--brass-ink)" />
      <div>
        <Button href={notFound.cta.href}>{notFound.cta.label}</Button>
      </div>
    </section>
  );
}
