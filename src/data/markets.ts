export type MarketCode = "IN" | "AE";

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
  },
];

export function marketConfig(code: string): MarketConfig {
  return MARKETS.find((market) => market.code === code) ?? MARKETS[0]!;
}