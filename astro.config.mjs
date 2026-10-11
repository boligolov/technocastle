import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import { hiddenBookSlugs } from './src/config/books.mjs';

const hiddenBooks = new RegExp(`/books/(${hiddenBookSlugs.join('|')})/`);

export default defineConfig({
  site: 'https://technocastle.site',
  // Preserve Astro 6 whitespace behavior (v7 default changed to 'jsx')
  compressHTML: true,
  integrations: [
    sitemap({
      // The visiting card and hidden books are noindex; the root only redirects
      // to a language version and would be listed as a second "ru" alternate of
      // the home page
      filter: (page) =>
        !/\/card\/?$/.test(page) &&
        !hiddenBooks.test(page) &&
        new URL(page).pathname !== '/',
      i18n: {
        defaultLocale: 'ru',
        locales: { ru: 'ru', pl: 'pl', en: 'en' },
      },
    }),
  ],
});