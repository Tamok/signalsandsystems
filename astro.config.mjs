// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://signalsandsystems.jellwrites.com',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      // Dual themes emit CSS variables (--shiki-light / --shiki-dark).
      // Activation rules live in src/styles/global.css and swap on .dark.
      // Use high-contrast variants so comment tokens meet WCAG 2.1 AA
      // (4.5:1) in both themes; the default github-light/dark themes share
      // a #6A737D comment color that fails AA on the dark background.
      themes: {
        light: 'github-light-high-contrast',
        dark: 'github-dark-high-contrast'
      },
      defaultColor: false
    }
  }
});