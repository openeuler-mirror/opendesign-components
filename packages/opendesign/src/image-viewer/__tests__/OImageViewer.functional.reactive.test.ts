/**
 * useImageViewer 入参响应式测试。
 *
 * 验证 MaybeRefOrGetter 入参在预览打开后源变化时，DOM 正确响应式更新。
 * 覆盖：
 *   1. previewList ref/getter — 空数组→有图、图片地址变更、数量变化
 *   2. scale ref — 缩放比例响应
 *   3. zoomRate ref — 缩放速率响应
 *   4. showActionArea ref — 操作区显隐
 *   5. showProgress ref — 进度指示器显隐
 *   6. toolbar ref — 工具栏按钮重新渲染
 *   7. infinite ref — 导航按钮 disabled
 *   8. closeOnPressEscape ref — ESC 关闭行为
 *   9. focusTrap ref — tabindex 属性
 *  10. bodyClose ref — 点击关闭行为
 *  11. crossorigin ref — img crossorigin 属性
 */
import { test, expect, describe, vi, afterEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { defineComponent, h, ref, shallowRef } from 'vue';
import { useImageViewer } from '../use-image-viewer';
import type { ImageViewerHandle } from '../use-image-viewer';
import { flush } from '../../../__tests__/_helpers/dom';

/** 1×1 透明 PNG data URL，浏览器中同步加载成功，不触发 error 状态 */
const DATA_IMG_A = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
/** 1×1 透明 GIF data URL，与 DATA_IMG_A 不同，用于验证 src 变更 */
const DATA_IMG_B = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/** 收集 body 下所有 o-image-viewer 元素 */
function queryViewers(): HTMLElement[] {
  return Array.from(document.querySelectorAll('.o-image-viewer'));
}

/**
 * 在 scope 外调用 useImageViewer 的辅助函数
 * @description 直接在测试函数体内调用，无 effect scope 包裹，
 * 因此 hasScope = false，close 行为为"直接 unmount"。
 */
function useOutOfScope(options: Parameters<typeof useImageViewer>[0]): ImageViewerHandle {
  return useImageViewer(options);
}

/**
 * 在 scope 内调用 useImageViewer 的辅助组件
 * @description 通过 defineComponent + render 在真正的组件 setup 中调用，
 * 因此 hasScope = true，close 行为为"只切 visible"。
 */
function renderInScope(options: Parameters<typeof useImageViewer>[0]) {
  const handleRef = shallowRef<ImageViewerHandle | null>(null);
  const Host = defineComponent({
    name: 'TestHost',
    setup() {
      handleRef.value = useImageViewer(options);
      return () => h('div', { class: 'test-host' });
    },
  });
  const screen = render(Host);
  return { screen, handle: handleRef };
}

/**
 * 确保图片加载完成，手动触发 load 事件以解除 isLoading 状态
 * @description 交互类测试（缩放、旋转等）依赖 isLoading=false，需先触发 load。
 * OLayer teleport 到 body 后，img 在 document 下。
 */
async function ensureLoaded() {
  await flush();
  const img = document.querySelector('.o-image-viewer-img') as HTMLImageElement | null;
  if (img) {
    img.dispatchEvent(new Event('load'));
    await flush();
  }
}

afterEach(() => {
  document.body.innerHTML = '';
});

// ──────────────────────────────────────────────────────────────
// previewList — 空数组→有图、地址变更、数量变化
// ──────────────────────────────────────────────────────────────
describe('previewList 响应式变化', () => {
  test('ref: 空数组→有图后 img src 正确更新', async () => {
    const list = ref<string[]>([]);
    const { open, unmount } = useOutOfScope({ previewList: list });
    open();
    await flush();

    // 初始为空数组，填充数据
    list.value = [DATA_IMG_A];
    await flush();

    // 验证 img 元素出现且 src 正确
    const img = document.querySelector('.o-image-viewer-img') as HTMLImageElement | null;
    expect(img).not.toBeNull();
    expect(img!.getAttribute('src')).toBe(DATA_IMG_A);
    unmount();
  });

  test('ref: [img1] → [img2] 后 img src 变更', async () => {
    const list = ref<string[]>([DATA_IMG_A]);
    const { open, unmount } = useOutOfScope({ previewList: list });
    open();
    await flush();

    // 初始 src 为 DATA_IMG_A
    const imgBefore = document.querySelector('.o-image-viewer-img') as HTMLImageElement;
    expect(imgBefore.getAttribute('src')).toBe(DATA_IMG_A);

    // 切换为不同图片
    list.value = [DATA_IMG_B];
    await flush();

    const imgAfter = document.querySelector('.o-image-viewer-img') as HTMLImageElement;
    expect(imgAfter.getAttribute('src')).toBe(DATA_IMG_B);
    unmount();
  });

  test('ref: [img1] → [img1, img2] 后导航按钮出现且 src 不变', async () => {
    const list = ref<string[]>([DATA_IMG_A]);
    const { open, unmount } = useOutOfScope({ previewList: list });
    open();
    await flush();
    expect(document.querySelectorAll('.o-image-viewer-nav').length).toBe(0);

    list.value = [DATA_IMG_A, DATA_IMG_B];
    await flush();
    expect(document.querySelectorAll('.o-image-viewer-nav').length).toBe(2);

    // 当前图片不应变化
    const img = document.querySelector('.o-image-viewer-img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe(DATA_IMG_A);
    unmount();
  });

  test('getter: 空数组→有图后 img src 正确更新', async () => {
    const list = ref<string[]>([]);
    const { open, unmount } = useOutOfScope({ previewList: () => list.value });
    open();
    await flush();

    list.value = [DATA_IMG_A];
    await flush();

    const img = document.querySelector('.o-image-viewer-img') as HTMLImageElement | null;
    expect(img).not.toBeNull();
    expect(img!.getAttribute('src')).toBe(DATA_IMG_A);
    unmount();
  });
});

// ──────────────────────────────────────────────────────────────
// scale — defineModel 双向，ref 变化后 transform 同步
// ──────────────────────────────────────────────────────────────
describe('scale 响应式变化', () => {
  test('ref: scale 从初始值变为新值后 transform 更新', async () => {
    const scaleVal = ref(1);
    const { open, unmount } = useOutOfScope({
      previewList: [DATA_IMG_A],
      scale: scaleVal,
    });
    open();
    await ensureLoaded();

    const before = document.querySelector('.o-image-viewer-container') as HTMLElement;
    expect(before.style.transform).toMatch(/scale\(2\)/);

    scaleVal.value = 3;
    await flush();

    const after = document.querySelector('.o-image-viewer-container') as HTMLElement;
    expect(after.style.transform).toMatch(/scale\(3\)/);
    unmount();
  });
});

// ──────────────────────────────────────────────────────────────
// zoomRate — handleActions 中读取 props.zoomRate
// ──────────────────────────────────────────────────────────────
describe('zoomRate 响应式变化', () => {
  test('ref: zoomRate 变化后影响后续缩放计算', async () => {
    const rate = ref(2);
    const { open, unmount } = useOutOfScope({
      previewList: [DATA_IMG_A],
      zoomRate: rate,
      maxScale: 8,
      toolbar: ['zoomIn', 'reset'],
    });
    open();
    await ensureLoaded();

    // 1x1 图片 fitScale=2，zoomRate=2 时放大：2 × 2 = 4
    const buttons = document.querySelectorAll('.o-image-action-item');
    const zoomInBtn = buttons[0] as HTMLButtonElement;
    const resetBtn = buttons[1] as HTMLButtonElement;
    zoomInBtn.click();
    await flush();
    let container = document.querySelector('.o-image-viewer-container') as HTMLElement;
    expect(container.style.transform).toMatch(/scale\(4\)/);

    // 重置
    resetBtn.click();
    await flush();

    // 切换 zoomRate=3
    rate.value = 3;
    await flush();

    // zoomRate=3 时放大：2 × 3 = 6
    const zoomInAgain = document.querySelector('.o-image-action-item') as HTMLButtonElement;
    zoomInAgain.click();
    await flush();
    container = document.querySelector('.o-image-viewer-container') as HTMLElement;
    expect(container.style.transform).toMatch(/scale\(6\)/);
    unmount();
  });
});

// ──────────────────────────────────────────────────────────────
// toolbar — v-if(showActionAreaComputed) 依赖 toolbar !== false
// ──────────────────────────────────────────────────────────────
describe('toolbar 响应式变化（操作区显隐）', () => {
  test('ref: 从数组变为 false 后操作区隐藏', async () => {
    const config = ref(['zoomIn']);
    const { open, unmount } = useOutOfScope({
      previewList: [DATA_IMG_A],
      toolbar: config,
    });
    open();
    await flush();
    const before = document.querySelector('.o-image-viewer-action');
    expect(before).not.toBeNull();

    config.value = false;
    await flush();
    const after = document.querySelector('.o-image-viewer-action');
    // v-if 隐藏：元素从 DOM 移除
    expect(after).toBeNull();
    unmount();
  });

  test('ref: 从 false 变为数组后操作区显示', async () => {
    const config = ref<false | string[]>(false);
    const { open, unmount } = useOutOfScope({
      previewList: [DATA_IMG_A],
      toolbar: config,
    });
    open();
    await flush();
    const before = document.querySelector('.o-image-viewer-action');
    // v-if 隐藏：元素不存在于 DOM
    expect(before).toBeNull();

    config.value = ['zoomIn'];
    await flush();
    const after = document.querySelector('.o-image-viewer-action');
    // v-if 显示：元素重新创建
    expect(after).not.toBeNull();
    unmount();
  });
});

// ──────────────────────────────────────────────────────────────
// showProgress — v-if 响应式（DOM 添加/移除）
// ──────────────────────────────────────────────────────────────
describe('showProgress 响应式变化', () => {
  test('ref: 从 false 变为 true 后进度指示器出现', async () => {
    const show = ref(false);
    const { open, unmount } = useOutOfScope({
      previewList: [DATA_IMG_A, DATA_IMG_B],
      showProgress: show,
    });
    open();
    await flush();
    expect(document.querySelector('.o-image-viewer-progress')).toBeNull();

    show.value = true;
    await flush();
    expect(document.querySelector('.o-image-viewer-progress')).not.toBeNull();
    unmount();
  });
});

// ──────────────────────────────────────────────────────────────
// toolbar — v-for 响应式重新渲染
// ──────────────────────────────────────────────────────────────
describe('toolbar 响应式变化', () => {
  test('ref: 变化后按钮列表重新渲染', async () => {
    const config = ref(['zoomIn']);
    const { open, unmount } = useOutOfScope({
      previewList: [DATA_IMG_A],
      toolbar: config,
    });
    open();
    await flush();
    const before = document.querySelectorAll('.o-image-action-item');
    expect(before.length).toBe(1);
    expect(before[0].getAttribute('aria-label')).toBe('放大');

    config.value = ['zoomOut', 'reset'];
    await flush();
    const after = document.querySelectorAll('.o-image-action-item');
    expect(after.length).toBe(2);
    expect(after[0].getAttribute('aria-label')).toBe('缩小');
    expect(after[1].getAttribute('aria-label')).toBe('重置');
    unmount();
  });
});

// ──────────────────────────────────────────────────────────────
// infinite — computed(hasPrev / hasNext) 响应
// ──────────────────────────────────────────────────────────────
describe('infinite 响应式变化', () => {
  test('ref: 从 true 变为 false 后第一张的上一张按钮 disabled', async () => {
    const inf = ref(true);
    const { open, unmount } = useOutOfScope({
      previewList: [DATA_IMG_A, DATA_IMG_B],
      infinite: inf,
    });
    open();
    await flush();
    const prevBefore = document.querySelector('.o-image-viewer-nav-prev') as HTMLButtonElement;
    expect(prevBefore.classList.contains('o-btn-disabled')).toBe(false);

    inf.value = false;
    await flush();
    const prevAfter = document.querySelector('.o-image-viewer-nav-prev') as HTMLButtonElement;
    expect(prevAfter.classList.contains('o-btn-disabled')).toBe(true);
    unmount();
  });
});

// ──────────────────────────────────────────────────────────────
// closeOnPressEscape — onKeydown 中读取 props.closeOnPressEscape
// ──────────────────────────────────────────────────────────────
describe('closeOnPressEscape 响应式变化', () => {
  test('ref: 从 false 变为 true 后 ESC 可关闭', async () => {
    const onClose = vi.fn();
    const esc = ref(false);
    const { open, unmount } = useOutOfScope({
      previewList: [DATA_IMG_A],
      closeOnPressEscape: esc,
      onClose,
    });
    open();
    await flush();
    const root = document.querySelector('.o-image-viewer') as HTMLElement;

    // closeOnPressEscape=false 时 ESC 不触发关闭
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await flush();
    expect(onClose).not.toHaveBeenCalled();

    // 切换为 true 后 ESC 触发关闭
    esc.value = true;
    await flush();
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await flush();
    expect(onClose).toHaveBeenCalledTimes(1);
    unmount();
  });
});

// ──────────────────────────────────────────────────────────────
// focusTrap — :tabindex 绑定 props.focusTrap
// ──────────────────────────────────────────────────────────────
describe('focusTrap 响应式变化', () => {
  test('ref: 从 true 变为 false 后 tabindex 移除', async () => {
    const trap = ref(true);
    const { open, unmount } = useOutOfScope({
      previewList: [DATA_IMG_A],
      focusTrap: trap,
    });
    open();
    await flush();
    const root = document.querySelector('.o-image-viewer') as HTMLElement;
    expect(root.getAttribute('tabindex')).toBe('-1');

    trap.value = false;
    await flush();
    const rootAfter = document.querySelector('.o-image-viewer') as HTMLElement;
    expect(rootAfter.getAttribute('tabindex')).toBeNull();
    unmount();
  });
});

// ──────────────────────────────────────────────────────────────
// bodyClose — onContainerClick 中读取 props.bodyClose
// ──────────────────────────────────────────────────────────────
describe('bodyClose 响应式变化', () => {
  test('ref: 从 false 变为 true 后点击根元素可关闭', async () => {
    const onClose = vi.fn();
    const close = ref(false);
    const { open, unmount } = useOutOfScope({
      previewList: [DATA_IMG_A],
      bodyClose: close,
      onClose,
    });
    open();
    await flush();
    const root = document.querySelector('.o-image-viewer-body') as HTMLElement;

    // bodyClose=false 时点击不触发关闭
    root.click();
    await flush();
    expect(onClose).not.toHaveBeenCalled();

    // 切换为 true 后点击触发关闭
    close.value = true;
    await flush();
    root.click();
    await flush();
    expect(onClose).toHaveBeenCalledTimes(1);
    unmount();
  });
});

// ──────────────────────────────────────────────────────────────
// crossorigin — :crossorigin 绑定 props.crossorigin
// ──────────────────────────────────────────────────────────────
describe('crossorigin 响应式变化', () => {
  test('ref: 从空变为 anonymous 后 img 属性更新', async () => {
    const cross = ref('');
    const { open, unmount } = useOutOfScope({
      previewList: [DATA_IMG_A],
      crossorigin: cross,
    });
    open();
    await flush();
    const imgBefore = document.querySelector('.o-image-viewer-img') as HTMLImageElement;
    expect(imgBefore.getAttribute('crossorigin')).toBeNull();

    cross.value = 'anonymous';
    await flush();
    const imgAfter = document.querySelector('.o-image-viewer-img') as HTMLImageElement;
    expect(imgAfter.getAttribute('crossorigin')).toBe('anonymous');
    unmount();
  });
});

// ──────────────────────────────────────────────────────────────
// 复用模式下（scope 内）的响应式更新
// ──────────────────────────────────────────────────────────────
describe('复用模式下响应式更新', () => {
  test('scope 内：previewList ref 变化后 DOM 同步更新', async () => {
    const list = ref<string[]>([DATA_IMG_A]);
    const { handle: handleRef } = renderInScope({ previewList: list });
    const handle = handleRef.value!;
    handle.open();
    await flush();

    const imgBefore = document.querySelector('.o-image-viewer-img') as HTMLImageElement;
    expect(imgBefore.getAttribute('src')).toBe(DATA_IMG_A);

    list.value = [DATA_IMG_B];
    await flush();
    const imgAfter = document.querySelector('.o-image-viewer-img') as HTMLImageElement;
    expect(imgAfter.getAttribute('src')).toBe(DATA_IMG_B);

    handle.unmount();
    await flush();
    expect(queryViewers().length).toBe(0);
  });
});
