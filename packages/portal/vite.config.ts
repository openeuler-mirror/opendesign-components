import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: ['chrome74'],
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, './src')}/`,
      '@components': path.resolve(__dirname, '../opendesign/src/components'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  server: {
    port: 3200,
  },
});
