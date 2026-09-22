import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Every absolute URL the page advertises — canonical, hreflang alternates,
// og:image, JSON-LD — is resolved against `site`. That means a tunnelled build
// still tells share-card validators to fetch the image from production, so you
// end up previewing whatever is deployed rather than what you just built.
// Point SITE_URL at the tunnel to preview the real thing:
//
//   SITE_URL=https://<id>.ngrok-free.app npm run build && npm run preview
//
// Leave it unset everywhere else; production must keep the canonical domain.
// Must be passed inline on the command line — this file is evaluated before
// Vite loads .env, so SITE_URL in a .env file is silently ignored. `|| `, not
// `?? `, so an empty value falls back instead of blanking every absolute URL.
const site = process.env.SITE_URL?.trim() || "https://aneshodza.ch";

export default defineConfig({
  site,
  i18n: {
    defaultLocale: "de",
    locales: ["de", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "de",
        locales: {
          de: "de-CH",
          en: "en-GB",
        },
      },
    }),
  ],
  // Tunnels for testing on a real device. `astro preview` reads this
  // top-level key (not vite.preview), and it only ever serves a built copy of
  // a site that is public anyway, so the host check buys nothing here.
  server: {
    allowedHosts: true,
  },
  vite: {
    // The dev server keeps its host check, since it also serves source. Any
    // tunnel subdomain is fine; free-tier URLs change on every restart.
    server: {
      allowedHosts: [".ngrok-free.app", ".ngrok.io", ".trycloudflare.com"],
    },
  },
  trailingSlash: "ignore",
  build: {
    inlineStylesheets: "always",
  },
});
