import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { plugin as markdownPlugin } from './plugins/markdown/vueMdTranslate';
import Inspect from 'vite-plugin-inspect';

import { injectDemoAndApi } from './plugins/injectDemoAndApi';
import { injectDemoSource } from './plugins/injectDemoSource';
import { injectDemoDocs } from './plugins/injectDemoDocs';
import generateComponentRouter from './plugins/generateComponentRouter';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: ['chrome74'],
    outDir: './dist',
  },
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    injectDemoAndApi(),
    injectDemoSource(),
    injectDemoDocs(),
    markdownPlugin,
    generateComponentRouter(),
    Inspect(),
  ],
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, './src')}/`,
      '@assets': path.resolve(__dirname, './src/assets'),
      '@opensig/opendesign': path.resolve(__dirname, '../opendesign/src'),
    },
  },
  server: {
    port: 3300,
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production'),
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@opensig/opendesign/_styles/mixin.scss" as *;\n',
      },
    },
  },
});
