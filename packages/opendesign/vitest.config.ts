import path from 'path';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  // 类型断言：vite@6 Plugin 类型与 vitest 4 内部依赖的 vite 类型不互通，仅 IDE 红线，运行时无影响
  plugins: [vue(), vueJsx()] as never,
  resolve: {
    alias: {
      '@opensig/opendesign': path.resolve(__dirname, './src'),
    },
  },
  test: {
    include: ['src/**/*.test.ts', '__tests__/*.test.ts'],
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
      exclude: [
        'src/**/__tests__/**',
        'src/**/*.test.ts',
        'src/**/__docs__/**',
        'src/**/__demo__/**',
        'src/**/*.d.ts',
        'src/_virtual/**',
        'src/icon-components/**',
      ],
    },
  },
});
