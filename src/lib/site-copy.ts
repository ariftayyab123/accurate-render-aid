import type { LanguageCode } from "@/lib/i18n";

export interface SiteCopy {
  nav: { signIn: string; demo: string; create: string; readIn: string };
  hero: {
    eyebrow: string;
    titleBefore: string;
    titleAfter: string;
    lead: string;
    primary: string;
    secondary: string;
    trust: string;
    cardTitle: string;
    cardNote: string;
    sold: string;
    kept: string;
    ofSales: string;
  };
  gap: {
    title: string;
    lead: string;
    items: { term: string; body: string }[];
    note: string;
  };
  positioning: {
    title: string;
    lead: string;
    rules: { title: string; body: string }[];
  };
  recon: {
    title: string;
    lead: string;
    expected: string;
    paid: string;
    gap: string;
    gapNote: string;
    flowTitle: string;
    labels: Record<string, string>;
    note: string;
  };
  features: { title: string; lead: string; items: { title: string; body: string }[] };
  audience: { title: string; lead: string; rows: { who: string; ask: string }[]; note: string };
  market: {
    title: string;
    india: { title: string; body: string };
    uae: { title: string; body: string };
  };
  faq: { title: string; lead: string; items: { q: string; a: string }[] };
  cta: { title: string; lead: string; primary: string; secondary: string; note: string };
  footer: string;
}

