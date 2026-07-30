/**
 * ODivider 响应式契约测试。
 *
 * media.scss 声明：
 *   @<=pad：字号从 text1 → tip1
 *   @<=pad_v：line 缩放 0.5
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import ODivider from '../ODivider.vue';
import { BREAKPOINTS, setViewport } from '../../../__tests__/_helpers/viewport';

async function renderDivider() {
  await setViewport('desktop');
  const screen = render(ODivider, { props: { direction: 'h' }, slots: { default: () => 'Label' } });
  return screen.container.querySelector('.o-divider') as HTMLElement;
}

describe('响应式契约', () => {
  test('ODivider @desktop - desktop 基准值', async () => {
    await setViewport('desktop');
    const screen = render(ODivider, { props: { direction: 'h' }, slots: { default: () => 'L' } });
    const el = screen.container.querySelector('.o-divider') as HTMLElement;
    expect(el).not.toBeNull();
  });

  test('ODivider @pad_v - <=pad_v 断点下 line 缩放', async () => {
    await setViewport('pad_v');
    const screen = render(ODivider, { props: { direction: 'h' } });
    const line = screen.container.querySelector('.o-divider-line') as HTMLElement;
    const cs = getComputedStyle(line);
    // <=pad_v 下 line 有 transform scaleY(0.5)
    expect(cs.transform).not.toBe('none');
  });

  test('ODivider @phone - 级联自 pad_v', async () => {
    await setViewport('phone');
    const screen = render(ODivider, { props: { direction: 'h' } });
    const line = screen.container.querySelector('.o-divider-line') as HTMLElement;
    const cs = getComputedStyle(line);
    // phone 级联 pad_v 的 transform
    expect(cs.transform).not.toBe('none');
  });
});
