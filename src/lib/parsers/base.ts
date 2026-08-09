import Papa from "papaparse";
import type {
  Order,
  SettlementOverrides,
  Settlement,
  ChannelCode,
  FlaggedCharge,
} from "@/data/types";

export type CsvRow = Record<string, string | number | null | undefined>;

export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15);
}

const TCS_COLUMN_PATTERN = /\btcs\b|tax collected at source|section\s*52/i;

const TCS_NOTE =
  "TCS shown on your statement — this normally doesn't apply to aggregator food delivery orders, worth checking with your accountant.";

/**
 * TCS under Section 52 is not modelled as a field: a platform paying GST under 9(5)
 * cannot also collect TCS on the same supply. But if a column ever shows up, we name it
 * rather than calling a government tax collection "unauthorized".
 */
export function detectFlaggedCharges(row: CsvRow): FlaggedCharge[] {
  const flagged: FlaggedCharge[] = [];
  for (const [key, raw] of Object.entries(row)) {
    if (!TCS_COLUMN_PATTERN.test(key)) continue;
    if (raw === undefined || raw === null || raw === "") continue;
    const amount = Math.abs(parseFloat(raw.toString().replace(/,/g, "")));
    if (!Number.isFinite(amount) || amount === 0) continue;
    flagged.push({ label: key.trim(), amount, note: TCS_NOTE });
  }
  return flagged;
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
  platformFee: number;
  gstOnServiceFee: number;
  paymentFee: number;
  packagingDeduction: number;
  membershipSubsidy: number;
  fulfilmentCost: number;
  adAllocation: number;
  adjustment: number;
  netDeductionsStated: number;
  tdsWithheld: number;
  /** Whether tax on platform fees is reclaimable under the owner's declared scheme. */
  feeTaxRecoverable?: boolean;
};

/** Builds a normalised imported order from channel-specific column readings. */
export function buildImportedOrder(input: MappedOrderInput): Order {
  const flaggedCharges = detectFlaggedCharges(input.row);
  const flaggedTotal = flaggedCharges.reduce((sum, charge) => sum + charge.amount, 0);
  const knownDeductions =
    input.serviceFee +
    input.platformFee +
    input.gstOnServiceFee +
    input.paymentFee +
    input.packagingDeduction +
    input.membershipSubsidy +
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
      platformFee: input.platformFee,
      gstOnServiceFee: input.gstOnServiceFee,
      paymentFee: input.paymentFee,
      packagingDeduction: input.packagingDeduction,
      membershipSubsidy: input.membershipSubsidy,
      adAllocation: input.adAllocation,
      fulfilmentCost: input.fulfilmentCost,
      adjustment: input.adjustment,
      unauthorizedDeductions: Math.max(
        0,
        input.netDeductionsStated - knownDeductions - flaggedTotal,
      ),
    },
    tdsWithheld: input.tdsWithheld,
    taxTreatment: {
      feeTaxAmount: input.gstOnServiceFee,
      recoverable: input.feeTaxRecoverable ?? false,
    },
    ...(flaggedCharges.length ? { flaggedCharges } : {}),
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
