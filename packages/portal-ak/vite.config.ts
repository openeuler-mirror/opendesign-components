import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    target: ['chrome74'],
    outDir: '../../output/ak',
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, './src')}/`,
      '@opendesign-src': path.resolve(__dirname, '../opendesign/src'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: "@use '@/assets/theme/mixin.scss' as *;",
  //     },
  //   },
  // },
  server: {
    port: 3202,
  },
});
