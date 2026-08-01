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

/** Platform deduction = service fee + GST on fee + payment fee + ads + fulfilment + adjustments. */
export function platformDeduction(order: Order) {
  const d = order.deductions;
  return (
    d.serviceFee + d.gstOnServiceFee + d.paymentFee + d.adAllocation + d.fulfilmentCost + d.adjustment
  );
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
    gstOnServiceFee: number;
    paymentFee: number;
    adAllocation: number;
    fulfilmentCost: number;
    adjustment: number;
  };
}

export function summarise(orders: Order[]): PeriodTotals {
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
      acc.deductionBreakdown.gstOnServiceFee += order.deductions.gstOnServiceFee;
      acc.deductionBreakdown.paymentFee += order.deductions.paymentFee;
      acc.deductionBreakdown.adAllocation += order.deductions.adAllocation;
      acc.deductionBreakdown.fulfilmentCost += order.deductions.fulfilmentCost;
      acc.deductionBreakdown.adjustment += order.deductions.adjustment;
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
        gstOnServiceFee: 0,
        paymentFee: 0,
        adAllocation: 0,
        fulfilmentCost: 0,
        adjustment: 0,
      },
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

export function summariseByChannel(orders: Order[], channels: ChannelCode[]): ChannelSummary[] {
  return channels.map((channel) => {
    const channelOrders = orders.filter((order) => order.channel === channel);
    const settlementVariance = DEMO_SETTLEMENTS.filter(
      (settlement) => settlement.channel === channel,
    ).reduce((sum, settlement) => sum + settlement.variance, 0);
    return { channel, settlementVariance, ...summarise(channelOrders) };
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