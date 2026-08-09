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
  unauthorizedDeductions: number;
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
   * TDS under Section 194-O: money withheld by the platform and claimable
   * against income tax. A receivable, never a cost — kept out of contribution.
   * TCS under Section 52 does not apply to 9(5) restaurant supplies and is not modelled.
   */
  tdsWithheld: number;
  taxTreatment?: TaxTreatment;
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