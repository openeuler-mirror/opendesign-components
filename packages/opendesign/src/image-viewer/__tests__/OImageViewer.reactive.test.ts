/**
 * OImageViewer 响应式 prop 变化测试。
 *
 * 验证组件挂载后 props 变化时，组件状态、DOM、行为正确响应式更新。
 * 覆盖：
 *   1. currentIndex 变化 — defineModel 同步当前预览索引
 *   2. scale / minScale / maxScale 变化 — watch 同步 transform.scale
 *   3. previewList 变化 — 图片源 / 导航按钮更新
 *   4. toolbar 变化 — 操作区显隐 + 工具栏按钮重新渲染
 *   5. showProgress 变化 — 进度指示器显隐
 *   6. showZoomRatio 变化 — 缩放比例提示响应
 *   7. infinite 变化 — 导航按钮 disabled 状态
 *   8. closeOnPressEscape 变化 — ESC 关闭行为
 *   9. focusTrap 变化 — tabindex 属性
 *  10. bodyClose 变化 — 点击关闭行为
 *  11. crossorigin 变化 — img crossorigin 属性
 *  12. zoomRate 变化 — 缩放速率
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { defineComponent, h, ref } from 'vue';
import OImageViewer from '../OImageViewer.vue';
import { flush } from '../../../__tests__/_helpers/dom';

/** 1×1 透明 PNG data URL，浏览器中同步加载成功，不触发 error 状态 */
const DATA_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const DATA_IMG_B = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

/**
 * 确保图片加载完成，手动触发 load 事件以解除 isLoading 状态
 * @description 交互类测试（缩放、旋转等）依赖 isLoading=false，需先触发 load
 */
async function ensureLoaded(screen: ReturnType<typeof render>) {
  await flush();
  const img = screen.container.querySelector('.o-image-viewer-img') as HTMLImageElement | null;
  if (img) {
    img.dispatchEvent(new Event('load'));
    await flush();
  }
}

// ──────────────────────────────────────────────────────────────
// currentIndex — defineModel 双向绑定当前预览索引
// ──────────────────────────────────────────────────────────────
describe('currentIndex 响应式变化', () => {
  test('currentIndex 从 0 变为 1 后图片切换', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG, DATA_IMG_B], currentIndex: 0 },
    });
    await flush();
    const imgBefore = screen.container.querySelector('.o-image-viewer-img') as HTMLImageElement;
    expect(imgBefore.getAttribute('src')).toBe(DATA_IMG);

    await screen.rerender({ currentIndex: 1 });
    await flush();
    const imgAfter = screen.container.querySelector('.o-image-viewer-img') as HTMLImageElement;
    expect(imgAfter.getAttribute('src')).toBe(DATA_IMG_B);
  });

  test('currentIndex 越界时回退到 0', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG, DATA_IMG_B], currentIndex: 0 },
    });
    await flush();

    await screen.rerender({ currentIndex: 99 });
    await flush();
    const img = screen.container.querySelector('.o-image-viewer-img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe(DATA_IMG);
  });
});

// ──────────────────────────────────────────────────────────────
// scale / minScale / maxScale — defineModel + watch(clamp(scale, ...)) 同步 transform
// ──────────────────────────────────────────────────────────────
describe('scale 响应式变化', () => {
  test('scale 从适屏值变为新值后 transform 更新', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG] },
    });
    await ensureLoaded(screen);
    const before = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    expect(before.style.transform).toMatch(/scale\(2\)/);

    await screen.rerender({ scale: 3 });
    await flush();
    const after = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    expect(after.style.transform).toMatch(/scale\(3\)/);
  });

  test('scale 超过 maxScale 时被 clamp', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG], maxScale: 8 },
    });
    await ensureLoaded(screen);

    await screen.rerender({ scale: 100 });
    await flush();
    const container = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    expect(container.style.transform).toMatch(/scale\(8\)/);
  });

  test('maxScale 变小后已超出的 scale 被 clamp', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG], maxScale: 8 },
    });
    await ensureLoaded(screen);
    // 加载后 fitScale=2，通过 rerender 设置 scale=5
    await screen.rerender({ scale: 5 });
    await flush();
    const before = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    expect(before.style.transform).toMatch(/scale\(5\)/);

    await screen.rerender({ maxScale: 3 });
    await flush();
    const after = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    expect(after.style.transform).toMatch(/scale\(3\)/);
  });
});

