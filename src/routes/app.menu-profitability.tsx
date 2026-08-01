import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { summariseByItem, type ItemSummary } from "@/lib/metrics";
import { cn } from "@/lib/utils";
import { useDataset } from "@/lib/workspace";

export const Route = createFileRoute("/app/menu-profitability")({
  head: () => ({
    meta: [
      { title: "Menu profitability — Retained" },
      {
        name: "description",
        content:
          "Units sold, allocated deductions and contribution per dish, plus a menu-engineering matrix of stars and weak performers.",
      },
      { property: "og:title", content: "Menu profitability — Retained" },
      {
        property: "og:description",
        content: "Find the popular dish with a weak margin before your next menu print.",
      },
    ],
  }),
  component: MenuProfitability,
});

type SortKey = "contribution" | "margin" | "unitsSold" | "sales";

const QUADRANTS = [
  {
    key: "stars",
    title: "Stars",
    caption: "High volume · high contribution",
    action: "Protect availability and keep pricing steady.",
  },
  {
    key: "popular-weak",
    title: "Popular but weak",
    caption: "High volume · low contribution",
    action: "Reprice, resize portions or cut channel discounts.",
  },
  {
    key: "opportunities",
    title: "Opportunities",
    caption: "Low volume · high contribution",
    action: "Promote these before spending on ads elsewhere.",
  },
  {
    key: "review",
    title: "Review",
    caption: "Low volume · low contribution",
    action: "Consider removing from the channel menus.",
  },
] as const;

function MenuProfitability() {
  const orders = useDataset();
  const [sortKey, setSortKey] = useState<SortKey>("contribution");

  const items = useMemo(
    () => summariseByItem(orders).filter((row) => row.unitsSold > 0),
    [orders],
  );

  const sorted = useMemo(() => {
    const copy = [...items];
    if (sortKey === "margin") return copy.sort((a, b) => a.margin - b.margin);
    if (sortKey === "unitsSold") return copy.sort((a, b) => b.unitsSold - a.unitsSold);
    if (sortKey === "sales") return copy.sort((a, b) => b.sales - a.sales);
    return copy.sort((a, b) => b.contribution - a.contribution);
  }, [items, sortKey]);

  const medianUnits = median(items.map((row) => row.unitsSold));
  const medianContribution = median(items.map((row) => row.contribution));

  const quadrantOf = (row: ItemSummary) => {
    const high = row.unitsSold >= medianUnits;
    const strong = row.contribution >= medianContribution;
    if (high && strong) return "stars";
    if (high && !strong) return "popular-weak";
    if (!high && strong) return "opportunities";
    return "review";
  };

  if (!items.length) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="text-xl font-semibold tracking-tight">No item sales in this period</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Load the synthetic demo dataset to see dish-level contribution.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 sm:px-6">
      <h1 className="text-lg font-semibold tracking-tight">Menu profitability</h1>
      <p className="text-xs text-muted-foreground">
        Order-level deductions and discounts are allocated to each dish in proportion to its share
        of order value.
      </p>

      <Tabs defaultValue="table" className="mt-4">
        <TabsList>
          <TabsTrigger value="table">Item table</TabsTrigger>
          <TabsTrigger value="matrix">Menu engineering</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {(
              [
                ["contribution", "Highest contribution"],
                ["margin", "Weakest margin"],
                ["unitsSold", "Most units"],
                ["sales", "Highest sales"],
              ] as [SortKey, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSortKey(key)}
                className={cn(
                  "rounded-md border px-2.5 py-1 text-xs transition-colors",
                  sortKey === key
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-border text-muted-foreground hover:bg-accent/40",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Units</TableHead>
                    <TableHead>Channel prices</TableHead>
                    <TableHead className="text-right">Sales</TableHead>
                    <TableHead className="text-right">Food + packaging</TableHead>
                    <TableHead className="text-right">Allocated deductions</TableHead>
                    <TableHead className="text-right">Contribution</TableHead>
                    <TableHead className="text-right">Per unit</TableHead>
                    <TableHead className="text-right">Margin</TableHead>
                    <TableHead>Mapping</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.map((row) => (
                    <TableRow key={row.item.id}>
                      <TableCell className="font-medium">{row.item.name}</TableCell>
                      <TableCell className="text-muted-foreground">{row.item.category}</TableCell>
                      <TableCell className="text-right">{row.unitsSold}</TableCell>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {row.item.listings
                          .map(
                            (listing) =>
                              `${CHANNEL_LABELS[listing.channel]} ${formatCurrency(listing.price)}`,
                          )
                          .join(" · ")}
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(row.sales)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(row.foodCost)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(row.deductions)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(row.contribution)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(row.contributionPerUnit)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-medium",
                          row.margin < 0.12 ? "text-warning" : undefined,
                        )}
                      >
                        {formatPercent(row.margin)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={row.item.mappingStatus === "mapped" ? "outline" : "secondary"}
                          className="font-normal capitalize"
                        >
                          {row.item.mappingStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="matrix">
          <div className="grid gap-4 lg:grid-cols-2">
            {QUADRANTS.map((quadrant) => {
              const members = items.filter((row) => quadrantOf(row) === quadrant.key);
              return (
                <div
                  key={quadrant.key}
                  className="overflow-hidden rounded-lg border border-border bg-card"
                >
                  <div className="border-b border-border px-4 py-3">
                    <h2 className="text-sm font-semibold">{quadrant.title}</h2>
                    <p className="text-xs text-muted-foreground">{quadrant.caption}</p>
                  </div>
                  <ul className="divide-y divide-border">
                    {members.length ? (
                      members.map((row) => (
                        <li
                          key={row.item.id}
                          className="flex items-center justify-between gap-4 px-4 py-2.5"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{row.item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {row.unitsSold} units · {formatCurrency(row.contribution)} retained
                            </p>
                          </div>
                          <span className="shrink-0 text-sm tabular">
                            {formatPercent(row.margin)}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-3 text-xs text-muted-foreground">
                        No dishes in this quadrant.
                      </li>
                    )}
                  </ul>
                  <p className="border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
                    {quadrant.action}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Quadrants split at the median units sold and median contribution for the active period.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function median(values: number[]) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2
    : (sorted[middle] ?? 0);
}