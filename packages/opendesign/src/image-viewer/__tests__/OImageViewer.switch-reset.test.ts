/**
 * OImageViewer 图片切换重置与紧凑屏适配测试。
 *
 * 覆盖：
 *   1. 切换上下张后重置缩放、位移、旋转
 *   2. 紧凑屏（≤ pad_v）隐藏导航按钮和工具栏
 *   3. 桌面端（> pad_v）显示导航按钮和工具栏
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import OImageViewer from '../OImageViewer.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { setViewport } from '../../../__tests__/_helpers/viewport';

/** 1×1 透明 PNG data URL，浏览器中同步加载成功，不触发 error 状态 */
const DATA_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const DATA_IMG_B = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

/** 确保图片加载完成，手动触发 load 事件以解除 isLoading 状态 */
async function ensureLoaded(screen: ReturnType<typeof render>) {
  await flush();
  const img = screen.container.querySelector('.o-image-viewer-img') as HTMLImageElement | null;
  if (img) {
    img.dispatchEvent(new Event('load'));
    await flush();
  }
}

/** 获取图片容器元素 */
function getContainer(screen: ReturnType<typeof render>) {
  return screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
}

describe('切换上下张后重置缩放', () => {
  test('放大并旋转后切换下一张，transform 重置为适屏状态', async () => {
    await setViewport('desktop');
    const screen = render(OImageViewer, {
      props: {
        previewList: [DATA_IMG, DATA_IMG_B],
        toolbar: ['zoomIn', 'rotateRight', 'reset'],
      },
    });
    await ensureLoaded(screen);

    // 放大并旋转
    const buttons = screen.container.querySelectorAll('.o-image-action-item');
    const zoomInBtn = buttons[0] as HTMLButtonElement;
    const rotateBtn = buttons[1] as HTMLButtonElement;
    zoomInBtn.click();
    await flush();
    rotateBtn.click();
    await flush();

    const beforeSwitch = getContainer(screen);
    expect(beforeSwitch.style.transform).toMatch(/scale\(1\.\d+\)/);
    expect(beforeSwitch.style.transform).toContain('rotate(90deg)');

    // 切换到下一张
    const nextBtn = screen.container.querySelector('.o-image-viewer-nav-next') as HTMLButtonElement;
    nextBtn.click();
    await flush();

    // 等待 out-in 过渡完成
    await new Promise((r) => setTimeout(r, 500));
    await flush();

    // 新图加载完成后 transform 应重置
    await ensureLoaded(screen);

    const afterSwitch = getContainer(screen);
    // 1×1 图片 fitScale=1（contain 模式，不超出屏幕）
    expect(afterSwitch.style.transform).toMatch(/scale\(1\)/);
    expect(afterSwitch.style.transform).not.toContain('rotate(90deg)');
    // 位移应归零（transform 模板始终含 translate，验证值为 0px）
    expect(afterSwitch.style.transform).toContain('translate(0px, 0px)');
  });

  test('放大后切换上一张，transform 重置为适屏状态', async () => {
    await setViewport('desktop');
    const screen = render(OImageViewer, {
      props: {
        previewList: [DATA_IMG, DATA_IMG_B],
        currentIndex: 1,
        toolbar: ['zoomIn'],
      },
    });
    await ensureLoaded(screen);

    // 放大
    const zoomInBtn = screen.container.querySelector('.o-image-action-item') as HTMLButtonElement;
    zoomInBtn.click();
    await flush();

    const beforeSwitch = getContainer(screen);
    expect(beforeSwitch.style.transform).toMatch(/scale\(1\.\d+\)/);

    // 切换到上一张
    const prevBtn = screen.container.querySelector('.o-image-viewer-nav-prev') as HTMLButtonElement;
    prevBtn.click();
    await flush();

    // 等待 out-in 过渡完成
    await new Promise((r) => setTimeout(r, 500));
    await flush();

    await ensureLoaded(screen);

    const afterSwitch = getContainer(screen);
    expect(afterSwitch.style.transform).toMatch(/scale\(1\)/);
  });
});

describe('非触摸设备所有视口显示导航按钮和工具栏', () => {
  // 测试环境为 Playwright Chromium 无触摸，@media (hover:none) and (pointer:coarse) 不匹配。
  // 非触摸设备无 swipe/pinch 替代方案，导航按钮和工具栏在任意屏幕宽度下都应可见。

  test('pad_v 视口下多图时导航按钮可见', async () => {
    await setViewport('pad_v');
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG, DATA_IMG_B] },
    });
    await flush();

    const navButtons = screen.container.querySelectorAll('.o-image-viewer-nav');
    expect(navButtons.length).toBe(2);
    expect(getComputedStyle(navButtons[0]).display).not.toBe('none');
  });

  test('pad_v 视口下工具栏可见', async () => {
    await setViewport('pad_v');
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG], toolbar: true },
    });
    await flush();

    const actionArea = screen.container.querySelector('.o-image-viewer-action');
    expect(actionArea).not.toBeNull();
    expect(getComputedStyle(actionArea!).display).not.toBe('none');
  });

  test('desktop 视口下多图时导航按钮可见', async () => {
    await setViewport('desktop');
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG, DATA_IMG_B] },
    });
    await flush();

    const navButtons = screen.container.querySelectorAll('.o-image-viewer-nav');
    expect(navButtons.length).toBe(2);
    expect(getComputedStyle(navButtons[0]).display).not.toBe('none');
  });

  test('desktop 视口下工具栏可见', async () => {
    await setViewport('desktop');
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG], toolbar: true },
    });
    await flush();

    const actionArea = screen.container.querySelector('.o-image-viewer-action');
    expect(actionArea).not.toBeNull();
    expect(getComputedStyle(actionArea!).display).not.toBe('none');
  });
});
