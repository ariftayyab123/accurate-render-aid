import Papa from "papaparse";
import type { Order, SettlementOverrides, Settlement, ChannelCode } from "@/data/types";
import { v4 as uuidv4 } from "uuid";

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
          id: uuidv4(),
          channel,
          periodStart: orders[0]?.placedAt || new Date().toISOString(),
          periodEnd: orders[orders.length - 1]?.placedAt || new Date().toISOString(),
          grossPayable: totalGrossPayable,
          feesAndGst: totalFeesAndGst,
          adsAndAdjustments: totalAdsAndAdjustments,
          taxWithheld: totalTaxWithheld,
          netPayout: totalNetPayout,
          variance: 0,
          overrides
        };

        resolve({ orders, settlement });
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}
