# Home page rebuild — owner-first story + search surface

The current home page is a thin two-column prototype screen: a headline, three tiny icon
notes and a signup box. It explains the product in analyst language ("channel-normalised
contribution margin") and gives search engines almost nothing to rank. The rebuild turns it
into a medium-length marketing page written the way a restaurant owner talks, using the
warm-teal / Sora + Manrope system already in the app.

## Page structure (top to bottom)

1. **Sticky header** — brand mark, Retained wordmark, language toggle, "See the demo" and
   "Create account".
2. **Hero** — one plain-language promise ("You sold ₹1,92,621 last month. You kept
   ₹37,626. Here's where the rest went."), a supporting line, two buttons (Create free
   account / Open the demo restaurant), and a small trust row (India + UAE, no POS change
   needed, every number opens its own calculation).
3. **The leak strip** — a horizontal money-flow band showing Sales → commission → tax on
   fees → payment fee → ads → discounts → food & packing → What you kept. This is the
   visual that makes the page feel like a product, not a template. Real numbers from the
   existing demo dataset, so it is honest and labelled as sample data.
4. **What owners ask** — three cards answering the actual questions:
   "How much does Zomato/Swiggy really take?", "Which dish is quietly losing money?",
   "Which app is worth pushing?" Each card carries one concrete figure from the demo data.
5. **How it works** — three steps: add your menu and costs → upload order/settlement files
   → open any number and see the maths. Deliberately short.
6. **Built for your market** — two panels: India (Zomato, Swiggy, direct, ₹, GST on fees)
   and UAE (Talabat, Deliveroo, Careem, Noon, AED). This is also the UAE keyword surface.
7. **FAQ** — 6 questions in owner language, each one a search phrase: what commission
   Zomato takes, how Swiggy payout is calculated, what a good restaurant profit margin is,
   how to work out dish-level profit, whether it works for cloud kitchens, whether it works
   in Dubai. Short honest answers, no invented statistics or fake testimonials.
8. **Closing CTA + footer** — account CTA, demo link, and the existing honesty line
   (estimates, never called net profit).

## Language behaviour

English is the primary language and what search engines index. On first visit the page
detects the visitor's system timezone/locale: an India timezone offers Hindi, a Gulf
timezone offers Arabic, everyone else sees English only. The offer appears as a quiet
toggle in the header (e.g. "हिन्दी में पढ़ें") — never an automatic switch, and the choice
is remembered. Arabic switches the page to right-to-left, matching the dashboard.

## SEO work

- Rewritten title and description built around "what your restaurant actually keeps from
  Zomato, Swiggy and Talabat".
- Self-referencing canonical and og:url, og:type website, twitter:card.
- One H1, section H2s that carry the target phrases (Zomato/Swiggy commission and payout,
  restaurant profit margin, dish/menu profitability, Talabat/Deliveroo UAE).
- FAQPage JSON-LD from the FAQ block, plus SoftwareApplication/Organization JSON-LD.
- `public/sitemap.xml` listing the public routes, and a `Sitemap:` line in robots.txt.
- The FAQ and market copy carry the keywords naturally in owner phrasing — no keyword
  stuffing, no claims we cannot back with the demo dataset.

## Technical notes

- Rewrite `src/routes/index.tsx`; split the page into small components under
  `src/components/marketing/` (hero, leak strip, question cards, steps, markets, FAQ).
- Numbers come from the existing demo generator (`src/data/orders.ts` + `src/lib/metrics.ts`)
  computed at module level, so hero and cards stay in sync with the demo workspace and
  render on the server for crawlers.
- Language detection uses `Intl.DateTimeFormat().resolvedOptions().timeZone` inside an
  effect (never during render, to avoid hydration mismatch), with the choice stored
  alongside the existing workspace preferences; page copy uses a marketing dictionary added
  to `src/lib/i18n.ts`.
- All colour/typography from existing tokens; no hardcoded colours.
- Verify with a Playwright pass: hero renders server-side, FAQ JSON-LD present, Hindi
  toggle appears for an Asia/Kolkata timezone, Arabic flips to RTL, demo button still loads
  the workspace.