const en: SiteCopy = {
  nav: { signIn: "Sign in", demo: "See the demo", create: "Create account", readIn: "Read in" },
  hero: {
    eyebrow: "For restaurants and cloud kitchens in India and the UAE",
    titleBefore: "You sold",
    titleAfter: "last month. How much did you actually keep?",
    lead: "Zomato and Swiggy show you sales. Your bank shows you a settlement. Nobody shows you what happened in between — commission, GST on that commission, ad spend, discounts you didn't approve, packaging, food cost. Retained does.",
    primary: "Show me what I kept",
    secondary: "See it work on a real example",
    trust:
      "No credit card. Uses your own settlement file — nothing invented, nothing estimated without telling you.",
    cardTitle: "A real month from the demo kitchen",
    cardNote: "Sample data built for this prototype, not live platform data.",
    sold: "You sold",
    kept: "You kept",
    ofSales: "of sales stayed with the kitchen",
  },
  gap: {
    title: "The number on your dashboard was never the number in your bank",
    lead: "Every restaurant owner selling on Zomato or Swiggy knows this feeling: the app says you did great this month. The bank account disagrees. Somewhere between gross sales and settlement received is a pile of PDFs nobody has time to read line by line.",
    items: [
      { term: "Commission", body: "15–30% depending on your plan, city and category." },
      { term: "GST on that commission", body: "18%, charged on top of the commission itself." },
      { term: "Payment gateway and platform fees", body: "A few percent, on every order." },
      { term: "Ad spend", body: "Sometimes approved, sometimes not." },
      {
        term: "Discounts",
        body: "Funded by the platform, or funded by you — and it is not always clear which.",
      },
      {
        term: "TDS",
        body: "0.1% of order value withheld before you are paid, but yours to claim back at filing. Not a real cost.",
      },
    ],
    note: "Most owners just watch the total and hope it is roughly right. It usually isn't.",
  },
  positioning: {
    title: "Not a POS. Not accounting software. Not another AI dashboard.",
    lead: "Retained reads your actual Zomato and Swiggy settlement file and shows you, order by order, exactly where every rupee went — and whether any of it shouldn't have.",
    rules: [
      {
        title: "Money before activity",
        body: "Every screen leads with what you kept, not how many orders you got. Order count doesn't pay your rent.",
      },
      {
        title: "Every number opens up",
        body: "Click any figure and see exactly what it is built from — no black box, no trust us.",
      },
      {
        title: "We never say Net Profit",
        body: "Rent, salaries and utilities aren't in this calculation, and pretending otherwise would be dishonest. We call it Estimated Contribution, and we tell you when a figure is imported straight from your statement versus estimated.",
      },
    ],
  },
  recon: {
    title: "Upload one settlement file. See what matched — and what didn't.",
    lead: "Within minutes of uploading a real Zomato or Swiggy settlement report, Retained shows what your payout should have been, what the platform actually paid, and any gap — down to the line item. If a deduction can't be explained, it is flagged on your dashboard in plain language, not buried in a PDF.",
    expected: "What your payout should have been",
    paid: "What the platform actually paid",
    gap: "Unexplained deductions, flagged",
    gapNote: "A portion of ad charges with no matching campaign on record in the demo month.",
    flowTitle: "Where the money actually went",
    labels: {
      sales: "What customers paid",
      commission: "App commission",
      platformFee: "Fixed platform fee per order",
      taxOnFees: "GST on that commission",
      payment: "Payment charges",
      packaging: "Packaging deducted back",
      membership: "Membership discount you funded",
      ads: "Ads charged to you",
      unmatchedAds: "Ads with no matching campaign ⚠",
      discounts: "Discounts you funded",
      food: "Food and packing",
      tds: "Income-tax withheld (0.1%) — a tax credit, not a platform cost",
      kept: "What you kept",
    },
    note: "One month, 431 orders of sample data. This is money kept before rent, salaries and electricity — we never call it net profit.",
  },
  features: {
    title: "From what happened to what to do about it",
    lead: "Five screens, one question each.",
    items: [
      {
        title: "Overview",
        body: "One screen, your real numbers: money kept, channel-by-channel keep-rate, and what changed since last period.",
      },
      {
        title: "Order-level drill-down",
        body: "Pick any order. See its full economics — commission, fees, discounts, food cost — traced from gross sale to what actually landed in your account.",
      },
      {
        title: "Menu profitability",
        body: "Not every popular dish is a good dish. See which items are quietly losing you money on every plate, and which ones deserve more attention than they're getting.",
      },
      {
        title: "Channel comparison",
        body: "Zomato or Swiggy — which one is actually worth pushing this month? Not by sales volume. By what you keep.",
      },
      {
        title: "One recommendation, not a hundred metrics",
        body: "Every period, Retained gives you one clear, actionable call — a channel to push, a dish to reprice, a deduction to dispute.",
      },
    ],
  },
  audience: {
    title: "Who this is for",
    lead: "Four owners, four questions, one dataset.",
    rows: [
      { who: "Single-outlet owner", ask: "Which app is actually worth pushing this month?" },
      { who: "Cloud-kitchen operator", ask: "Which of my dishes is quietly bleeding money?" },
      { who: "Multi-outlet owner", ask: "Which outlet's channel mix is wrong?" },
      {
        who: "Manager or accountant",
        ask: "Did the platform actually pay what it said it would?",
      },
    ],
    note: "Retained answers all four from the same data.",
  },
  market: {
    title: "Built for your market",
    india: {
      title: "India",
      body: "Built for Indian restaurant accounting — GST on commission handled correctly, income tax withheld by the apps tracked separately as the tax credit it is, not folded into your losses.",
    },
    uae: {
      title: "UAE",
      body: "Built for the UAE market — AED, VAT-aware, and Talabat, Careem, Deliveroo and Noon in one view.",
    },
  },
  faq: {
    title: "Questions restaurant owners ask us",
    lead: "Short, honest answers.",
    items: [
      {
        q: "How much commission do Zomato and Swiggy actually take?",
        a: "Headline commission (15–30%) is only part of it. After GST on commission, payment gateway fees, ad spend and discount funding, the real deduction is often 8–12 percentage points higher than the number in your contract. Retained calculates your actual rate from your own settlement data, not an industry average.",
      },
      {
        q: "Why is my Zomato/Swiggy payout smaller than expected?",
        a: "Usually one or more of: GST on the platform's commission, promotional discount co-funding, ad charges, refund adjustments, or income tax withheld by the platform. Retained breaks down every deduction on every order so you can see exactly which one.",
      },
      {
        q: "Does my restaurant have to pay GST on Zomato/Swiggy orders?",
        a: "No — since January 2022, the platform is liable for GST on the order itself under Section 9(5) of the CGST Act. You only pay GST on the commission fee the platform charges you. Retained applies this correctly by default.",
      },
      {
        q: "Can Zomato or Swiggy deduct ad spend or discounts without my approval?",
        a: "It happens more than most owners realise, and it is often only visible after the fact in the settlement statement. This is exactly what Retained's reconciliation flags.",
      },
      {
        q: "Is this an accounting tool?",
        a: "No. We show you where your money went so you can make better decisions about pricing, channels and the menu. We're not a substitute for your accountant, and we don't file anything for you.",
      },
    ],
  },
  cta: {
    title: "Fifteen minutes. One settlement file. A real answer.",
    lead: "You don't need to guess anymore. Upload one file, and see exactly what you kept — and what you didn't.",
    primary: "Show me what I kept",
    secondary: "Explore with sample data",
    note: "No commitment. No card. Skip to explore with sample data if you'd rather look around first.",
  },
  footer:
    " · Contribution and margin are estimates based on the data you supply. Retained never labels them as net profit.",
};

