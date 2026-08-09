export type ChannelCode = "zomato" | "swiggy" | "direct";

export type DataQuality = "imported" | "estimated" | "manual" | "missing";

export type OrderStatus = "delivered" | "cancelled" | "refund_pending";

export type MappingStatus = "mapped" | "review" | "unmapped";

export interface Restaurant {
  id: string;
  name: string;
  legalName?: string;
  city: string;
  currency: "INR";
  timezone: "Asia/Kolkata";
}

export interface Outlet {
  id: string;
  restaurantId: string;
  name: string;
  area: string;
}

export interface ChannelListing {
  channel: ChannelCode;
  listingName: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  foodCost: number;
  packagingCost: number;
  listings: ChannelListing[];
  mappingStatus: MappingStatus;
}

export interface OrderLine {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  foodCost: number;
  packagingCost: number;
}

export interface DeductionBreakdown {
  serviceFee: number;
  /** Fixed platform fee charged per order, independent of order value. */
  platformFee: number;
  gstOnServiceFee: number;
  paymentFee: number;
  /** Packaging charge the platform deducts back from the restaurant. */
  packagingDeduction: number;
  /** Restaurant-funded share of a membership programme (Gold / One) discount. */
  membershipSubsidy: number;
  adAllocation: number;
  fulfilmentCost: number;
  adjustment: number;
  /**
   * Statement lines we could not classify. Deliberately not called "unauthorized":
   * an unfamiliar column is not proof the platform had no right to deduct it.
   */
  unclassifiedAdjustments: number;
}

/**
 * Money withheld toward income tax. Reported is what the platform's statement says
 * and is the source of truth for cash; expected is our own calculation, used only
 * for reconciliation. The legal reference is resolved from the transaction date.
 */
export interface TaxWithholding {
  type: "ECOMMERCE_TDS";
  transactionDate: string;
  taxableBase: number;
  rate: number;
  reportedAmount: number;
  expectedAmount: number;
  legalReference: string;
}

/**
 * Tax charged on platform fees, plus whether the business can reclaim it.
 * Recoverability is derived from the owner's declared registration
 * (India: 5% no-ITC vs 18% with-ITC; UAE: VAT registered or not), never assumed.
 */
export interface TaxTreatment {
  feeTaxAmount: number;
  recoverable: boolean;
}

/**
 * A charge found on a statement that we can name but deliberately do not model as
 * a schema field — surfaced with its own explanation instead of being lumped into
 * "charges we can't explain".
 */
export interface FlaggedCharge {
  label: string;
  amount: number;
  note: string;
  /** Audit trail: where in the uploaded statement this value came from. */
  sourceColumn?: string;
  sourceRow?: number;
}

export interface Order {
  id: string;
  placedAt: string;
  channel: ChannelCode;
  lines: OrderLine[];
  grossOrderValue: number;
  restaurantDiscount: number;
  refundedValue: number;
  deductions: DeductionBreakdown;
  /**
   * E-commerce income-tax withholding: reduces the cash settlement, never the
   * operating contribution. Treated as a tax credit, not a guaranteed refund.
   * GST TCS under Section 52 is not part of this model — it does not normally apply
   * to 9(5) restaurant supplies — but a TCS line found in a file is preserved
   * as a flagged charge for review.
   */
  withholding?: TaxWithholding;
  taxTreatment?: TaxTreatment;
  /** Named exceptions from the unknown-column fallback (e.g. a stray TCS column). */
  flaggedCharges?: FlaggedCharge[];
  status: OrderStatus;
  dataQuality: DataQuality;
}

export interface SettlementOverrides {
  adSpend?: number;
  /** Owner-declared share of discounts they funded (0–1). Declared, never detected. */
  discountFundingSplit?: number;
  /** Whether tax on platform fees is reclaimable under the declared scheme. */
  feeTaxRecoverable?: boolean;
}

export interface Settlement {
  id: string;
  channel: ChannelCode;
  periodStart: string;
  periodEnd: string;
  grossPayable: number;
  feesAndGst: number;
  adsAndAdjustments: number;
  taxWithheld: number;
  netPayout: number;
  variance: number;
  overrides?: SettlementOverrides;
}

export const CHANNEL_LABELS: Record<ChannelCode, string> = {
  zomato: "Zomato",
  swiggy: "Swiggy",
  direct: "Direct",
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  delivered: "Delivered",
  cancelled: "Cancelled",
  refund_pending: "Refund adjustment pending",
};

export const QUALITY_LABELS: Record<DataQuality, string> = {
  imported: "Imported",
  estimated: "Estimated",
  manual: "Manual",
  missing: "Missing",
};