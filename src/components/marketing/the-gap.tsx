import type { SiteCopy } from "@/lib/site-copy";

export function TheGap({ copy }: { copy: SiteCopy }) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
        <h2 className="display max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
          {copy.gap.title}
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
          {copy.gap.lead}
        </p>

        <dl className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {copy.gap.items.map((item) => (
            <div key={item.term} className="border-t-2 border-primary/25 pt-4">
              <dt className="display text-base font-semibold tracking-tight">{item.term}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.body}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-10 max-w-2xl text-base font-medium leading-relaxed">{copy.gap.note}</p>
      </div>
    </section>
  );
}