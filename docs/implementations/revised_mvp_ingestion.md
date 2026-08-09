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

## India — restaurant aggregator tax model (source of truth)

### GST on platform commission / fees

Store the GST amount actually shown on the platform's statement. Restaurant service taxed at
5% without ITC → that GST is a non-recoverable cost in the profitability model. Where the
outlet's classification legally carries ITC (restaurant service at specified premises, 18%),
classify the same amount as potential input tax credit, not operating cost.

Do **not** model 5% vs 18% as an unrestricted "tax scheme" choice. Onboarding asks how the
outlet's restaurant service is actually taxed, and offers "I'm not sure" (`gst_unknown`),
which is treated as non-recoverable pending confirmation.

### E-commerce income-tax withholding

Effective-dated in `src/lib/tax/rules.ts` — never hard-coded into fields, labels or copy:

```text
01 Oct 2020 – 30 Sep 2024  1%     ITA 1961 §194-O
01 Oct 2024 – 31 Mar 2026  0.1%   ITA 1961 §194-O
01 Apr 2026 onward         0.1%   ITA 2025 §393(1), Table Sl. No. 8(v)
```

Never blindly compute `GOV × rate`. The pipeline is: parse the **reported** amount from the
statement (source of truth), derive an **expected** amount from a statutory base
(`resolveTdsTaxBase`: transaction-linked charges in, restaurant-funded discounts out,
platform-funded discounts left in, separately identified GST out), then show the variance.

Classification: tax withholding / tax credit. Reduces cash settlement, never operating
contribution. Copy says "income-tax withheld … can generally be claimed as tax credit,
subject to your tax records and return" — never "you'll get this back".

### GST TCS — Section 52

Not part of the standard deduction model and never shown as an empty row: an ECO paying GST
under Section 9(5) does not collect TCS on those restaurant-service supplies (CBIC Circular
167/23/2021). If a TCS-labelled column appears, preserve the raw value with its source column
and row, and flag it for review — the file may contain a non-9(5) supply. Never silently
dropped, never called "unauthorized".

### Unclassified lines

`unauthorizedDeductions` is now `unclassifiedAdjustments`. An unfamiliar column is not proof
the platform had no right to deduct it; only a reconciliation rule can promote a line to a
discrepancy.

### Scope notes

SLA / late-prep / cancellation penalties fold into the existing `adjustment` line — no
dedicated deduction row. Swiggy Instamart and quick commerce are out of MVP scope and must
not reuse restaurant-service assumptions.
