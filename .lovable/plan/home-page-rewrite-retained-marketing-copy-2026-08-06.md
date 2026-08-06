# Home page rewrite — "Retained" marketing copy

Replace the current landing copy and section structure with the supplied marketing page, keeping the existing design system (warm teal, Sora/Manrope), the language toggle, and the demo-data wiring.

## New page structure

1. Hero — H1 "You sold ₹4,80,000 last month. How much did you actually keep?" (the amount is pulled live from the demo dataset so it never contradicts the numbers below), subhead, "Show me what I kept →" primary CTA, ghost "See it work on a real example ↓" that scrolls to the demo section, and the no-credit-card trust line.
2. The Gap — "The number on your dashboard was never the number in your bank", with the six deduction lines (commission, GST on commission, gateway/platform fees, ads, discounts, TDS) as a readable list rather than a table.
3. Positioning — "Not a POS. Not accounting software. Not another AI dashboard." with the three rules (money before activity, every number opens up, never "Net Profit").
4. Reconciliation — "Upload one settlement file. See what matched — and what didn't." Reuses the existing money-flow visual as the "real example" anchor target, showing calculated payout vs. actual payout vs. flagged gap using demo figures.
5. What you get — five feature blocks (Overview, order drill-down, menu profitability, channel comparison, one recommendation).
6. Who this is for — four persona rows (single-outlet, cloud kitchen, multi-outlet, manager/accountant) with the question each one asks.
7. Market trust line — India variant shown by default (GST on commission, TDS 194-O as credit); UAE variant surfaces for Gulf visitors.
8. FAQ — replaced with the five supplied Q&As, verbatim.
9. Final CTA — "Fifteen minutes. One settlement file. A real answer."

## SEO

- Title: "Retained — Know What You Actually Kept From Zomato & Swiggy"
- Meta description: the supplied 152-char version; same text mirrored into og:description and twitter.
- FAQPage JSON-LD regenerated from the new five questions; SoftwareApplication JSON-LD kept.
- Canonical and og:url stay self-referencing on `/`.

## Technical notes

- `src/lib/site-copy.ts` — rewrite the `SiteCopy` interface and the English copy to match the new sections; Hindi and Arabic entries are updated to mirror the same structure (translated, with ₹/AED and channel names adjusted per market).
- New/edited components under `src/components/marketing/`: `hero.tsx`, `money-flow.tsx` (becomes the reconciliation section with an id anchor), plus new `the-gap.tsx`, `positioning.tsx`, `features.tsx`, `audience.tsx`, `market-note.tsx`. `sections.tsx` keeps FAQ and closing CTA; `OwnerQuestions`/`Steps`/`Markets` are removed or folded into the new sections.
- `src/routes/index.tsx` — new section order, updated head metadata and JSON-LD, smooth-scroll handler for the secondary CTA.
- No backend or business-logic changes; all figures continue to come from `src/lib/marketing-stats.ts` and the demo dataset.

## Note on claims

The copy references uploading a real settlement file and reconciliation flags — a feature that is not built yet. The section will be written as what Retained does on upload, matching the supplied copy, with the demo preview clearly labelled as sample data.
