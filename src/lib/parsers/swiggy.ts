import Papa from "papaparse";
import type { Order, SettlementOverrides, Settlement } from "@/data/types";
import { v4 as uuidv4 } from "uuid";

// Simplified generic parser mapping against Swiggy's known fields.
// Unknown fields are bundled into unauthorized deductions.
export async function parseSwiggySettlement(
  csvData: string,
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
          
          const val = (key: string) => parseFloat(row[key]?.toString().replace(/,/g, '') || "0");
          
          const grossOrderValue = val("gross order value") || val("total order value");
          
          // Deductions
          const serviceFee = val("commission");
          const gstOnServiceFee = val("gst on commission") || val("taxes on commission");
          const paymentFee = val("payment gateway fee");
          
          // TDS
          const tdsWithheld = val("TDS") || val("tds deducted");
          
          // Ads and overrides
          const adAllocation = overrides?.adSpend || 0; 
          
          // Unclear deductions check
          // If there is a stated total deductions, we compare it against our mapped standard ones.
          const netDeductionsStated = val("total deductions") || val("deductions");
          const knownDeductions = serviceFee + gstOnServiceFee + paymentFee + adAllocation;
          const unauthorizedDeductions = Math.max(0, netDeductionsStated - knownDeductions);

          const orderId = row["Order ID"] || uuidv4();

          const order: Order = {
            id: orderId,
            placedAt: row["order date"] || new Date().toISOString(),
            channel: "swiggy",
            lines: [], 
            grossOrderValue,
            restaurantDiscount: val("restaurant discount"),
            refundedValue: val("refunds"),
            deductions: {
              serviceFee,
              gstOnServiceFee,
              paymentFee,
              adAllocation,
              fulfilmentCost: 0,
              adjustment: val("adjustments"),
              unauthorizedDeductions,
            },
            tdsWithheld,
            status: "delivered",
            dataQuality: "imported",
          };

          orders.push(order);
          
          // Accumulate for settlement
          totalGrossPayable += grossOrderValue;
          totalFeesAndGst += serviceFee + gstOnServiceFee + paymentFee;
          totalAdsAndAdjustments += adAllocation + order.deductions.adjustment + unauthorizedDeductions;
          totalTaxWithheld += tdsWithheld;
          totalNetPayout += val("net payout");
        });

        const settlement: Settlement = {
          id: uuidv4(),
          channel: "swiggy",
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
