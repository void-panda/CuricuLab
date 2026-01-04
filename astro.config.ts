// @ts-check
import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

// Site URL configuration
const site = process.env.SITE ?? "https://curiculab.com"; // Assuming a default production domain
const base = process.env.BASE || "/";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: netlify(),
  site,
  base,
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
