import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  const base = process.env.VITE_BASE_PATH || '/';

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
        workbox: {
          maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,json}'],
          globIgnores: ['**/data/snapshots/*.csv', '**/data/snapshots/snapshot-202*.csv'],
        },
        manifest: {
          id: base,
          name: 'Madrid Apoyo Especializado',
          short_name: 'MadridApoyo',
          description: 'Buscador de recursos de atención social autorizados de Madrid y Comunidad de Madrid',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: base,
          scope: base,
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/leaflet')) return 'leaflet';
            if (id.includes('node_modules/lucide-react')) return 'icons';
            if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
              return 'vendor-react';
            }
            return undefined;
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
