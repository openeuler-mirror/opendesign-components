/**
 * OImageViewer 无障碍端到端测试。
 *
 * 覆盖 ImageViewerAccessibility.vue 文档描述的全部无障碍功能点，
 * 使用真实键盘 API（userEvent.keyboard / userEvent.tab）而非 dispatchEvent，
 * 验证在真实浏览器键盘管线下的行为正确性。
 *
 * 覆盖：
 *   1. 键盘导航 — ←/→ 切换图片、↑/↓ 缩放、+/- 缩放、ESC 关闭
 *   2. 焦点陷阱 — Tab 在浮层内循环，不溢出到 body
 *   3. 屏幕阅读器语义 — role="dialog" / aria-modal / aria-label / 图片 alt
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { userEvent } from 'vitest/browser';
import { h, ref } from 'vue';
import OImageViewer from '../OImageViewer.vue';
import { flush } from '../../../__tests__/_helpers/dom';

/** 1x1 透明 PNG data URL，浏览器中同步加载成功，不触发 error 状态 */
const DATA_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const DATA_IMG_B = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

/** 获取浮层根元素（.o-image-viewer，即 OLayer 的 .o-layer 经 class 透传后） */
async function getViewerRoot(screen: ReturnType<typeof render>): Promise<HTMLElement> {
  await flush();
  return screen.container.querySelector('.o-image-viewer') as HTMLElement;
}

/** 确保图片加载完成，手动触发 load 事件以解除 isLoading 状态 */
async function ensureLoaded(screen: ReturnType<typeof render>) {
  await flush();
  const img = screen.container.querySelector('.o-image-viewer-img') as HTMLImageElement | null;
  if (img) {
    img.dispatchEvent(new Event('load'));
    await flush();
  }
}

/**
 * 从容器内联 transform 中提取 scale 值。
 * containerStyle 输出形如 `scale(1.2) rotate(0deg) translate(0px, 0px)`，
 * 直接读 element.style.transform 即可拿到原始字符串。
 */
function getContainerScale(screen: ReturnType<typeof render>): number {
  const container = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
  const transform = container.style.transform || '';
  const match = transform.match(/scale\(([\d.]+)\)/);
  return match ? parseFloat(match[1]) : 1;
}

