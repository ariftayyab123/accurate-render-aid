import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownUp, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CHANNEL_LABELS, QUALITY_LABELS, STATUS_LABELS, type Order } from "@/data/types";
import { formatCurrency, formatDateTime, formatPercent } from "@/lib/format";
import {
  contributionMargin,
  foodAndPackagingCost,
  orderContribution,
  platformDeduction,
  revenueBasis,
} from "@/lib/metrics";
import { cn } from "@/lib/utils";
import { useDataset, useWorkspace } from "@/lib/workspace";

export const Route = createFileRoute("/app/orders")({
  head: () => ({
    meta: [
      { title: "Orders explorer — Retained" },
      {
        name: "description",
        content:
          "Trace any order from gross value through discounts, platform deductions and food cost to the contribution it left behind.",
      },
      { property: "og:title", content: "Orders explorer — Retained" },
      {
        property: "og:description",
        content: "Order-level economics with a full deduction breakdown for every order.",
      },
    ],
  }),
  component: OrdersPage,
});

type SortKey = "placedAt" | "grossOrderValue" | "contribution" | "margin";

function OrdersPage() {
  const { state } = useWorkspace();
  const orders = useDataset();
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState("all");
  const [status, setStatus] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("placedAt");
  const [selected, setSelected] = useState<Order | null>(null);

  const rows = useMemo(() => {
    const filtered = orders.filter((order) => {
      if (channel !== "all" && order.channel !== channel) return false;
      if (status !== "all" && order.status !== status) return false;
      if (!query.trim()) return true;
      const needle = query.trim().toLowerCase();
      return (
        order.id.toLowerCase().includes(needle) ||
        order.lines.some((line) => line.itemName.toLowerCase().includes(needle))
      );
    });

    const decorated = filtered.map((order) => {
      const basis = revenueBasis(order);
      const contribution = orderContribution(order);
      return {
        order,
        basis,
        deductions: platformDeduction(order),
        cost: foodAndPackagingCost(order),
        contribution,
        margin: contributionMargin(contribution, basis),
      };
    });

    return decorated.sort((a, b) => {
      if (sortKey === "placedAt") {
        return new Date(b.order.placedAt).getTime() - new Date(a.order.placedAt).getTime();
      }
      if (sortKey === "grossOrderValue") return b.order.grossOrderValue - a.order.grossOrderValue;
      if (sortKey === "contribution") return b.contribution - a.contribution;
      return a.margin - b.margin;
    });
  }, [orders, query, channel, status, sortKey]);

  return (
    <div className="px-4 py-5 sm:px-6">
      <h1 className="text-lg font-semibold tracking-tight">Orders</h1>
      <p className="text-xs text-muted-foreground">
        {rows.length} of {orders.length} orders in the active period. Select a row to see the full
        calculation.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search order ID or dish"
            className="pl-8"
          />
        </div>
        <Select value={channel} onValueChange={setChannel}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All channels</SelectItem>
            {state.channels.map((code) => (
              <SelectItem key={code} value={code}>
                {CHANNEL_LABELS[code]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="refund_pending">Refund adjustment pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortKey} onValueChange={(value) => setSortKey(value as SortKey)}>
          <SelectTrigger className="w-52">
            <ArrowDownUp className="size-3.5" />
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="placedAt">Newest first</SelectItem>
            <SelectItem value="grossOrderValue">Largest order value</SelectItem>
            <SelectItem value="contribution">Highest contribution</SelectItem>
            <SelectItem value="margin">Weakest margin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-border bg-card">
        <div className="max-h-[calc(100vh-16rem)] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-card">
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Placed</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead className="text-right">Order value</TableHead>
                <TableHead className="text-right">Discount</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Food + packaging</TableHead>
                <TableHead className="text-right">Contribution</TableHead>
                <TableHead className="text-right">Margin</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.order.id}
                  onClick={() => setSelected(row.order)}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium">{row.order.id}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatDateTime(row.order.placedAt)}
                  </TableCell>
                  <TableCell>{CHANNEL_LABELS[row.order.channel]}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.order.grossOrderValue)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.order.restaurantDiscount)}
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(row.deductions)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(row.cost)}</TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-medium",
                      row.contribution < 0 && "text-negative",
                    )}
                  >
                    {formatCurrency(row.contribution)}
                  </TableCell>
                  <TableCell
                    className={cn("text-right", row.margin < 0.1 ? "text-warning" : undefined)}
                  >
                    {formatPercent(row.margin)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {STATUS_LABELS[row.order.status]}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {QUALITY_LABELS[row.order.dataQuality]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <OrderDrawer order={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function OrderDrawer({ order, onClose }: { order: Order | null; onClose: () => void }) {
  return (
    <Sheet open={Boolean(order)} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        {order ? <OrderDetail order={order} /> : null}
      </SheetContent>
    </Sheet>
  );
}

function OrderDetail({ order }: { order: Order }) {
  const basis = revenueBasis(order);
  const deductions = platformDeduction(order);
  const cost = foodAndPackagingCost(order);
  const contribution = orderContribution(order);
  const d = order.deductions;

  return (
    <>
      <SheetHeader>
        <SheetTitle>{order.id}</SheetTitle>
        <SheetDescription>
          {CHANNEL_LABELS[order.channel]} · {formatDateTime(order.placedAt)} ·{" "}
          {STATUS_LABELS[order.status]}
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-6 px-4 pb-8">
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Items
          </h3>
          <ul className="mt-2 divide-y divide-border border-y border-border">
            {order.lines.map((line) => (
              <li key={line.itemId} className="flex items-center justify-between gap-3 py-2">
                <span className="text-sm">
                  {line.quantity} × {line.itemName}
                  <span className="ml-2 text-xs text-muted-foreground">
                    cost {formatCurrency(line.foodCost + line.packagingCost)}
                  </span>
                </span>
                <span className="text-sm tabular">
                  {formatCurrency(line.unitPrice * line.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Platform deductions
          </h3>
          <Row label="Service fee / commission" value={formatCurrency(d.serviceFee)} />
          <Row label="GST on platform services" value={formatCurrency(d.gstOnServiceFee)} />
          <Row label="Payment mechanism fee" value={formatCurrency(d.paymentFee)} />
          <Row label="Ad allocation" value={formatCurrency(d.adAllocation)} />
          <Row label="Own delivery / fulfilment" value={formatCurrency(d.fulfilmentCost)} />
          <Row label="Cancellation or SLA adjustment" value={formatCurrency(d.adjustment)} />
          <Row label="Total deductions" value={formatCurrency(deductions)} emphasis />
        </section>

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Contribution walk
          </h3>
          <Row label="Gross order value" value={formatCurrency(order.grossOrderValue)} />
          <Row
            label="Restaurant-funded discount"
            value={`− ${formatCurrency(order.restaurantDiscount)}`}
          />
          <Row label="Refunded item value" value={`− ${formatCurrency(order.refundedValue)}`} />
          <Row label="Revenue basis" value={formatCurrency(basis)} emphasis />
          <Row label="Platform deductions" value={`− ${formatCurrency(deductions)}`} />
          <Row label="Food and packaging cost" value={`− ${formatCurrency(cost)}`} />
          <Row label="Estimated contribution" value={formatCurrency(contribution)} emphasis />
          <Row
            label="Contribution margin"
            value={formatPercent(contributionMargin(contribution, basis))}
            emphasis
          />
        </section>

        <p className="text-xs text-muted-foreground">
          Data quality: {QUALITY_LABELS[order.dataQuality]}. Food cost comes from the menu master,
          so contribution is an estimate and excludes fixed operating expenses.
        </p>
      </div>
    </>
  );
}

function Row({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 border-b border-border py-2 text-sm",
        emphasis && "font-semibold",
      )}
    >
      <span className={emphasis ? undefined : "text-muted-foreground"}>{label}</span>
      <span className="tabular">{value}</span>
    </div>
  );
}