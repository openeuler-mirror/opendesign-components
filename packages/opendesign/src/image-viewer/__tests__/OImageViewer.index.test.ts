/**
 * OImageViewer 单组件契约测试。
 *
 * 组织原则：
 *   1. 静态契约：按 types.ts prop 顺序，验证根元素 class、img 渲染
 *   2. 动态契约：close / change 事件、多图切换
 *   3. 插槽契约：default 插槽
 *   4. 可访问性：操作按钮 aria-label、keyboard button 元素
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OImageViewer from '../OImageViewer.vue';
import { flush } from '../../../__tests__/_helpers/dom';

const MOCK_IMG_A = 'https://example.com/a.png';
const MOCK_IMG_B = 'https://example.com/b.png';

describe('静态契约（按 types.ts 属性）', () => {
  test('OImageViewer 根元素 class 包含 o-image-viewer', async () => {
    const screen = render(OImageViewer, { props: { previewList: [MOCK_IMG_A] } });
    await flush();
    const el = screen.container.querySelector('.o-image-viewer') as HTMLElement;
    expect(el).not.toBeNull();
  });

  test('OImageViewer previewList - 渲染 img 元素并设置 src', async () => {
    const screen = render(OImageViewer, { props: { previewList: [MOCK_IMG_A] } });
    await flush();
    const img = screen.container.querySelector('.o-image-viewer-img') as HTMLImageElement | null;
    // 浏览器环境可能已异步触发 error 导致 img 被替换为错误提示
    if (img) {
      expect(img.getAttribute('src')).toBe(MOCK_IMG_A);
    } else {
      // img 被 error 状态移除时，确认错误提示存在
      const errorEl = screen.container.querySelector('.o-image-viewer-error');
      expect(errorEl).not.toBeNull();
    }
  });

  test('OImageViewer currentIndex - 多图时渲染指定索引的图片', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [MOCK_IMG_A, MOCK_IMG_B], currentIndex: 1 },
    });
    await flush();
    const img = screen.container.querySelector('.o-image-viewer-img') as HTMLImageElement | null;
    if (img) {
      expect(img.getAttribute('src')).toBe(MOCK_IMG_B);
    } else {
      const errorEl = screen.container.querySelector('.o-image-viewer-error');
      expect(errorEl).not.toBeNull();
    }
  });

  test('OImageViewer toolbar 默认 - 渲染操作区', async () => {
    const screen = render(OImageViewer, { props: { previewList: [MOCK_IMG_A] } });
    await flush();
    const action = screen.container.querySelector('.o-image-viewer-action');
    expect(action).not.toBeNull();
  });

  test('OImageViewer toolbar=false - 不渲染操作区', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [MOCK_IMG_A], toolbar: false },
    });
    await flush();
    const action = screen.container.querySelector('.o-image-viewer-action');
    // v-if=false 时元素不存在于 DOM
    expect(action).toBeNull();
  });

  test('OImageViewer showZoomRatio - 缩放比例提示默认存在', async () => {
    const screen = render(OImageViewer, { props: { previewList: [MOCK_IMG_A] } });
    await flush();
    const ratio = screen.container.querySelector('.o-image-zoom-ratio');
    expect(ratio).not.toBeNull();
  });

  test('OImageViewer 多图 - 渲染上一张/下一张导航按钮', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [MOCK_IMG_A, MOCK_IMG_B] },
    });
    await flush();
    const navButtons = screen.container.querySelectorAll('.o-image-viewer-nav');
    expect(navButtons.length).toBe(2);
  });

  test('OImageViewer 单图 - 不渲染导航按钮', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [MOCK_IMG_A] },
    });
    await flush();
    const navButtons = screen.container.querySelectorAll('.o-image-viewer-nav');
    expect(navButtons.length).toBe(0);
  });
});

describe('动态契约', () => {
  test('OImageViewer close 事件 - 点击 OLayer 关闭按钮触发', async () => {
    const onClose = vi.fn();
    const screen = render(OImageViewer, {
      props: { previewList: [MOCK_IMG_A] },
      attrs: { onClose },
    });
    await flush();
    // OImageViewer 默认 buttonClose: true，OLayer 渲染 .o-layer-close 关闭按钮
    const closeBtn = screen.container.querySelector('.o-layer-close') as HTMLButtonElement;
    closeBtn.click();
    // OLayer 的 toggle 是 async（beforeToggle），需 flush 等待微任务执行
    await flush();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('OImageViewer switch 事件 - 点击下一张触发', async () => {
    const onSwitch = vi.fn();
    const screen = render(OImageViewer, {
      props: { previewList: [MOCK_IMG_A, MOCK_IMG_B] },
      attrs: { onSwitch },
    });
    await flush();
    const nextBtn = screen.container.querySelector('.o-image-viewer-nav-next') as HTMLButtonElement;
    nextBtn.click();
    await flush();
    expect(onSwitch).toHaveBeenCalledWith(1);
  });

  test('OImageViewer switch 事件 - 点击上一张触发', async () => {
    const onSwitch = vi.fn();
    const screen = render(OImageViewer, {
      props: { previewList: [MOCK_IMG_A, MOCK_IMG_B], currentIndex: 1 },
      attrs: { onSwitch },
    });
    await flush();
    const prevBtn = screen.container.querySelector('.o-image-viewer-nav-prev') as HTMLButtonElement;
    prevBtn.click();
    await flush();
    expect(onSwitch).toHaveBeenCalledWith(0);
  });

  test('OImageViewer 导航边界(infinite=false) - 第一张时上一张按钮 disabled', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [MOCK_IMG_A, MOCK_IMG_B], currentIndex: 0, infinite: false },
    });
    await flush();
    const prevBtn = screen.container.querySelector('.o-image-viewer-nav-prev') as HTMLButtonElement;
    expect(prevBtn.classList.contains('o-btn-disabled')).toBe(true);
  });

  test('OImageViewer 导航边界(infinite=false) - 最后一张时下一张按钮 disabled', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [MOCK_IMG_A, MOCK_IMG_B], currentIndex: 1, infinite: false },
    });
    await flush();
    const nextBtn = screen.container.querySelector('.o-image-viewer-nav-next') as HTMLButtonElement;
    expect(nextBtn.classList.contains('o-btn-disabled')).toBe(true);
  });

  test('OImageViewer 导航(infinite=true) - 第一张时上一张按钮可点击', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [MOCK_IMG_A, MOCK_IMG_B], currentIndex: 0, infinite: true },
    });
    await flush();
    const prevBtn = screen.container.querySelector('.o-image-viewer-nav-prev') as HTMLButtonElement;
    expect(prevBtn.classList.contains('o-btn-disabled')).toBe(false);
  });
});

describe('可访问性契约', () => {
  test('OImageViewer 操作项为 button 元素', async () => {
    const screen = render(OImageViewer, { props: { previewList: [MOCK_IMG_A] } });
    await flush();
    const items = screen.container.querySelectorAll('.o-image-action-item');
    items.forEach((item) => {
      expect(item.tagName).toBe('BUTTON');
    });
  });

  test('OImageViewer 操作按钮有 aria-label', async () => {
    const screen = render(OImageViewer, { props: { previewList: [MOCK_IMG_A] } });
    await flush();
    const items = screen.container.querySelectorAll('.o-image-action-item');
    items.forEach((item) => {
      expect(item.getAttribute('aria-label')).toBeTruthy();
    });
  });

  test('OImageViewer 导航按钮有 aria-label', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [MOCK_IMG_A, MOCK_IMG_B] },
    });
    await flush();
    const navButtons = screen.container.querySelectorAll('.o-image-viewer-nav');
    navButtons.forEach((btn) => {
      expect(btn.getAttribute('aria-label')).toBeTruthy();
    });
  });
});

describe('插槽契约', () => {
  test('OImageViewer default 插槽 - 渲染在预览包裹层内', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [MOCK_IMG_A] },
      slots: { default: () => h('div', { class: 'slot-content' }, 'extra') },
    });
    await flush();
    const slot = screen.container.querySelector('.slot-content');
    expect(slot).not.toBeNull();
    expect(slot?.textContent).toBe('extra');
    // 默认插槽渲染在 .o-image-viewer-wrapper 内、.o-image-viewer-container 外
    const wrapper = screen.container.querySelector('.o-image-viewer-wrapper');
    expect(wrapper?.contains(slot!)).toBe(true);
    const container = screen.container.querySelector('.o-image-viewer-container');
    expect(container?.contains(slot!)).toBe(false);
  });
});