const hi: SiteCopy = {
  nav: { signIn: "साइन इन", demo: "डेमो देखें", create: "खाता बनाएँ", readIn: "पढ़ें" },
  hero: {
    eyebrow: "भारत और यूएई के रेस्टोरेंट और क्लाउड किचन के लिए",
    titleBefore: "पिछले महीने आपने बेचा",
    titleAfter: "। असल में आपके पास बचा कितना?",
    lead: "ज़ोमैटो और स्विगी आपको बिक्री दिखाते हैं। बैंक आपको सेटलमेंट दिखाता है। बीच में क्या हुआ — कमीशन, उस पर GST, विज्ञापन, वे छूट जिन्हें आपने मंज़ूरी नहीं दी, पैकिंग, खाने की लागत — वह कोई नहीं दिखाता। Retained दिखाता है।",
    primary: "दिखाइए मेरे पास क्या बचा",
    secondary: "असली उदाहरण पर चलकर देखिए",
    trust:
      "कोई कार्ड नहीं। आपकी अपनी सेटलमेंट फ़ाइल से — कुछ भी गढ़ा नहीं जाता, और अनुमान हो तो बता दिया जाता है।",
    cardTitle: "डेमो किचन का एक पूरा महीना",
    cardNote: "यह प्रोटोटाइप के लिए बनाया गया नमूना डेटा है, असली प्लेटफ़ॉर्म डेटा नहीं।",
    sold: "आपने बेचा",
    kept: "आपके पास बचा",
    ofSales: "बिक्री का हिस्सा किचन के पास रहा",
  },
  gap: {
    title: "डैशबोर्ड का आँकड़ा कभी बैंक का आँकड़ा नहीं था",
    lead: "हर मालिक यह महसूस करता है: ऐप कहता है महीना शानदार गया, बैंक खाता कुछ और कहता है। ग्रॉस बिक्री और मिले हुए सेटलमेंट के बीच PDF का ढेर है, जिसे लाइन दर लाइन पढ़ने का वक़्त किसी के पास नहीं।",
    items: [
      { term: "कमीशन", body: "प्लान, शहर और श्रेणी के हिसाब से 15–30%।" },
      { term: "उस कमीशन पर GST", body: "18%, कमीशन के ऊपर से।" },
      { term: "पेमेंट गेटवे और प्लेटफ़ॉर्म फ़ीस", body: "हर ऑर्डर पर कुछ प्रतिशत।" },
      { term: "विज्ञापन खर्च", body: "कभी मंज़ूर किया हुआ, कभी नहीं।" },
      {
        term: "छूट",
        body: "प्लेटफ़ॉर्म की तरफ़ से या आपकी तरफ़ से — और यह हमेशा साफ़ नहीं होता कि किसकी।",
      },
      {
        term: "TDS",
        body: "ऑर्डर वैल्यू का 0.1% भुगतान से पहले काटा जाता है, पर फ़ाइलिंग में वापस मिलने वाला क्रेडिट है। यह लागत नहीं है।",
      },
    ],
    note: "ज़्यादातर मालिक बस कुल आँकड़ा देखकर मान लेते हैं कि सब ठीक होगा। अक्सर नहीं होता।",
  },
  positioning: {
    title: "न POS, न अकाउंटिंग सॉफ़्टवेयर, न एक और AI डैशबोर्ड।",
    lead: "Retained आपकी असली ज़ोमैटो और स्विगी सेटलमेंट फ़ाइल पढ़ता है और ऑर्डर दर ऑर्डर दिखाता है कि हर रुपया कहाँ गया — और कहीं वह जाना नहीं चाहिए था तो वह भी।",
    rules: [
      {
        title: "गतिविधि से पहले पैसा",
        body: "हर स्क्रीन पहले बताती है कि आपके पास क्या बचा, यह नहीं कि कितने ऑर्डर आए। ऑर्डर की गिनती किराया नहीं भरती।",
      },
      {
        title: "हर आँकड़ा खुलता है",
        body: "किसी भी आँकड़े पर क्लिक कीजिए और देखिए वह किन लाइनों से बना — कोई ब्लैक बॉक्स नहीं।",
      },
      {
        title: "हम कभी नेट प्रॉफ़िट नहीं कहते",
        body: "किराया, तनख़्वाह और बिजली इस हिसाब में नहीं हैं, और इसे मुनाफ़ा कहना बेईमानी होगी। हम इसे अनुमानित कॉन्ट्रिब्यूशन कहते हैं, और बताते हैं कि कोई आँकड़ा स्टेटमेंट से आया है या अनुमान है।",
      },
    ],
  },
  recon: {
    title: "एक सेटलमेंट फ़ाइल अपलोड कीजिए। देखिए क्या मिला और क्या नहीं।",
    lead: "असली सेटलमेंट रिपोर्ट अपलोड करने के मिनटों में Retained बताता है कि आपका पेआउट कितना होना चाहिए था, प्लेटफ़ॉर्म ने असल में कितना दिया, और अंतर किस लाइन आइटम से आया। जो कटौती समझ में न आए उसे साफ़ भाषा में फ़्लैग किया जाता है — PDF में दबाकर नहीं।",
    expected: "आपका पेआउट कितना होना चाहिए था",
    paid: "प्लेटफ़ॉर्म ने असल में दिया",
    gap: "बिना कारण की कटौती, फ़्लैग की गई",
    gapNote: "डेमो महीने में कुछ विज्ञापन चार्ज जिनका कोई मेल खाता कैंपेन रिकॉर्ड में नहीं है।",
    flowTitle: "पैसा असल में गया कहाँ",
    labels: {
      sales: "ग्राहक ने जो चुकाया",
      commission: "ऐप कमीशन",
      platformFee: "हर ऑर्डर पर फिक्स्ड प्लेटफ़ॉर्म फ़ीस",
      taxOnFees: "उस कमीशन पर GST",
      payment: "पेमेंट चार्ज",
      packaging: "वापस काटा गया पैकेजिंग चार्ज",
      membership: "मेंबरशिप छूट जो आपने दी",
      ads: "आप पर लगे विज्ञापन चार्ज",
      unmatchedAds: "बिना कैंपेन के विज्ञापन चार्ज ⚠",
      discounts: "आपकी दी हुई छूट",
      food: "खाना और पैकिंग",
      tds: "आयकर रोका गया (0.1%) — टैक्स क्रेडिट, प्लैटफ़ॉर्म का ख़र्च नहीं",
      kept: "आपके पास बचा",
    },
    note: "एक महीना, 431 ऑर्डर का नमूना डेटा। यह किराया, तनख़्वाह और बिजली से पहले का पैसा है — हम इसे कभी नेट प्रॉफ़िट नहीं कहते।",
  },
  features: {
    title: "क्या हुआ से लेकर अब करना क्या है तक",
    lead: "पाँच स्क्रीन, हर एक का एक सवाल।",
    items: [
      {
        title: "ओवरव्यू",
        body: "एक ही स्क्रीन पर आपके असली आँकड़े: कितना बचा, हर चैनल की कीप-रेट, और पिछली अवधि से क्या बदला।",
      },
      {
        title: "ऑर्डर-स्तर का ब्यौरा",
        body: "कोई भी ऑर्डर चुनिए और उसका पूरा हिसाब देखिए — कमीशन, फ़ीस, छूट, खाने की लागत — बिक्री से लेकर खाते में आए पैसे तक।",
      },
      {
        title: "मेन्यू प्रॉफ़िटेबिलिटी",
        body: "हर लोकप्रिय डिश अच्छी डिश नहीं होती। देखिए कौन-सा आइटम हर प्लेट पर चुपचाप नुक़सान करा रहा है।",
      },
      {
        title: "चैनल तुलना",
        body: "ज़ोमैटो या स्विगी — इस महीने किस पर ज़ोर देना सही है? बिक्री से नहीं, बचत से।",
      },
      {
        title: "सौ आँकड़े नहीं, एक सलाह",
        body: "हर अवधि में Retained एक साफ़ काम बताता है — कौन-सा चैनल बढ़ाएँ, कौन-सी डिश की क़ीमत बदलें, किस कटौती पर सवाल उठाएँ।",
      },
    ],
  },
  audience: {
    title: "यह किसके लिए है",
    lead: "चार तरह के मालिक, चार सवाल, एक ही डेटा।",
    rows: [
      { who: "एक आउटलेट के मालिक", ask: "इस महीने किस ऐप पर ज़ोर देना सही है?" },
      { who: "क्लाउड किचन ऑपरेटर", ask: "मेरी कौन-सी डिश चुपचाप पैसा खा रही है?" },
      { who: "कई आउटलेट के मालिक", ask: "किस आउटलेट का चैनल मिक्स ग़लत है?" },
      { who: "मैनेजर या अकाउंटेंट", ask: "क्या प्लेटफ़ॉर्म ने वही दिया जो कहा था?" },
    ],
    note: "Retained चारों जवाब एक ही डेटा से देता है।",
  },
  market: {
    title: "आपके बाज़ार के लिए बना",
    india: {
      title: "भारत",
      body: "भारतीय रेस्टोरेंट अकाउंटिंग के हिसाब से — कमीशन पर GST सही तरीक़े से, और ऐप्स द्वारा रोका गया आयकर अलग से टैक्स क्रेडिट की तरह, नुक़सान में जोड़े बिना।",
    },
    uae: {
      title: "यूएई",
      body: "यूएई बाज़ार के लिए — दिरहम, VAT का ध्यान, और तलाबात, करीम, डेलीवरू तथा नून एक ही जगह।",
    },
  },
  faq: {
    title: "रेस्टोरेंट मालिकों के आम सवाल",
    lead: "छोटे और सीधे जवाब।",
    items: [
      {
        q: "ज़ोमैटो और स्विगी असल में कितना कमीशन लेते हैं?",
        a: "कॉन्ट्रैक्ट का कमीशन (15–30%) पूरी कहानी नहीं है। कमीशन पर GST, पेमेंट गेटवे फ़ीस, विज्ञापन और छूट जोड़ने के बाद असली कटौती अक्सर 8–12 प्रतिशत अंक ज़्यादा निकलती है। Retained आपकी अपनी सेटलमेंट फ़ाइल से आपकी असली दर निकालता है।",
      },
      {
        q: "मेरा पेआउट उम्मीद से कम क्यों आया?",
        a: "आमतौर पर इनमें से कोई: कमीशन पर GST, प्रोमो छूट में आपका हिस्सा, विज्ञापन चार्ज, रिफ़ंड एडजस्टमेंट, या प्लैटफ़ॉर्म द्वारा रोका गया आयकर। Retained हर ऑर्डर की हर कटौती अलग-अलग दिखाता है।",
      },
      {
        q: "क्या ज़ोमैटो/स्विगी ऑर्डर पर मुझे GST देना होता है?",
        a: "नहीं। जनवरी 2022 से CGST एक्ट की धारा 9(5) के तहत ऑर्डर पर GST की ज़िम्मेदारी प्लेटफ़ॉर्म की है। आप केवल प्लेटफ़ॉर्म की कमीशन फ़ीस पर GST देते हैं। Retained यह डिफ़ॉल्ट रूप से सही लगाता है।",
      },
      {
        q: "क्या प्लेटफ़ॉर्म बिना मंज़ूरी विज्ञापन या छूट काट सकते हैं?",
        a: "यह जितना लगता है उससे ज़्यादा होता है, और अक्सर बाद में सेटलमेंट स्टेटमेंट में ही दिखता है। Retained का रिकंसिलिएशन ठीक यही फ़्लैग करता है।",
      },
      {
        q: "क्या यह अकाउंटिंग टूल है?",
        a: "नहीं। हम दिखाते हैं कि पैसा कहाँ गया ताकि आप क़ीमत, चैनल और मेन्यू पर बेहतर फ़ैसले ले सकें। यह आपके अकाउंटेंट का विकल्प नहीं है और हम कोई फ़ाइलिंग नहीं करते।",
      },
    ],
  },
  cta: {
    title: "पंद्रह मिनट। एक सेटलमेंट फ़ाइल। एक सच्चा जवाब।",
    lead: "अब अंदाज़ा लगाने की ज़रूरत नहीं। एक फ़ाइल अपलोड कीजिए और देखिए क्या बचा — और क्या नहीं।",
    primary: "दिखाइए मेरे पास क्या बचा",
    secondary: "नमूना डेटा से देखिए",
    note: "कोई शर्त नहीं, कोई कार्ड नहीं। चाहें तो पहले नमूना डेटा में घूम लीजिए।",
  },
  footer:
    " · कॉन्ट्रिब्यूशन और मार्जिन आपके दिए डेटा पर आधारित अनुमान हैं। Retained इन्हें कभी नेट प्रॉफ़िट नहीं कहता।",
};

