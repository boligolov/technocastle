import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://technocastle.com',
  // Preserve Astro 6 whitespace behavior (v7 default changed to 'jsx')
  compressHTML: true,
  integrations: [sitemap()],
});