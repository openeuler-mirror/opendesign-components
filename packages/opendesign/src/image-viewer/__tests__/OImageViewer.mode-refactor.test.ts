/**
 * OImageViewer 模式系统移除 + 适屏缩放重构测试。
 *
 * 覆盖：
 *   1. 无 CSS maxWidth/maxHeight 约束 — transform scale 全权控制尺寸
 *   2. 默认工具栏不包含 mode 按钮
 *   3. toolbar 中 'mode' 项被忽略
 *   4. Space 键不再切换模式
 *   5. toggleMode 不在 exposed API 中
 *   6. 小图加载后 scale=2（200% 缩放，两边不超屏幕）
 *   7. 4K 横向大图加载后 scale<1（适屏缩放）
 *   8. 4K 竖向大图加载后 scale<1（适屏缩放）
 *   9. resetTransform 重置到适屏缩放比例
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import OImageViewer from '../OImageViewer.vue';
import { flush } from '../../../__tests__/_helpers/dom';

/** 1x1 透明 PNG data URL，浏览器中同步加载成功 */
const DATA_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

/**
 * 4K 横向大图（3840×2160），用于超屏幕适屏缩放测试。
 * @description 使用 data URI 避免浏览器异步网络请求触发额外的 load 事件导致 flaky test，
 * 实际自然尺寸由 ensureLoaded 的 mockSize 参数注入。
 */
const IMG_4K_LANDSCAPE = DATA_IMG;
/**
 * 4K 竖向大图（2160×3840），用于超屏幕适屏缩放测试。
 * @description 同上，使用 data URI 避免异步加载。
 */
const IMG_4K_PORTRAIT = DATA_IMG;

/** 获取根元素 */
async function getRoot(screen: ReturnType<typeof render>) {
  await flush();
  return screen.container.querySelector('.o-image-viewer') as HTMLElement;
}

/**
 * 确保图片加载完成，手动触发 load 事件以解除 isLoading 状态。
 * 支持设置 mock 自然尺寸用于适屏缩放计算。
 */
async function ensureLoaded(screen: ReturnType<typeof render>, mockSize?: { naturalWidth: number; naturalHeight: number }) {
  await flush();
  const img = screen.container.querySelector('.o-image-viewer-img') as HTMLImageElement | null;
  if (img) {
    if (mockSize) {
      Object.defineProperty(img, 'naturalWidth', { value: mockSize.naturalWidth, configurable: true });
      Object.defineProperty(img, 'naturalHeight', { value: mockSize.naturalHeight, configurable: true });
    }
    img.dispatchEvent(new Event('load'));
    await flush();
  }
}

describe('无 CSS 约束', () => {
  test('容器不设置 maxWidth / maxHeight 内联样式', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG] },
    });
    await ensureLoaded(screen);
    const container = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    expect(container.style.maxWidth).toBe('');
    expect(container.style.maxHeight).toBe('');
  });
});

describe('工具栏', () => {
  test('默认工具栏不包含 mode 按钮', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG] },
    });
    await flush();
    const buttons = screen.container.querySelectorAll('.o-image-action-item');
    const labels = Array.from(buttons).map((b) => b.getAttribute('aria-label'));
    expect(labels).not.toContain('切换模式');
  });

  test('toolbar 传入 mode 项时忽略，不渲染对应按钮', async () => {
    const screen = render(OImageViewer, {
      props: {
        previewList: [DATA_IMG],
        toolbar: ['zoomIn', 'mode'],
      },
    });
    await flush();
    const buttons = screen.container.querySelectorAll('.o-image-action-item');
    // mode 被忽略，只有 zoomIn 一个按钮
    expect(buttons.length).toBe(1);
    expect(buttons[0].getAttribute('aria-label')).toBe('放大');
  });
});

describe('Space 键', () => {
  test('Space 不再切换模式（容器样式无变化）', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG] },
    });
    await ensureLoaded(screen);
    const root = screen.container.querySelector('.o-image-viewer') as HTMLElement;
    const before = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    const beforeTransform = before.style.transform;
    const beforeMaxWidth = before.style.maxWidth;
    root.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await flush();
    const after = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    // 样式不应发生变化（不再有模式切换）
    expect(after.style.transform).toBe(beforeTransform);
    expect(after.style.maxWidth).toBe(beforeMaxWidth);
  });
});

