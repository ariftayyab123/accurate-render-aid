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
  gstOnServiceFee: number;
  paymentFee: number;
  adAllocation: number;
  fulfilmentCost: number;
  adjustment: number;
  unauthorizedDeductions: number;
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
  tdsWithheld: number;
  status: OrderStatus;
  dataQuality: DataQuality;
}

export interface SettlementOverrides {
  adSpend?: number;
  discountFundingSplit?: number;
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