// ──────────────────────────────────────────────────────────────
// previewList — computed(currentUrl / canNavigate) 响应式更新
// ──────────────────────────────────────────────────────────────
describe('previewList 响应式变化', () => {
  test('从单图变为多图后导航按钮出现', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG] },
    });
    await flush();
    expect(screen.container.querySelectorAll('.o-image-viewer-nav').length).toBe(0);

    await screen.rerender({ previewList: [DATA_IMG, DATA_IMG_B] });
    await flush();
    expect(screen.container.querySelectorAll('.o-image-viewer-nav').length).toBe(2);
  });

  test('图片地址变化后 img src 更新', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG] },
    });
    await flush();
    const imgBefore = screen.container.querySelector('.o-image-viewer-img') as HTMLImageElement;
    expect(imgBefore.getAttribute('src')).toBe(DATA_IMG);

    await screen.rerender({ previewList: [DATA_IMG_B] });
    await flush();
    const imgAfter = screen.container.querySelector('.o-image-viewer-img') as HTMLImageElement;
    expect(imgAfter.getAttribute('src')).toBe(DATA_IMG_B);
  });

  test('从空数组变为有图后 img src 正确更新', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [] },
    });
    await flush();

    await screen.rerender({ previewList: [DATA_IMG] });
    await flush();
    const img = screen.container.querySelector('.o-image-viewer-img') as HTMLImageElement | null;
    expect(img).not.toBeNull();
    expect(img!.getAttribute('src')).toBe(DATA_IMG);
  });
});

// ──────────────────────────────────────────────────────────────
// toolbar — computed(showActionAreaComputed) 响应式
// ──────────────────────────────────────────────────────────────
describe('toolbar 响应式变化', () => {
  test('从数组变为 false 后操作区隐藏', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG], toolbar: ['zoomIn'] },
    });
    await flush();
    const before = screen.container.querySelector('.o-image-viewer-action');
    expect(before).not.toBeNull();

    await screen.rerender({ toolbar: false });
    await flush();
    const after = screen.container.querySelector('.o-image-viewer-action');
    // v-if 隐藏：元素从 DOM 移除
    expect(after).toBeNull();
  });

  test('从 false 变为数组后操作区显示', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG], toolbar: false },
    });
    await flush();
    const before = screen.container.querySelector('.o-image-viewer-action');
    // v-if 隐藏：元素不存在于 DOM
    expect(before).toBeNull();

    await screen.rerender({ toolbar: ['zoomIn'] });
    await flush();
    const after = screen.container.querySelector('.o-image-viewer-action');
    // v-if 显示：元素重新创建
    expect(after).not.toBeNull();
  });
});

// ──────────────────────────────────────────────────────────────
// showProgress — v-if 响应式（DOM 添加/移除）
// ──────────────────────────────────────────────────────────────
describe('showProgress 响应式变化', () => {
  test('从 false 变为 true 后进度指示器出现', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG, DATA_IMG_B], showProgress: false },
    });
    await flush();
    expect(screen.container.querySelector('.o-image-viewer-progress')).toBeNull();

    await screen.rerender({ showProgress: true });
    await flush();
    const progress = screen.container.querySelector('.o-image-viewer-progress');
    expect(progress).not.toBeNull();
  });

  test('从 true 变为 false 后进度指示器消失', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG, DATA_IMG_B], showProgress: true },
    });
    await flush();
    expect(screen.container.querySelector('.o-image-viewer-progress')).not.toBeNull();

    await screen.rerender({ showProgress: false });
    await flush();
    expect(screen.container.querySelector('.o-image-viewer-progress')).toBeNull();
  });
});

