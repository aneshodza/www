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
    server: {
      allowedHosts: ['ffa1-2a0a-d1c0-2-f300-7cd4-a016-7214-7c02.ngrok-free.app'],
    },
  },
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'auto',
  },
});
