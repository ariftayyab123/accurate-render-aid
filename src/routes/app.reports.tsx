import { createFileRoute } from "@tanstack/react-router";

import { ComingSoon } from "@/components/app/coming-soon";

export const Route = createFileRoute("/app/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Retained" },
      {
        name: "description",
        content: "Owner summary, channel comparison and settlement exception reports come next.",
      },
      { property: "og:title", content: "Reports — Retained" },
      { property: "og:description", content: "Shareable monthly summaries, coming next." },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Reports"
      description="Owner summary, channel comparison, item profitability and settlement exception reports are planned for the next build."
    />
  ),
});