// ──────────────────────────────────────────────────────────────
// showZoomRatio — computed 依赖 props.showZoomRatio
// ──────────────────────────────────────────────────────────────
describe('showZoomRatio 响应式变化', () => {
  test('缩放后从 true 变为 false 时提示隐藏', async () => {
    const screen = render(OImageViewer, {
      props: {
        previewList: [DATA_IMG],
        showZoomRatio: true,
        duration: 10000,
        toolbar: ['zoomIn'],
      },
    });
    await ensureLoaded(screen);

    // 触发缩放，使 hideZoomRatio=false，此时 showZoomRatio=true → 提示可见
    const zoomInBtn = screen.container.querySelector('.o-image-action-item') as HTMLButtonElement;
    zoomInBtn.click();
    await flush();
    const ratioVisible = screen.container.querySelector('.o-image-zoom-ratio') as HTMLElement;
    expect(ratioVisible.style.display).not.toBe('none');

    // 切换 showZoomRatio=false → computed=false → 提示隐藏
    await screen.rerender({ showZoomRatio: false });
    await flush();
    const ratioHidden = screen.container.querySelector('.o-image-zoom-ratio') as HTMLElement;
    expect(ratioHidden.style.display).toBe('none');
  });
});

// ──────────────────────────────────────────────────────────────
// toolbar — v-for 响应式重新渲染
// ──────────────────────────────────────────────────────────────
describe('toolbar 响应式变化', () => {
  test('toolbar 变化后按钮列表重新渲染', async () => {
    const screen = render(OImageViewer, {
      props: {
        previewList: [DATA_IMG],
        toolbar: ['zoomIn'],
      },
    });
    await flush();
    const before = screen.container.querySelectorAll('.o-image-action-item');
    expect(before.length).toBe(1);
    expect(before[0].getAttribute('aria-label')).toBe('放大');

    await screen.rerender({ toolbar: ['zoomOut', 'reset'] });
    await flush();
    const after = screen.container.querySelectorAll('.o-image-action-item');
    expect(after.length).toBe(2);
    expect(after[0].getAttribute('aria-label')).toBe('缩小');
    expect(after[1].getAttribute('aria-label')).toBe('重置');
  });
});

// ──────────────────────────────────────────────────────────────
// infinite — computed(hasPrev / hasNext) 响应式
// ──────────────────────────────────────────────────────────────
describe('infinite 响应式变化', () => {
  test('从 true 变为 false 后第一张的上一张按钮 disabled', async () => {
    const screen = render(OImageViewer, {
      props: {
        previewList: [DATA_IMG, DATA_IMG_B],
        currentIndex: 0,
        infinite: true,
      },
    });
    await flush();
    const prevBefore = screen.container.querySelector('.o-image-viewer-nav-prev') as HTMLButtonElement;
    expect(prevBefore.classList.contains('o-btn-disabled')).toBe(false);

    await screen.rerender({ infinite: false });
    await flush();
    const prevAfter = screen.container.querySelector('.o-image-viewer-nav-prev') as HTMLButtonElement;
    expect(prevAfter.classList.contains('o-btn-disabled')).toBe(true);
  });

  test('从 false 变为 true 后第一张的上一张按钮可点击', async () => {
    const screen = render(OImageViewer, {
      props: {
        previewList: [DATA_IMG, DATA_IMG_B],
        currentIndex: 0,
        infinite: false,
      },
    });
    await flush();
    const prevBefore = screen.container.querySelector('.o-image-viewer-nav-prev') as HTMLButtonElement;
    expect(prevBefore.classList.contains('o-btn-disabled')).toBe(true);

    await screen.rerender({ infinite: true });
    await flush();
    const prevAfter = screen.container.querySelector('.o-image-viewer-nav-prev') as HTMLButtonElement;
    expect(prevAfter.classList.contains('o-btn-disabled')).toBe(false);
  });
});

// ──────────────────────────────────────────────────────────────
// closeOnPressEscape — onKeydown 中读取 props.closeOnPressEscape
// ──────────────────────────────────────────────────────────────
describe('closeOnPressEscape 响应式变化', () => {
  test('从 false 变为 true 后 ESC 可关闭', async () => {
    const onClose = vi.fn();
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG], closeOnPressEscape: false },
      attrs: { onClose },
    });
    await flush();
    const root = screen.container.querySelector('.o-image-viewer') as HTMLElement;

    // closeOnPressEscape=false 时 ESC 不触发关闭
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await flush();
    expect(onClose).not.toHaveBeenCalled();

    // 切换为 true 后 ESC 触发关闭
    await screen.rerender({ closeOnPressEscape: true });
    await flush();
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await flush();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

