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
  /** i18n key, falls back to `title` when untranslated. */
  key: string;
  title: string;
  url: string;
  icon: typeof LayoutDashboard;
  soon?: boolean;
}

export interface NavGroup {
  key: string;
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    key: "nav.overviewGroup",
    label: "Overview",
    items: [{ key: "nav.overview", title: "Overview", url: "/app", icon: LayoutDashboard }],
  },
  {
    key: "nav.dataSetup",
    label: "Data setup",
    items: [
      { key: "nav.menu", title: "Menu", url: "/app/menu", icon: UtensilsCrossed, soon: true },
      { key: "nav.mapping", title: "Channel mapping", url: "/app/mapping", icon: Shuffle, soon: true },
      { key: "nav.imports", title: "Imports", url: "/app/imports", icon: FileSpreadsheet, soon: true },
    ],
  },
  {
    key: "nav.analysis",
    label: "Analysis",
    items: [
      { key: "nav.orders", title: "Orders", url: "/app/orders", icon: ListOrdered },
      { key: "nav.menuProfitability", title: "Menu profitability", url: "/app/menu-profitability", icon: BarChart3 },
      { key: "nav.expenses", title: "Expenses", url: "/app/expenses", icon: Wallet, soon: true },
      { key: "nav.reports", title: "Reports", url: "/app/reports", icon: Receipt, soon: true },
    ],
  },
  {
    key: "nav.advisorGroup",
    label: "Advisor",
    items: [
      { key: "nav.advisor", title: "Ask Profit Advisor", url: "/app/advisor", icon: MessageSquareText, soon: true },
    ],
  },
  {
    key: "nav.workspaceGroup",
    label: "Workspace",
    items: [{ key: "nav.restaurant", title: "Restaurant", url: "/app/workspace", icon: Building2, soon: true }],
  },
];