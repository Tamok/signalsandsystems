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
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      },
      defaultColor: false
    }
  }
});