import type { Order, SettlementOverrides, Settlement } from "@/data/types";
import { buildImportedOrder, numericReader, parseSettlementCsv, type RowMapper } from "./base";

const mapRow: RowMapper = (row, overrides) => {
  const val = numericReader(row);

  const serviceFee = val("commission");
  const platformFee = val("platform fee", "fixed fee");
  const gstOnServiceFee = val("gst on commission", "taxes on commission");
  const paymentFee = val("payment gateway fee");
  const packagingDeduction = val("packaging charges", "packing charges");
  const membershipSubsidy = val("one benefit", "swiggy one discount");
  const adAllocation = overrides?.adSpend || 0;
  const fundingShare = overrides?.discountFundingSplit ?? 1;

  const order: Order = buildImportedOrder({
    row,
    channel: "swiggy",
    placedAt: (row["order date"] ?? "").toString() || new Date().toISOString(),
    grossOrderValue: val("gross order value", "total order value"),
    restaurantDiscount: val("restaurant discount") * fundingShare,
    refundedValue: val("refunds"),
    serviceFee,
    platformFee,
    gstOnServiceFee,
    paymentFee,
    packagingDeduction,
    membershipSubsidy,
    fulfilmentCost: 0,
    adAllocation,
    adjustment: val("adjustments"),
    netDeductionsStated: val("total deductions", "deductions"),
    tdsWithheld: val("TDS", "tds deducted"),
    ...(overrides?.feeTaxRecoverable !== undefined
      ? { feeTaxRecoverable: overrides.feeTaxRecoverable }
      : {}),
  });

  return {
    order,
    feesAndGst: serviceFee + platformFee + gstOnServiceFee + paymentFee,
    netPayout: val("net payout"),
  };
};

export async function parseSwiggySettlement(
  csvData: string,
  overrides?: SettlementOverrides
): Promise<{ orders: Order[]; settlement: Settlement }> {
  return parseSettlementCsv(csvData, "swiggy", mapRow, overrides);
}
