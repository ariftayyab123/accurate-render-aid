import type { Order, SettlementOverrides, Settlement } from "@/data/types";
import { v4 as uuidv4 } from "uuid";
import { parseSettlementCsv, type RowMapper } from "./base";

export async function parseZomatoSettlement(
  csvData: string,
  overrides?: SettlementOverrides
): Promise<{ orders: Order[]; settlement: Settlement }> {
  
  const mapRow: RowMapper = (row: any, overrides?: SettlementOverrides) => {
    const val = (key: string) => parseFloat(row[key]?.toString().replace(/,/g, '') || "0");
    
    const grossOrderValue = val("gross sales") || val("total merchant amount") || val("Items subtotal");
    
    const serviceFee = val("service fee");
    const gstOnServiceFee = val("taxes on service & payment-mechanism fees");
    const paymentFee = val("payment mechanism fee");
    const logisticsCharge = val("logistics charge");
    
    const tdsWithheld = val("TDS 194-O");
    const adAllocation = overrides?.adSpend || val("order-level ad deductions");
    
    const netDeductionsStated = val("net deductions");
    const knownDeductions = serviceFee + gstOnServiceFee + paymentFee + logisticsCharge + adAllocation;
    const unauthorizedDeductions = Math.max(0, netDeductionsStated - knownDeductions);

    const orderId = row["Order ID"] || uuidv4();

    const order: Order = {
      id: orderId,
      placedAt: row["settlement date"] || new Date().toISOString(),
      channel: "zomato",
      lines: [], 
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

    return {
      order,
      feesAndGst: serviceFee + gstOnServiceFee + paymentFee + logisticsCharge,
      netPayout: val("net additions") - netDeductionsStated
    };
  };

  return parseSettlementCsv(csvData, "zomato", mapRow, overrides);
}
