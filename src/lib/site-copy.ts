import type { LanguageCode } from "@/lib/i18n";

export interface SiteCopy {
  nav: { signIn: string; demo: string; create: string; readIn: string };
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    primary: string;
    secondary: string;
    trust: string[];
    cardTitle: string;
    cardNote: string;
    sold: string;
    kept: string;
    ofSales: string;
  };
  flow: {
    title: string;
    lead: string;
    labels: Record<string, string>;
    note: string;
  };
  questions: {
    title: string;
    lead: string;
    items: { q: string; a: string; stat: string }[];
  };
  steps: { title: string; lead: string; items: { title: string; body: string }[] };
  markets: {
    title: string;
    lead: string;
    india: { title: string; body: string };
    uae: { title: string; body: string };
  };
  faq: { title: string; lead: string; items: { q: string; a: string }[] };
  cta: { title: string; lead: string; primary: string; secondary: string };
  footer: string;
}

const en: SiteCopy = {
  nav: { signIn: "Sign in", demo: "See the demo", create: "Create account", readIn: "Read in" },
  hero: {
    eyebrow: "For restaurants and cloud kitchens in India and the UAE",
    title: "You know what you sold. Do you know what you kept?",
    lead: "Retained takes your orders from Zomato, Swiggy, Talabat or your own counter and shows what was left after commission, tax on fees, payment charges, ads, your discounts and the cost of the food. Every number opens up and shows its own working.",
    primary: "Create your free account",
    secondary: "Open the demo restaurant",
    trust: [
      "Works with your existing POS and app reports",
      "Set up in one sitting",
      "Every figure can be opened and checked",
    ],
    cardTitle: "A real month from the demo kitchen",
    cardNote: "Sample data built for this prototype, not live platform data.",
    sold: "You sold",
    kept: "You kept",
    ofSales: "of sales stayed with the kitchen",
  },
  flow: {
    title: "Where the money actually goes",
    lead: "One month, 431 orders. This is the same order data the demo workspace uses — every slice below is a line you can open.",
    labels: {
      sales: "What customers paid",
      commission: "App commission",
      taxOnFees: "Tax on those fees",
      payment: "Payment charges",
      ads: "Ads you ran on the apps",
      discounts: "Discounts you funded",
      food: "Food and packing",
      kept: "What you kept",
    },
    note: "This is money kept before rent, salaries and electricity. We never call it net profit.",
  },
  questions: {
    title: "The three questions owners actually ask",
    lead: "Not dashboards. Answers.",
    items: [
      {
        q: "How much does Zomato or Swiggy really take?",
        a: "Commission is only the first cut. Add the tax on that commission, the payment charge, the ad spend and the discounts you funded, and the real deduction is much larger than the rate in your contract.",
        stat: "of Zomato sales left as platform charges in the demo month",
      },
      {
        q: "Which dish is quietly losing money?",
        a: "A dish can sell every day and still leave you almost nothing once app charges and packing are spread across it. Retained ranks every item by what it keeps, not by how often it sells.",
        stat: "kept on the weakest-selling-well dish in the demo month",
      },
      {
        q: "Which channel is worth pushing?",
        a: "Compare what each app kept for you per ₹100 of sales, side by side with your direct and walk-in orders, before you spend another rupee on visibility.",
        stat: "kept on direct orders versus the apps",
      },
    ],
  },
  steps: {
    title: "How it works",
    lead: "Three steps, one sitting.",
    items: [
      {
        title: "Add your menu and what each dish costs",
        body: "Prices per channel, food cost and packing cost. This is the only setup work.",
      },
      {
        title: "Bring in your orders and settlements",
        body: "Upload the reports you already download from the apps, or start with the demo dataset.",
      },
      {
        title: "Open any number and see the maths",
        body: "Every figure has a calculation drawer showing exactly which lines produced it.",
      },
    ],
  },
  markets: {
    title: "Built for your market",
    lead: "Currency, channels and language follow where your kitchen is.",
    india: {
      title: "India — Zomato, Swiggy and direct orders",
      body: "Rupee formatting with Indian grouping, GST on platform fees handled as its own line, restaurant-funded discounts kept separate from platform offers, and the whole app readable in Hindi.",
    },
    uae: {
      title: "UAE — Talabat, Deliveroo, Careem and Noon",
      body: "Dirham formatting, Gulf delivery channels, and an Arabic interface that flips to right-to-left. Same contribution maths, your market's aggregators.",
    },
  },
  faq: {
    title: "Questions restaurant owners ask us",
    lead: "Short, honest answers.",
    items: [
      {
        q: "How much commission does Zomato take from restaurants?",
        a: "The headline commission on a partner contract typically sits somewhere in the high teens to mid twenties of order value, but that is not the full deduction. Tax on the commission, payment gateway charges, promotional ad spend and any discount you funded all come out too. Retained shows your own actual rate from your own settlement reports instead of a generic figure.",
      },
      {
        q: "How is a Swiggy payout calculated?",
        a: "Start from what the customer paid, subtract the discount you funded and any refunds, then subtract commission, tax on that commission, payment charges, ad allocation and adjustments. What lands in your bank is the remainder. Retained rebuilds that chain order by order so you can match it against the payout that actually arrived.",
      },
      {
        q: "What is a good profit margin for a restaurant?",
        a: "There is no single number, and anyone quoting one is guessing. What matters is your contribution — what is left after platform charges, discounts and the cost of the food — because rent, salaries and electricity still have to come out of it. Retained tracks that figure per channel so you can watch it move rather than compare yourself to an average.",
      },
      {
        q: "How do I work out profit for a single dish?",
        a: "Take the dish's sales, subtract its food and packing cost, then allocate a fair share of the order's platform charges and discounts to it. Retained does that allocation automatically for every item and sorts your menu by what each dish actually keeps.",
      },
      {
        q: "Does this work for a cloud kitchen with no dine-in?",
        a: "Yes. Cloud kitchens usually depend most on aggregator orders, which is exactly where the deductions pile up, so the channel comparison tends to be more useful, not less.",
      },
      {
        q: "Does it work for restaurants in Dubai and the wider UAE?",
        a: "Yes. Choose the UAE during setup and the workspace switches to dirhams and Gulf delivery channels such as Talabat, Deliveroo, Careem and Noon Food, with an Arabic interface available.",
      },
    ],
  },
  cta: {
    title: "Find out what last month actually left you",
    lead: "Create a free owner account, or look through the demo kitchen first — no account needed.",
    primary: "Create your free account",
    secondary: "Open the demo restaurant",
  },
  footer:
    "Contribution and margin are estimates based on the data you supply. Retained never labels them as net profit.",
};

