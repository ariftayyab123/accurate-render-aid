import { createFileRoute } from "@tanstack/react-router";

import { ComingSoon } from "@/components/app/coming-soon";

export const Route = createFileRoute("/app/expenses")({
  head: () => ({
    meta: [
      { title: "Expenses — Retained" },
      {
        name: "description",
        content: "Fixed and variable expense capture arrives in the next prototype phase.",
      },
      { property: "og:title", content: "Expenses — Retained" },
      { property: "og:description", content: "Rent, salaries and utilities for operating result." },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Expenses"
      description="Recurring and one-off expense capture feeds the estimated outlet operating result. It is planned for the next build, so today's figures stop at contribution."
    />
  ),
});