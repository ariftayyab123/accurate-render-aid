import { useMemo } from "react";

import { marketConfig, type MarketCode } from "@/data/markets";
import { useWorkspace } from "@/lib/workspace";

export type LanguageCode = "en" | "hi" | "ar";

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  /** Native name shown in the picker. */
  native: string;
  locale: string;
  rtl?: boolean;
}

export const LANGUAGES: Record<LanguageCode, LanguageOption> = {
  en: { code: "en", label: "English", native: "English", locale: "en" },
  hi: { code: "hi", label: "Hindi", native: "हिन्दी", locale: "hi-IN" },
  ar: { code: "ar", label: "Arabic", native: "العربية", locale: "ar-AE", rtl: true },
};

/** Languages offered per market — India gets Hindi, the Gulf gets Arabic. */
export const MARKET_LANGUAGES: Record<MarketCode, LanguageCode[]> = {
  IN: ["en", "hi"],
  AE: ["en", "ar"],
};

export function languagesForMarket(market: string): LanguageOption[] {
  const codes = MARKET_LANGUAGES[(market as MarketCode) ?? "IN"] ?? MARKET_LANGUAGES.IN;
  return codes.map((code) => LANGUAGES[code]);
}

export function defaultLanguageForMarket(market: string): LanguageCode {
  return languagesForMarket(market)[0]!.code;
}

type Dict = Record<string, string>;

const en: Dict = {
  "brand.tagline": "Profit intelligence",
  "nav.overviewGroup": "Overview",
  "nav.overview": "Overview",
  "nav.dataSetup": "Data setup",
  "nav.menu": "Menu",
  "nav.mapping": "Channel mapping",
  "nav.imports": "Imports",
  "nav.analysis": "Analysis",
  "nav.orders": "Orders",
  "nav.menuProfitability": "Menu profitability",
  "nav.expenses": "Expenses",
  "nav.reports": "Reports",
  "nav.advisorGroup": "Advisor",
  "nav.advisor": "Ask Profit Advisor",
  "nav.workspaceGroup": "Workspace",
  "nav.restaurant": "Restaurant",
  "nav.soon": "Soon",

  "top.yourRestaurant": "Your restaurant",
  "top.outlet": "Outlet",
  "top.city": "City",
  "top.fromUploads": "from uploads",
  "top.upload": "Upload",
  "top.signOut": "Sign out",
  "top.demoSession": "Demo session",
  "top.language": "Language",
  "top.uploadsSoon": "Imports arrive in the next phase",
  "top.uploadsSoonBody": "Order and settlement uploads are not part of this prototype build.",

  "range.pickDates": "Pick dates",
  "range.ownDates": "Choose your own dates",
  "range.available": "Data available",
  "range.from": "From",
  "range.to": "To",
  "range.reset": "Reset to last 30 days",
  "range.last": "Last",
  "range.days": "days",

  "overview.title": "Your money",
  "overview.subtitle": "{orders} orders over {days} days · every number can be opened up",
  "overview.totalSales": "Total sales",
  "overview.discounts": "Discounts you paid for",
  "overview.appsTook": "What the apps took",
  "overview.foodCost": "Food and packing cost",
  "overview.ordersFrom": "Where your orders came from",
  "overview.keepRate": "How much of every 100 you keep on each app",
  "overview.seeOrders": "See all orders",
  "overview.worthALook": "Worth a look:",
  "overview.orders": "orders",
  "overview.sales": "sales",
  "overview.kept": "kept",
};

const hi: Dict = {
  "brand.tagline": "मुनाफ़ा जानकारी",
  "nav.overviewGroup": "सारांश",
  "nav.overview": "सारांश",
  "nav.dataSetup": "डेटा सेटअप",
  "nav.menu": "मेन्यू",
  "nav.mapping": "चैनल मैपिंग",
  "nav.imports": "अपलोड",
  "nav.analysis": "विश्लेषण",
  "nav.orders": "ऑर्डर",
  "nav.menuProfitability": "मेन्यू मुनाफ़ा",
  "nav.expenses": "खर्चे",
  "nav.reports": "रिपोर्ट",
  "nav.advisorGroup": "सलाहकार",
  "nav.advisor": "प्रॉफ़िट सलाहकार से पूछें",
  "nav.workspaceGroup": "वर्कस्पेस",
  "nav.restaurant": "रेस्टोरेंट",
  "nav.soon": "जल्द",

  "top.yourRestaurant": "आपका रेस्टोरेंट",
  "top.outlet": "आउटलेट",
  "top.city": "शहर",
  "top.fromUploads": "अपलोड से",
  "top.upload": "अपलोड",
  "top.signOut": "साइन आउट",
  "top.demoSession": "डेमो सेशन",
  "top.language": "भाषा",
  "top.uploadsSoon": "अपलोड अगले चरण में आएगा",
  "top.uploadsSoonBody": "ऑर्डर और सेटलमेंट अपलोड अभी इस प्रोटोटाइप में नहीं हैं।",

  "range.pickDates": "तारीख़ चुनें",
  "range.ownDates": "अपनी तारीख़ चुनें",
  "range.available": "डेटा उपलब्ध",
  "range.from": "से",
  "range.to": "तक",
  "range.reset": "पिछले 30 दिन पर लौटें",
  "range.last": "पिछले",
  "range.days": "दिन",

  "overview.title": "आपका पैसा",
  "overview.subtitle": "{days} दिनों में {orders} ऑर्डर · हर आँकड़ा खोलकर देखा जा सकता है",
  "overview.totalSales": "कुल बिक्री",
  "overview.discounts": "आपने जो छूट दी",
  "overview.appsTook": "ऐप्स ने कितना काटा",
  "overview.foodCost": "खाना और पैकिंग लागत",
  "overview.ordersFrom": "ऑर्डर कहाँ से आए",
  "overview.keepRate": "हर 100 में से हर ऐप पर आपके पास कितना बचता है",
  "overview.seeOrders": "सभी ऑर्डर देखें",
  "overview.worthALook": "ध्यान दें:",
  "overview.orders": "ऑर्डर",
  "overview.sales": "बिक्री",
  "overview.kept": "बचा",
};

