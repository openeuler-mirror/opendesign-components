import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    target: ['chrome74'],
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: 'OpenAnalytics',
      fileName: 'open-analytics',
    },
  },
  plugins: [],
  resolve: {
    alias: {
      '@/': `${resolve(__dirname, './src')}/`,
    },
  },
  server: {
    port: 3300,
  },
});