const ar: SiteCopy = {
  nav: { signIn: "تسجيل الدخول", demo: "شاهد العرض", create: "إنشاء حساب", readIn: "اقرأ بـ" },
  hero: {
    eyebrow: "للمطاعم والمطابخ السحابية في الإمارات والهند",
    titleBefore: "بِعتَ الشهر الماضي",
    titleAfter: "— فكم بقي لك فعلاً؟",
    lead: "تُظهر لك التطبيقات المبيعات، ويُظهر لك البنك التسوية. أما ما حدث بينهما — العمولة والضريبة عليها والإعلانات وخصومات لم توافق عليها والتغليف وتكلفة الطعام — فلا يُظهره أحد. Retained يفعل.",
    primary: "أرني ما بقي لي",
    secondary: "شاهدها على مثال حقيقي",
    trust: "بدون بطاقة. من ملف التسوية الخاص بك — لا شيء مُختلق، وأي تقدير نخبرك به.",
    cardTitle: "شهر كامل من المطبخ التجريبي",
    cardNote: "بيانات عيّنة أُعدّت لهذا النموذج، وليست بيانات منصّة حقيقية.",
    sold: "مبيعاتك",
    kept: "ما بقي لك",
    ofSales: "من المبيعات بقي في المطبخ",
  },
  gap: {
    title: "الرقم في لوحة التطبيق لم يكن يوماً الرقم في حسابك البنكي",
    lead: "يعرف كل صاحب مطعم هذا الشعور: التطبيق يقول إن الشهر كان ممتازاً، والحساب البنكي يقول غير ذلك. بين إجمالي المبيعات والتسوية المستلمة كومة من ملفات PDF لا وقت لأحد لقراءتها سطراً سطراً.",
    items: [
      { term: "العمولة", body: "من 15% إلى 30% حسب الباقة والمدينة والفئة." },
      { term: "الضريبة على العمولة", body: "تُضاف فوق العمولة نفسها." },
      { term: "رسوم الدفع والمنصّة", body: "نسبة قليلة على كل طلب." },
      { term: "الإنفاق الإعلاني", body: "أحياناً بموافقتك، وأحياناً لا." },
      { term: "الخصومات", body: "تتحمّلها المنصّة أو تتحمّلها أنت — وليس واضحاً دائماً أيّهما." },
      { term: "الضريبة المقتطعة", body: "تُخصم قبل الدفع لكنها رصيد ضريبي لك، لا تكلفة حقيقية." },
    ],
    note: "معظم الملاك يكتفون بمتابعة الإجمالي على أمل أنه صحيح تقريباً. غالباً ليس كذلك.",
  },
  positioning: {
    title: "ليس نظام نقاط بيع، ولا برنامج محاسبة، ولا لوحة ذكاء اصطناعي أخرى.",
    lead: "يقرأ Retained ملف التسوية الحقيقي ويُظهر لك، طلباً بطلب، أين ذهب كل درهم — وما إذا كان بعضه ما كان يجب أن يذهب.",
    rules: [
      {
        title: "المال قبل النشاط",
        body: "كل شاشة تبدأ بما بقي لك، لا بعدد الطلبات. عدد الطلبات لا يدفع الإيجار.",
      },
      {
        title: "كل رقم يُفتح",
        body: "اضغط أي رقم لترى مِمَّ تكوّن بالضبط — بلا صندوق أسود.",
      },
      {
        title: "لا نقول صافي ربح أبداً",
        body: "الإيجار والرواتب والمرافق ليست ضمن هذا الحساب، وتسميته ربحاً صافياً غير أمين. نسمّيه المساهمة التقديرية، ونوضّح ما إذا كان الرقم مستورداً من كشفك أم تقديرياً.",
      },
    ],
  },
  recon: {
    title: "ارفع ملف تسوية واحداً. شاهد ما تطابق وما لم يتطابق.",
    lead: "خلال دقائق من رفع تقرير تسوية حقيقي، يُظهر Retained ما كان يجب أن تكون عليه دفعتك، وما دفعته المنصّة فعلاً، وأي فارق حتى مستوى البند. وأي خصم لا يمكن تفسيره يُعلَّم بلغة واضحة، لا مدفوناً في ملف PDF.",
    expected: "ما كان يجب أن تكون عليه دفعتك",
    paid: "ما دفعته المنصّة فعلاً",
    gap: "خصومات غير مُفسَّرة، مُعلَّمة",
    gapNote: "رسوم إعلانية بلا حملة مطابقة في جزء من الشهر التجريبي.",
    flowTitle: "أين ذهب المال فعلاً",
    labels: {
      sales: "ما دفعه العملاء",
      commission: "عمولة التطبيق",
      platformFee: "رسوم ثابتة لكل طلب",
      taxOnFees: "الضريبة على العمولة",
      payment: "رسوم الدفع",
      packaging: "رسوم التغليف المخصومة",
      membership: "خصم العضوية الذي تحمّلته",
      ads: "رسوم إعلانية عليك",
      unmatchedAds: "رسوم إعلانية بلا حملة ⚠",
      discounts: "الخصومات التي تحمّلتها",
      food: "الطعام والتغليف",
      tds: "ضريبة مقتطعة — تستردّها لاحقاً",
      kept: "ما بقي لك",
    },
    note: "شهر واحد، 431 طلباً من بيانات العيّنة. هذا المبلغ قبل الإيجار والرواتب والكهرباء — ولا نسمّيه صافي ربح.",
  },
  features: {
    title: "من ماذا حدث إلى ماذا تفعل حياله",
    lead: "خمس شاشات، لكل منها سؤال واحد.",
    items: [
      {
        title: "نظرة عامة",
        body: "شاشة واحدة بأرقامك الحقيقية: ما بقي لك، ونسبة الاحتفاظ لكل قناة، وما تغيّر عن الفترة السابقة.",
      },
      {
        title: "تفصيل على مستوى الطلب",
        body: "اختر أي طلب وشاهد اقتصادياته كاملة — العمولة والرسوم والخصومات وتكلفة الطعام — من البيع حتى ما وصل حسابك.",
      },
      {
        title: "ربحية القائمة",
        body: "ليس كل طبق رائج طبقاً جيداً. شاهد الأصناف التي تخسر بهدوء في كل صحن، وتلك التي تستحق اهتماماً أكبر.",
      },
      {
        title: "مقارنة القنوات",
        body: "أي قناة تستحق الدفع هذا الشهر؟ ليس بحجم المبيعات، بل بما يبقى لك.",
      },
      {
        title: "توصية واحدة بدل مئة مؤشر",
        body: "في كل فترة يمنحك Retained خطوة واحدة واضحة — قناة تدفعها، طبق تعيد تسعيره، أو خصم تعترض عليه.",
      },
    ],
  },
  audience: {
    title: "لمن هذا",
    lead: "أربعة أصحاب أعمال، أربعة أسئلة، بيانات واحدة.",
    rows: [
      { who: "صاحب فرع واحد", ask: "أي تطبيق يستحق الدفع هذا الشهر؟" },
      { who: "مشغّل مطبخ سحابي", ask: "أي أطباقي يخسر بهدوء؟" },
      { who: "صاحب فروع متعددة", ask: "أي فرع مزيج قنواته خاطئ؟" },
      { who: "مدير أو محاسب", ask: "هل دفعت المنصّة فعلاً ما قالت إنها ستدفعه؟" },
    ],
    note: "يجيب Retained عن الأسئلة الأربعة من البيانات نفسها.",
  },
  market: {
    title: "مصمّم لسوقك",
    india: {
      title: "الهند",
      body: "مبني على المحاسبة الهندية — ضريبة السلع والخدمات على العمولة تُعالَج بشكل صحيح، والضريبة المقتطعة من الدخل تُتابَع كرصيد ضريبي مستقل لا كخسارة.",
    },
    uae: {
      title: "الإمارات",
      body: "مبني للسوق الإماراتي — بالدرهم، مع مراعاة ضريبة القيمة المضافة، وطلبات وكريم وديليفرو ونون في عرض واحد.",
    },
  },
  faq: {
    title: "أسئلة يطرحها أصحاب المطاعم",
    lead: "إجابات قصيرة وصريحة.",
    items: [
      {
        q: "كم تأخذ تطبيقات التوصيل فعلاً؟",
        a: "العمولة المعلنة (15–30%) جزء فقط. بعد الضريبة على العمولة ورسوم الدفع والإنفاق الإعلاني وتمويل الخصومات، يصبح الخصم الحقيقي أعلى بنحو 8 إلى 12 نقطة مئوية. يحسب Retained نسبتك الفعلية من بيانات تسويتك أنت.",
      },
      {
        q: "لماذا جاءت دفعتي أقل من المتوقع؟",
        a: "عادةً بسبب واحد أو أكثر من: الضريبة على العمولة، وتمويل الخصومات الترويجية، ورسوم الإعلانات، وتسويات الاسترداد، أو ضريبة مقتطعة. يفصّل Retained كل خصم في كل طلب.",
      },
      {
        q: "هل يجب أن يدفع مطعمي ضريبة على طلبات التطبيقات؟",
        a: "في الهند، ومنذ يناير 2022، المنصّة هي المسؤولة عن ضريبة الطلب وفق المادة 9(5)، وأنت تدفع الضريبة على رسوم العمولة فقط. في الإمارات تُطبَّق قواعد ضريبة القيمة المضافة المحلية. يطبّق Retained ذلك افتراضياً.",
      },
      {
        q: "هل يمكن للمنصّة خصم إعلانات أو خصومات بلا موافقتي؟",
        a: "يحدث أكثر مما يظن الملاك، وغالباً لا يظهر إلا لاحقاً في كشف التسوية. وهذا بالضبط ما تعلّمه مطابقة Retained.",
      },
      {
        q: "هل هذه أداة محاسبة؟",
        a: "لا. نُظهر لك أين ذهب مالك لتتخذ قرارات أفضل في التسعير والقنوات والقائمة. لسنا بديلاً عن محاسبك ولا نقدّم أي إقرارات.",
      },
    ],
  },
  cta: {
    title: "خمس عشرة دقيقة. ملف تسوية واحد. إجابة حقيقية.",
    lead: "لم تعد بحاجة إلى التخمين. ارفع ملفاً واحداً وشاهد بالضبط ما بقي لك وما لم يبقَ.",
    primary: "أرني ما بقي لي",
    secondary: "استكشف ببيانات عيّنة",
    note: "بلا التزام وبلا بطاقة. ويمكنك التجوّل أولاً ببيانات العيّنة إن أردت.",
  },
  footer:
    " · المساهمة والهامش تقديرات مبنية على البيانات التي تزوّدنا بها. لا يسمّيها Retained صافي ربح أبداً.",
};

const COPY: Record<LanguageCode, SiteCopy> = { en, hi, ar };

export function siteCopy(language: LanguageCode): SiteCopy {
  return COPY[language] ?? en;
}