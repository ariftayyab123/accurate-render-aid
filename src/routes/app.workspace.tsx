import { createFileRoute } from "@tanstack/react-router";

import { ComingSoon } from "@/components/app/coming-soon";

export const Route = createFileRoute("/app/workspace")({
  head: () => ({
    meta: [
      { title: "Workspace settings — Retained" },
      {
        name: "description",
        content: "Restaurant, outlets, branding and team settings arrive in the next phase.",
      },
      { property: "og:title", content: "Workspace settings — Retained" },
      { property: "og:description", content: "White-label branding and team access, coming next." },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Workspace settings"
      description="Restaurant details, additional outlets, white-label branding and team access are planned for the next build."
    />
  ),
});