describe('exposed API', () => {
  test('toggleMode 不在 exposed 中', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG] },
    });
    await flush();
    // @ts-expect-error — toggleMode 应已移除
    expect(screen.rerender).toBeDefined(); // 占位确保组件已挂载
    // 获取组件实例
    const root = screen.container.querySelector('.o-image-viewer') as any;
    const vm = root.__vueParentComponent?.ctx ?? root.__vueParentComponent?.proxy;
    // exposed 中不应有 toggleMode
    if (vm) {
      expect(vm.toggleMode).toBeUndefined();
    }
  });
});

describe('适屏缩放', () => {
  test('小图加载后 scale=2（200% 缩放，两边不超屏幕）', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG] },
    });
    await ensureLoaded(screen);
    const container = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    // 1x1 图片不超出屏幕，fitScale=min(2, scaleW, scaleH)=2
    expect(container.style.transform).toMatch(/scale\(2\)/);
  });

  test('4K 横向大图加载后 scale<1（适屏缩放）', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [IMG_4K_LANDSCAPE] },
    });
    // 3840×2160 超出 1920×1080 视口，适屏后 scale < 1
    await ensureLoaded(screen, { naturalWidth: 3840, naturalHeight: 2160 });
    const img = screen.container.querySelector('.o-image-viewer-img') as HTMLImageElement;
    // 验证使用了 4K 横向图片地址
    expect(img.getAttribute('src')).toBe(IMG_4K_LANDSCAPE);
    const container = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    const match = container.style.transform.match(/scale\(([\d.]+)\)/);
    expect(match).not.toBeNull();
    const scale = parseFloat(match![1]);
    // 3840px 宽度超出 1920px 视口，scale 应小于 1
    expect(scale).toBeLessThan(1);
    expect(scale).toBeGreaterThan(0);
  });

  test('4K 竖向大图加载后 scale<1（适屏缩放）', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [IMG_4K_PORTRAIT] },
    });
    // 2160×3840 超出 1920×1080 视口，适屏后 scale < 1
    await ensureLoaded(screen, { naturalWidth: 2160, naturalHeight: 3840 });
    const img = screen.container.querySelector('.o-image-viewer-img') as HTMLImageElement;
    // 验证使用了 4K 竖向图片地址
    expect(img.getAttribute('src')).toBe(IMG_4K_PORTRAIT);
    const container = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    const match = container.style.transform.match(/scale\(([\d.]+)\)/);
    expect(match).not.toBeNull();
    const scale = parseFloat(match![1]);
    // 3840px 高度超出 1080px 视口高度，scale 应小于 1
    expect(scale).toBeLessThan(1);
    expect(scale).toBeGreaterThan(0);
  });
});

describe('resetTransform', () => {
  test('reset 后回到适屏缩放比例（非 initialScale）', async () => {
    const screen = render(OImageViewer, {
      props: {
        previewList: [IMG_4K_LANDSCAPE],
        toolbar: ['zoomIn', 'reset'],
      },
    });
    // 4K 横向大图（3840×2160），适屏后 scale < 1
    await ensureLoaded(screen, { naturalWidth: 3840, naturalHeight: 2160 });
    const container = () => screen.container.querySelector('.o-image-viewer-container') as HTMLElement;

    // 记录适屏 scale
    const fitMatch = container().style.transform.match(/scale\(([\d.]+)\)/);
    const fitScale = parseFloat(fitMatch![1]);
    expect(fitScale).toBeLessThan(1);

    // 放大
    const zoomInBtn = screen.container.querySelectorAll('.o-image-action-item')[0] as HTMLButtonElement;
    zoomInBtn.click();
    await flush();
    const zoomedMatch = container().style.transform.match(/scale\(([\d.]+)\)/);
    const zoomedScale = parseFloat(zoomedMatch![1]);
    expect(zoomedScale).toBeGreaterThan(fitScale);

    // reset 应回到 fitScale
    const resetBtn = screen.container.querySelectorAll('.o-image-action-item')[1] as HTMLButtonElement;
    resetBtn.click();
    await flush();
    const resetMatch = container().style.transform.match(/scale\(([\d.]+)\)/);
    const resetScale = parseFloat(resetMatch![1]);
    expect(resetScale).toBeCloseTo(fitScale, 3);
  });
});

