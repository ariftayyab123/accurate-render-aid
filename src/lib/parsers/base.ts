import Papa from "papaparse";
import type { Order, SettlementOverrides, Settlement, ChannelCode } from "@/data/types";

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15);
}

export type RowMapper = (row: any, overrides?: SettlementOverrides) => {
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
    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const orders: Order[] = [];
        let totalGrossPayable = 0;
        let totalFeesAndGst = 0;
        let totalAdsAndAdjustments = 0;
        let totalTaxWithheld = 0;
        let totalNetPayout = 0;

        results.data.forEach((row: any) => {
          const { order, feesAndGst, netPayout } = mapRow(row, overrides);
          
          orders.push(order);
          
          totalGrossPayable += order.grossOrderValue;
          totalFeesAndGst += feesAndGst;
          totalAdsAndAdjustments += order.deductions.adAllocation + order.deductions.adjustment + order.deductions.unauthorizedDeductions;
          totalTaxWithheld += order.tdsWithheld;
          totalNetPayout += netPayout;
        });

        const settlement: Settlement = {
          id: generateId(),
          channel,
          periodStart: orders[0]?.placedAt || new Date().toISOString(),
          periodEnd: orders[orders.length - 1]?.placedAt || new Date().toISOString(),
          grossPayable: totalGrossPayable,
          feesAndGst: totalFeesAndGst,
          adsAndAdjustments: totalAdsAndAdjustments,
          taxWithheld: totalTaxWithheld,
          netPayout: totalNetPayout,
          variance: 0,
          ...(overrides ? { overrides } : {}),
        };

        resolve({ orders, settlement });
      },
      error: (error: unknown) => {
        reject(error);
      }
    });
  });
}
