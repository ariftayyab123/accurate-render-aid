import { Link } from "@tanstack/react-router";
import { ArrowRight, PlayCircle } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { DEMO, money } from "@/lib/marketing-stats";
import type { SiteCopy } from "@/lib/site-copy";

export function Features({ copy }: { copy: SiteCopy }) {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
        <h2 className="display text-3xl font-semibold tracking-tight sm:text-4xl">
          {copy.features.title}
        </h2>
        <p className="mt-3 text-base text-muted-foreground">{copy.features.lead}</p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {copy.features.items.map((item) => (
            <article key={item.title} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="display text-lg font-semibold leading-snug tracking-tight">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Audience({ copy }: { copy: SiteCopy }) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:py-20">
        <h2 className="display text-3xl font-semibold tracking-tight sm:text-4xl">
          {copy.audience.title}
        </h2>
        <p className="mt-3 text-base text-muted-foreground">{copy.audience.lead}</p>

        <ul className="mt-8 divide-y divide-border border-y border-border">
          {copy.audience.rows.map((row) => (
            <li
              key={row.who}
              className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-8"
            >
              <span className="display shrink-0 text-sm font-semibold tracking-tight sm:w-56">
                {row.who}
              </span>
              <span className="text-sm leading-relaxed text-muted-foreground">“{row.ask}”</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-base font-medium">{copy.audience.note}</p>
      </div>
    </section>
  );
}

export function MarketNote({ copy }: { copy: SiteCopy }) {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
        <h2 className="display text-3xl font-semibold tracking-tight sm:text-4xl">
          {copy.market.title}
        </h2>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {[copy.market.india, copy.market.uae].map((panel) => (
            <article key={panel.title} className="rounded-2xl border border-border bg-card p-7">
              <h3 className="display text-xl font-semibold tracking-tight">{panel.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{panel.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Faq({ copy }: { copy: SiteCopy }) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-20">
        <h2 className="display text-3xl font-semibold tracking-tight sm:text-4xl">
          {copy.faq.title}
        </h2>
        <p className="mt-3 text-base text-muted-foreground">{copy.faq.lead}</p>

        <Accordion type="single" collapsible className="mt-8" defaultValue={copy.faq.items[0]?.q}>
          {copy.faq.items.map((item) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger className="text-start text-base font-medium">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function ClosingCta({ copy, onDemo }: { copy: SiteCopy; onDemo: () => void }) {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8">
        <h2 className="display text-3xl font-semibold tracking-tight sm:text-4xl">
          {copy.cta.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-primary-foreground/80">
          {copy.cta.lead}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" variant="secondary" className="h-12 gap-2 rounded-full px-6" asChild>
            <Link to="/auth">
              {copy.cta.primary}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 gap-2 rounded-full border-primary-foreground/40 bg-transparent px-6 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            onClick={onDemo}
          >
            <PlayCircle className="size-4" />
            {copy.cta.secondary}
          </Button>
        </div>
        <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-primary-foreground/80">
          {copy.cta.note}
        </p>
        <p className="mt-8 text-xs leading-relaxed text-primary-foreground/70">
          {money(DEMO.kept)} · {DEMO.orders} orders · {DEMO.period.label}
        </p>
      </div>
    </section>
  );
}