# Lock the tax lines: TDS 0.1%, no TCS field, flagged TCS fallback

Three tax positions are now closed. This plan makes the code match them and records the
position in the build's source-of-truth doc so it stops drifting.

## What changes for the user

- **TDS is corrected to 0.1% of gross order value** (down from the 1% currently in the demo
  data — the rate was cut effective 1 Oct 2024). The "withheld, you'll claim this back"
  figure on the dashboard, order drawer and home-page money flow drops roughly tenfold.
- **No TCS field anywhere.** It does not apply to aggregator food-delivery supplies where
  the platform pays GST under 9(5), so the product never asks about it or shows a row for it.
- **If a settlement file ever does contain a TCS-looking column**, it is no longer swept into
  "charges we can't explain". It surfaces under its own label: *"TCS shown on your statement —
  this normally doesn't apply to aggregator food delivery orders, worth checking with your
  accountant."*
- **SLA penalties** (late prep, cancellation) are recorded inside the existing adjustments
  line — no new deduction row.

## Technical changes

**Demo data** (`src/data/orders.ts`)
- `tdsRate` 0.01 → 0.001 for Zomato and Swiggy; direct stays 0. Comment states the rate,
  the section, and the 1 Oct 2024 effective date so it isn't "corrected" back later.

**Parser fallback** (`src/lib/parsers/base.ts`)
- Before the residual falls into `unauthorizedDeductions`, scan the row's unmatched columns
  for a TCS pattern (`/\btcs\b/i`, "tax collected at source", "section 52").
- Any matched amount is subtracted from the residual and carried on the order as a flagged
  note rather than an unauthorized charge.
- `Order` gains an optional `flaggedCharges?: { label: string; amount: number; note: string }[]`
  — a generic escape hatch, not a TCS schema field. Nothing else populates it today.

**Parsers** (`src/lib/parsers/zomato.ts`, `swiggy.ts`)
- Swiggy: SLA / late-prep / cancellation-penalty columns are read into `adjustment`
  alongside the existing adjustments, not a new field.

**UI**
- Order drawer (`src/routes/app.orders.tsx`): render `flaggedCharges` as their own row with
  the accountant-check note, visually distinct from the unauthorized-deductions row.
- Any copy stating the TDS rate is updated to 0.1% (`src/lib/site-copy.ts` glossary + FAQ,
  EN / HI / AR; onboarding help text if it names a rate).

**Source of truth**
- Update `docs/implementations/revised_mvp_ingestion.md` with a short "Tax positions (closed)"
  section holding all three rules verbatim, so future research passes have one place to check.

## Deliberately not in scope

Swiggy Instamart / grocery settlement files (separate format, not a channel yet), a dedicated
SLA-penalty deduction row, and bank-statement matching, which stays Phase 1.5.
