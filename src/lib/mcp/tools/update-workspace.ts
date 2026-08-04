import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "update_workspace",
  title: "Update restaurant workspace",
  description:
    "Update the signed-in owner's restaurant workspace details (restaurant name, city, outlet name, market, currency, sales channels).",
  inputSchema: {
    restaurant_name: z.string().trim().min(1).optional().describe("Restaurant name."),
    city: z.string().trim().min(1).optional().describe("City the outlet operates in."),
    outlet_name: z.string().trim().min(1).optional().describe("Outlet or branch name."),
    market: z.enum(["IN", "AE"]).optional().describe("Market: IN (India) or AE (UAE)."),
    currency: z.enum(["INR", "AED"]).optional().describe("Currency code."),
    channels: z
      .array(z.string().trim().min(1))
      .min(1)
      .optional()
      .describe("Sales channels, e.g. zomato, swiggy, direct, talabat, deliveroo."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const patch = Object.fromEntries(
      Object.entries(input).filter(([, value]) => value !== undefined),
    );
    if (Object.keys(patch).length === 0) {
      return { content: [{ type: "text", text: "Nothing to update." }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("workspaces")
      .update(patch)
      .eq("owner_id", ctx.getUserId())
      .select()
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) {
      return {
        content: [{ type: "text", text: "No workspace to update. Finish onboarding in the app first." }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { workspace: data },
    };
  },
});