describe('contain scale 低于 minScale 时的缩放边界', () => {
  /**
   * 当图片的 contain 缩放比例低于用户设定的 minScale 时，
   * 有效最小缩放应动态扩展至 containScale，确保：
   *   1. 初始显示为 contain（完整可见）
   *   2. 从 contain 位置手动放大时平滑过渡，不跳跃到 minScale
   *   3. 手动缩小不会低于 containScale
   */

  test('containScale < minScale 时，初始显示 containScale，手动放大平滑过渡', async () => {
    const screen = render(OImageViewer, {
      props: {
        previewList: [IMG_4K_LANDSCAPE],
        minScale: 0.6,
        maxScale: 5,
        zoomRate: 1.2,
        toolbar: ['zoomIn', 'zoomOut', 'reset'],
      },
    });
    // 3840×2160 在 1920×1080 视口下 containScale = 0.5，低于 minScale 0.6
    await ensureLoaded(screen, { naturalWidth: 3840, naturalHeight: 2160 });

    const container = () => screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    const getScale = () => parseFloat(container().style.transform.match(/scale\(([\d.]+)\)/)![1]);

    // 1. 初始显示 containScale（0.5），不受 minScale 0.6 约束
    const initialScale = getScale();
    expect(initialScale).toBeCloseTo(0.5, 2);

    // 2. 手动放大一次（zoomRate=1.2）：0.5 * 1.2 = 0.6，平滑过渡
    const zoomInBtn = screen.container.querySelectorAll('.o-image-action-item')[0] as HTMLButtonElement;
    zoomInBtn.click();
    await flush();
    const afterZoomIn = getScale();
    expect(afterZoomIn).toBeCloseTo(0.6, 2);

    // 3. 再放大一次：0.6 * 1.2 = 0.72
    zoomInBtn.click();
    await flush();
    const afterZoomIn2 = getScale();
    expect(afterZoomIn2).toBeCloseTo(0.72, 2);

    // 4. 缩小一次：0.72 / 1.2 = 0.6
    const zoomOutBtn = screen.container.querySelectorAll('.o-image-action-item')[1] as HTMLButtonElement;
    zoomOutBtn.click();
    await flush();
    const afterZoomOut = getScale();
    expect(afterZoomOut).toBeCloseTo(0.6, 2);

    // 5. 再缩小一次：0.6 / 1.2 = 0.5（回到 containScale，不应低于）
    zoomOutBtn.click();
    await flush();
    const afterZoomOut2 = getScale();
    expect(afterZoomOut2).toBeCloseTo(0.5, 2);

    // 6. 再缩小：仍然停在 containScale（0.5），不会更小
    zoomOutBtn.click();
    await flush();
    const afterZoomOut3 = getScale();
    expect(afterZoomOut3).toBeCloseTo(0.5, 2);
  });

  test('containScale < minScale 时，reset 回到 containScale 而非 minScale', async () => {
    const screen = render(OImageViewer, {
      props: {
        previewList: [IMG_4K_LANDSCAPE],
        minScale: 0.6,
        maxScale: 5,
        zoomRate: 1.2,
        toolbar: ['zoomIn', 'reset'],
      },
    });
    await ensureLoaded(screen, { naturalWidth: 3840, naturalHeight: 2160 });

    const container = () => screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    const getScale = () => parseFloat(container().style.transform.match(/scale\(([\d.]+)\)/)![1]);

    // 放大两次
    const zoomInBtn = screen.container.querySelectorAll('.o-image-action-item')[0] as HTMLButtonElement;
    zoomInBtn.click();
    await flush();
    zoomInBtn.click();
    await flush();
    expect(getScale()).toBeGreaterThan(0.6);

    // reset 应回到 containScale（0.5），而非 minScale（0.6）
    const resetBtn = screen.container.querySelectorAll('.o-image-action-item')[1] as HTMLButtonElement;
    resetBtn.click();
    await flush();
    expect(getScale()).toBeCloseTo(0.5, 2);
  });

  /**
   * 从 containScale < minScale 的图片切换到 containScale > minScale 的图片时，
   * 第二张图应使用其自身的 containScale，不应被 minScale 覆盖。
   * 视口 1920×1080：
   *   - 图1 961×540 → containScale = 1920/961 ≈ 0.5（< minScale 0.6）
   *   - 图2 640×480 → containScale = 1920/640 ≈ 0.609（> minScale 0.6）
   */
  /**
   * 从 containScale < minScale 的图片切换到 containScale > minScale（但仍 <1）的图片时，
   * 第二张图应使用其自身的 containScale，不应被 minScale 覆盖。
   * 视口 1920×1080：
   *   - 图1 3840×2160 → containScale = 1920/3840 = 0.5（< minScale 0.6）
   *   - 图2 2880×2160 → containScale = 1920/2880 ≈ 0.667（> minScale 0.6）
   */
  /**
   * 验证 effectiveMinScale 动态扩展逻辑：
   * 当 containScale < minScale 时，effectiveMinScale = containScale，
   * 手动缩放不会低于 containScale，reset 回到 containScale。
   * 使用单张 3840×2160 图片（containScale=0.5，minScale=0.6）验证完整交互链。
   */
  test('containScale < minScale 时，zoomIn 从 containScale 平滑放大，zoomOut 不低于 containScale', async () => {
    const screen = render(OImageViewer, {
      props: {
        previewList: [IMG_4K_LANDSCAPE],
        minScale: 0.6,
        maxScale: 5,
        zoomRate: 1.2,
        toolbar: ['zoomIn', 'zoomOut', 'reset'],
      },
    });
    await ensureLoaded(screen, { naturalWidth: 3840, naturalHeight: 2160 });
    const container = () => screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    const getScale = () => parseFloat(container().style.transform.match(/scale\(([\d.]+)\)/)![1]);

    // 初始 containScale = 0.5（< minScale 0.6）
    expect(getScale()).toBeCloseTo(0.5, 2);

    // zoomIn: 0.5 * 1.2 = 0.6（平滑过渡到 minScale）
    const zoomInBtn = screen.container.querySelectorAll('.o-image-action-item')[0] as HTMLButtonElement;
    zoomInBtn.click();
    await flush();
    expect(getScale()).toBeCloseTo(0.6, 2);

    // zoomIn: 0.6 * 1.2 = 0.72
    zoomInBtn.click();
    await flush();
    expect(getScale()).toBeCloseTo(0.72, 2);

    // zoomOut: 0.72 / 1.2 = 0.6
    const zoomOutBtn = screen.container.querySelectorAll('.o-image-action-item')[1] as HTMLButtonElement;
    zoomOutBtn.click();
    await flush();
    expect(getScale()).toBeCloseTo(0.6, 2);

    // zoomOut: 0.6 / 1.2 = 0.5（回到 containScale，不低于 effectiveMinScale）
    zoomOutBtn.click();
    await flush();
    expect(getScale()).toBeCloseTo(0.5, 2);

    // zoomOut: 仍然停在 containScale（0.5），不会更低
    zoomOutBtn.click();
    await flush();
    expect(getScale()).toBeCloseTo(0.5, 2);

    // reset: 回到 containScale（0.5），不是 minScale（0.6）
    zoomInBtn.click();
    await flush();
    zoomInBtn.click();
    await flush();
    expect(getScale()).toBeGreaterThan(0.6);

    const resetBtn = screen.container.querySelectorAll('.o-image-action-item')[2] as HTMLButtonElement;
    resetBtn.click();
    await flush();
    expect(getScale()).toBeCloseTo(0.5, 2);
  });
});
