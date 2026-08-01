import { createFileRoute } from "@tanstack/react-router";

import { ComingSoon } from "@/components/app/coming-soon";

export const Route = createFileRoute("/app/menu")({
  head: () => ({
    meta: [
      { title: "Menu builder — Retained" },
      {
        name: "description",
        content: "Manual menu entry and CSV menu import arrive in the next prototype phase.",
      },
      { property: "og:title", content: "Menu builder — Retained" },
      { property: "og:description", content: "Item costs and channel prices, coming next." },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Menu builder"
      description="Manual item entry, recipe costs and CSV menu import are planned for the next build. The demo menu already powers every cost figure you see."
    />
  ),
});