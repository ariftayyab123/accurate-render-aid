import { useCallback, useEffect, useState } from "react";

import type { LanguageCode } from "@/lib/i18n";

/**
 * The public site is English first — that is what search engines index.
 * Visitors whose system timezone sits in India or the Gulf are *offered*
 * their local language through a header toggle; nothing switches on its own.
 */
const STORAGE_KEY = "retained.site-language";

const INDIA_ZONES = ["Asia/Kolkata", "Asia/Calcutta"];
const GULF_ZONES = [
  "Asia/Dubai",
  "Asia/Muscat",
  "Asia/Riyadh",
  "Asia/Qatar",
  "Asia/Bahrain",
  "Asia/Kuwait",
];

export function localLanguageForZone(zone: string | undefined): LanguageCode | null {
  if (!zone) return null;
  if (INDIA_ZONES.includes(zone)) return "hi";
  if (GULF_ZONES.includes(zone)) return "ar";
  return null;
}

export interface SiteLanguageState {
  language: LanguageCode;
  /** The local language on offer for this visitor, if any. */
  offer: LanguageCode | null;
  setLanguage: (next: LanguageCode) => void;
  dir: "ltr" | "rtl";
}

export function useSiteLanguage(): SiteLanguageState {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [offer, setOffer] = useState<LanguageCode | null>(null);

  // Runs after hydration only, so server and first client render always match.
  useEffect(() => {
    let zone: string | undefined;
    try {
      zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      zone = undefined;
    }
    const local = localLanguageForZone(zone);
    setOffer(local);

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "hi" || stored === "ar") {
      setLanguageState(stored as LanguageCode);
      if (stored !== "en") setOffer(stored as LanguageCode);
    }
  }, []);

  const setLanguage = useCallback((next: LanguageCode) => {
    setLanguageState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage can be blocked; the choice just will not persist */
    }
  }, []);

  return { language, offer, setLanguage, dir: language === "ar" ? "rtl" : "ltr" };
}
