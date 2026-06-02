# VIP - VinUni Individualized Planner

VIP is a pitch-ready interactive prototype for the VinUni Wellbeing Changemaker Contest. It helps first-year students turn scattered syllabus deadlines into a student-owned planner with a weekly workload heatmap, Academic Load Score, action cards, and an Academic SOS Navigator.

The prototype is static and privacy-first: no backend, no login, no tracking, no external database, and no API calls. Task data is stored only in the browser through `localStorage`.

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Open the local URL printed by Vite.

## Build

```bash
npm run build
```

The production files are generated in `dist/`.

## Deploy to GitHub Pages

This repo includes `.github/workflows/deploy.yml`.

Before deployment, confirm the Vite base path in `vite.config.ts` matches the GitHub repository name:

```ts
base: process.env.NODE_ENV === "production" ? "/vinuni-individualized-planner/" : "/",
```

If the repository is renamed, replace `vinuni-individualized-planner` with the actual GitHub repository name before deploying as a GitHub project page.

Then:

1. Push the repository to GitHub.
2. In GitHub, open Settings -> Pages.
3. Set Source to GitHub Actions.
4. Push to `main`; the workflow will build and deploy `dist/`.

## Repository structure

- `src/data/sampleTasks.ts` stores default first-year sample tasks.
- `src/data/demoCases.ts` stores the three pitch demo cases.
- `src/data/slides.ts` stores the 10 pitch deck slides and speaker notes.
- `src/lib/loadScore.ts` stores the Academic Load Score rules.
- `src/lib/actionCards.ts` stores Green, Yellow, and Red action card logic.
- `src/lib/csv.ts` stores CSV import/export parsing.
- `docs/pitch-script.md` contains the full 10-minute script.
- `docs/demo-runbook.md` contains the click-by-click live demo plan.

## Reset localStorage

In the Dashboard tab, click Clear local data. This removes the saved task list and restores sample demo data.

You can also run this in the browser console:

```js
localStorage.removeItem("vip.tasks.v1");
```

## Edit slides

Edit `src/data/slides.ts`. Each slide has:

- title
- key message
- 2-4 bullets
- visual type
- optional local asset
- speaker notes
- estimated time

## Edit scoring logic

Edit `src/lib/loadScore.ts`.

Current rule summary:

- Small task: +1
- Medium task: +2
- Large task: +3
- Two deadlines within 48 hours: +2
- Three or more deadlines within 72 hours: +3
- Medium effort: +1
- High effort: +2
- Unclear task: +1 each, max +2 per week
- Green: 0-4
- Yellow: 5-8
- Red: 9+

The UI labels the score as a transparent heuristic, not an AI model.

## Privacy note

VIP must remain student-owned and opt-in. It must not collect grades, GPA, counseling records, clinical data, private Canvas analytics, login data, or tracking data. Support routes are framed as where to ask, not as diagnosis or counseling advice.

## Pitch day checklist

1. Run `npm install`.
2. Run `npm run build`.
3. Run `npm run dev`.
4. Open Dashboard and click Clear local data.
5. Practice Demo Cases 1, 2, and 3 using `docs/demo-runbook.md`.
6. Open Pitch Deck and test Left/Right keyboard controls.
7. Toggle Presenter Notes with `N`.
8. Confirm the GitHub Pages base path has the real repo name.
