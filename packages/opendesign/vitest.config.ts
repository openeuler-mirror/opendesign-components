import path from 'path';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@opensig/opendesign': path.resolve(__dirname, './src'),
    },
  },
  test: {
    include: ['src/**/__tests__/*.test.ts'],
    exclude: ['**/node_modules/**'],
    setupFiles: ['__tests__/setup.ts'],
    browser: {
      enabled: true,
      provider: playwright(),
      headless: false,
      screenshotFailures: false,
      instances: [{ browser: 'chromium' }],
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,vue}'],
      exclude: ['src/**/__tests__/**', 'src/**/__docs__/**', 'src/**/__demo__/**', 'src/**/*.d.ts', 'src/_virtual/**', 'src/icon-components/**'],
    },
  },
});
