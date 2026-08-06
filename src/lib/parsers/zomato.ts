import Papa from "papaparse";
import type { Order, SettlementOverrides, Settlement } from "@/data/types";
import { v4 as uuidv4 } from "uuid";

// Simplified generic parser mapping against Zomato's fields.
// In reality, this would have robust error handling and fallbacks for column names.
export async function parseZomatoSettlement(
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
          // Fallback parsing for MVP: we attempt to match column strings provided in the prompt.
          // Note: Real CSVs might have slightly different names, so we use a loose parse approach.
          
          const val = (key: string) => parseFloat(row[key]?.toString().replace(/,/g, '') || "0");
          
          const grossOrderValue = val("gross sales") || val("total merchant amount") || val("Items subtotal");
          
          // Deductions
          const serviceFee = val("service fee");
          const gstOnServiceFee = val("taxes on service & payment-mechanism fees");
          const paymentFee = val("payment mechanism fee");
          const logisticsCharge = val("logistics charge");
          
          // TDS & Taxes
          const tdsWithheld = val("TDS 194-O");
          
          // Ads and overrides
          const adAllocation = overrides?.adSpend || val("order-level ad deductions");
          
          // Unclear deductions check - we sum up all known fees and if the "net deductions" is higher, we flag the diff.
          const netDeductionsStated = val("net deductions");
          const knownDeductions = serviceFee + gstOnServiceFee + paymentFee + logisticsCharge + adAllocation;
          const unauthorizedDeductions = Math.max(0, netDeductionsStated - knownDeductions);

          const orderId = row["Order ID"] || uuidv4();

          const order: Order = {
            id: orderId,
            placedAt: row["settlement date"] || new Date().toISOString(),
            channel: "zomato",
            lines: [], // Item level data often isn't in settlement reports, so we might need to mock or parse separately
            grossOrderValue,
            restaurantDiscount: val("restaurant discount (promo)") + val("restaurant discount (flat-offs/freebies/Gold)"),
            refundedValue: val("cancellation/refund-level payout"),
            deductions: {
              serviceFee,
              gstOnServiceFee,
              paymentFee,
              adAllocation,
              fulfilmentCost: logisticsCharge,
              adjustment: val("credit/debit note adjustment"),
              unauthorizedDeductions,
            },
            tdsWithheld,
            status: "delivered",
            dataQuality: "imported",
          };

          orders.push(order);
          
          // Accumulate for settlement
          totalGrossPayable += grossOrderValue;
          totalFeesAndGst += serviceFee + gstOnServiceFee + paymentFee + logisticsCharge;
          totalAdsAndAdjustments += adAllocation + order.deductions.adjustment + unauthorizedDeductions;
          totalTaxWithheld += tdsWithheld;
          totalNetPayout += val("net additions") - netDeductionsStated;
        });

        const settlement: Settlement = {
          id: uuidv4(),
          channel: "zomato",
          periodStart: orders[0]?.placedAt || new Date().toISOString(),
          periodEnd: orders[orders.length - 1]?.placedAt || new Date().toISOString(),
          grossPayable: totalGrossPayable,
          feesAndGst: totalFeesAndGst,
          adsAndAdjustments: totalAdsAndAdjustments,
          taxWithheld: totalTaxWithheld,
          netPayout: totalNetPayout,
          variance: 0, // This would be calculated by comparing computed net against stated net
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
