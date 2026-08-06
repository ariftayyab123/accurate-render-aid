import Papa from "papaparse";
import type { Order, SettlementOverrides, Settlement, ChannelCode } from "@/data/types";

export type CsvRow = Record<string, string | number | null | undefined>;

export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15);
}

/** Reads a numeric cell, tolerating thousands separators and missing columns. */
export function numericReader(row: CsvRow) {
  return (...keys: string[]): number => {
    for (const key of keys) {
      const raw = row[key];
      if (raw === undefined || raw === null || raw === "") continue;
      const value = parseFloat(raw.toString().replace(/,/g, ""));
      if (!Number.isNaN(value) && value !== 0) return value;
    }
    return 0;
  };
}

export type MappedOrderInput = {
  row: CsvRow;
  channel: ChannelCode;
  placedAt: string;
  grossOrderValue: number;
  restaurantDiscount: number;
  refundedValue: number;
  serviceFee: number;
  gstOnServiceFee: number;
  paymentFee: number;
  fulfilmentCost: number;
  adAllocation: number;
  adjustment: number;
  netDeductionsStated: number;
  tdsWithheld: number;
};

/** Builds a normalised imported order from channel-specific column readings. */
export function buildImportedOrder(input: MappedOrderInput): Order {
  const knownDeductions =
    input.serviceFee +
    input.gstOnServiceFee +
    input.paymentFee +
    input.fulfilmentCost +
    input.adAllocation;

  return {
    id: (input.row["Order ID"] ?? "").toString() || generateId(),
    placedAt: input.placedAt,
    channel: input.channel,
    lines: [],
    grossOrderValue: input.grossOrderValue,
    restaurantDiscount: input.restaurantDiscount,
    refundedValue: input.refundedValue,
    deductions: {
      serviceFee: input.serviceFee,
      gstOnServiceFee: input.gstOnServiceFee,
      paymentFee: input.paymentFee,
      adAllocation: input.adAllocation,
      fulfilmentCost: input.fulfilmentCost,
      adjustment: input.adjustment,
      unauthorizedDeductions: Math.max(0, input.netDeductionsStated - knownDeductions),
    },
    tdsWithheld: input.tdsWithheld,
    status: "delivered",
    dataQuality: "imported",
  };
}

export type RowMapper = (
  row: CsvRow,
  overrides?: SettlementOverrides
) => {
  order: Order;
  feesAndGst: number;
  netPayout: number;
};

export async function parseSettlementCsv(
  csvData: string,
  channel: ChannelCode,
  mapRow: RowMapper,
  overrides?: SettlementOverrides
): Promise<{ orders: Order[]; settlement: Settlement }> {
  return new Promise((resolve, reject) => {
    Papa.parse<CsvRow>(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const orders: Order[] = [];
        let grossPayable = 0;
        let feesAndGst = 0;
        let adsAndAdjustments = 0;
        let taxWithheld = 0;
        let netPayout = 0;

        for (const row of results.data) {
          const mapped = mapRow(row, overrides);
          const { order } = mapped;

          orders.push(order);
          grossPayable += order.grossOrderValue;
          feesAndGst += mapped.feesAndGst;
          adsAndAdjustments +=
            order.deductions.adAllocation +
            order.deductions.adjustment +
            order.deductions.unauthorizedDeductions;
          taxWithheld += order.tdsWithheld;
          netPayout += mapped.netPayout;
        }

        const fallbackDate = new Date().toISOString();
        resolve({
          orders,
          settlement: {
            id: generateId(),
            channel,
            periodStart: orders[0]?.placedAt || fallbackDate,
            periodEnd: orders[orders.length - 1]?.placedAt || fallbackDate,
            grossPayable,
            feesAndGst,
            adsAndAdjustments,
            taxWithheld,
            netPayout,
            variance: 0,
            ...(overrides ? { overrides } : {}),
          },
        });
      },
      error: (error: unknown) => reject(error),
    });
  });
}

/** Safe human-readable message for an unknown thrown value. */
export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
