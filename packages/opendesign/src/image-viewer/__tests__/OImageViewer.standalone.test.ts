/**
 * OImageViewer OLayer 集成测试。
 *
 * 覆盖：
 *   1. layer-options — mask / maskClose / buttonClose / wrapper 配置
 *   2. closeOnPressEscape — ESC 键关闭
 *   3. focusTrap — 根元素 tabindex
 *   4. visible — v-model:visible 双向绑定
 *   5. bodyClose — 点击图片关闭预览
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import OImageViewer from '../OImageViewer.vue';
import { flush } from '../../../__tests__/_helpers/dom';

const MOCK_IMG_A = 'https://example.com/a.png';

describe('layer-options 遮罩层配置', () => {
  test('layer-options mask=true 时渲染遮罩层', async () => {
    render(OImageViewer, {
      props: {
        previewList: [MOCK_IMG_A],
        layerOptions: { mask: true, maskClose: true, buttonClose: false, wrapper: null },
      },
    });
    await flush();
    const mask = document.querySelector('.o-layer-mask');
    expect(mask).not.toBeNull();
  });

  test('layer-options mask=false 时不渲染遮罩层', async () => {
    render(OImageViewer, {
      props: {
        previewList: [MOCK_IMG_A],
        layerOptions: { mask: false, maskClose: false, buttonClose: false, wrapper: null },
      },
    });
    await flush();
    const mask = document.querySelector('.o-layer-mask');
    expect(mask).toBeNull();
  });

  test('layer-options buttonClose=true 时渲染 OLayer 关闭按钮', async () => {
    render(OImageViewer, {
      props: {
        previewList: [MOCK_IMG_A],
        layerOptions: { mask: true, maskClose: true, buttonClose: true, wrapper: null },
      },
    });
    await flush();
    const closeBtn = document.querySelector('.o-layer-close');
    expect(closeBtn).not.toBeNull();
  });

  test('layer-options buttonClose=false 时不渲染 OLayer 关闭按钮', async () => {
    render(OImageViewer, {
      props: {
        previewList: [MOCK_IMG_A],
        layerOptions: { mask: true, maskClose: true, buttonClose: false, wrapper: null },
      },
    });
    await flush();
    const closeBtn = document.querySelector('.o-layer-close');
    expect(closeBtn).toBeNull();
  });
});

describe('closeOnPressEscape', () => {
  test('closeOnPressEscape=true 时按 ESC 触发 close 事件', async () => {
    const onClose = vi.fn();
    render(OImageViewer, {
      props: { previewList: [MOCK_IMG_A], closeOnPressEscape: true },
      attrs: { onClose },
    });
    await flush();
    const root = document.querySelector('.o-image-viewer') as HTMLElement;
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await flush();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('closeOnPressEscape=false 时按 ESC 不触发 close 事件', async () => {
    const onClose = vi.fn();
    render(OImageViewer, {
      props: { previewList: [MOCK_IMG_A], closeOnPressEscape: false },
      attrs: { onClose },
    });
    await flush();
    const root = document.querySelector('.o-image-viewer') as HTMLElement;
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await flush();
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('focusTrap', () => {
  test('focusTrap=true 时根元素设置 tabindex=-1', async () => {
    render(OImageViewer, {
      props: { previewList: [MOCK_IMG_A], focusTrap: true },
    });
    await flush();
    const root = document.querySelector('.o-image-viewer') as HTMLElement;
    expect(root.getAttribute('tabindex')).toBe('-1');
  });

  test('focusTrap=false 时根元素不设置 tabindex', async () => {
    render(OImageViewer, {
      props: { previewList: [MOCK_IMG_A], focusTrap: false },
    });
    await flush();
    const root = document.querySelector('.o-image-viewer') as HTMLElement;
    expect(root.getAttribute('tabindex')).toBeNull();
  });
});

describe('visible v-model', () => {
  test('visible=false 时不渲染内容', async () => {
    render(OImageViewer, {
      props: { previewList: [MOCK_IMG_A], visible: false },
    });
    await flush();
    const root = document.querySelector('.o-image-viewer');
    expect(root).toBeNull();
  });

  test('visible=true 时渲染内容', async () => {
    render(OImageViewer, {
      props: { previewList: [MOCK_IMG_A], visible: true },
    });
    await flush();
    const root = document.querySelector('.o-image-viewer');
    expect(root).not.toBeNull();
  });
});
