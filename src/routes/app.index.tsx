import { createFileRoute, Link } from "@tanstack/react-router";
import { Lightbulb } from "lucide-react";

import { KpiCard } from "@/components/app/kpi-card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ANALYSIS_PERIOD } from "@/data/orders";
import { CHANNEL_LABELS } from "@/data/types";
import { formatCurrency, formatPercent } from "@/lib/format";
import { dataConfidence, summarise, summariseByChannel, summariseByItem } from "@/lib/metrics";
import { useDataset, useWorkspace } from "@/lib/workspace";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Overview — Retained" },
      {
        name: "description",
        content:
          "Gross order value, platform deductions and estimated contribution for the selected period and channels.",
      },
      { property: "og:title", content: "Overview — Retained" },
      {
        property: "og:description",
        content: "Channel contribution margin at a glance, with every figure explained.",
      },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { state } = useWorkspace();
  const orders = useDataset();
  const totals = summarise(orders);
  const channels = summariseByChannel(orders, state.channels).filter((row) => row.orders > 0);
  const items = summariseByItem(orders).filter((row) => row.unitsSold > 0);
  const confidence = dataConfidence(orders);

  const ranked = [...channels].sort((a, b) => b.margin - a.margin);
  const best = ranked[0];
  const worst = ranked[ranked.length - 1];

  const strongest = [...items].sort((a, b) => b.contribution - a.contribution).slice(0, 3);
  const weakest = [...items].sort((a, b) => a.margin - b.margin).slice(0, 3);

  if (!orders.length) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="text-xl font-semibold tracking-tight">No data in this workspace yet</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This workspace was started empty. Order and settlement imports arrive in the next phase —
          until then you can load the synthetic demo dataset from the sign-in screen.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">What did you retain?</h1>
          <p className="text-xs text-muted-foreground">
            {ANALYSIS_PERIOD.label} · {totals.orders} orders · synthetic dataset
          </p>
        </div>
        <Badge variant="outline" className="font-normal">
          Contribution, not net profit
        </Badge>
      </div>

      <section className="mt-5 grid overflow-hidden rounded-lg border border-border bg-card md:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          label="Gross order value"
          value={formatCurrency(totals.grossOrderValue)}
          hint={`AOV ${formatCurrency(totals.averageOrderValue)}`}
          formula="Item selling value + customer-facing packaging charge + other merchant charges"
          rows={[
            { label: "Orders in period", value: String(totals.orders), source: "Imported" },
            {
              label: "Item selling value",
              value: formatCurrency(totals.grossOrderValue - totals.orders * 15),
            },
            { label: "Packaging and merchant charges", value: formatCurrency(totals.orders * 15) },
            {
              label: "Gross order value",
              value: formatCurrency(totals.grossOrderValue),
              emphasis: true,
            },
          ]}
        />
        <KpiCard
          label="Restaurant-funded discounts"
          value={formatCurrency(totals.restaurantDiscounts)}
          hint={formatPercent(totals.restaurantDiscounts / totals.grossOrderValue)}
          tone="negative"
          formula="Discounts you funded, plus refunded item value, removed from gross order value"
          rows={[
            {
              label: "Restaurant-funded discounts",
              value: formatCurrency(totals.restaurantDiscounts),
              source: "Imported",
            },
            {
              label: "Refunded item value",
              value: formatCurrency(totals.refunds),
              source: "Imported",
            },
            { label: "Revenue basis", value: formatCurrency(totals.revenueBasis), emphasis: true },
          ]}
        />
        <KpiCard
          label="Platform deductions"
          value={formatCurrency(totals.platformDeductions)}
          hint={formatPercent(totals.platformDeductions / totals.revenueBasis)}
          tone="negative"
          formula="Service fee + GST on platform services + payment fee + ad allocation + fulfilment + adjustments"
          rows={[
            {
              label: "Service fee / commission",
              value: formatCurrency(totals.deductionBreakdown.serviceFee),
            },
            {
              label: "GST on platform services",
              value: formatCurrency(totals.deductionBreakdown.gstOnServiceFee),
            },
            {
              label: "Payment mechanism fee",
              value: formatCurrency(totals.deductionBreakdown.paymentFee),
            },
            { label: "Ad allocation", value: formatCurrency(totals.deductionBreakdown.adAllocation) },
            {
              label: "Own delivery / fulfilment",
              value: formatCurrency(totals.deductionBreakdown.fulfilmentCost),
            },
            {
              label: "Cancellation adjustments",
              value: formatCurrency(totals.deductionBreakdown.adjustment),
            },
            {
              label: "Total deductions",
              value: formatCurrency(totals.platformDeductions),
              emphasis: true,
            },
          ]}
          note="TDS and TCS are tracked in the settlement view and never reduce contribution here."
        />
        <KpiCard
          label="Food and packaging"
          value={formatCurrency(totals.foodAndPackaging)}
          hint={formatPercent(totals.foodAndPackaging / totals.revenueBasis)}
          formula="Sum of item food cost and packaging cost across all order lines"
          rows={[
            { label: "Recipe cost basis", value: "Menu master", source: "Manual" },
            {
              label: "Food and packaging cost",
              value: formatCurrency(totals.foodAndPackaging),
              emphasis: true,
            },
          ]}
          note="Costs come from the menu master, so they are estimates rather than measured consumption."
        />
        <KpiCard
          label="Estimated contribution"
          value={formatCurrency(totals.contribution)}
          hint="Before fixed expenses"
          tone="positive"
          formula="Revenue basis − platform deduction − food and packaging cost"
          rows={[
            { label: "Revenue basis", value: formatCurrency(totals.revenueBasis) },
            {
              label: "Platform deductions",
              value: `− ${formatCurrency(totals.platformDeductions)}`,
            },
            { label: "Food and packaging", value: `− ${formatCurrency(totals.foodAndPackaging)}` },
            {
              label: "Estimated contribution",
              value: formatCurrency(totals.contribution),
              emphasis: true,
            },
          ]}
          note="Fixed expenses such as rent and salaries are not deducted, so this is not net profit."
        />
        <KpiCard
          label="Contribution margin"
          value={formatPercent(totals.margin)}
          hint={`Data confidence ${formatPercent(confidence, 0)}`}
          tone="positive"
          formula="Estimated contribution ÷ revenue basis"
          rows={[
            { label: "Estimated contribution", value: formatCurrency(totals.contribution) },
            { label: "Revenue basis", value: formatCurrency(totals.revenueBasis) },
            { label: "Contribution margin", value: formatPercent(totals.margin), emphasis: true },
            {
              label: "Orders sourced from imports",
              value: formatPercent(confidence, 0),
              source: "Imported",
            },
          ]}
        />
      </section>

      {best && worst && best.channel !== worst.channel ? (
        <section className="mt-5 flex gap-3 rounded-lg border border-border bg-accent/40 px-4 py-3">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="text-sm leading-relaxed">
            {CHANNEL_LABELS[best.channel]} retained {formatPercent(best.margin)} of its revenue
            basis against {CHANNEL_LABELS[worst.channel]}&apos;s {formatPercent(worst.margin)}, on{" "}
            {best.orders} orders versus {worst.orders}. Review {CHANNEL_LABELS[worst.channel]} ad
            allocation ({formatCurrency(worst.deductionBreakdown.adAllocation)}) and
            restaurant-funded discounts ({formatCurrency(worst.restaurantDiscounts)}) before
            increasing spend there.
          </p>
        </section>
      ) : null}

      <section className="mt-5 overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">Channel comparison</h2>
          <Link to="/app/orders" className="text-xs text-primary hover:underline">
            Open orders
          </Link>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Channel</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Gross order value</TableHead>
                <TableHead className="text-right">AOV</TableHead>
                <TableHead className="text-right">Discounts</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Food + packaging</TableHead>
                <TableHead className="text-right">Contribution</TableHead>
                <TableHead className="text-right">Margin</TableHead>
                <TableHead className="text-right">Settlement variance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channels.map((row) => (
                <TableRow key={row.channel}>
                  <TableCell className="font-medium">{CHANNEL_LABELS[row.channel]}</TableCell>
                  <TableCell className="text-right">{row.orders}</TableCell>
                  <TableCell className="text-right">{formatCurrency(row.grossOrderValue)}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.averageOrderValue)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.restaurantDiscounts)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.platformDeductions)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.foodAndPackaging)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(row.contribution)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPercent(row.margin)}
                  </TableCell>
                  <TableCell
                    className={
                      row.settlementVariance < 0
                        ? "text-right text-negative"
                        : "text-right text-muted-foreground"
                    }
                  >
                    {formatCurrency(row.settlementVariance)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-secondary/60">
                <TableCell className="font-semibold">Total</TableCell>
                <TableCell className="text-right font-semibold">{totals.orders}</TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(totals.grossOrderValue)}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(totals.averageOrderValue)}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(totals.restaurantDiscounts)}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(totals.platformDeductions)}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(totals.foodAndPackaging)}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(totals.contribution)}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatPercent(totals.margin)}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(channels.reduce((sum, row) => sum + row.settlementVariance, 0))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-2">
        <ContributorList
          title="Largest contributors"
          caption="Money retained across the period"
          rows={strongest.map((row) => ({
            name: row.item.name,
            primary: formatCurrency(row.contribution),
            secondary: `${row.unitsSold} units · ${formatPercent(row.margin)} margin`,
          }))}
        />
        <ContributorList
          title="Weakest margins"
          caption="Sold well, retained little"
          rows={weakest.map((row) => ({
            name: row.item.name,
            primary: formatPercent(row.margin),
            secondary: `${row.unitsSold} units · ${formatCurrency(row.contribution)} retained`,
          }))}
        />
      </section>

      <p className="mt-6 text-xs text-muted-foreground">
        All figures are synthetic test fixtures generated for this prototype, not real Zomato,
        Swiggy or market data.
      </p>
    </div>
  );
}

function ContributorList({
  title,
  caption,
  rows,
}: {
  title: string;
  caption: string;
  rows: { name: string; primary: string; secondary: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">{caption}</p>
      </div>
      <ul className="divide-y divide-border">
        {rows.map((row) => (
          <li key={row.name} className="flex items-center justify-between gap-4 px-4 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{row.name}</p>
              <p className="truncate text-xs text-muted-foreground">{row.secondary}</p>
            </div>
            <span className="shrink-0 text-sm font-semibold tabular">{row.primary}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}