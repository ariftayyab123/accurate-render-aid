import type { Order, SettlementOverrides, Settlement } from "@/data/types";
import { buildImportedOrder, numericReader, parseSettlementCsv, type RowMapper } from "./base";

const mapRow: RowMapper = (row, overrides) => {
  const val = numericReader(row);

  const serviceFee = val("commission");
  const gstOnServiceFee = val("gst on commission", "taxes on commission");
  const paymentFee = val("payment gateway fee");
  const adAllocation = overrides?.adSpend || 0;

  const order: Order = buildImportedOrder({
    row,
    channel: "swiggy",
    placedAt: (row["order date"] ?? "").toString() || new Date().toISOString(),
    grossOrderValue: val("gross order value", "total order value"),
    restaurantDiscount: val("restaurant discount"),
    refundedValue: val("refunds"),
    serviceFee,
    gstOnServiceFee,
    paymentFee,
    fulfilmentCost: 0,
    adAllocation,
    adjustment: val("adjustments"),
    netDeductionsStated: val("total deductions", "deductions"),
    tdsWithheld: val("TDS", "tds deducted"),
  });

  return {
    order,
    feesAndGst: serviceFee + gstOnServiceFee + paymentFee,
    netPayout: val("net payout"),
  };
};

export async function parseSwiggySettlement(
  csvData: string,
  overrides?: SettlementOverrides
): Promise<{ orders: Order[]; settlement: Settlement }> {
  return parseSettlementCsv(csvData, "swiggy", mapRow, overrides);
}
