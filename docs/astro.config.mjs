// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: '🔐 Input OTP Native',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/yjose/input-otp-native',
        },
      ],
      sidebar: [
        // Each item here is one entry in the navigation menu.
        { label: 'Getting Started', slug: 'getting-started' },
        {
          label: 'Examples',
          autogenerate: { directory: 'examples' },
        },
      ],
      customCss: [
        './src/styles/global.css',
        '@fontsource/ibm-plex-serif/400.css',
        '@fontsource/ibm-plex-serif/600.css',
      ],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