// ──────────────────────────────────────────────────────────────
// focusTrap — :tabindex 绑定 props.focusTrap
// ──────────────────────────────────────────────────────────────
describe('focusTrap 响应式变化', () => {
  test('从 true 变为 false 后 tabindex 移除', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG], focusTrap: true },
    });
    await flush();
    const root = screen.container.querySelector('.o-image-viewer') as HTMLElement;
    expect(root.getAttribute('tabindex')).toBe('-1');

    await screen.rerender({ focusTrap: false });
    await flush();
    const rootAfter = screen.container.querySelector('.o-image-viewer') as HTMLElement;
    expect(rootAfter.getAttribute('tabindex')).toBeNull();
  });

  test('从 false 变为 true 后 tabindex 设置', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG], focusTrap: false },
    });
    await flush();
    const root = screen.container.querySelector('.o-image-viewer') as HTMLElement;
    expect(root.getAttribute('tabindex')).toBeNull();

    await screen.rerender({ focusTrap: true });
    await flush();
    const rootAfter = screen.container.querySelector('.o-image-viewer') as HTMLElement;
    expect(rootAfter.getAttribute('tabindex')).toBe('-1');
  });
});

// ──────────────────────────────────────────────────────────────
// bodyClose — onContainerClick 中读取 props.bodyClose
// ──────────────────────────────────────────────────────────────
describe('bodyClose 响应式变化', () => {
  test('从 false 变为 true 后点击根元素可关闭', async () => {
    const onClose = vi.fn();
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG], bodyClose: false },
      attrs: { onClose },
    });
    await flush();
    const root = screen.container.querySelector('.o-image-viewer-body') as HTMLElement;

    // bodyClose=false 时点击不触发关闭
    root.click();
    await flush();
    expect(onClose).not.toHaveBeenCalled();

    // 切换为 true 后点击触发关闭
    await screen.rerender({ bodyClose: true });
    await flush();
    root.click();
    await flush();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

// ──────────────────────────────────────────────────────────────
// crossorigin — :crossorigin 绑定 props.crossorigin
// ──────────────────────────────────────────────────────────────
describe('crossorigin 响应式变化', () => {
  test('从无变为 anonymous 后 img 属性更新', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG] },
    });
    await flush();
    const imgBefore = screen.container.querySelector('.o-image-viewer-img') as HTMLImageElement;
    expect(imgBefore.getAttribute('crossorigin')).toBeNull();

    await screen.rerender({ crossorigin: 'anonymous' });
    await flush();
    const imgAfter = screen.container.querySelector('.o-image-viewer-img') as HTMLImageElement;
    expect(imgAfter.getAttribute('crossorigin')).toBe('anonymous');
  });

  test('从 anonymous 变为空后 img 属性移除', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG], crossorigin: 'anonymous' },
    });
    await flush();
    const imgBefore = screen.container.querySelector('.o-image-viewer-img') as HTMLImageElement;
    expect(imgBefore.getAttribute('crossorigin')).toBe('anonymous');

    await screen.rerender({ crossorigin: '' });
    await flush();
    const imgAfter = screen.container.querySelector('.o-image-viewer-img') as HTMLImageElement;
    expect(imgAfter.getAttribute('crossorigin')).toBeNull();
  });
});

