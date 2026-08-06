import { MENU_ITEMS } from "./menu";
import type { ChannelCode, DataQuality, Order, OrderLine, OrderStatus, Settlement } from "./types";

/** Deterministic PRNG so the synthetic dataset is identical on server and client. */
function mulberry32(seed: number) {
  let a = seed;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface ChannelProfile {
  orders: number;
  discountRate: number;
  commissionRate: number;
  paymentFeeRate: number;
  adRate: number;
  fulfilmentRate: number;
}

const CHANNEL_PROFILES: Record<ChannelCode, ChannelProfile> = {
  zomato: {
    orders: 262,
    discountRate: 0.085,
    commissionRate: 0.22,
    paymentFeeRate: 0.02,
    adRate: 0.031,
    fulfilmentRate: 0,
  },
  swiggy: {
    orders: 135,
    discountRate: 0.05,
    commissionRate: 0.2,
    paymentFeeRate: 0.02,
    adRate: 0.015,
    fulfilmentRate: 0,
  },
  direct: {
    orders: 34,
    discountRate: 0.01,
    commissionRate: 0,
    paymentFeeRate: 0.02,
    adRate: 0,
    fulfilmentRate: 0.09,
  },
};

/** Relative popularity weights, so the menu-engineering matrix has real spread. */
const ITEM_WEIGHTS: Record<string, number> = {
  "itm-biryani": 20,
  "itm-butter-chicken": 14,
  "itm-paneer-tikka": 11,
  "itm-veg-burger": 12,
  "itm-family-combo": 5,
  "itm-chicken-roll": 13,
  "itm-veg-thali": 10,
  "itm-cold-coffee": 8,
  "itm-dal-makhani": 5,
  "itm-gulab-jamun": 6,
};

const WEIGHTED_POOL: string[] = Object.entries(ITEM_WEIGHTS).flatMap(([id, weight]) =>
  Array.from({ length: weight }, () => id),
);

const PERIOD_START = new Date(Date.UTC(2026, 6, 1, 0, 0, 0));
const PERIOD_DAYS = 30;

export const ANALYSIS_PERIOD = {
  start: "2026-07-01",
  end: "2026-07-30",
  label: "1 – 30 July 2026",
  days: PERIOD_DAYS,
};

function round(value: number) {
  return Math.round(value);
}

function priceFor(itemId: string, channel: ChannelCode) {
  const item = MENU_ITEMS.find((menuItem) => menuItem.id === itemId)!;
  const listing = item.listings.find((entry) => entry.channel === channel)!;
  return { item, price: listing.price };
}

function buildOrders(): Order[] {
  const random = mulberry32(20260701);
  const orders: Order[] = [];
  const channels = Object.keys(CHANNEL_PROFILES) as ChannelCode[];

  const queue: ChannelCode[] = [];
  channels.forEach((channel) => {
    for (let i = 0; i < CHANNEL_PROFILES[channel].orders; i += 1) queue.push(channel);
  });
  // Deterministic shuffle so channels interleave across the month.
  for (let i = queue.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const a = queue[i]!;
    const b = queue[j]!;
    queue[i] = b;
    queue[j] = a;
  }

  queue.forEach((channel, index) => {
    const profile = CHANNEL_PROFILES[channel];
    const dayOffset = Math.floor((index / queue.length) * PERIOD_DAYS);
    const hour = random() < 0.55 ? 19 + Math.floor(random() * 3) : 12 + Math.floor(random() * 4);
    const minute = Math.floor(random() * 60);
    const placedAt = new Date(PERIOD_START);
    placedAt.setUTCDate(placedAt.getUTCDate() + dayOffset);
    placedAt.setUTCHours(hour, minute, 0, 0);

    const lineCount = random() < 0.62 ? 1 : random() < 0.85 ? 2 : 3;
    const lines: OrderLine[] = [];
    const used = new Set<string>();
    for (let i = 0; i < lineCount; i += 1) {
      let itemId = WEIGHTED_POOL[Math.floor(random() * WEIGHTED_POOL.length)]!;
      let guard = 0;
      while (used.has(itemId) && guard < 6) {
        itemId = WEIGHTED_POOL[Math.floor(random() * WEIGHTED_POOL.length)]!;
        guard += 1;
      }
      used.add(itemId);
      const { item, price } = priceFor(itemId, channel);
      const quantity = random() < 0.86 ? 1 : 2;
      lines.push({
        itemId,
        itemName: item.name,
        quantity,
        unitPrice: price,
        foodCost: item.foodCost,
        packagingCost: item.packagingCost,
      });
    }

    const itemValue = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
    const packagingCharge = channel === "direct" ? 0 : 15;
    const grossOrderValue = itemValue + packagingCharge;

    const discountJitter = 0.75 + random() * 0.5;
    const restaurantDiscount = round(grossOrderValue * profile.discountRate * discountJitter);

    const statusRoll = random();
    const status: OrderStatus =
      statusRoll > 0.985 ? "cancelled" : statusRoll > 0.965 ? "refund_pending" : "delivered";
    const refundedValue = status === "refund_pending" ? round(itemValue * 0.35) : 0;

    const serviceFee = round(grossOrderValue * profile.commissionRate);
    const gstOnServiceFee = round(serviceFee * 0.18);
    const paymentFee = round(grossOrderValue * profile.paymentFeeRate);
    const adAllocation = round(grossOrderValue * profile.adRate * (0.6 + random() * 0.8));
    const fulfilmentCost = round(grossOrderValue * profile.fulfilmentRate);
    const adjustment = status === "cancelled" ? round(grossOrderValue * 0.05) : 0;

    const qualityRoll = random();
    const dataQuality: DataQuality =
      qualityRoll > 0.94 ? "estimated" : qualityRoll > 0.985 ? "missing" : "imported";

    orders.push({
      id: `ORD-${String(index + 1).padStart(5, "0")}`,
      placedAt: placedAt.toISOString(),
      channel,
      lines,
      grossOrderValue,
      restaurantDiscount,
      refundedValue,
      deductions: {
        serviceFee,
        gstOnServiceFee,
        paymentFee,
        adAllocation,
        fulfilmentCost,
        adjustment,
        unauthorizedDeductions: 0,
      },
      tdsWithheld: 0,
      status,
      dataQuality,
    });
  });

  return orders.sort(
    (a, b) => new Date(a.placedAt).getTime() - new Date(b.placedAt).getTime(),
  );
}

export const DEMO_ORDERS: Order[] = buildOrders();

export const DEMO_SETTLEMENTS: Settlement[] = [
  {
    id: "SET-Z-0701",
    channel: "zomato",
    periodStart: "2026-07-01",
    periodEnd: "2026-07-07",
    grossPayable: 24840,
    feesAndGst: 6240,
    adsAndAdjustments: 1380,
    taxWithheld: 410,
    netPayout: 16810,
    variance: 0,
  },
  {
    id: "SET-S-0701",
    channel: "swiggy",
    periodStart: "2026-07-01",
    periodEnd: "2026-07-07",
    grossPayable: 12510,
    feesAndGst: 2630,
    adsAndAdjustments: 520,
    taxWithheld: 205,
    netPayout: 9155,
    variance: 120,
  },
  {
    id: "SET-Z-0708",
    channel: "zomato",
    periodStart: "2026-07-08",
    periodEnd: "2026-07-14",
    grossPayable: 23960,
    feesAndGst: 6010,
    adsAndAdjustments: 1525,
    taxWithheld: 395,
    netPayout: 16030,
    variance: -180,
  },
  {
    id: "SET-S-0708",
    channel: "swiggy",
    periodStart: "2026-07-08",
    periodEnd: "2026-07-14",
    grossPayable: 11890,
    feesAndGst: 2490,
    adsAndAdjustments: 480,
    taxWithheld: 198,
    netPayout: 8722,
    variance: 0,
  },
  {
    id: "SET-Z-0715",
    channel: "zomato",
    periodStart: "2026-07-15",
    periodEnd: "2026-07-21",
    grossPayable: 25310,
    feesAndGst: 6390,
    adsAndAdjustments: 1610,
    taxWithheld: 418,
    netPayout: 16892,
    variance: -240,
  },
  {
    id: "SET-S-0715",
    channel: "swiggy",
    periodStart: "2026-07-15",
    periodEnd: "2026-07-21",
    grossPayable: 13040,
    feesAndGst: 2705,
    adsAndAdjustments: 495,
    taxWithheld: 212,
    netPayout: 9628,
    variance: 95,
  },
  {
    id: "SET-Z-0722",
    channel: "zomato",
    periodStart: "2026-07-22",
    periodEnd: "2026-07-30",
    grossPayable: 27940,
    feesAndGst: 7020,
    adsAndAdjustments: 1740,
    taxWithheld: 462,
    netPayout: 18718,
    variance: -310,
  },
  {
    id: "SET-S-0722",
    channel: "swiggy",
    periodStart: "2026-07-22",
    periodEnd: "2026-07-30",
    grossPayable: 14710,
    feesAndGst: 3060,
    adsAndAdjustments: 540,
    taxWithheld: 238,
    netPayout: 10872,
    variance: 60,
  },
];