const ar: Dict = {
  "brand.tagline": "ذكاء الأرباح",
  "nav.overviewGroup": "نظرة عامة",
  "nav.overview": "نظرة عامة",
  "nav.dataSetup": "إعداد البيانات",
  "nav.menu": "القائمة",
  "nav.mapping": "ربط القنوات",
  "nav.imports": "الاستيراد",
  "nav.analysis": "التحليل",
  "nav.orders": "الطلبات",
  "nav.menuProfitability": "ربحية القائمة",
  "nav.expenses": "المصروفات",
  "nav.reports": "التقارير",
  "nav.advisorGroup": "المستشار",
  "nav.advisor": "اسأل مستشار الأرباح",
  "nav.workspaceGroup": "مساحة العمل",
  "nav.restaurant": "المطعم",
  "nav.soon": "قريباً",

  "top.yourRestaurant": "مطعمك",
  "top.outlet": "الفرع",
  "top.city": "المدينة",
  "top.fromUploads": "من الملفات المرفوعة",
  "top.upload": "رفع",
  "top.signOut": "تسجيل الخروج",
  "top.demoSession": "جلسة تجريبية",
  "top.language": "اللغة",
  "top.uploadsSoon": "الرفع سيتوفر في المرحلة القادمة",
  "top.uploadsSoonBody": "رفع الطلبات والتسويات غير متاح في هذه النسخة التجريبية.",

  "range.pickDates": "اختر التواريخ",
  "range.ownDates": "اختر تواريخك",
  "range.available": "البيانات متاحة",
  "range.from": "من",
  "range.to": "إلى",
  "range.reset": "العودة إلى آخر 30 يوماً",
  "range.last": "آخر",
  "range.days": "يوم",

  "overview.title": "أموالك",
  "overview.subtitle": "{orders} طلباً خلال {days} يوماً · كل رقم يمكن فتحه وشرحه",
  "overview.totalSales": "إجمالي المبيعات",
  "overview.discounts": "الخصومات التي تحملتها",
  "overview.appsTook": "ما أخذته التطبيقات",
  "overview.foodCost": "تكلفة الطعام والتغليف",
  "overview.ordersFrom": "من أين جاءت طلباتك",
  "overview.keepRate": "كم يبقى لك من كل 100 على كل تطبيق",
  "overview.seeOrders": "عرض كل الطلبات",
  "overview.worthALook": "يستحق الانتباه:",
  "overview.orders": "طلب",
  "overview.sales": "مبيعات",
  "overview.kept": "متبقٍ لك",
};

const DICTS: Record<LanguageCode, Dict> = { en, hi, ar };

export function translate(
  language: LanguageCode,
  key: string,
  vars?: Record<string, string | number>,
) {
  const value = DICTS[language]?.[key] ?? en[key] ?? key;
  if (!vars) return value;
  return value.replace(/\{(\w+)\}/g, (_match, name: string) => String(vars[name] ?? ""));
}

/** Active language, translator and market-aware formatting for the signed-in workspace. */
export function useI18n() {
  const { state, update } = useWorkspace();
  const market = marketConfig(state.market);
  const available = languagesForMarket(state.market);
  const language = available.some((option) => option.code === state.language)
    ? (state.language as LanguageCode)
    : available[0]!.code;
  const option = LANGUAGES[language];

  return useMemo(
    () => ({
      language,
      option,
      available,
      market,
      dir: option.rtl ? ("rtl" as const) : ("ltr" as const),
      setLanguage: (next: LanguageCode) => update({ language: next }),
      t: (key: string, vars?: Record<string, string | number>) => translate(language, key, vars),
      /** Channel display name for the active market (brand names are never translated). */
      channelLabel: (code: string) =>
        market.channels.find((channel) => channel.code === code)?.label ?? code,
    }),
    [language, option, available, market, update],
  );
}
