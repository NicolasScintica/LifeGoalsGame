# Life Goals XP Tracker

A lightweight React + TypeScript web app for tracking life categories, monthly XP, bonus quests, and a year capsule — all stored locally in your browser.

## Getting started
1. Install dependencies (Node 18+):
   ```bash
   npm install
   ```
2. Run the dev server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build && npm run preview
   ```

## GitHub Pages deployment
1. Set the Vite base path to the repo name (already set to `/LifeGoalsGame/` in `vite.config.ts`).
2. Deploy the built `dist` folder to a `gh-pages` branch:
   ```bash
   npm install
   npm run deploy
   ```
   This uses the included `gh-pages` script to publish `dist` automatically.
3. In GitHub, open **Settings → Pages** and choose **Deploy from a branch**, select the `gh-pages` branch and the `/` (root) folder.
4. Wait for the Pages build to complete, then visit `https://<your-username>.github.io/LifeGoalsGame/`.

## If Node/npm are missing
This project relies on Node (18+ recommended). If `node -v` or `npm -v` fail, install with one of these common options:

- **Via nvm (recommended):**
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  # restart shell or source your profile, then
  nvm install 18
  nvm use 18
  ```
- **Via NodeSource (Debian/Ubuntu):**
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

After installing, rerun `node -v` and `npm -v` to confirm they’re available.

## Features
- Hard-coded six life categories with icons and colors.
- Monthly review cards with 0–3 XP selector and reflection prompts.
- Bonus quest log that can award XP to categories.
- Year capsule for memories, wins, lessons, dreams, quotes, and more with filters and search.
- Anchor goals per category and yearly dashboard summaries.
- Data persisted to `localStorage` under one key (`xp_tracker_state_v1`).
