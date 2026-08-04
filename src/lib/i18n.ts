import { useMemo } from "react";

import { marketConfig, type MarketCode } from "@/data/markets";
import { CHANNEL_LABELS } from "@/data/types";
import { setActiveFormat } from "@/lib/format";
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
  "kpi.explain": "Show me how this is worked out",
  "overview.salesCaption": "{orders} orders · average bill {avg}",
  "overview.discountsCaption": "{pct} of your sales went back to customers as your own offers.",
  "overview.appsTookCaption": "{pct} of your sales — commission, tax on it, payment and ad charges.",
  "overview.foodCostCaption": "{pct} of sales — what it cost you to cook and pack these orders.",
  "overview.confidenceHint": "Numbers are {pct} from uploaded records",
  "overview.insight": "You keep {bestPct} on {best} orders but only {worstPct} on {worst}. On {worst} you spent {ads} on ads and {discounts} on your own discounts — check those before spending more there.",
  "overview.showTable": "Show the full number table",
  "overview.sampleNote": "All figures are sample data made for this prototype, not real platform data.",
  "overview.sold": "sold",
  "overview.youKept": "You kept this much",
  "overview.youKeptCaption": "Out of {sales} in sales, you kept about {per} of every {hundred} after apps, discounts and food cost. Rent, salaries and electricity still come out of this.",
  "overview.perHundred": "Money kept per {hundred}",
  "overview.perHundredCaption": "Roughly {per} out of every {hundred} of sales stays with you.",
  "overview.bestDishes": "Dishes that earn you the most",
  "overview.bestDishesCaption": "Money kept across these dates",
  "overview.weakDishes": "Dishes that leave you little",
  "overview.weakDishesCaption": "They sell, but not much stays with you",
  "overview.beforeFixed": "This is money kept before rent and salaries",
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
  "kpi.explain": "यह कैसे निकला, दिखाइए",
  "overview.salesCaption": "{orders} ऑर्डर · औसत बिल {avg}",
  "overview.discountsCaption": "आपकी बिक्री का {pct} हिस्सा आपकी अपनी छूट के रूप में ग्राहकों को वापस गया।",
  "overview.appsTookCaption": "आपकी बिक्री का {pct} — कमीशन, उस पर टैक्स, पेमेंट और विज्ञापन शुल्क।",
  "overview.foodCostCaption": "बिक्री का {pct} — इन ऑर्डर को बनाने और पैक करने की लागत।",
  "overview.confidenceHint": "{pct} आँकड़े अपलोड किए गए रिकॉर्ड से हैं",
  "overview.insight": "{best} के ऑर्डर पर आपके पास {bestPct} बचता है, पर {worst} पर सिर्फ़ {worstPct}। {worst} पर आपने {ads} विज्ञापन और {discounts} अपनी छूट पर खर्च किए — वहाँ और खर्च करने से पहले इन्हें देखें।",
  "overview.showTable": "पूरी तालिका देखें",
  "overview.sampleNote": "सभी आँकड़े इस प्रोटोटाइप के लिए बनाए गए नमूना डेटा हैं, असली प्लेटफ़ॉर्म डेटा नहीं।",
  "overview.sold": "बिके",
  "overview.youKept": "आपके पास इतना बचा",
  "overview.youKeptCaption": "{sales} की बिक्री में से, ऐप्स, छूट और खाने की लागत के बाद हर {hundred} में लगभग {per} आपके पास बचे। किराया, तनख़्वाह और बिजली इसी में से जाते हैं।",
  "overview.perHundred": "हर {hundred} में बचत",
  "overview.perHundredCaption": "बिक्री के हर {hundred} में से लगभग {per} आपके पास रहते हैं।",
  "overview.bestDishes": "सबसे ज़्यादा कमाई वाले व्यंजन",
  "overview.bestDishesCaption": "इन तारीख़ों में बचा पैसा",
  "overview.weakDishes": "कम बचत वाले व्यंजन",
  "overview.weakDishesCaption": "बिकते हैं, पर बचत कम है",
  "overview.beforeFixed": "यह किराया और तनख़्वाह से पहले बचा पैसा है",
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
  "kpi.explain": "اعرض لي كيف تم حساب ذلك",
  "overview.salesCaption": "{orders} طلب · متوسط الفاتورة {avg}",
  "overview.discountsCaption": "{pct} من مبيعاتك عاد للعملاء كخصومات تحمّلتها بنفسك.",
  "overview.appsTookCaption": "{pct} من مبيعاتك — عمولة وضريبة عليها ورسوم دفع وإعلانات.",
  "overview.foodCostCaption": "{pct} من المبيعات — تكلفة تحضير وتغليف هذه الطلبات.",
  "overview.confidenceHint": "{pct} من الأرقام مصدرها ملفات مرفوعة",
  "overview.insight": "يبقى لك {bestPct} من طلبات {best} مقابل {worstPct} فقط على {worst}. على {worst} أنفقت {ads} على الإعلانات و{discounts} على خصوماتك — راجعها قبل الإنفاق أكثر هناك.",
  "overview.showTable": "عرض الجدول الكامل",
  "overview.sampleNote": "جميع الأرقام بيانات تجريبية أُنشئت لهذا النموذج وليست بيانات منصات حقيقية.",
  "overview.sold": "مُباع",
  "overview.youKept": "هذا ما بقي لك",
  "overview.youKeptCaption": "من أصل {sales} مبيعات، بقي لك نحو {per} من كل {hundred} بعد التطبيقات والخصومات وتكلفة الطعام. الإيجار والرواتب والكهرباء تُخصم من هذا المبلغ.",
  "overview.perHundred": "المتبقي من كل {hundred}",
  "overview.perHundredCaption": "يبقى لك نحو {per} من كل {hundred} من المبيعات.",
  "overview.bestDishes": "الأطباق الأكثر ربحاً",
  "overview.bestDishesCaption": "المبلغ المتبقي خلال هذه الفترة",
  "overview.weakDishes": "أطباق تترك لك القليل",
  "overview.weakDishesCaption": "تُباع، لكن يبقى منها القليل",
  "overview.beforeFixed": "هذا ما يبقى قبل الإيجار والرواتب",
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

  // Keep currency/date formatting in sync with the active market + language.
  setActiveFormat(state.currency || market.currency, option.locale);

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
        market.channels.find((channel) => channel.code === code)?.label ??
        CHANNEL_LABELS[code as keyof typeof CHANNEL_LABELS] ??
        code,
    }),
    [language, option, available, market, update],
  );
}
