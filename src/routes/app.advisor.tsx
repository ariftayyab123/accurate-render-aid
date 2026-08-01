import { createFileRoute } from "@tanstack/react-router";

import { ComingSoon } from "@/components/app/coming-soon";

export const Route = createFileRoute("/app/advisor")({
  head: () => ({
    meta: [
      { title: "Profit Advisor — Retained" },
      {
        name: "description",
        content: "A deterministic question-and-answer advisor over your calculated figures.",
      },
      { property: "og:title", content: "Profit Advisor — Retained" },
      { property: "og:description", content: "Answers with evidence, action and confidence." },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Ask Profit Advisor"
      description="The advisor will answer from the same calculated figures shown on your dashboard, always with evidence and a recommended action. It never calculates money on its own."
    />
  ),
});