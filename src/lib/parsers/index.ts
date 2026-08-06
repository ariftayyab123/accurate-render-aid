import type { Order, Settlement, SettlementOverrides } from "@/data/types";

export { errorMessage } from "./base";

/**
 * Detects the channel from the file name and parses it with the matching
 * settlement parser. Parsers are loaded lazily so the CSV code stays out of
 * the initial bundle.
 */
export async function parseSettlementFile(
  file: File,
  overrides?: SettlementOverrides
): Promise<{ orders: Order[]; settlement: Settlement }> {
  const text = await file.text();

  if (file.name.toLowerCase().includes("swiggy")) {
    const { parseSwiggySettlement } = await import("./swiggy");
    return parseSwiggySettlement(text, overrides);
  }

  const { parseZomatoSettlement } = await import("./zomato");
  return parseZomatoSettlement(text, overrides);
}
