import { createFileRoute } from "@tanstack/react-router";

import { ComingSoon } from "@/components/app/coming-soon";

export const Route = createFileRoute("/app/imports")({
  head: () => ({
    meta: [
      { title: "Imports — Retained" },
      {
        name: "description",
        content: "Order and settlement file uploads with column mapping arrive in the next phase.",
      },
      { property: "og:title", content: "Imports — Retained" },
      { property: "og:description", content: "CSV and XLSX import with validation, coming next." },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Imports and data quality"
      description="Order and settlement uploads, column mapping, validation and the exception queue are planned for the next build."
    />
  ),
});