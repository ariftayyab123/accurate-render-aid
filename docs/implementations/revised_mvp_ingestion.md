# Revised MVP (Ingestion & Business Logic)

## Context
Pivot the MVP to rely on manual CSV settlement parsing rather than future APIs. Update business logic to handle TDS correctly (as a tax credit, not a cost) and surface unauthorized deductions. Shift onboarding to lead with a "Trust Moment" by making users upload a settlement file right away.

## Implementation Plan
- [x] Update `types.ts` and `metrics.ts` for TDS and Unauthorized Deductions.
- [x] Build CSV parsers for Zomato and Swiggy (`src/lib/parsers/`).
- [x] Restructure `onboarding.tsx` Step 4 to prompt for file upload and display instant reconciliation.
- [x] Connect `app.imports.tsx` to the new parsers.

## Status/Updates
- *Execution Phase*: Completed initial CSV parsers using `papaparse`. Added UI hooks for processing real files in Onboarding and Imports pages. Updated calculation dictionary for TDS.

## Tax positions (closed — source of truth)

These three are settled. Do not re-open them in a research pass without a citation that
supersedes the ones below.

1. **GST on commission (18%)** — cost or recoverable, **derived from the owner's declared GST
   scheme** (5% composition-style, no ITC → permanent cost; 18% with ITC → recoverable).
   Never assumed from a market default, never hedged in copy.
2. **TDS Section 194-O** — **0.1% of gross order value** (cut from 1% effective 1 October 2024
   by the Finance (No. 2) Act, 2024). A receivable, shown separately as "withheld, you'll claim
   this back", and excluded from contribution.
3. **TCS Section 52** — **not modelled as a schema field.** It does not apply to restaurant
   supplies where the aggregator discharges GST under Section 9(5) (CBIC Circular 167/23/2021).
   The unknown-column parser fallback carries a named exception: a TCS-looking column is
   surfaced as a flagged charge with an accountant-check note, never as an "unauthorized
   deduction" and never silently dropped.

Related: SLA / late-prep / cancellation penalties fold into the existing `adjustment` line —
no dedicated deduction row. Swiggy Instamart settlement files are out of MVP scope.
