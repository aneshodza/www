import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://aneshodza.ch',
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'de',
        locales: {
          de: 'de-CH',
          en: 'en-GB',
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'auto',
  },
});
