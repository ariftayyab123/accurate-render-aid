import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { SiteHeader } from "@/components/marketing/site-header";
import { Hero } from "@/components/marketing/hero";
import { TheGap } from "@/components/marketing/the-gap";
import { Positioning } from "@/components/marketing/positioning";
import { Reconciliation } from "@/components/marketing/reconciliation";
import { Audience, ClosingCta, Faq, Features, MarketNote } from "@/components/marketing/sections";
import { loadDemoWorkspace } from "@/lib/workspace";
import { siteCopy } from "@/lib/site-copy";
import { useSiteLanguage } from "@/lib/site-language";

const SITE_URL = "https://accurate-render-aid.lovable.app";
const TITLE = "Retained — Know What You Actually Kept From Zomato & Swiggy";
const DESCRIPTION =
  "See what Zomato and Swiggy really deduct from every order — commission, ads, discounts, GST, TDS. Match your payout to the rupee. Free to try.";

const faqCopy = siteCopy("en").faq;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL + "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Retained",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: SITE_URL + "/",
          description: DESCRIPTION,
          audience: {
            "@type": "Audience",
            audienceType: "Restaurant and cloud kitchen owners in India and the UAE",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqCopy.items.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }),
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  const { language, offer, setLanguage, dir } = useSiteLanguage();
  const copy = siteCopy(language);

  const openDemo = () => {
    loadDemoWorkspace();
    navigate({ to: "/app" });
  };

  const scrollToExample = () => {
    document.getElementById("example")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background" dir={dir} lang={language}>
      <SiteHeader
        copy={copy}
        language={language}
        offer={offer}
        onLanguage={setLanguage}
        onDemo={openDemo}
      />

      <main>
        <Hero copy={copy} onExample={scrollToExample} />
        <TheGap copy={copy} />
        <Positioning copy={copy} />
        <Reconciliation copy={copy} />
        <Features copy={copy} />
        <Audience copy={copy} />
        <MarketNote copy={copy} />
        <Faq copy={copy} />
        <ClosingCta copy={copy} onDemo={openDemo} />
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-5 py-8 text-xs text-muted-foreground sm:px-8">
          <span className="display text-sm font-semibold text-foreground">Retained</span>
          <span className="max-w-2xl leading-relaxed">{copy.footer}</span>
        </div>
      </footer>
    </div>
  );
}