describe('键盘导航（真实键盘 e2e）', () => {
  test('OImageViewer visible false→true 后焦点自动到浮层（真实使用场景）', async () => {
    const visible = ref(false);
    const screen = render({
      setup() {
        return () =>
          h(OImageViewer, {
            previewList: [DATA_IMG, DATA_IMG_B],
            focusTrap: true,
            visible: visible.value,
            'onUpdate:visible': (v: boolean) => {
              visible.value = v;
            },
          });
      },
    });
    await flush();
    expect(screen.container.querySelector('.o-image-viewer')).toBeNull();
    visible.value = true;
    await flush();
    await ensureLoaded(screen);
    expect(document.activeElement).not.toBe(document.body);
    const root = screen.container.querySelector('.o-image-viewer') as HTMLElement;
    expect(document.activeElement).toBe(root);
  });

  test('OImageViewer visible false→true 后按 → 切换下一张（不手动 focus）', async () => {
    const onSwitch = vi.fn();
    const visible = ref(false);
    const screen = render({
      setup() {
        return () =>
          h(OImageViewer, {
            previewList: [DATA_IMG, DATA_IMG_B],
            focusTrap: true,
            visible: visible.value,
            'onUpdate:visible': (v: boolean) => {
              visible.value = v;
            },
            onSwitch,
          });
      },
    });
    await flush();
    visible.value = true;
    await flush();
    await ensureLoaded(screen);
    await userEvent.keyboard('{ArrowRight}');
    await flush();
    expect(onSwitch).toHaveBeenCalledWith(1);
  });

  test('OImageViewer 打开后按 → 切换到下一张', async () => {
    const onSwitch = vi.fn();
    const screen = render({
      setup() {
        return () =>
          h(OImageViewer, {
            previewList: [DATA_IMG, DATA_IMG_B],
            focusTrap: true,
            onSwitch,
          });
      },
    });
    await ensureLoaded(screen);
    const root = await getViewerRoot(screen);
    root.focus();
    await flush();
    await userEvent.keyboard('{ArrowRight}');
    await flush();
    expect(onSwitch).toHaveBeenCalledWith(1);
  });

  test('OImageViewer 打开后按 ← 切换到上一张', async () => {
    const onSwitch = vi.fn();
    const screen = render({
      setup() {
        return () =>
          h(OImageViewer, {
            previewList: [DATA_IMG, DATA_IMG_B],
            currentIndex: 1,
            focusTrap: true,
            onSwitch,
          });
      },
    });
    await ensureLoaded(screen);
    const root = await getViewerRoot(screen);
    root.focus();
    await flush();
    await userEvent.keyboard('{ArrowLeft}');
    await flush();
    expect(onSwitch).toHaveBeenCalledWith(0);
  });

  test('OImageViewer 打开后按 ↑ 放大图片', async () => {
    const screen = render({
      setup() {
        return () =>
          h(OImageViewer, {
            previewList: [DATA_IMG],
            focusTrap: true,
          });
      },
    });
    await ensureLoaded(screen);
    const root = await getViewerRoot(screen);
    root.focus();
    await flush();
    const scaleBefore = getContainerScale(screen);
    await userEvent.keyboard('{ArrowUp}');
    await flush();
    const scaleAfter = getContainerScale(screen);
    expect(scaleAfter).toBeGreaterThan(scaleBefore);
  });

  test('OImageViewer 打开后按 ↓ 缩小图片', async () => {
    const screen = render({
      setup() {
        return () =>
          h(OImageViewer, {
            previewList: [DATA_IMG],
            focusTrap: true,
          });
      },
    });
    await ensureLoaded(screen);
    const root = await getViewerRoot(screen);
    root.focus();
    await flush();
    await userEvent.keyboard('{ArrowUp}');
    await flush();
    const scaleBefore = getContainerScale(screen);
    await userEvent.keyboard('{ArrowDown}');
    await flush();
    const scaleAfter = getContainerScale(screen);
    expect(scaleAfter).toBeLessThan(scaleBefore);
  });

  test('OImageViewer 打开后按 + 放大图片', async () => {
    const screen = render({
      setup() {
        return () =>
          h(OImageViewer, {
            previewList: [DATA_IMG],
            focusTrap: true,
          });
      },
    });
    await ensureLoaded(screen);
    const root = await getViewerRoot(screen);
    root.focus();
    await flush();
    const scaleBefore = getContainerScale(screen);
    await userEvent.keyboard('+');
    await flush();
    const scaleAfter = getContainerScale(screen);
    expect(scaleAfter).toBeGreaterThan(scaleBefore);
  });

  test('OImageViewer 打开后按 - 缩小图片', async () => {
    const screen = render({
      setup() {
        return () =>
          h(OImageViewer, {
            previewList: [DATA_IMG],
            focusTrap: true,
          });
      },
    });
    await ensureLoaded(screen);
    const root = await getViewerRoot(screen);
    root.focus();
    await flush();
    await userEvent.keyboard('{ArrowUp}');
    await flush();
    const scaleBefore = getContainerScale(screen);
    await userEvent.keyboard('-');
    await flush();
    const scaleAfter = getContainerScale(screen);
    expect(scaleAfter).toBeLessThan(scaleBefore);
  });

  test('OImageViewer 打开后按 ESC 关闭预览', async () => {
    const onClose = vi.fn();
    const screen = render({
      setup() {
        return () =>
          h(OImageViewer, {
            previewList: [DATA_IMG],
            focusTrap: true,
            closeOnPressEscape: true,
            onClose,
          });
      },
    });
    await ensureLoaded(screen);
    const root = await getViewerRoot(screen);
    root.focus();
    await flush();
    await userEvent.keyboard('{Escape}');
    await flush();
    expect(onClose).toHaveBeenCalled();
  });

  test('OImageViewer closeOnPressEscape=false 时 ESC 不关闭', async () => {
    const onClose = vi.fn();
    const screen = render({
      setup() {
        return () =>
          h(OImageViewer, {
            previewList: [DATA_IMG],
            focusTrap: true,
            closeOnPressEscape: false,
            onClose,
          });
      },
    });
    await ensureLoaded(screen);
    const root = await getViewerRoot(screen);
    root.focus();
    await flush();
    await userEvent.keyboard('{Escape}');
    await flush();
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('焦点陷阱（Tab 循环）', () => {
  test('OImageViewer focusTrap=true 打开后 Tab 在浮层内循环不溢出', async () => {
    const screen = render({
      setup() {
        return () =>
          h(OImageViewer, {
            previewList: [DATA_IMG, DATA_IMG_B],
            focusTrap: true,
          });
      },
    });
    await ensureLoaded(screen);
    const root = await getViewerRoot(screen);
    root.focus();
    await flush();

    const focusableBefore = Array.from(root.querySelectorAll<HTMLElement>('button, [href], input, [tabindex]:not([tabindex="-1"])')).filter(
      (el) => !el.hasAttribute('disabled'),
    );
    expect(focusableBefore.length).toBeGreaterThan(0);

    const first = focusableBefore[0];
    const last = focusableBefore[focusableBefore.length - 1];

    last.focus();
    await flush();
    expect(document.activeElement).toBe(last);

    await userEvent.tab();
    await flush();
    expect(document.activeElement).toBe(first);
  });

  test('OImageViewer focusTrap=true Shift+Tab 在末尾按钮反向循环', async () => {
    const screen = render({
      setup() {
        return () =>
          h(OImageViewer, {
            previewList: [DATA_IMG, DATA_IMG_B],
            focusTrap: true,
          });
      },
    });
    await ensureLoaded(screen);
    const root = await getViewerRoot(screen);
    root.focus();
    await flush();

    const focusable = Array.from(root.querySelectorAll<HTMLElement>('button, [href], input, [tabindex]:not([tabindex="-1"])')).filter(
      (el) => !el.hasAttribute('disabled'),
    );
    const first = focusable[0];

    first.focus();
    await flush();
    expect(document.activeElement).toBe(first);

    await userEvent.tab({ shift: true });
    await flush();
    const last = focusable[focusable.length - 1];
    expect(document.activeElement).toBe(last);
  });
});

describe('屏幕阅读器语义', () => {
  test('OImageViewer 根元素带 role="dialog"', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG], focusTrap: true },
    });
    await flush();
    const root = await getViewerRoot(screen);
    expect(root.getAttribute('role')).toBe('dialog');
  });

  test('OImageViewer 根元素带 aria-modal="true"', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG], focusTrap: true },
    });
    await flush();
    const root = await getViewerRoot(screen);
    expect(root.getAttribute('aria-modal')).toBe('true');
  });

  test('OImageViewer 根元素带 aria-label 描述预览语境', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG], focusTrap: true },
    });
    await flush();
    const root = await getViewerRoot(screen);
    expect(root.getAttribute('aria-label')).toBeTruthy();
  });

  test('OImageViewer 图片 alt 不是 URL 字符串', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG, DATA_IMG_B], currentIndex: 0 },
    });
    await ensureLoaded(screen);
    const img = screen.container.querySelector('.o-image-viewer-img') as HTMLImageElement;
    expect(img).not.toBeNull();
    const alt = img.getAttribute('alt') || '';
    expect(alt).not.toContain('data:');
    expect(alt).not.toContain('http');
    expect(alt.length).toBeGreaterThan(0);
  });

  test('OImageViewer 操作按钮有 aria-label', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG] },
    });
    await flush();
    const buttons = screen.container.querySelectorAll('.o-image-action-item');
    buttons.forEach((btn) => {
      expect(btn.getAttribute('aria-label')).toBeTruthy();
    });
  });

  test('OImageViewer 导航按钮有 aria-label', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG, DATA_IMG_B] },
    });
    await flush();
    const navButtons = screen.container.querySelectorAll('.o-image-viewer-nav');
    navButtons.forEach((btn) => {
      expect(btn.getAttribute('aria-label')).toBeTruthy();
    });
  });

  test('OImageViewer 缩放比例提示有 aria-label', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG], toolbar: ['zoomOut', 'zoomIn', 'reset'] },
    });
    await ensureLoaded(screen);
    const zoomRatio = screen.container.querySelector('.o-image-zoom-ratio');
    if (zoomRatio) {
      expect(zoomRatio.getAttribute('aria-label')).toBeTruthy();
    }
  });

  test('OImageViewer 进度指示器有 aria-label', async () => {
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG, DATA_IMG_B], showProgress: true },
    });
    await flush();
    const progress = screen.container.querySelector('.o-image-viewer-progress');
    expect(progress).not.toBeNull();
    expect(progress?.getAttribute('aria-label')).toBeTruthy();
  });
});
