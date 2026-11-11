/**
 * OSearch ARIA 无障碍契约测试。
 *
 * 验证根元素 role='search'，使读无障碍树的 AI 代理与屏幕阅读器
 * 能识别该区域为搜索控件，而非通用 div。
 */
import { test, expect, describe, afterEach, beforeEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import OSearch from '../OSearch.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { setViewport } from '../../../__tests__/_helpers/viewport';

const cleanupBodyPopups = () => {
  document.body.querySelectorAll('.o-options-popup, .o-select-options, [data-v-popper-escaped], .o-popup-content').forEach((el) => el.remove());
};

describe('ARIA — 根元素', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('根元素设 role="search"', async () => {
    const screen = render(OSearch, {});
    await flush();
    const root = screen.container.querySelector('.o-search') as HTMLElement;
    expect(root.getAttribute('role')).toBe('search');
  });

  test('未传 ariaLabel 时回退 i18n 默认词条，显式传入时覆盖', async () => {
    const bare = render(OSearch, {});
    await flush();
    expect((bare.container.querySelector('.o-search') as HTMLElement).getAttribute('aria-label')).toBeTruthy();
    const explicit = render(OSearch, { props: { ariaLabel: '站内搜索' } });
    await flush();
    expect((explicit.container.querySelector('.o-search') as HTMLElement).getAttribute('aria-label')).toBe('站内搜索');
  });
});
