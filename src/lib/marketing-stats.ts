import { DEMO_ORDERS, ANALYSIS_PERIOD } from "@/data/orders";
import { summarise, summariseByChannel, summariseByItem } from "@/lib/metrics";

/**
 * Figures for the public home page. These come from the same demo dataset the
 * demo workspace uses, computed once at module scope so the server and the
 * browser render identical HTML for crawlers.
 */
const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
  numberingSystem: "latn",
});

export const money = (value: number) => inr.format(Math.round(value));
export const pct = (value: number, digits = 1) => `${(value * 100).toFixed(digits)}%`;

const totals = summarise(DEMO_ORDERS);
const channels = summariseByChannel(DEMO_ORDERS, ["zomato", "swiggy", "direct"]);
const byChannel = Object.fromEntries(channels.map((row) => [row.channel, row]));
const items = summariseByItem(DEMO_ORDERS).filter((row) => row.unitsSold > 0);
const strongest = [...items].sort((a, b) => b.contribution - a.contribution)[0]!;
const weakest = [...items].sort((a, b) => a.margin - b.margin)[0]!;

const zomato = byChannel['zomato']!;
const swiggy = byChannel['swiggy']!;
const direct = byChannel['direct']!;

export interface FlowStep {
  key: string;
  amount: number;
  share: number;
  kind: "sales" | "cost" | "kept";
}

/** Sales, then every slice that leaves, then what is left. */
export const FLOW: FlowStep[] = [
  { key: "sales", amount: totals.grossOrderValue, kind: "sales" },
  { key: "commission", amount: totals.deductionBreakdown.serviceFee, kind: "cost" },
  { key: "taxOnFees", amount: totals.deductionBreakdown.gstOnServiceFee, kind: "cost" },
  { key: "payment", amount: totals.deductionBreakdown.paymentFee, kind: "cost" },
  { key: "ads", amount: totals.deductionBreakdown.adAllocation, kind: "cost" },
  { key: "discounts", amount: totals.restaurantDiscounts, kind: "cost" },
  { key: "food", amount: totals.foodAndPackaging, kind: "cost" },
  { key: "kept", amount: totals.contribution, kind: "kept" },
].map((step) => ({ ...step, share: step.amount / totals.grossOrderValue }) as FlowStep);

export const DEMO = {
  period: ANALYSIS_PERIOD,
  orders: totals.orders,
  sales: totals.grossOrderValue,
  kept: totals.contribution,
  keptMargin: totals.margin,
  averageOrder: totals.averageOrderValue,
  platformCut: totals.platformDeductions,
  platformCutShare: totals.platformDeductions / totals.grossOrderValue,
  ads: totals.deductionBreakdown.adAllocation,
  discounts: totals.restaurantDiscounts,
  channels: [
    { code: "zomato", orders: zomato.orders, sales: zomato.grossOrderValue, keep: zomato.margin },
    { code: "swiggy", orders: swiggy.orders, sales: swiggy.grossOrderValue, keep: swiggy.margin },
    { code: "direct", orders: direct.orders, sales: direct.grossOrderValue, keep: direct.margin },
  ],
  zomatoCut: zomato.platformDeductions / zomato.grossOrderValue,
  swiggyCut: swiggy.platformDeductions / swiggy.grossOrderValue,
  bestDish: { name: strongest.item.name, kept: strongest.contribution, units: strongest.unitsSold },
  weakDish: { name: weakest.item.name, margin: weakest.margin, units: weakest.unitsSold },
};
