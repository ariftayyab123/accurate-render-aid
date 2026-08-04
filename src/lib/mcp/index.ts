import { auth, defineMcp } from "@lovable.dev/mcp-js";

type McpTools = Parameters<typeof defineMcp>[0]["tools"];

import getProfitSummary from "./tools/get-profit-summary";
import getWorkspace from "./tools/get-workspace";
import updateWorkspace from "./tools/update-workspace";

const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "pixel-perfect-replica",
  title: "Pixel Perfect Replica",
  version: "0.1.0",
  instructions:
    "Tools for Retained, a restaurant profit intelligence app. Use `get_workspace` to read the owner's restaurant setup, `update_workspace` to change it, and `get_profit_summary` for sales, platform deductions and what the restaurant kept per channel.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [getWorkspace, updateWorkspace, getProfitSummary] as unknown as McpTools,
});