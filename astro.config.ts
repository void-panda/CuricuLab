// @ts-check
import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// Site URL configuration
const site = process.env.SITE ?? "http://localhost:4321";
const base = process.env.BASE || "/";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: netlify(),
  site,
  base,
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
