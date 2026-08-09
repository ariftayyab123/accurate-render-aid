export type MarketCode = "IN" | "AE";

/**
 * The outlet's actual tax classification, as it appears on their filings — not a
 * plan the owner can pick for economic advantage. In India the 5% vs 18% split
 * follows the "specified premises" rules, so we ask what applies, never offer a switch.
 */
export type TaxSchemeCode =
  | "gst_5_no_itc"
  | "gst_18_with_itc"
  | "gst_unknown"
  | "vat_registered"
  | "vat_unregistered";

export interface TaxScheme {
  code: TaxSchemeCode;
  label: string;
  hint: string;
  /** Whether tax charged on platform fees can be reclaimed. */
  recoverable: boolean;
  /** Set when we treated tax as non-recoverable because the owner wasn't sure. */
  needsConfirmation?: boolean;
}

export interface MarketTax {
  /** How the tax on platform fees is named for this market. */
  label: string;
  /** Headline rate applied to platform fees. */
  rate: number;
  schemes: TaxScheme[];
}

export interface MarketConfig {
  code: MarketCode;
  label: string;
  currency: string;
  currencyLabel: string;
  cityPlaceholder: string;
  /** Delivery channels commonly used by restaurants in this market. */
  channels: { code: string; label: string }[];
  /** Channels the demo dataset can render figures for. */
  demoReady: boolean;
  tax: MarketTax;
}

export const MARKETS: MarketConfig[] = [
  {
    code: "IN",
    label: "India",
    currency: "INR",
    currencyLabel: "₹ Indian Rupee",
    cityPlaceholder: "Meerut",
    channels: [
      { code: "zomato", label: "Zomato" },
      { code: "swiggy", label: "Swiggy" },
      { code: "direct", label: "Direct / walk-in" },
    ],
    demoReady: true,
    tax: {
      label: "GST on commission",
      rate: 0.18,
      schemes: [
        {
          code: "gst_5_no_itc",
          label: "5%, without input tax credit",
          hint: "Most ordinary restaurant-service outlets. GST on app commission stays a permanent cost.",
          recoverable: false,
        },
        {
          code: "gst_18_with_itc",
          label: "18%, restaurant service at specified premises",
          hint: "GST on app commission is classified as input tax credit, not a cost.",
          recoverable: true,
        },
        {
          code: "gst_unknown",
          label: "I'm not sure",
          hint: "We'll treat GST on fees as a cost for now — the safer assumption — and you can change this once your accountant confirms.",
          recoverable: false,
          needsConfirmation: true,
        },
      ],
    },
  },
  {
    code: "AE",
    label: "United Arab Emirates",
    currency: "AED",
    currencyLabel: "د.إ UAE Dirham",
    cityPlaceholder: "Dubai",
    channels: [
      { code: "talabat", label: "Talabat" },
      { code: "deliveroo", label: "Deliveroo" },
      { code: "careem", label: "Careem" },
      { code: "noon", label: "Noon Food" },
      { code: "direct", label: "Direct / walk-in" },
    ],
    demoReady: false,
    tax: {
      label: "VAT on fees",
      rate: 0.05,
      schemes: [
        {
          code: "vat_registered",
          label: "VAT registered",
          hint: "VAT on platform fees is recoverable input VAT.",
          recoverable: true,
        },
        {
          code: "vat_unregistered",
          label: "Not VAT registered",
          hint: "VAT on platform fees stays a permanent cost.",
          recoverable: false,
        },
      ],
    },
  },
];

export function marketConfig(code: string): MarketConfig {
  return MARKETS.find((market) => market.code === code) ?? MARKETS[0]!;
}

export function defaultTaxScheme(code: string): TaxSchemeCode {
  return marketConfig(code).tax.schemes[0]!.code;
}

/** Whether tax on platform fees is reclaimable under the declared scheme. */
export function isFeeTaxRecoverable(scheme: string | undefined): boolean {
  for (const market of MARKETS) {
    const match = market.tax.schemes.find((entry) => entry.code === scheme);
    if (match) return match.recoverable;
  }
  return false;
}