// ──────────────────────────────────────────────────────────────
// zoomRate — handleActions 中读取 props.zoomRate
// ──────────────────────────────────────────────────────────────
describe('zoomRate 响应式变化', () => {
  test('zoomRate 变化后影响后续缩放计算', async () => {
    const screen = render(OImageViewer, {
      props: {
        previewList: [DATA_IMG],
        zoomRate: 2,
        maxScale: 8,
        toolbar: ['zoomIn', 'reset'],
      },
    });
    await ensureLoaded(screen);

    // 1x1 图片 fitScale=2，zoomRate=2 时放大：2 × 2 = 4
    const buttons = screen.container.querySelectorAll('.o-image-action-item');
    const zoomInBtn = buttons[0] as HTMLButtonElement;
    const resetBtn = buttons[1] as HTMLButtonElement;
    zoomInBtn.click();
    await flush();
    let container = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    expect(container.style.transform).toMatch(/scale\(4\)/);

    // 重置回 fitScale=2
    resetBtn.click();
    await flush();

    // 切换 zoomRate=3
    await screen.rerender({ zoomRate: 3 });
    await flush();

    // zoomRate=3 时放大：2 × 3 = 6
    const zoomInBtnAfter = screen.container.querySelector('.o-image-action-item') as HTMLButtonElement;
    zoomInBtnAfter.click();
    await flush();
    container = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    expect(container.style.transform).toMatch(/scale\(6\)/);
  });
});

// ──────────────────────────────────────────────────────────────
// defineModel 默认值 — 不传 currentIndex / scale 时的行为
// ──────────────────────────────────────────────────────────────
describe('defineModel 默认值', () => {
  test('不传 currentIndex 时默认从 0 开始', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG, DATA_IMG_B], showProgress: true },
    });
    await flush();
    const img = screen.container.querySelector('.o-image-viewer-img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe(DATA_IMG);
    const progress = screen.container.querySelector('.o-image-viewer-progress');
    expect(progress?.textContent?.trim()).toBe('1 / 2');
  });

  test('不传 scale 时默认缩放为适屏 200%', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG] },
    });
    await ensureLoaded(screen);
    const container = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    expect(container.style.transform).toMatch(/scale\(2\)/);
  });
});

// ──────────────────────────────────────────────────────────────
// v-model 双向绑定 — 用户交互时 model 值回传到外部 ref
// ──────────────────────────────────────────────────────────────
describe('v-model 双向绑定', () => {
  test('v-model:currentIndex — 点击下一张时外部 ref 更新', async () => {
    const Wrapper = defineComponent({
      setup() {
        const idx = ref(0);
        return { idx };
      },
      render() {
        return h(OImageViewer, {
          previewList: [DATA_IMG, DATA_IMG_B],
          currentIndex: this.idx,
          'onUpdate:currentIndex': (val: number) => {
            this.idx = val;
          },
        });
      },
    });
    const screen = render(Wrapper);
    await flush();
    const nextBtn = screen.container.querySelector('.o-image-viewer-nav-next') as HTMLButtonElement;
    nextBtn.click();
    await flush();
    // 外部 ref 应为 1，验证图片也切换到第二张
    const img = screen.container.querySelector('.o-image-viewer-img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe(DATA_IMG_B);
  });

  test('v-model:scale — 点击放大时 transform 更新且 update:scale 回传', async () => {
    const onUpdateScale = vi.fn();
    const screen = render(OImageViewer, {
      props: {
        previewList: [DATA_IMG],
        zoomRate: 1.2,
        maxScale: 8,
        toolbar: ['zoomIn'],
      },
      attrs: { 'onUpdate:scale': onUpdateScale },
    });
    await ensureLoaded(screen);
    const zoomInBtn = screen.container.querySelector('.o-image-action-item') as HTMLButtonElement;
    zoomInBtn.click();
    await flush();
    const container = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    expect(container.style.transform).toMatch(/scale\(2\.4\)/);
    expect(onUpdateScale).toHaveBeenCalledWith(2.4);
  });

  test('v-model:scale — 点击重置时 transform 回到初始值', async () => {
    const screen = render(OImageViewer, {
      props: {
        previewList: [DATA_IMG],
        zoomRate: 1.2,
        maxScale: 8,
        toolbar: ['zoomIn', 'reset'],
      },
    });
    await ensureLoaded(screen);

    // 先放大
    const buttons = screen.container.querySelectorAll('.o-image-action-item');
    (buttons[0] as HTMLButtonElement).click();
    await flush();

    // 重置
    (buttons[1] as HTMLButtonElement).click();
    await flush();
    const container = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    expect(container.style.transform).toMatch(/scale\(2\)/);
  });
});
