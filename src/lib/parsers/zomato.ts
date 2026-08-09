import type { Order, SettlementOverrides, Settlement } from "@/data/types";
import { buildImportedOrder, numericReader, parseSettlementCsv, type RowMapper } from "./base";

const mapRow: RowMapper = (row, overrides, rowIndex) => {
  const val = numericReader(row);

  const serviceFee = val("service fee");
  const platformFee = val("platform fee", "fixed fee per order");
  const gstOnServiceFee = val("taxes on service & payment-mechanism fees");
  const paymentFee = val("payment mechanism fee");
  const packagingDeduction = val("packaging charge deduction", "packaging charges");
  const membershipSubsidy = val("gold discount", "restaurant funded gold discount");
  const fulfilmentCost = val("logistics charge");
  const adAllocation = overrides?.adSpend || val("order-level ad deductions");
  const netDeductionsStated = val("net deductions");
  const fundingShare = overrides?.discountFundingSplit ?? 1;

  const order: Order = buildImportedOrder({
    row,
    ...(rowIndex !== undefined ? { rowIndex } : {}),
    channel: "zomato",
    placedAt: (row["settlement date"] ?? "").toString() || new Date().toISOString(),
    grossOrderValue: val("gross sales", "total merchant amount", "Items subtotal"),
    restaurantDiscount:
      (val("restaurant discount (promo)") +
        val("restaurant discount (flat-offs/freebies/Gold)")) *
      fundingShare,
    refundedValue: val("cancellation/refund-level payout"),
    serviceFee,
    platformFee,
    gstOnServiceFee,
    paymentFee,
    packagingDeduction,
    membershipSubsidy,
    fulfilmentCost,
    adAllocation,
    adjustment: val("credit/debit note adjustment"),
    netDeductionsStated,
    tdsReported: val("TDS", "TDS 194-O", "tds deducted", "income tax withheld"),
    ...(overrides?.feeTaxRecoverable !== undefined
      ? { feeTaxRecoverable: overrides.feeTaxRecoverable }
      : {}),
  });

  return {
    order,
    feesAndGst: serviceFee + platformFee + gstOnServiceFee + paymentFee + fulfilmentCost,
    netPayout: val("net additions") - netDeductionsStated,
  };
};

export async function parseZomatoSettlement(
  csvData: string,
  overrides?: SettlementOverrides
): Promise<{ orders: Order[]; settlement: Settlement }> {
  return parseSettlementCsv(csvData, "zomato", mapRow, overrides);
}
