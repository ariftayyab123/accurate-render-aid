export type MarketCode = "IN" | "AE";

/** Tax registration the owner declares in onboarding; drives ITC/VAT recoverability. */
export type TaxSchemeCode =
  | "gst_5_no_itc"
  | "gst_18_with_itc"
  | "vat_registered"
  | "vat_unregistered";

export interface TaxScheme {
  code: TaxSchemeCode;
  label: string;
  hint: string;
  /** Whether tax charged on platform fees can be reclaimed. */
  recoverable: boolean;
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
          label: "5% GST, no input tax credit",
          hint: "GST charged on app commission stays a permanent cost.",
          recoverable: false,
        },
        {
          code: "gst_18_with_itc",
          label: "18% GST with input tax credit",
          hint: "GST on app commission can be claimed back as credit.",
          recoverable: true,
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