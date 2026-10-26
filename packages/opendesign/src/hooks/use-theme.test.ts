/**
 * hooks/use-theme.ts 全局主题管理测试。
 *
 * 验证 useTheme 返回的 theme ref 能正确读写主题，
 * 且主题变化时自动更新 documentElement data-o-theme 和 localStorage。
 * watch 是异步的，theme 赋值后须 await nextTick 再断言。
 */
import { test, expect, describe, afterEach } from 'vitest';
import { nextTick } from 'vue';
import { useTheme } from './use-theme';

describe('useTheme', () => {
  const originalTheme = document.documentElement.dataset.oTheme;
  const originalStorage = localStorage.getItem('__theme__');

  afterEach(async () => {
    // 重置模块级 rootTheme 为空字符串（rootTheme 未导出，通过 theme ref 间接清空）
    const { theme } = useTheme();
    theme.value = '';
    await nextTick();
    // 恢复原始 DOM 和 localStorage
    if (originalTheme) {
      document.documentElement.dataset.oTheme = originalTheme;
    } else {
      delete document.documentElement.dataset.oTheme;
    }
    if (originalStorage) {
      localStorage.setItem('__theme__', originalStorage);
    } else {
      localStorage.removeItem('__theme__');
    }
  });

  test('useTheme - 默认主题为 light（首次无 localStorage 时）', () => {
    localStorage.removeItem('__theme__');
    const { theme } = useTheme('light');
    expect(theme.value).toBe('light');
  });

  test('useTheme - theme 变化时更新 documentElement data-o-theme', async () => {
    const { theme } = useTheme('light');
    theme.value = 'dark';
    await nextTick();
    expect(document.documentElement.dataset.oTheme).toBe('dark');
  });

  test('useTheme - theme 变化时写入 localStorage', async () => {
    const { theme } = useTheme('light');
    theme.value = 'dark';
    await nextTick();
    expect(localStorage.getItem('__theme__')).toBe('dark');
  });
});
