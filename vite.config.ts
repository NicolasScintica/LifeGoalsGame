import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Use a relative base so assets resolve correctly on GitHub Pages (repo name: LifeGoalsGame)
  base: '/LifeGoalsGame/',
});
