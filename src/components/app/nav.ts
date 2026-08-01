import {
  BarChart3,
  Building2,
  FileSpreadsheet,
  LayoutDashboard,
  ListOrdered,
  MessageSquareText,
  Receipt,
  Shuffle,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: typeof LayoutDashboard;
  soon?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [{ title: "Overview", url: "/app", icon: LayoutDashboard }],
  },
  {
    label: "Data setup",
    items: [
      { title: "Menu", url: "/app/menu", icon: UtensilsCrossed, soon: true },
      { title: "Channel mapping", url: "/app/mapping", icon: Shuffle, soon: true },
      { title: "Imports", url: "/app/imports", icon: FileSpreadsheet, soon: true },
    ],
  },
  {
    label: "Analysis",
    items: [
      { title: "Orders", url: "/app/orders", icon: ListOrdered },
      { title: "Menu profitability", url: "/app/menu-profitability", icon: BarChart3 },
      { title: "Expenses", url: "/app/expenses", icon: Wallet, soon: true },
      { title: "Reports", url: "/app/reports", icon: Receipt, soon: true },
    ],
  },
  {
    label: "Advisor",
    items: [
      { title: "Ask Profit Advisor", url: "/app/advisor", icon: MessageSquareText, soon: true },
    ],
  },
  {
    label: "Workspace",
    items: [{ title: "Restaurant", url: "/app/workspace", icon: Building2, soon: true }],
  },
];