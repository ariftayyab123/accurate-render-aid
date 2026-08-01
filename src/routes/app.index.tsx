import { createFileRoute, Link } from "@tanstack/react-router";
import { Lightbulb } from "lucide-react";

import { DateRangeFilter } from "@/components/app/date-range-filter";
import { KpiCard } from "@/components/app/kpi-card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CHANNEL_LABELS } from "@/data/types";
import { formatCurrency, formatPercent } from "@/lib/format";
import { dataConfidence, summarise, summariseByChannel, summariseByItem } from "@/lib/metrics";
import { rangeDays, rangeLabel, useDataset, useWorkspace } from "@/lib/workspace";

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
  const days = rangeDays(state);
  const perHundred = totals.revenueBasis
    ? Math.round((totals.contribution / totals.revenueBasis) * 100)
    : 0;

  const ranked = [...channels].sort((a, b) => b.margin - a.margin);
  const best = ranked[0];
  const worst = ranked[ranked.length - 1];

  const strongest = [...items].sort((a, b) => b.contribution - a.contribution).slice(0, 3);
  const weakest = [...items].sort((a, b) => a.margin - b.margin).slice(0, 3);

  const header = (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Your money · {rangeLabel(state)}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {totals.orders} orders over {days} days · every number can be opened up
        </p>
      </div>
      <DateRangeFilter />
    </div>
  );

  if (!orders.length) {
    return (
      <div className="px-4 py-6 sm:px-6">
        {header}
        <div className="mt-8 rounded-xl border border-border bg-card px-6 py-16 text-center">
          <h2 className="text-lg font-semibold tracking-tight">No orders in these dates</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Try a wider date range, or load the demo dataset from the sign-in screen. Order and
            settlement uploads arrive in the next phase.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6">
      {header}

      <section className="mt-6 grid gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <KpiCard
            size="hero"
            label="You kept this much"
            value={formatCurrency(totals.contribution)}
            tone="positive"
            caption={`Out of ${formatCurrency(totals.grossOrderValue)} in sales, you kept about ₹${perHundred} of every ₹100 after apps, discounts and food cost. Rent, salaries and electricity still come out of this.`}
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
        </div>
        <KpiCard
          label="Money kept per ₹100"
          value={formatPercent(totals.margin)}
          caption={`Roughly ₹${perHundred} out of every ₹100 of sales stays with you.`}
          hint={`Numbers are ${formatPercent(confidence, 0)} from uploaded records`}
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

      <section className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total sales"
          value={formatCurrency(totals.grossOrderValue)}
          caption={`${totals.orders} orders · average bill ${formatCurrency(totals.averageOrderValue)}`}
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
          label="Discounts you paid for"
          value={formatCurrency(totals.restaurantDiscounts)}
          caption={`${formatPercent(totals.restaurantDiscounts / totals.grossOrderValue)} of your sales went back to customers as your own offers.`}
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
          label="What the apps took"
          value={formatCurrency(totals.platformDeductions)}
          caption={`${formatPercent(totals.platformDeductions / totals.revenueBasis)} of your sales — commission, GST on it, payment and ad charges.`}
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
          label="Food and packing cost"
          value={formatCurrency(totals.foodAndPackaging)}
          caption={`${formatPercent(totals.foodAndPackaging / totals.revenueBasis)} of sales — what it cost you to cook and pack these orders.`}
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
      </section>

      {best && worst && best.channel !== worst.channel ? (
        <section className="mt-3 flex gap-3 rounded-xl border border-border bg-accent px-5 py-4">
          <Lightbulb className="mt-0.5 size-5 shrink-0 text-primary" />
          <p className="text-sm leading-relaxed">
            <span className="font-semibold">Worth a look: </span>
            You keep {formatPercent(best.margin)} on {CHANNEL_LABELS[best.channel]} orders but only{" "}
            {formatPercent(worst.margin)} on {CHANNEL_LABELS[worst.channel]}. On{" "}
            {CHANNEL_LABELS[worst.channel]} you spent{" "}
            {formatCurrency(worst.deductionBreakdown.adAllocation)} on ads and{" "}
            {formatCurrency(worst.restaurantDiscounts)} on your own discounts — check those before
            spending more there.
          </p>
        </section>
      ) : null}

      <section className="mt-3 rounded-xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-semibold">Where your orders came from</h2>
            <p className="text-xs text-muted-foreground">
              How much of every ₹100 you keep on each app
            </p>
          </div>
          <Link to="/app/orders" className="text-sm font-medium text-primary hover:underline">
            See all orders
          </Link>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
          {channels.map((row) => (
            <div key={row.channel} className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-medium">{CHANNEL_LABELS[row.channel]}</p>
                <p className="display text-xl font-semibold tabular">{formatPercent(row.margin)}</p>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.max(2, Math.min(100, row.margin * 100))}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {row.orders} orders · {formatCurrency(row.grossOrderValue)} sales ·{" "}
                <span className="font-medium text-foreground">
                  {formatCurrency(row.contribution)} kept
                </span>
              </p>
            </div>
          ))}
        </div>

        <Collapsible>
          <CollapsibleTrigger className="w-full border-t border-border px-5 py-3 text-left text-sm font-medium text-primary hover:underline">
            Show the full number table
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="overflow-x-auto border-t border-border">
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
          </CollapsibleContent>
        </Collapsible>
      </section>

      <section className="mt-3 grid gap-3 lg:grid-cols-2">
        <ContributorList
          title="Dishes that earn you the most"
          caption="Money kept across these dates"
          rows={strongest.map((row) => ({
            name: row.item.name,
            primary: formatCurrency(row.contribution),
            secondary: `${row.unitsSold} sold · keeps ${formatPercent(row.margin)}`,
          }))}
        />
        <ContributorList
          title="Dishes that leave you little"
          caption="They sell, but not much stays with you"
          rows={weakest.map((row) => ({
            name: row.item.name,
            primary: formatPercent(row.margin),
            secondary: `${row.unitsSold} sold · ${formatCurrency(row.contribution)} kept`,
          }))}
        />
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="font-normal">
          This is money kept before rent and salaries
        </Badge>
        <p className="text-xs text-muted-foreground">
          All figures are sample data made for this prototype, not real Zomato or Swiggy data.
        </p>
      </div>
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
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">{caption}</p>
      </div>
      <ul className="divide-y divide-border">
        {rows.map((row) => (
          <li key={row.name} className="flex items-center justify-between gap-4 px-5 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{row.name}</p>
              <p className="truncate text-xs text-muted-foreground">{row.secondary}</p>
            </div>
            <span className="display shrink-0 text-base font-semibold tabular">{row.primary}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}