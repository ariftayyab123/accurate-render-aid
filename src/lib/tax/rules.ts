/**
 * Effective-dated tax rules. Rates and legal references are looked up from the
 * transaction date, never hard-coded into fields, labels or copy — so a statement
 * from March 2026 cites Section 194-O and one from April 2026 cites Section 393
 * without a code change.
 */
export interface TaxRule {
  jurisdiction: "IN";
  ruleKey: "ECOMMERCE_TDS";
  effectiveFrom: string;
  effectiveTo?: string;
  rate: number;
  legalReference: { act: string; provision: string };
}

export const ECOMMERCE_TDS_RULES: TaxRule[] = [
  {
    jurisdiction: "IN",
    ruleKey: "ECOMMERCE_TDS",
    effectiveFrom: "2020-10-01",
    effectiveTo: "2024-09-30",
    rate: 0.01,
    legalReference: { act: "Income-tax Act, 1961", provision: "Section 194-O" },
  },
  {
    jurisdiction: "IN",
    ruleKey: "ECOMMERCE_TDS",
    effectiveFrom: "2024-10-01",
    effectiveTo: "2026-03-31",
    rate: 0.001,
    legalReference: { act: "Income-tax Act, 1961", provision: "Section 194-O" },
  },
  {
    jurisdiction: "IN",
    ruleKey: "ECOMMERCE_TDS",
    effectiveFrom: "2026-04-01",
    rate: 0.001,
    legalReference: {
      act: "Income-tax Act, 2025",
      provision: "Section 393(1), Table Sl. No. 8(v)",
    },
  },
];

function dayKey(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString().slice(0, 10);
  return parsed.toISOString().slice(0, 10);
}

/** The e-commerce withholding rule in force on a given transaction date. */
export function resolveTdsRule(date: string): TaxRule {
  const key = dayKey(date);
  const match = ECOMMERCE_TDS_RULES.find(
    (rule) => key >= rule.effectiveFrom && (!rule.effectiveTo || key <= rule.effectiveTo),
  );
  return match ?? ECOMMERCE_TDS_RULES[ECOMMERCE_TDS_RULES.length - 1]!;
}

export function formatLegalReference(rule: TaxRule): string {
  return `${rule.legalReference.act}, ${rule.legalReference.provision}`;
}

export interface TdsBaseInput {
  /** Order value as billed, including packaging and other transaction-linked charges. */
  grossOrderValue: number;
  /** Charges billed alongside the order that form part of the statutory gross amount. */
  transactionLinkedCharges?: number;
  /** Seller-funded discount — reduces the consideration, so it reduces the base. */
  restaurantFundedDiscount?: number;
  /** Platform-funded discount — the restaurant still receives full value, base unchanged. */
  platformFundedDiscount?: number;
  /** GST separately identified on the statement, excluded where identifiable at credit. */
  separatelyIdentifiedTax?: number;
}

/**
 * The statutory gross amount for e-commerce withholding. Not the same thing as the
 * restaurant's gross order value: transaction-linked charges are inside it,
 * restaurant-funded discounts reduce it, platform-funded discounts do not, and
 * separately identified GST comes out where the statement identifies it.
 */
export function resolveTdsTaxBase(input: TdsBaseInput): number {
  const base =
    input.grossOrderValue +
    (input.transactionLinkedCharges ?? 0) -
    (input.restaurantFundedDiscount ?? 0) -
    (input.separatelyIdentifiedTax ?? 0);
  return Math.max(0, base);
}
