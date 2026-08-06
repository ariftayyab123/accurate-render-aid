import type { Order, SettlementOverrides, Settlement } from "@/data/types";
import { buildImportedOrder, numericReader, parseSettlementCsv, type RowMapper } from "./base";

const mapRow: RowMapper = (row, overrides) => {
  const val = numericReader(row);

  const serviceFee = val("service fee");
  const gstOnServiceFee = val("taxes on service & payment-mechanism fees");
  const paymentFee = val("payment mechanism fee");
  const fulfilmentCost = val("logistics charge");
  const adAllocation = overrides?.adSpend || val("order-level ad deductions");
  const netDeductionsStated = val("net deductions");

  const order: Order = buildImportedOrder({
    row,
    channel: "zomato",
    placedAt: (row["settlement date"] ?? "").toString() || new Date().toISOString(),
    grossOrderValue: val("gross sales", "total merchant amount", "Items subtotal"),
    restaurantDiscount:
      val("restaurant discount (promo)") +
      val("restaurant discount (flat-offs/freebies/Gold)"),
    refundedValue: val("cancellation/refund-level payout"),
    serviceFee,
    gstOnServiceFee,
    paymentFee,
    fulfilmentCost,
    adAllocation,
    adjustment: val("credit/debit note adjustment"),
    netDeductionsStated,
    tdsWithheld: val("TDS 194-O"),
  });

  return {
    order,
    feesAndGst: serviceFee + gstOnServiceFee + paymentFee + fulfilmentCost,
    netPayout: val("net additions") - netDeductionsStated,
  };
};

export async function parseZomatoSettlement(
  csvData: string,
  overrides?: SettlementOverrides
): Promise<{ orders: Order[]; settlement: Settlement }> {
  return parseSettlementCsv(csvData, "zomato", mapRow, overrides);
}
