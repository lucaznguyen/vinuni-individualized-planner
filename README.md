# VIP — VinUni Individualized Planner

A deploy-ready static frontend prototype for **VIP — VinUni Individualized Planner**.

Tagline: **See your load early. Plan your week clearly. Ask the right person.**

## What is included

- Landing page for the VIP proposal
- Interactive deadline bank with localStorage
- Weekly workload heatmap
- Dynamic workload result and action card
- Academic SOS Navigator
- Template pack with copy/download actions
- Methodology section for the Academic Load Score
- Eight-week pilot timeline
- Privacy-first About section
- Downloadable XLSX sheet template
- CSV export for the deadline bank
- Dark mode and responsive layout
- Vercel-ready configuration

## Run locally

The simplest option is to open `index.html` directly in your browser.

For a local dev server:

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Build for deploy

```bash
npm install
npm run build
```

The production files will be created in `dist/`.

## Deploy on Vercel

1. Push this folder to a GitHub repository.
2. Import the repository on Vercel.
3. Use the included `vercel.json` settings.
4. Build command: `npm run build`.
5. Output directory: `dist`.

## Google Sheets note

This version is frontend-only. It does **not** live-sync to Google Sheets.

For the intended low-risk MVP flow:

1. Download `assets/templates/vip-sheet-template.xlsx`.
2. Upload it to Google Drive.
3. Open it with Google Sheets.
4. Students can keep their own student-owned VIP Sheet.

Live Google Sheets integration would require Google API credentials, OAuth, or an Apps Script backend.

## Privacy note

The demo stores deadline data only in the browser using localStorage. No grades, GPA, clinical records, counseling data, or private Canvas analytics are collected.
