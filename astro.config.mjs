// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    react()
  ],
  output: 'server', // Use server mode to enable API routes
  adapter: cloudflare(),
  site: 'https://activeaway.com',

  build: {
    assets: 'assets'
  }
});