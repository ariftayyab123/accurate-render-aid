## Goal

Build the "core money loop" of the Restaurant Profit Intelligence workspace as a frontend-only prototype: a user can create a demo account, set up a restaurant, load synthetic 30-day data, and immediately see how much money was retained per channel, per order and per dish.

## Scope of this build

```text
Landing / sign-up (mock)
→ Onboarding wizard (restaurant, outlet, channels, demo-data load)
→ App shell (sidebar + top bar with outlet/period/confidence)
→ Overview dashboard
→ Orders explorer + calculation drawer
→ Menu profitability table + menu-engineering matrix
```

Deferred to a later pass (nav entries present, marked "Coming soon"): CSV/XLSX imports, channel mapping editor, expenses ledger, reports, AI advisor, branding, team.

## Screens

**Landing + auth (`/`)** — white-label branded entry, product promise, mock sign-up/login. No real auth; a local session flag. Two paths: "Start setup" and "Load demo restaurant" (Uday Foods, Shastri Nagar Meerut) which skips straight to a populated dashboard.

**Onboarding wizard (`/onboarding`)** — four steps with progress and resumable local state: restaurant profile, outlet, channel selection (Zomato / Swiggy / Direct / POS / Other), data source choice (demo dataset vs. empty workspace). Selected channels drive what later screens show.

**App shell** — ~232px sidebar grouped as Overview / Data Setup / Analysis / Advisor / Workspace, with Data Setup visually separated. Top bar: restaurant, outlet, analysis period (30-day default + custom range), data-confidence chip, upload shortcut, account menu.

**Overview (`/app`)** — first row exactly: gross order value, restaurant-funded discounts, platform deductions, estimated contribution, contribution margin, data confidence. Every KPI opens a calculation drawer showing the formula, inputs and source labels (imported / estimated / manual / missing). Below: channel comparison table (orders, GOV, AOV, discounts, deductions, food+packaging, contribution, margin, settlement variance), one deterministic insight card, top/weak contributors list. No "net profit" wording anywhere.

**Orders (`/app/orders`)** — dense table with search, channel/status/date filters and sorting: order ID, datetime, channel, order value, discount, platform deductions, food+packaging, contribution, margin, status, data quality. Row click opens a right drawer breaking deductions into service fee, GST on fee, payment fee, ad allocation, adjustments, then the full contribution walk.

**Menu profitability (`/app/menu-profitability`)** — table tab (item, category, units sold, channel prices, sales, avg food cost, avg deductions, contribution, contribution per item, margin, mapping status) plus a menu-engineering matrix tab (Stars / Popular but weak / Opportunities / Review).

## Data + calculations

- Typed fixtures in `src/data/`: restaurant, outlet, 8–12 master items with channel listings and prices, ~431 synthetic orders across Jul 1–30 2026 with order lines, generated deterministically from a seeded generator so channel totals land near Zomato 262 orders / 18.7% margin, Swiggy 135 / 24.8%, Direct 34 / 38.2%, overall ~22.0%. Sample rows from the spec are used verbatim as anchors.
- A single metrics module implements the dictionary: gross order value, restaurant revenue basis, platform deduction, estimated order contribution, contribution margin. TDS/TCS tracked separately and never subtracted from contribution.
- Everything labelled synthetic in the UI. Persistence via localStorage (onboarding state, session, active outlet/period).

## Design

Financial-operations look, not AI dashboard: warm-white base, near-black text, subtle gray borders and dividers, single deep-green accent used only for active nav, primary actions and focus. Compact table rows, 6–10px radii, minimal shadow, tabular numerals. No gradients, glassmorphism, purple-blue palette, oversized KPI type or sparkle icons. All colors as semantic tokens in `src/styles.css`.

## Technical notes

- TanStack Start file routes; `src/routes/index.tsx` becomes the landing page, authenticated screens under a shared layout route rendering the shell.
- shadcn components for table, drawer/sheet, tabs, dialog, select, form; Recharts only where a chart carries a decision.
- No backend, no API keys, no Gemini call — advisor stays out of this pass.
- Per-route `head()` metadata with app-specific titles and descriptions.