const hi: SiteCopy = {
  nav: { signIn: "साइन इन", demo: "डेमो देखें", create: "खाता बनाएँ", readIn: "पढ़ें" },
  hero: {
    eyebrow: "भारत और यूएई के रेस्टोरेंट और क्लाउड किचन के लिए",
    title: "बिक्री तो आपको पता है। लेकिन बचा कितना?",
    lead: "Retained आपके ज़ोमैटो, स्विगी, तलाबात या काउंटर के ऑर्डर लेकर दिखाता है कि कमीशन, उस पर टैक्स, पेमेंट चार्ज, विज्ञापन, आपकी छूट और खाने की लागत के बाद कितना बचा। हर आँकड़ा खोलकर उसका पूरा हिसाब देखा जा सकता है।",
    primary: "मुफ़्त खाता बनाएँ",
    secondary: "डेमो रेस्टोरेंट खोलें",
    trust: [
      "आपके मौजूदा POS और ऐप रिपोर्ट के साथ चलता है",
      "एक ही बैठक में सेटअप",
      "हर आँकड़ा खोलकर जाँचा जा सकता है",
    ],
    cardTitle: "डेमो किचन का एक पूरा महीना",
    cardNote: "यह प्रोटोटाइप के लिए बनाया गया नमूना डेटा है, असली प्लेटफ़ॉर्म डेटा नहीं।",
    sold: "आपने बेचा",
    kept: "आपके पास बचा",
    ofSales: "बिक्री का हिस्सा किचन के पास रहा",
  },
  flow: {
    title: "पैसा असल में जाता कहाँ है",
    lead: "एक महीना, 431 ऑर्डर। यही डेटा डेमो वर्कस्पेस में भी है — नीचे का हर हिस्सा खोलकर देखा जा सकता है।",
    labels: {
      sales: "ग्राहक ने जो चुकाया",
      commission: "ऐप कमीशन",
      taxOnFees: "उस फ़ीस पर टैक्स",
      payment: "पेमेंट चार्ज",
      ads: "ऐप पर चलाए विज्ञापन",
      discounts: "आपकी दी हुई छूट",
      food: "खाना और पैकिंग",
      kept: "आपके पास बचा",
    },
    note: "यह किराया, तनख़्वाह और बिजली से पहले का पैसा है। हम इसे कभी नेट प्रॉफ़िट नहीं कहते।",
  },
  questions: {
    title: "मालिक असल में यही तीन सवाल पूछते हैं",
    lead: "डैशबोर्ड नहीं, जवाब।",
    items: [
      {
        q: "ज़ोमैटो या स्विगी असल में कितना लेते हैं?",
        a: "कमीशन सिर्फ़ पहली कटौती है। उस पर टैक्स, पेमेंट चार्ज, विज्ञापन और आपकी दी हुई छूट जोड़िए — असली कटौती कॉन्ट्रैक्ट की दर से कहीं ज़्यादा निकलती है।",
        stat: "डेमो महीने में ज़ोमैटो की बिक्री का इतना हिस्सा प्लेटफ़ॉर्म चार्ज में गया",
      },
      {
        q: "कौन-सी डिश चुपचाप नुक़सान करा रही है?",
        a: "कोई डिश रोज़ बिक सकती है और फिर भी ऐप चार्ज और पैकिंग के बाद कुछ ख़ास नहीं छोड़ती। Retained हर आइटम को बिक्री से नहीं, बचत से क्रम में लगाता है।",
        stat: "डेमो महीने की सबसे कमज़ोर मार्जिन वाली डिश पर बचा",
      },
      {
        q: "किस चैनल पर ज़ोर देना सही है?",
        a: "हर ₹100 की बिक्री पर किस ऐप ने आपके पास कितना छोड़ा — इसे अपने डायरेक्ट और वॉक-इन ऑर्डर के साथ रखकर देखिए, विज्ञापन पर और पैसा लगाने से पहले।",
        stat: "ऐप के मुक़ाबले डायरेक्ट ऑर्डर पर बचा",
      },
    ],
  },
  steps: {
    title: "यह काम कैसे करता है",
    lead: "तीन क़दम, एक ही बैठक।",
    items: [
      {
        title: "मेन्यू और हर डिश की लागत डालिए",
        body: "हर चैनल की क़ीमत, खाने की लागत और पैकिंग लागत। सेटअप का काम बस इतना है।",
      },
      {
        title: "ऑर्डर और सेटलमेंट लाइए",
        body: "जो रिपोर्ट आप ऐप से पहले से डाउनलोड करते हैं वही अपलोड कीजिए, या डेमो डेटा से शुरू कीजिए।",
      },
      {
        title: "कोई भी आँकड़ा खोलिए और हिसाब देखिए",
        body: "हर आँकड़े के साथ उसका पूरा कैलकुलेशन खुलता है — कौन-सी लाइन से क्या बना।",
      },
    ],
  },
  markets: {
    title: "आपके बाज़ार के लिए बना",
    lead: "मुद्रा, चैनल और भाषा वहीं के हिसाब से जहाँ आपका किचन है।",
    india: {
      title: "भारत — ज़ोमैटो, स्विगी और डायरेक्ट ऑर्डर",
      body: "भारतीय ढंग की रुपये फ़ॉर्मेटिंग, प्लेटफ़ॉर्म फ़ीस पर GST अलग लाइन में, आपकी दी हुई छूट प्लेटफ़ॉर्म की छूट से अलग, और पूरा ऐप हिंदी में।",
    },
    uae: {
      title: "यूएई — तलाबात, डेलीवरू, करीम और नून",
      body: "दिरहम फ़ॉर्मेटिंग, खाड़ी के डिलीवरी चैनल और दाएँ-से-बाएँ चलने वाला अरबी इंटरफ़ेस। हिसाब वही, ऐप आपके बाज़ार के।",
    },
  },
  faq: {
    title: "रेस्टोरेंट मालिकों के आम सवाल",
    lead: "छोटे और सीधे जवाब।",
    items: [
      {
        q: "ज़ोमैटो रेस्टोरेंट से कितना कमीशन लेता है?",
        a: "पार्टनर कॉन्ट्रैक्ट में कमीशन आमतौर पर ऑर्डर मूल्य के क़रीब बीस प्रतिशत के आसपास रहता है, पर कटौती यहीं ख़त्म नहीं होती। उस पर टैक्स, पेमेंट गेटवे चार्ज, विज्ञापन और आपकी दी छूट भी घटती है। Retained आपकी अपनी सेटलमेंट रिपोर्ट से आपकी असली दर निकालता है।",
      },
      {
        q: "स्विगी का पेआउट कैसे बनता है?",
        a: "ग्राहक ने जो चुकाया उससे शुरू कीजिए, फिर आपकी छूट और रिफ़ंड घटाइए, उसके बाद कमीशन, उस पर टैक्स, पेमेंट चार्ज, विज्ञापन हिस्सा और एडजस्टमेंट। जो बचा वही बैंक में आता है। Retained यह पूरी कड़ी हर ऑर्डर के लिए दोबारा बनाता है।",
      },
      {
        q: "रेस्टोरेंट के लिए अच्छा प्रॉफ़िट मार्जिन कितना है?",
        a: "कोई एक आँकड़ा नहीं होता। असल बात है आपका कॉन्ट्रिब्यूशन — प्लेटफ़ॉर्म चार्ज, छूट और खाने की लागत के बाद जो बचा, क्योंकि किराया, तनख़्वाह और बिजली इसी में से जाती है। Retained इसे हर चैनल के लिए दिखाता है।",
      },
      {
        q: "एक डिश का मुनाफ़ा कैसे निकालें?",
        a: "डिश की बिक्री से उसकी खाने और पैकिंग लागत घटाइए, फिर ऑर्डर के प्लेटफ़ॉर्म चार्ज और छूट का उचित हिस्सा उस पर डालिए। Retained यह हिसाब हर आइटम के लिए ख़ुद करता है।",
      },
      {
        q: "क्या यह बिना डाइन-इन वाले क्लाउड किचन के लिए भी है?",
        a: "हाँ। क्लाउड किचन ज़्यादातर ऐप ऑर्डर पर टिके होते हैं, और कटौती वहीं सबसे ज़्यादा होती है — इसलिए चैनल तुलना और भी काम की हो जाती है।",
      },
      {
        q: "क्या यह दुबई और यूएई के रेस्टोरेंट के लिए चलता है?",
        a: "हाँ। सेटअप में यूएई चुनिए और वर्कस्पेस दिरहम तथा तलाबात, डेलीवरू, करीम और नून फ़ूड जैसे चैनलों पर चला जाता है, अरबी इंटरफ़ेस के साथ।",
      },
    ],
  },
  cta: {
    title: "देखिए पिछले महीने आपके पास असल में क्या बचा",
    lead: "मुफ़्त खाता बनाइए, या पहले डेमो किचन देख लीजिए — खाते की ज़रूरत नहीं।",
    primary: "मुफ़्त खाता बनाएँ",
    secondary: "डेमो रेस्टोरेंट खोलें",
  },
  footer:
    "कॉन्ट्रिब्यूशन और मार्जिन आपके दिए डेटा पर आधारित अनुमान हैं। Retained इन्हें कभी नेट प्रॉफ़िट नहीं कहता।",
};

