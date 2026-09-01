/**
 * OImageViewer 图片切换滑动动画测试。
 *
 * 覆盖：
 *   1. next 切换 — 容器带有 slide-next 方向类
 *   2. prev 切换 — 容器带有 slide-prev 方向类
 *   3. 键盘导航方向 — ArrowRight/ArrowLeft 对应方向类
 *   4. 无限循环 — 循环切换方向正确
 *   5. retry — 使用 fade 方向（非导航场景）
 *   6. 图片切换时 img 元素重新创建（Transition 触发）
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import OImageViewer from '../OImageViewer.vue';
import { flush } from '../../../__tests__/_helpers/dom';

/** 1×1 透明 PNG data URL，浏览器中同步加载成功，不触发 error 状态 */
const DATA_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const DATA_IMG_B = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const DATA_IMG_C = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

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

describe('图片切换滑动动画', () => {
  test('next 切换后容器带有 slide-next 方向类', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG, DATA_IMG_B], currentIndex: 0 },
    });
    await ensureLoaded(screen);

    const nextBtn = screen.container.querySelector('.o-image-viewer-nav-next') as HTMLButtonElement;
    nextBtn.click();
    await flush();

    expect(getContainer(screen).classList.contains('o-image-viewer-slide-next')).toBe(true);
  });

  test('prev 切换后容器带有 slide-prev 方向类', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG, DATA_IMG_B], currentIndex: 1 },
    });
    await ensureLoaded(screen);

    const prevBtn = screen.container.querySelector('.o-image-viewer-nav-prev') as HTMLButtonElement;
    prevBtn.click();
    await flush();

    expect(getContainer(screen).classList.contains('o-image-viewer-slide-prev')).toBe(true);
  });

  test('键盘 ArrowRight 触发 slide-next 方向', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG, DATA_IMG_B], currentIndex: 0 },
    });
    await ensureLoaded(screen);

    const root = screen.container.querySelector('.o-image-viewer') as HTMLElement;
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await flush();

    expect(getContainer(screen).classList.contains('o-image-viewer-slide-next')).toBe(true);
  });

  test('键盘 ArrowLeft 触发 slide-prev 方向', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG, DATA_IMG_B], currentIndex: 1 },
    });
    await ensureLoaded(screen);

    const root = screen.container.querySelector('.o-image-viewer') as HTMLElement;
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await flush();

    expect(getContainer(screen).classList.contains('o-image-viewer-slide-prev')).toBe(true);
  });

  test('无限循环从最后一张到第一张为 slide-next 方向', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG, DATA_IMG_B, DATA_IMG_C], currentIndex: 2, infinite: true },
    });
    await ensureLoaded(screen);

    const nextBtn = screen.container.querySelector('.o-image-viewer-nav-next') as HTMLButtonElement;
    nextBtn.click();
    await flush();

    expect(getContainer(screen).classList.contains('o-image-viewer-slide-next')).toBe(true);
  });

  test('无限循环从第一张到最后一张为 slide-prev 方向', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG, DATA_IMG_B, DATA_IMG_C], currentIndex: 0, infinite: true },
    });
    await ensureLoaded(screen);

    const prevBtn = screen.container.querySelector('.o-image-viewer-nav-prev') as HTMLButtonElement;
    prevBtn.click();
    await flush();

    expect(getContainer(screen).classList.contains('o-image-viewer-slide-prev')).toBe(true);
  });

  test('retry 后容器带有 slide-fade 方向类（非导航场景）', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG], currentIndex: 0 },
    });
    await flush();

    // 触发图片加载错误
    const img = screen.container.querySelector('.o-image-viewer-img') as HTMLImageElement | null;
    if (img) {
      img.dispatchEvent(new Event('error'));
      await flush();
    }

    // 点击错误提示触发 retry
    const errorEl = screen.container.querySelector('.o-image-viewer-error') as HTMLElement;
    expect(errorEl).not.toBeNull();
    errorEl.click();
    await flush();

    expect(getContainer(screen).classList.contains('o-image-viewer-slide-fade')).toBe(true);
  });

  test('图片切换后 img 元素重新创建（Transition 触发）', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG, DATA_IMG_B], currentIndex: 0 },
    });
    await ensureLoaded(screen);

    const imgBefore = screen.container.querySelector('.o-image-viewer-img');

    const nextBtn = screen.container.querySelector('.o-image-viewer-nav-next') as HTMLButtonElement;
    nextBtn.click();
    // 等待 out-in 过渡完成（leave 200ms + enter 200ms）
    await new Promise((r) => setTimeout(r, 500));
    await flush();

    const imgAfter = screen.container.querySelector('.o-image-viewer-img');
    // Transition + key 变化导致 img 元素重新创建
    expect(imgBefore).not.toBe(imgAfter);
  });
});
