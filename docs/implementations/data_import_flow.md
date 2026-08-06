# Data Import UX Flow

## Context
The application needs a seamless data import flow for Zomato, Swiggy, and direct channels. Users are often confused about how to get their data out of these platforms. To solve this, we need a flow that instructs the user quickly, provides the upload mechanism, and offers a demo mode so they can experience the app without committing their own data immediately.

## Implementation Plan
- [x] Replace `<ComingSoon />` in `app.imports.tsx`.
- [x] Add step-by-step instructions for exporting data from partner portals.
- [x] Build a file upload dropzone (`src/components/app/upload-zone.tsx`).
- [x] Add a "Load Demo File" button to inject synthetic data or simulate an upload.

## Status/Updates
- *Status*: **Implemented**. The frontend UI is in place. Clicking "Load Demo File" simulates uploading and redirects to the mapping phase. Upload Dropzones are visually ready and styled using the centralized design system.
