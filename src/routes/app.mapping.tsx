import { createFileRoute } from "@tanstack/react-router";

import { ComingSoon } from "@/components/app/coming-soon";

export const Route = createFileRoute("/app/mapping")({
  head: () => ({
    meta: [
      { title: "Channel mapping — Retained" },
      {
        name: "description",
        content: "Matching channel listings to master menu items arrives in the next phase.",
      },
      { property: "og:title", content: "Channel mapping — Retained" },
      { property: "og:description", content: "Connect Zomato and Swiggy listings to master items." },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Channel mapping"
      description="Match suggestions and manual overrides between channel listings and master items are planned next. Demo items are already mapped."
    />
  ),
});