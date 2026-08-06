# Revised MVP (Ingestion & Business Logic)

## Context
Pivot the MVP to rely on manual CSV settlement parsing rather than future APIs. Update business logic to handle TDS correctly (as a tax credit, not a cost) and surface unauthorized deductions. Shift onboarding to lead with a "Trust Moment" by making users upload a settlement file right away.

## Implementation Plan
- [x] Update `types.ts` and `metrics.ts` for TDS and Unauthorized Deductions.
- [x] Build CSV parsers for Zomato and Swiggy (`src/lib/parsers/`).
- [x] Restructure `onboarding.tsx` Step 4 to prompt for file upload and display instant reconciliation.
- [x] Connect `app.imports.tsx` to the new parsers.

## Status/Updates
- *Execution Phase*: Completed initial CSV parsers using `papaparse`. Added UI hooks for processing real files in Onboarding and Imports pages. Updated calculation dictionary for TDS.
