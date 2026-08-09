# Retained — Correct the money model (tax, fees, subsidies) and close the open questions

The research is right on the two things that matter most: the deduction stack in the app is
incomplete, and the tax treatment is stated as an open question when it should be a firm rule.
This plan fixes the calculation layer first, then surfaces the corrections in the UI.

## What changes for the user

- Every figure that says "tax on fees" carries an explicit recoverability rule. The rule is
  **derived from the owner's declared GST/VAT registration in onboarding**, never assumed from a
  market-wide percentage: India 5% scheme → GST on commission is a **permanent cost**; India 18%
  scheme and UAE VAT-registered → **recoverable**. No ITC ambiguity anywhere in the product.
- The deduction list gains four missing lines: **fixed platform fee per order**, **packaging
  deduction**, **membership subsidy (Gold / One)**, and **TDS 194-O** shown separately as
  *money withheld, claimable later* — never mixed into costs.
- **TCS under Section 52 is explicitly out of scope**: it does not apply to restaurant supplies
  where the aggregator discharges tax under 9(5) (CBIC Circular 167/23/2021). No field, no line,
  no copy. TDS 194-O is the only withholding we model.
- Ad spend allocation states its formula openly ("pro-rata by channel revenue") with a per-order
  override, and discount funding is **declared by the owner** (default 100% restaurant-funded)
  rather than guessed from the file.
- Confidence chips move from the page header down to each line in the order drawer.

## Scope of this plan

Phase 1 only — the money model and how it is presented. Bank-statement matching is Phase 1.5,
with column-mapper UI, POS/ONDC integrations and pricing tiers after it; all noted at the end.

## Technical changes

**Data model** (`src/data/types.ts`)
- `DeductionBreakdown` gains `platformFee`, `packagingDeduction`, `membershipSubsidy`.
- New `TaxTreatment` on the order: `{ feeTaxAmount, recoverable: boolean }` so a figure carries
  its own tax rule instead of the UI inferring one. `recoverable` comes from the workspace's
  declared scheme.
- `tdsWithheld` documented as a receivable. No `tcsCollected` field.

**Market rules** (`src/data/markets.ts`)
- Each market gains a `tax` block: India `{ label: "GST on commission", rate: 0.18 }` with schemes
  `gst_5_no_itc` (recoverable: false) and `gst_18_with_itc` (recoverable: true); UAE
  `{ label: "VAT on fees", rate: 0.05 }` with `vat_registered` / `vat_unregistered`. Recoverability
  always resolves from the owner's declared scheme — never a hardcoded market default or "95% of
  restaurants" claim in copy.

**Metrics** (`src/lib/metrics.ts`)
- `platformDeduction` includes the three new lines.
- New `withheldTax(order)` returning TDS/TCS, kept **out** of contribution and reported as a
  separate "held back, you get this back" total.
- New `allocateAdSpend(orders, channelAdSpend)` implementing pro-rata by channel GOV, used when a
  settlement has a lump-sum ad figure; per-order overrides win.
- `PeriodTotals` extends with the new breakdown keys and `taxRecoverable` / `taxSunk` splits.

**Parsers** (`src/lib/parsers/*`)
- Zomato and Swiggy row mappers read the new columns (fixed fee, packaging, membership /
  subsidy) through the existing `numericReader`, so unknown columns still fall back to 0 and
  land in `unauthorizedDeductions`. No TCS column is read.
- Settlement overrides gain `discountFundingSplit` usage: the declared owner share scales
  `restaurantDiscount`.

**Demo data** (`src/data/orders.ts`)
- Channel profiles gain fixed per-order fee (₹6), packaging deduction (₹20 on aggregators) and a
  membership subsidy rate (~3% on a subset of orders), and 1% TDS so the demo shows the real stack.

**UI**
- Overview and the marketing reconciliation section render the expanded deduction list, with TDS
  in its own "withheld, not lost" row.
- Order drawer: a data-quality chip per line, and each amount opens its formula.
- Onboarding: two new declarations — GST scheme (India: 5% no ITC vs 18% with ITC) / VAT
  registration (UAE), and typical discount funding share. The GST answer is what drives every
  recoverable-vs-sunk label in the app.

## Phase 1.5 — bank statement matching

After the money model lands: upload a bank statement, match narration lines such as
"ZOMATO MEDIA PRIVATE LIMITED" to settlement periods, and show a three-way view —
what the platform said, what we calculated, and what actually hit the bank. This is a stronger
trust claim than the current two-way reconciliation and comes before any POS work.

## Follow-ups (not in this plan)

A saveable column-mapper for format drift, POS/ONDC ingestion, and the pricing tiers. Competitor
price points stay out of product copy until verified on the vendors' own pricing pages.
