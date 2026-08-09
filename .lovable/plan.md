# Lock the India tax model as a dated rule engine

Three changes to the money model, all of them architectural rather than cosmetic. Current code hard-codes "TDS 194-O" as a label, derives withholding as a flat 0.1% of gross order value, calls unexplained statement lines "unauthorized", and presents the GST rate as a free choice in onboarding.

## 1. Effective-dated tax rules instead of constants

New `src/lib/tax/rules.ts` holding an `ecommerceTdsRules` table keyed by effective date:

- 2020-10-01 to 2024-09-30 — 0.1%... 1%, Income-tax Act 1961 s.194-O
- 2024-10-01 to 2026-03-31 — 0.1%, Income-tax Act 1961 s.194-O
- 2026-04-01 onward — 0.1%, Income-tax Act 2025 s.393(1), Table Sl. 8(v)

`resolveTdsRule(date)` returns rate plus legal reference. No component, column name, database field or copy string mentions "194-O" directly; the reference is always looked up from the transaction date. A settlement from March 2026 renders "Section 194-O", one from April 2026 renders "Section 393" with no code change.

Parser column matching still recognises literal "TDS 194-O" headers in uploaded files — that is what the platforms print — but the value is stored under a neutral field.

## 2. Reported vs expected withholding

Rename the order field from `tdsWithheld` to a structured withholding record: transaction date, taxable base, rate, reported amount (from the statement), expected amount (derived), and the resolved legal reference.

Rules:
- The platform-reported amount is the source of truth for money movement. The derived figure is only used for comparison.
- Expected amount comes from a `resolveTdsTaxBase()` helper, not raw GOV: packaging and transaction-linked charges are inside the base; restaurant-funded discounts reduce it; platform-funded discounts do not; separately identified GST is excluded where the statement identifies it.
- The order drawer gains a reconciliation row: Platform reported / Retained expected / Variance, with a "Matched" or "Review" state.
- Demo data generates both, with a couple of deliberate variances so the reconciliation view has something to show.

Withholding stays out of contribution, as today. Copy changes from a refund promise to a credit statement: "Income-tax withheld — this isn't a platform cost. The platform has withheld this toward your income tax. It can generally be claimed as tax credit, subject to your tax records and return." Dashboard short form: "Tax withheld / Not counted as a cost". Updated in English, Hindi and Arabic.

## 3. Unclassified, not unauthorized

Rename `unauthorizedDeductions` to `unclassifiedAdjustments` throughout (types, metrics, parsers, dashboard, drawer, marketing copy). A parser encountering an unfamiliar column cannot conclude the platform had no right to deduct; only a reconciliation rule can promote a line to a flagged discrepancy.

TCS handling keeps its named exception but the warning softens to acknowledge mixed supplies: "TCS appears in this statement. It normally does not apply to restaurant-service supplies where the platform pays GST under Section 9(5). We've preserved the amount for review because the statement may contain another supply type or adjustment." No TCS row in the deduction stack, no empty KPI — but the raw value is preserved as an audit event with its source column and row.

## 4. GST classification, not a scheme picker

Onboarding currently offers "5% GST no ITC" vs "18% GST with ITC" as if it were a preference. Reword to describe the outlet's actual classification:

- 5% — ordinary restaurant service, no input tax credit (default)
- 18% — restaurant service at specified premises
- I'm not sure

The "not sure" answer defaults to 5%-without-ITC for calculations and shows a persistent "confirm with your accountant" note on the tax figures. Nothing in the product ever suggests switching rate to recover GST.

## Technical notes

Files touched: `src/data/types.ts`, `src/data/orders.ts`, `src/data/markets.ts`, `src/lib/metrics.ts`, `src/lib/parsers/{base,zomato,swiggy}.ts`, `src/lib/marketing-stats.ts`, `src/lib/site-copy.ts`, `src/routes/{onboarding,app.index,app.orders,app.imports}.tsx`, plus new `src/lib/tax/rules.ts`. Also update `docs/implementations/revised_mvp_ingestion.md` so the locked positions match.

No database migration is required for the withholding change — settlement data is client-side. The onboarding wording change reuses the existing `tax_scheme` column; a third `unsure` value is stored as `gst_5_no_itc` with a separate confirmation flag only if you want it persisted, otherwise it stays a UI-level default.

Instamart / quick commerce stays explicitly out of scope, recorded in the doc rather than the code.
