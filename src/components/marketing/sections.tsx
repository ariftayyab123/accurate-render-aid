import { Link } from "@tanstack/react-router";
import { ArrowRight, PlayCircle } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { DEMO, money, pct } from "@/lib/marketing-stats";
import type { SiteCopy } from "@/lib/site-copy";

/** One headline figure per owner question, taken from the demo dataset. */
function questionStats() {
  const direct = DEMO.channels.find((row) => row.code === "direct")!;
  return [
    pct(DEMO.zomatoCut),
    money(Math.round((DEMO.weakDish.margin * 100) / 100) * 0 + DEMO.weakDish.margin * 100) ,
    pct(direct.keep),
  ];
}

export function OwnerQuestions({ copy }: { copy: SiteCopy }) {
  const direct = DEMO.channels.find((row) => row.code === "direct")!;
  const stats = [pct(DEMO.zomatoCut), pct(DEMO.weakDish.margin), pct(direct.keep)];

  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
        <h2 className="display text-3xl font-semibold tracking-tight sm:text-4xl">
          {copy.questions.title}
        </h2>
        <p className="mt-3 text-base text-muted-foreground">{copy.questions.lead}</p>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {copy.questions.items.map((item, index) => (
            <article
              key={item.q}
              className="flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              <h3 className="display text-lg font-semibold leading-snug tracking-tight">
                {item.q}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              <div className="mt-auto pt-6">
                <div className="display text-3xl font-semibold tabular text-primary">
                  {stats[index]}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {index === 1 ? `${copy.questions.items[1]!.stat} · ${DEMO.weakDish.name}` : item.stat}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Steps({ copy }: { copy: SiteCopy }) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
        <h2 className="display text-3xl font-semibold tracking-tight sm:text-4xl">
          {copy.steps.title}
        </h2>
        <p className="mt-3 text-base text-muted-foreground">{copy.steps.lead}</p>

        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {copy.steps.items.map((step, index) => (
            <li key={step.title} className="border-t-2 border-primary/30 pt-5">
              <span className="display text-sm font-bold text-primary">0{index + 1}</span>
              <h3 className="display mt-2 text-lg font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Markets({ copy }: { copy: SiteCopy }) {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
        <h2 className="display text-3xl font-semibold tracking-tight sm:text-4xl">
          {copy.markets.title}
        </h2>
        <p className="mt-3 text-base text-muted-foreground">{copy.markets.lead}</p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {[copy.markets.india, copy.markets.uae].map((panel, index) => (
            <article key={panel.title} className="rounded-2xl border border-border bg-card p-7">
              <h3 className="display text-xl font-semibold tracking-tight">{panel.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{panel.body}</p>
              {index === 0 ? (
                <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-5">
                  {DEMO.channels.map((row) => (
                    <div key={row.code}>
                      <dt className="text-xs capitalize text-muted-foreground">{row.code}</dt>
                      <dd className="display text-lg font-semibold tabular">{pct(row.keep, 0)}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <ul className="mt-6 flex flex-wrap gap-2 border-t border-border pt-5">
                  {["Talabat", "Deliveroo", "Careem", "Noon Food", "Direct"].map((label) => (
                    <li
                      key={label}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                    >
                      {label}
                    </li>
                  ))}
                </ul>
              )}
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

        <Accordion type="single" collapsible className="mt-8">
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
        <p className="mt-10 text-xs leading-relaxed text-primary-foreground/70">
          {money(DEMO.kept)} · {DEMO.orders} orders · {DEMO.period.label}
        </p>
      </div>
    </section>
  );
}
