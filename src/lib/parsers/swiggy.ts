import type { Order, SettlementOverrides, Settlement } from "@/data/types";
import { parseSettlementCsv, type RowMapper } from "./base";

export async function parseSwiggySettlement(
  csvData: string,
  overrides?: SettlementOverrides
): Promise<{ orders: Order[]; settlement: Settlement }> {

  const mapRow: RowMapper = (row: any, overrides?: SettlementOverrides) => {
    const val = (key: string) => parseFloat(row[key]?.toString().replace(/,/g, '') || "0");
    
    const grossOrderValue = val("gross order value") || val("total order value");
    
    const serviceFee = val("commission");
    const gstOnServiceFee = val("gst on commission") || val("taxes on commission");
    const paymentFee = val("payment gateway fee");
    
    const tdsWithheld = val("TDS") || val("tds deducted");
    const adAllocation = overrides?.adSpend || 0; 
    
    const netDeductionsStated = val("total deductions") || val("deductions");
    const knownDeductions = serviceFee + gstOnServiceFee + paymentFee + adAllocation;
    const unauthorizedDeductions = Math.max(0, netDeductionsStated - knownDeductions);

    const orderId = row["Order ID"] || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15));

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

    return {
      order,
      feesAndGst: serviceFee + gstOnServiceFee + paymentFee,
      netPayout: val("net payout")
    };
  };

  return parseSettlementCsv(csvData, "swiggy", mapRow, overrides);
}
