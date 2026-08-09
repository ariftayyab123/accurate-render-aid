import { DEMO_SETTLEMENTS } from "@/data/orders";
import { MENU_ITEMS } from "@/data/menu";
import type { ChannelCode, MenuItem, Order } from "@/data/types";

export function grossOrderValue(order: Order) {
  return order.grossOrderValue;
}

/** Revenue basis = gross order value − restaurant-funded discount − refunded item value. */
export function revenueBasis(order: Order) {
  return order.grossOrderValue - order.restaurantDiscount - order.refundedValue;
}

/**
 * Platform deduction = service fee + fixed platform fee + tax on fees + payment fee
 * + packaging deduction + membership subsidy + ads + fulfilment + adjustments + unclassified.
 * Income-tax withholding is deliberately excluded: it is withheld money, not a cost.
 */
export function platformDeduction(order: Order) {
  const d = order.deductions;
  return (
    d.serviceFee +
    (d.platformFee || 0) +
    d.gstOnServiceFee +
    d.paymentFee +
    (d.packagingDeduction || 0) +
    (d.membershipSubsidy || 0) +
    d.adAllocation +
    d.fulfilmentCost +
    d.adjustment +
    (d.unclassifiedAdjustments || 0)
  );
}

/**
 * Money the platform held back toward the restaurant's income tax, as reported on the
 * statement. GST TCS under Section 52 does not normally apply to restaurant supplies
 * taxed by the aggregator under Section 9(5) (CBIC Circular 167/23/2021), so it is not
 * part of this model.
 */
export function withheldTax(order: Order) {
  return order.withholding?.reportedAmount ?? 0;
}

/** What our own calculation expects the withholding to be, for reconciliation only. */
export function expectedWithheldTax(order: Order) {
  return order.withholding?.expectedAmount ?? 0;
}

/**
 * Spread a lump-sum channel ad figure across that channel's orders, pro-rata by gross
 * order value. Orders that already carry their own ad deduction keep it.
 */
export function allocateAdSpend(orders: Order[], channelAdSpend: Partial<Record<ChannelCode, number>>) {
  const totals = new Map<ChannelCode, number>();
  orders.forEach((order) => {
    if (order.deductions.adAllocation) return;
    totals.set(order.channel, (totals.get(order.channel) ?? 0) + order.grossOrderValue);
  });

  return orders.map((order) => {
    const lump = channelAdSpend[order.channel];
    const basis = totals.get(order.channel) ?? 0;
    if (!lump || !basis || order.deductions.adAllocation) return order;
    const share = order.grossOrderValue / basis;
    return {
      ...order,
      deductions: { ...order.deductions, adAllocation: Math.round(lump * share) },
    };
  });
}

export function foodAndPackagingCost(order: Order) {
  return order.lines.reduce(
    (sum, line) => sum + (line.foodCost + line.packagingCost) * line.quantity,
    0,
  );
}

/** Estimated order contribution = revenue basis − platform deduction − food and packaging cost. */
export function orderContribution(order: Order) {
  return revenueBasis(order) - platformDeduction(order) - foodAndPackagingCost(order);
}

export function contributionMargin(contribution: number, basis: number) {
  return basis === 0 ? 0 : contribution / basis;
}

export interface PeriodTotals {
  orders: number;
  grossOrderValue: number;
  restaurantDiscounts: number;
  refunds: number;
  revenueBasis: number;
  platformDeductions: number;
  foodAndPackaging: number;
  contribution: number;
  margin: number;
  averageOrderValue: number;
  deductionBreakdown: {
    serviceFee: number;
    platformFee: number;
    gstOnServiceFee: number;
    paymentFee: number;
    packagingDeduction: number;
    membershipSubsidy: number;
    adAllocation: number;
    fulfilmentCost: number;
    adjustment: number;
    unclassifiedAdjustments: number;
  };
  /** Income tax withheld, as reported on the statements. */
  taxWithheld: number;
  /** What our calculation expects the withholding to be. */
  taxWithheldExpected: number;
  /** Tax on fees the business can reclaim. */
  taxRecoverable: number;
  /** Tax on fees that stays a permanent cost. */
  taxSunk: number;
}

/**
 * @param feeTaxRecoverable Declared registration outcome — whether tax on platform
 * fees can be reclaimed. Per-order `taxTreatment` overrides it when present.
 */