const ar: SiteCopy = {
  nav: { signIn: "تسجيل الدخول", demo: "شاهد العرض", create: "إنشاء حساب", readIn: "اقرأ بـ" },
  hero: {
    eyebrow: "للمطاعم والمطابخ السحابية في الإمارات والهند",
    title: "تعرف كم بِعت. لكن كم بقي لك؟",
    lead: "يأخذ Retained طلباتك من طلبات، ديليفرو، كريم أو من الصالة، ويُظهر ما تبقّى بعد العمولة والضريبة عليها ورسوم الدفع والإعلانات وخصوماتك وتكلفة الطعام. كل رقم يمكن فتحه لرؤية طريقة حسابه.",
    primary: "أنشئ حسابك المجاني",
    secondary: "افتح المطعم التجريبي",
    trust: [
      "يعمل مع نظام نقاط البيع وتقارير التطبيقات لديك",
      "الإعداد في جلسة واحدة",
      "كل رقم قابل للفتح والتحقق",
    ],
    cardTitle: "شهر كامل من المطبخ التجريبي",
    cardNote: "بيانات عيّنة أُعدّت لهذا النموذج، وليست بيانات منصّة حقيقية.",
    sold: "مبيعاتك",
    kept: "ما بقي لك",
    ofSales: "من المبيعات بقي في المطبخ",
  },
  flow: {
    title: "أين يذهب المال فعلاً",
    lead: "شهر واحد، 431 طلباً. البيانات نفسها الموجودة في مساحة العمل التجريبية — وكل جزء أدناه يمكن فتحه.",
    labels: {
      sales: "ما دفعه العملاء",
      commission: "عمولة التطبيق",
      taxOnFees: "الضريبة على الرسوم",
      payment: "رسوم الدفع",
      ads: "إعلاناتك على التطبيقات",
      discounts: "الخصومات التي تحمّلتها",
      food: "الطعام والتغليف",
      kept: "ما بقي لك",
    },
    note: "هذا المبلغ قبل الإيجار والرواتب والكهرباء. نحن لا نسمّيه صافي ربح.",
  },
  questions: {
    title: "الأسئلة الثلاثة التي يطرحها أصحاب المطاعم",
    lead: "إجابات، لا لوحات أرقام.",
    items: [
      {
        q: "كم تأخذ التطبيقات فعلاً؟",
        a: "العمولة هي الخصم الأول فقط. أضف الضريبة عليها ورسوم الدفع والإعلانات والخصومات التي تحمّلتها، فيصبح الخصم الحقيقي أكبر بكثير من النسبة المكتوبة في العقد.",
        stat: "من مبيعات التطبيق ذهبت كرسوم منصّة في الشهر التجريبي",
      },
      {
        q: "أي طبق يخسر بهدوء؟",
        a: "قد يُباع الطبق يومياً ولا يترك لك شيئاً بعد رسوم التطبيق والتغليف. يرتّب Retained كل صنف حسب ما يبقيه لك، لا حسب عدد مرات بيعه.",
        stat: "بقي من أضعف الأطباق هامشاً في الشهر التجريبي",
      },
      {
        q: "أي قناة تستحق الدفع؟",
        a: "قارن ما تبقيه لك كل قناة من كل 100 من المبيعات، جنباً إلى جنب مع الطلبات المباشرة، قبل أن تصرف المزيد على الظهور.",
        stat: "بقي من الطلبات المباشرة مقابل التطبيقات",
      },
    ],
  },
  steps: {
    title: "كيف يعمل",
    lead: "ثلاث خطوات في جلسة واحدة.",
    items: [
      {
        title: "أضف قائمتك وتكلفة كل طبق",
        body: "الأسعار لكل قناة، تكلفة الطعام وتكلفة التغليف. هذا كل الإعداد المطلوب.",
      },
      {
        title: "أدخل الطلبات والتسويات",
        body: "ارفع التقارير التي تنزّلها أصلاً من التطبيقات، أو ابدأ بالبيانات التجريبية.",
      },
      {
        title: "افتح أي رقم وشاهد الحساب",
        body: "لكل رقم لوحة تُظهر بالضبط السطور التي كوّنته.",
      },
    ],
  },
  markets: {
    title: "مصمّم لسوقك",
    lead: "العملة والقنوات واللغة تتبع مكان مطبخك.",
    india: {
      title: "الهند — زوماتو، سويغي والطلبات المباشرة",
      body: "تنسيق الروبية، ضريبة السلع والخدمات على رسوم المنصّة كسطر مستقل، وفصل خصوماتك عن عروض المنصّة، مع واجهة بالهندية.",
    },
    uae: {
      title: "الإمارات — طلبات، ديليفرو، كريم ونون",
      body: "تنسيق الدرهم، قنوات التوصيل الخليجية، وواجهة عربية من اليمين إلى اليسار. الحساب نفسه، وتطبيقات سوقك.",
    },
  },
  faq: {
    title: "أسئلة يطرحها أصحاب المطاعم",
    lead: "إجابات قصيرة وصريحة.",
    items: [
      {
        q: "كم تأخذ تطبيقات التوصيل من المطاعم؟",
        a: "تتراوح العمولة المعلنة عادةً حول عشرين بالمئة من قيمة الطلب، لكن الخصم لا يتوقف هناك: الضريبة على العمولة، ورسوم الدفع، والإنفاق الإعلاني، والخصومات التي تتحمّلها. يستخرج Retained نسبتك الحقيقية من تقارير التسوية الخاصة بك.",
      },
      {
        q: "كيف تُحتسب دفعة التطبيق؟",
        a: "ابدأ بما دفعه العميل، اطرح خصمك وأي مبالغ مستردة، ثم اطرح العمولة والضريبة عليها ورسوم الدفع وحصة الإعلانات والتسويات. الباقي هو ما يصل إلى حسابك. يعيد Retained بناء هذه السلسلة لكل طلب.",
      },
      {
        q: "ما هامش الربح الجيد للمطعم؟",
        a: "لا يوجد رقم واحد. المهم هو ما يتبقّى بعد رسوم المنصّات والخصومات وتكلفة الطعام، لأن الإيجار والرواتب والكهرباء تُدفع منه. يتتبّع Retained هذا الرقم لكل قناة.",
      },
      {
        q: "كيف أحسب ربح طبق واحد؟",
        a: "اطرح تكلفة الطعام والتغليف من مبيعات الطبق، ثم وزّع عليه حصة عادلة من رسوم المنصّة والخصومات. يقوم Retained بهذا التوزيع تلقائياً لكل صنف.",
      },
      {
        q: "هل يناسب المطابخ السحابية بدون صالة؟",
        a: "نعم. تعتمد المطابخ السحابية غالباً على طلبات التطبيقات، وهناك تتراكم الخصومات، لذا تصبح مقارنة القنوات أكثر فائدة.",
      },
      {
        q: "هل يعمل في دبي وبقية الإمارات؟",
        a: "نعم. اختر الإمارات أثناء الإعداد فتتحوّل مساحة العمل إلى الدرهم وقنوات مثل طلبات وديليفرو وكريم ونون فود، مع واجهة عربية.",
      },
    ],
  },
  cta: {
    title: "اعرف ما تبقّى لك فعلاً الشهر الماضي",
    lead: "أنشئ حساباً مجانياً، أو تصفّح المطبخ التجريبي أولاً دون حساب.",
    primary: "أنشئ حسابك المجاني",
    secondary: "افتح المطعم التجريبي",
  },
  footer:
    "المساهمة والهامش تقديرات مبنية على بياناتك. لا يصفها Retained أبداً بصافي الربح.",
};

const COPY: Record<LanguageCode, SiteCopy> = { en, hi, ar };

export function siteCopy(language: LanguageCode): SiteCopy {
  return COPY[language] ?? en;
}
