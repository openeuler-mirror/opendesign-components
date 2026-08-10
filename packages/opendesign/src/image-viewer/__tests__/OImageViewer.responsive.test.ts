/**
 * OImageViewer 响应式契约测试。
 *
 * 验证 media.scss 中声明的断点覆盖在对应视口下正确生效。
 * 断点设计：
 *   <=pad (0-1200)  — 操作区尺寸缩小
 *   phone (0-600)   — 缩放比例提示框缩小
 *
 * 另验证非触摸设备在窄屏下导航按钮和工具栏始终可见（无 swipe 替代方案）。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import OImageViewer from '../OImageViewer.vue';
import '../style';
import { setViewport } from '../../../__tests__/_helpers/viewport';
import { flush, resolveTokenPx } from '../../../__tests__/_helpers/dom';

const MOCK_IMG_A = 'https://example.com/a.png';
const MOCK_IMG_B = 'https://example.com/b.png';

describe('响应式契约', () => {
  describe('action-bottom / action-padding / action-item-gap', () => {
    test('desktop (>1200) — 使用默认值', async () => {
      await setViewport('desktop');
      const screen = render(OImageViewer, { props: { previewList: [MOCK_IMG_A] } });
      await flush();
      const el = screen.container.querySelector('.o-image-viewer') as HTMLElement;
      const bottom = resolveTokenPx(el, '--image-viewer-action-bottom');
      // 默认 72px
      expect(bottom).toBe(72);
    });

    test('<=pad (≤1200) — 操作区偏移缩小', async () => {
      await setViewport('pad_h');
      const screen = render(OImageViewer, { props: { previewList: [MOCK_IMG_A] } });
      await flush();
      const el = screen.container.querySelector('.o-image-viewer') as HTMLElement;
      const bottom = resolveTokenPx(el, '--image-viewer-action-bottom');
      // <=pad 时响应式 token --o-r-gap-10 缩小为 40px
      expect(bottom).toBe(40);
    });

    test('<=pad 断点前后 action-item-gap 发生变化', async () => {
      await setViewport('desktop');
      const screenDesktop = render(OImageViewer, { props: { previewList: [MOCK_IMG_A] } });
      await flush();
      const elDesktop = screenDesktop.container.querySelector('.o-image-viewer') as HTMLElement;
      const gapDesktop = resolveTokenPx(elDesktop, '--image-viewer-action-item-gap');
      expect(gapDesktop).toBe(40);

      await setViewport('pad_h');
      const screenPad = render(OImageViewer, { props: { previewList: [MOCK_IMG_A] } });
      await flush();
      const elPad = screenPad.container.querySelector('.o-image-viewer') as HTMLElement;
      const gapPad = resolveTokenPx(elPad, '--image-viewer-action-item-gap');
      // <=pad 时响应式 token --o-r-gap-7 缩小为 16px
      expect(gapPad).toBe(16);
    });
  });

  describe('ratio-width / ratio-height', () => {
    test('phone (≤600) — 缩放比例提示框尺寸缩小', async () => {
      await setViewport('phone');
      const screen = render(OImageViewer, { props: { previewList: [MOCK_IMG_A] } });
      await flush();
      const el = screen.container.querySelector('.o-image-viewer') as HTMLElement;
      const width = resolveTokenPx(el, '--image-viewer-ratio-width');
      // phone 覆盖为 64px
      expect(width).toBe(64);
    });

    test('>phone (>600) — 使用默认尺寸', async () => {
      await setViewport('pad_h');
      const screen = render(OImageViewer, { props: { previewList: [MOCK_IMG_A] } });
      await flush();
      const el = screen.container.querySelector('.o-image-viewer') as HTMLElement;
      const width = resolveTokenPx(el, '--image-viewer-ratio-width');
      // 默认 82px
      expect(width).toBe(82);
    });
  });
});

/**
 * 非触摸设备小屏可见性测试。
 *
 * 测试环境为 Playwright Chromium 无触摸，@media (hover:none) and (pointer:coarse) 不匹配。
 * 非触摸设备没有 swipe 手势替代方案，导航按钮和工具栏在窄屏下必须可见（非 display:none）。
 * 触摸设备在窄屏下由 CSS display:none 隐藏，由 swipe/pinch/触屏关闭按钮替代。
 */
describe('非触摸设备小屏可见性', () => {
  test('phone (≤600px) 非触摸 — 导航按钮可见', async () => {
    await setViewport('phone');
    const screen = render(OImageViewer, {
      props: { previewList: [MOCK_IMG_A, MOCK_IMG_B], toolbar: true },
    });
    await flush();
    const navButtons = screen.container.querySelectorAll('.o-image-viewer-nav');
    expect(navButtons).toHaveLength(2);
    expect(getComputedStyle(navButtons[0]).display).not.toBe('none');
  });

  test('phone (≤600px) 非触摸 — 工具栏可见', async () => {
    await setViewport('phone');
    const screen = render(OImageViewer, {
      props: { previewList: [MOCK_IMG_A], toolbar: true },
    });
    await flush();
    const action = screen.container.querySelector('.o-image-viewer-action');
    expect(action).toBeTruthy();
    expect(getComputedStyle(action!).display).not.toBe('none');
  });

  test('pad_v (≤840px) 非触摸 — 导航按钮可见', async () => {
    await setViewport('pad_v');
    const screen = render(OImageViewer, {
      props: { previewList: [MOCK_IMG_A, MOCK_IMG_B], toolbar: true },
    });
    await flush();
    const navButtons = screen.container.querySelectorAll('.o-image-viewer-nav');
    expect(navButtons).toHaveLength(2);
    expect(getComputedStyle(navButtons[0]).display).not.toBe('none');
  });

  test('pad_v (≤840px) 非触摸 — 工具栏可见', async () => {
    await setViewport('pad_v');
    const screen = render(OImageViewer, {
      props: { previewList: [MOCK_IMG_A], toolbar: true },
    });
    await flush();
    const action = screen.container.querySelector('.o-image-viewer-action');
    expect(action).toBeTruthy();
    expect(getComputedStyle(action!).display).not.toBe('none');
  });
});
