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
The repo now includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds the Vite app and ships the contents of
`dist` to GitHub Pages. Use it to avoid a blank `index.html` being served without the compiled bundle.

1. Confirm the Vite base path matches the repo name (already `/LifeGoalsGame/` in `vite.config.ts`).
2. In GitHub **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab); the workflow installs deps, runs `npm run build`, and
   publishes `dist` to Pages.
4. Your site will be available at `https://<your-username>.github.io/LifeGoalsGame/` once the deploy job finishes.
5. If you prefer the manual `gh-pages` branch approach, keep using:
   ```bash
   npm install
   npm run deploy
   ```
   Then point Pages to the `gh-pages` branch root.

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
