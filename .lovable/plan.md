# Retained — Correct the money model (tax, fees, subsidies) and close the open questions

The research is right on the two things that matter most: the deduction stack in the app is
incomplete, and the tax treatment is stated as an open question when it should be a firm rule.
This plan fixes the calculation layer first, then surfaces the corrections in the UI.

## What changes for the user

- Every figure that says "tax on fees" is labelled as a **permanent cost** for 5% GST restaurants
  in India, and as **recoverable input VAT** for VAT-registered businesses in the UAE. No ITC
  ambiguity anywhere in the product.
- The deduction list gains four missing lines: **fixed platform fee per order**, **packaging
  deduction**, **membership subsidy (Gold / One)**, and **TDS 194-O** shown separately as
  *money withheld, claimable later* — never mixed into costs.
- Ad spend allocation states its formula openly ("pro-rata by channel revenue") with a per-order
  override, and discount funding is **declared by the owner** (default 100% restaurant-funded)
  rather than guessed from the file.
- Confidence chips move from the page header down to each line in the order drawer.

## Scope of this plan

Phase 1 only — the money model and how it is presented. Bank-statement matching, column-mapper
UI, POS/ONDC integrations and pricing tiers are noted at the end as follow-ups, not built here.

## Technical changes

**Data model** (`src/data/types.ts`)
- `DeductionBreakdown` gains `platformFee`, `packagingDeduction`, `membershipSubsidy`.
- New `TaxTreatment` on the order: `{ feeTaxAmount, recoverable: boolean }` so a figure carries
  its own tax rule instead of the UI inferring one.
- `tdsWithheld` documented as a receivable, plus `tcsCollected` for GSTR reconciliation.

**Market rules** (`src/data/markets.ts`)
- Each market gains a `tax` block: India `{ label: "GST on commission", rate: 0.18,
  recoverableDefault: false }`, UAE `{ label: "VAT on fees", rate: 0.05, recoverableDefault: true }`,
  plus a `gstScheme` choice for India (5% composition vs 18% hotel) captured in onboarding.

**Metrics** (`src/lib/metrics.ts`)
- `platformDeduction` includes the three new lines.
- New `withheldTax(order)` returning TDS/TCS, kept **out** of contribution and reported as a
  separate "held back, you get this back" total.
- New `allocateAdSpend(orders, channelAdSpend)` implementing pro-rata by channel GOV, used when a
  settlement has a lump-sum ad figure; per-order overrides win.
- `PeriodTotals` extends with the new breakdown keys and `taxRecoverable` / `taxSunk` splits.

**Parsers** (`src/lib/parsers/*`)
- Zomato and Swiggy row mappers read the new columns (fixed fee, packaging, membership /
  subsidy, TCS) through the existing `numericReader`, so unknown columns still fall back to 0 and
  land in `unauthorizedDeductions`.
- Settlement overrides gain `discountFundingSplit` usage: the declared owner share scales
  `restaurantDiscount`.

**Demo data** (`src/data/orders.ts`)
- Channel profiles gain fixed per-order fee (₹6), packaging deduction (₹20 on aggregators) and a
  membership subsidy rate (~3% on a subset of orders), and 1% TDS so the demo shows the real stack.

**UI**
- Overview and the marketing reconciliation section render the expanded deduction list, with TDS
  in its own "withheld, not lost" row.
- Order drawer: a data-quality chip per line, and each amount opens its formula.
- Onboarding: two new declarations — GST scheme (India) / VAT registration (UAE), and typical
  discount funding share.

## Follow-ups (not in this plan)

Bank-statement upload and settlement matching, a saveable column-mapper for format drift,
POS/ONDC ingestion, and the pricing tiers.
