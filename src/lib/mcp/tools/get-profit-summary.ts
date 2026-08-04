import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { DEMO_ORDERS } from "@/data/orders";
import { channelBreakdown, totalsFor } from "@/lib/metrics";

export default defineTool({
  name: "get_profit_summary",
  title: "Get profit summary",
  description:
    "Summarise sales, platform deductions, food and packaging cost and what the restaurant kept, for the last N days of the demo dataset, with a per-channel breakdown.",
  inputSchema: {
    days: z.number().int().min(1).max(30).default(30).describe("How many recent days to include."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ days }) => {
    const end = Math.max(...DEMO_ORDERS.map((order) => new Date(order.placedAt).getTime()));
    const from = end - days * 24 * 60 * 60 * 1000;
    const orders = DEMO_ORDERS.filter((order) => new Date(order.placedAt).getTime() >= from);
    const totals = totalsFor(orders);
    const channels = channelBreakdown(orders).map((row) => ({
      channel: row.channel,
      orders: row.orders,
      sales: Math.round(row.grossOrderValue),
      kept: Math.round(row.contribution),
      keepRate: Number((row.margin * 100).toFixed(1)),
    }));
    const summary = {
      days,
      orders: totals.orders,
      sales: Math.round(totals.grossOrderValue),
      platformDeductions: Math.round(totals.platformDeductions),
      foodAndPackaging: Math.round(totals.foodAndPackaging),
      kept: Math.round(totals.contribution),
      keepRate: Number((totals.margin * 100).toFixed(1)),
      channels,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(summary) }],
      structuredContent: summary,
    };
  },
});