export function summarise(orders: Order[], feeTaxRecoverable = false): PeriodTotals {
  const totals = orders.reduce(
    (acc, order) => {
      acc.orders += 1;
      acc.grossOrderValue += order.grossOrderValue;
      acc.restaurantDiscounts += order.restaurantDiscount;
      acc.refunds += order.refundedValue;
      acc.revenueBasis += revenueBasis(order);
      acc.platformDeductions += platformDeduction(order);
      acc.foodAndPackaging += foodAndPackagingCost(order);
      acc.contribution += orderContribution(order);
      acc.deductionBreakdown.serviceFee += order.deductions.serviceFee;
      acc.deductionBreakdown.platformFee += order.deductions.platformFee || 0;
      acc.deductionBreakdown.gstOnServiceFee += order.deductions.gstOnServiceFee;
      acc.deductionBreakdown.paymentFee += order.deductions.paymentFee;
      acc.deductionBreakdown.packagingDeduction += order.deductions.packagingDeduction || 0;
      acc.deductionBreakdown.membershipSubsidy += order.deductions.membershipSubsidy || 0;
      acc.deductionBreakdown.adAllocation += order.deductions.adAllocation;
      acc.deductionBreakdown.fulfilmentCost += order.deductions.fulfilmentCost;
      acc.deductionBreakdown.adjustment += order.deductions.adjustment;
      acc.deductionBreakdown.unclassifiedAdjustments += order.deductions.unclassifiedAdjustments || 0;
      acc.taxWithheld += withheldTax(order);
      acc.taxWithheldExpected += expectedWithheldTax(order);
      const feeTax = order.taxTreatment?.feeTaxAmount ?? order.deductions.gstOnServiceFee;
      const recoverable = order.taxTreatment?.recoverable ?? feeTaxRecoverable;
      if (recoverable) acc.taxRecoverable += feeTax;
      else acc.taxSunk += feeTax;
      return acc;
    },
    {
      orders: 0,
      grossOrderValue: 0,
      restaurantDiscounts: 0,
      refunds: 0,
      revenueBasis: 0,
      platformDeductions: 0,
      foodAndPackaging: 0,
      contribution: 0,
      margin: 0,
      averageOrderValue: 0,
      deductionBreakdown: {
        serviceFee: 0,
        platformFee: 0,
        gstOnServiceFee: 0,
        paymentFee: 0,
        packagingDeduction: 0,
        membershipSubsidy: 0,
        adAllocation: 0,
        fulfilmentCost: 0,
        adjustment: 0,
        unclassifiedAdjustments: 0,
      },
      taxWithheld: 0,
      taxWithheldExpected: 0,
      taxRecoverable: 0,
      taxSunk: 0,
    } as PeriodTotals,
  );

  totals.margin = contributionMargin(totals.contribution, totals.revenueBasis);
  totals.averageOrderValue = totals.orders ? totals.grossOrderValue / totals.orders : 0;
  return totals;
}

export interface ChannelSummary extends PeriodTotals {
  channel: ChannelCode;
  settlementVariance: number;
}

export function summariseByChannel(
  orders: Order[],
  channels: ChannelCode[],
  feeTaxRecoverable = false,
): ChannelSummary[] {
  return channels.map((channel) => {
    const channelOrders = orders.filter((order) => order.channel === channel);
    const settlementVariance = DEMO_SETTLEMENTS.filter(
      (settlement) => settlement.channel === channel,
    ).reduce((sum, settlement) => sum + settlement.variance, 0);
    return { channel, settlementVariance, ...summarise(channelOrders, feeTaxRecoverable) };
  });
}

export interface ItemSummary {
  item: MenuItem;
  unitsSold: number;
  sales: number;
  foodCost: number;
  deductions: number;
  contribution: number;
  contributionPerUnit: number;
  margin: number;
}

/**
 * Item-level economics. Order-level deductions and discounts are allocated to lines
 * in proportion to each line's share of the order's item value.
 */
export function summariseByItem(orders: Order[]): ItemSummary[] {
  const acc = new Map<string, { units: number; sales: number; food: number; deduct: number }>();

  orders.forEach((order) => {
    const itemValue = order.lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
    if (itemValue === 0) return;
    const orderDeductions = platformDeduction(order) + order.restaurantDiscount + order.refundedValue;

    order.lines.forEach((line) => {
      const lineValue = line.unitPrice * line.quantity;
      const share = lineValue / itemValue;
      const current = acc.get(line.itemId) ?? { units: 0, sales: 0, food: 0, deduct: 0 };
      current.units += line.quantity;
      current.sales += lineValue;
      current.food += (line.foodCost + line.packagingCost) * line.quantity;
      current.deduct += orderDeductions * share;
      acc.set(line.itemId, current);
    });
  });

  return MENU_ITEMS.map((item) => {
    const entry = acc.get(item.id) ?? { units: 0, sales: 0, food: 0, deduct: 0 };
    const basis = entry.sales;
    const contribution = basis - entry.deduct - entry.food;
    return {
      item,
      unitsSold: entry.units,
      sales: Math.round(entry.sales),
      foodCost: Math.round(entry.food),
      deductions: Math.round(entry.deduct),
      contribution: Math.round(contribution),
      contributionPerUnit: entry.units ? Math.round(contribution / entry.units) : 0,
      margin: contributionMargin(contribution, basis),
    };
  });
}

/** Share of orders whose values came straight from an import, expressed 0–1. */
export function dataConfidence(orders: Order[]) {
  if (!orders.length) return 0;
  const imported = orders.filter((order) => order.dataQuality === "imported").length;
  return imported / orders.length;
}