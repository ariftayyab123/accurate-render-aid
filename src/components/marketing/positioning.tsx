import type { SiteCopy } from "@/lib/site-copy";

export function Positioning({ copy }: { copy: SiteCopy }) {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
        <h2 className="display max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
          {copy.positioning.title}
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
          {copy.positioning.lead}
        </p>

        <ol className="mt-10 grid gap-5 lg:grid-cols-3">
          {copy.positioning.rules.map((rule, index) => (
            <li key={rule.title} className="rounded-2xl border border-border bg-card p-6">
              <span className="display text-sm font-bold text-primary">0{index + 1}</span>
              <h3 className="display mt-2 text-lg font-semibold tracking-tight">{rule.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{rule.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}