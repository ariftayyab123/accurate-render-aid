import Papa from "papaparse";
import { formatLegalReference, resolveTdsRule, resolveTdsTaxBase } from "@/lib/tax/rules";
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
  "TCS appears in this statement. It normally does not apply to restaurant-service supplies where the platform pays GST under Section 9(5). We've preserved the amount for review because the statement may contain another supply type or adjustment.";

/**
 * TCS under Section 52 is not modelled as a field: a platform paying GST under 9(5)
 * cannot also collect TCS on the same supply. But if a column ever shows up, we name it
 * rather than calling a government tax collection "unauthorized".
 */
export function detectFlaggedCharges(row: CsvRow, rowIndex?: number): FlaggedCharge[] {
  const flagged: FlaggedCharge[] = [];
  for (const [key, raw] of Object.entries(row)) {
    if (!TCS_COLUMN_PATTERN.test(key)) continue;
    if (raw === undefined || raw === null || raw === "") continue;
    const amount = Math.abs(parseFloat(raw.toString().replace(/,/g, "")));
    if (!Number.isFinite(amount) || amount === 0) continue;
    flagged.push({
      label: key.trim(),
      amount,
      note: TCS_NOTE,
      sourceColumn: key,
      ...(rowIndex !== undefined ? { sourceRow: rowIndex } : {}),
    });
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
  /** Withholding exactly as the statement reports it, before any calculation. */
  tdsReported: number;
  rowIndex?: number;
  /** Whether tax on platform fees is reclaimable under the owner's declared scheme. */
  feeTaxRecoverable?: boolean;
};

/** Builds a normalised imported order from channel-specific column readings. */
export function buildImportedOrder(input: MappedOrderInput): Order {
  const flaggedCharges = detectFlaggedCharges(input.row, input.rowIndex);
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

  const tdsRule = resolveTdsRule(input.placedAt);
  const taxableBase = resolveTdsTaxBase({
    grossOrderValue: input.grossOrderValue,
    restaurantFundedDiscount: input.restaurantDiscount,
    separatelyIdentifiedTax: input.gstOnServiceFee,
  });
  const expectedAmount = Math.round(taxableBase * tdsRule.rate * 100) / 100;

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
      unclassifiedAdjustments: Math.max(
        0,
        input.netDeductionsStated - knownDeductions - flaggedTotal,
      ),
    },
    withholding: {
      type: "ECOMMERCE_TDS",
      transactionDate: input.placedAt,
      taxableBase,
      rate: tdsRule.rate,
      // The statement is the source of truth; our number is only for comparison.
      reportedAmount: input.tdsReported,
      expectedAmount,
      legalReference: formatLegalReference(tdsRule),
    },
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
  overrides?: SettlementOverrides,
  rowIndex?: number
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

        results.data.forEach((row, rowIndex) => {
          const mapped = mapRow(row, overrides, rowIndex);
          const { order } = mapped;

          orders.push(order);
          grossPayable += order.grossOrderValue;
          feesAndGst += mapped.feesAndGst;
          adsAndAdjustments +=
            order.deductions.adAllocation +
            order.deductions.adjustment +
            order.deductions.unclassifiedAdjustments;
          taxWithheld += order.withholding?.reportedAmount ?? 0;
          netPayout += mapped.netPayout;
        });

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
