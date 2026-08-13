# Retained

AI-assisted development for a restaurant profit intelligence product, with the developer kept in control.

`Retained` helps restaurant owners understand what they actually kept from marketplace sales after commissions, GST/VAT, ads, discount funding, packaging, food cost, and settlement adjustments.

**Live app:** https://accurate-render-aid.lovable.app

## What This Project Is

Retained is a web application for restaurants and cloud kitchens in India and the UAE.

The current product direction is centered on:

- showing retained revenue instead of only gross sales
- reconciling settlement files from platforms like Zomato and Swiggy
- highlighting unexplained deductions
- comparing channel performance by what the business keeps
- guiding operators toward better pricing, menu, and channel decisions

This is not positioned as accounting software or a POS. It is a profit-visibility and settlement-intelligence product.

## Current Architecture

- `React 19`
- `TypeScript`
- `Vite`
- `TanStack Start` with file-based routing via `TanStack Router`
- `Redux Toolkit` for app state
- `Supabase` for auth and persistence
- `Tailwind CSS 4` and `Radix UI`

Important directories:

- `src/routes/` - route-driven application structure
- `src/components/` - reusable UI and app components
- `src/lib/` - domain logic, helpers, parsers, i18n, and copy
- `src/store/` - Redux store, slices, persistence
- `src/integrations/supabase/` - Supabase integration layer
- `supabase/` - local database config and migrations
- `docs/implementations/` - implementation notes for preserving context

## AI-Assisted Development Philosophy

This repository is intended to support AI-assisted development without giving up engineering discipline.

Core principles:

- the developer stays accountable for architecture, correctness, and final decisions
- AI is used to accelerate implementation, reduce repetitive work, and preserve context
- generated or assisted code should still meet normal standards for readability and maintainability
- changes should be small, reviewable, and easy to verify
- product context should be documented so future sessions do not waste tokens rediscovering the codebase

In practice, this means:

- documenting implementation context in `docs/implementations/`
- keeping architectural boundaries clear
- reviewing AI output instead of accepting it blindly
- preferring stable abstractions over large speculative rewrites

## Graphify And Token Efficiency

This project also uses a context-preservation workflow inspired by `Graphify`.

Why it matters:

- large codebases become expensive to re-read every session
- AI quality drops when context is shallow or fragmented
- repeated full-repo reads waste tokens and slow iteration

Graphify helps by building a persistent knowledge graph from the codebase and related docs so future work can start from structured context instead of re-ingesting everything from scratch.

Recommended workflow:

1. Run Graphify on the repository when major architecture changes land.
2. Keep `docs/implementations/` updated for feature-level context.
3. Use Graphify output plus implementation notes before starting larger changes.
4. Re-run Graphify incrementally after meaningful updates.

Example usage:

```sh
/graphify .
/graphify . --update
```

This approach is intended to improve:

- token efficiency
- architectural recall across sessions
- onboarding speed for new contributors or new agents
- consistency in product understanding

## Development Standards

This repo should be treated like a normal production-minded codebase, even when AI is involved.

Expected standards:

- preserve developer control over product and architecture decisions
- prefer minimal correct changes
- keep domain logic separated from presentational code
- avoid editing generated files unless there is a clear reason
- document non-obvious implementation decisions
- keep the branch in a working state, especially because the repo is connected to Lovable

## Local Development

Requirements:

- `Node.js`
- `npm`

Install and run:

```sh
npm install
npm run dev
```

Useful scripts:

```sh
npm run dev
npm run build
npm run preview
npm run lint
npm run format
```

## Product Understanding As Of Now

Based on the current codebase, the app already includes or scaffolds:

- authentication flow
- onboarding flow
- app shell with sidebar and top bar
- workspace state and local persistence
- imported/demo dataset handling
- order and settlement parsing for supported channels
- reporting-oriented routes such as overview, orders, imports, mapping, reports, and advisor flows
- multilingual site copy for English, Hindi, and Arabic

Some areas are still clearly in-progress or prototype-stage, but the direction is consistent: explain retained earnings from restaurant marketplace operations in a way owners can actually act on.

## Lovable Integration

This project is connected to `Lovable`.

- changes pushed to the connected branch sync back into Lovable
- avoid rewriting published history
- keep commits safe and the branch healthy

Lovable project:

- https://lovable.dev/projects/42db894f-8e47-486d-8b77-88e8191f59c1

## License

MIT
