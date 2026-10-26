/**
 * OImageViewer 函数式 API（useImageViewer）测试。
 *
 * 覆盖：
 *   1. 基础挂载 — open() 渲染 DOM
 *   2. close 行为 — scope 内（只切 visible）vs scope 外（直接 unmount）
 *   3. visible ref 双向控制 — 外部赋值等价于 open/close
 *   4. 内部关闭 — 关闭按钮 / ESC / 遮罩点击触发 onClose + visible=false
 *   5. onClose 幂等 — 仅触发一次
 *   6. 事件透传 — onSwitch / onRotate / onZoomDrag
 *   7. layerOptions 默认值与合并
 *   8. props 透传 — previewList / toolbar / showProgress
 *   9. 响应式更新 — previewList ref 变化反映到打开的预览
 *   10. 复用模式 — scope 内多次 open/close 复用同一实例
 *   11. unmount() 彻底销毁
 *   12. scope 销毁时自动 unmount
 */
import { test, expect, describe, vi, afterEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { defineComponent, h, ref, shallowRef } from 'vue';
import { useImageViewer } from '../use-image-viewer';
import type { ImageViewerHandle } from '../use-image-viewer';
import { flush, createMouseEvent } from '../../../__tests__/_helpers/dom';

/** 1×1 透明 PNG，浏览器中同步加载成功，不触发 error 状态 */
const DATA_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const DATA_IMG_B = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

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
 * 句柄通过 shallowRef 暴露给测试，便于在 mount 后访问。
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

afterEach(() => {
  document.body.innerHTML = '';
});

describe('基础挂载', () => {
  test('open() 调用后渲染 OImageViewer DOM', async () => {
    const { open } = useOutOfScope({ previewList: [DATA_IMG] });
    open();
    await flush();
    expect(queryViewers().length).toBeGreaterThan(0);
  });

  test('useImageViewer 返回 { visible, open, close, unmount }', () => {
    const handle = useOutOfScope({ previewList: [DATA_IMG] });
    expect(handle.visible).toBeDefined();
    expect(typeof handle.open).toBe('function');
    expect(typeof handle.close).toBe('function');
    expect(typeof handle.unmount).toBe('function');
    handle.unmount();
  });
});

describe('close 行为', () => {
  test('scope 外：close 直接卸载 DOM', async () => {
    const { open, close } = useOutOfScope({ previewList: [DATA_IMG] });
    open();
    await flush();
    expect(queryViewers().length).toBeGreaterThan(0);
    close();
    await flush();
    expect(queryViewers().length).toBe(0);
  });

  test('scope 外：close 幂等（未打开时不报错）', () => {
    const { close } = useOutOfScope({ previewList: [DATA_IMG] });
    expect(() => close()).not.toThrow();
  });

  test('scope 内：close 只切 visible，保留挂载实例', async () => {
    const { handle: handleRef } = renderInScope({ previewList: [DATA_IMG] });
    const handle = handleRef.value!;
    handle.open();
    await flush();
    expect(handle.visible.value).toBe(true);
    expect(queryViewers().length).toBeGreaterThan(0);

    handle.close();
    await flush();
    // visible 变为 false，但挂载实例仍存在
    expect(handle.visible.value).toBe(false);
    // DOM 可能因 OLayer 隐藏而不可见，但 wrapper 容器不应当被 unmount
    // （实际 OLayer 可能保留 DOM 也可能不保留，这里不严格断言 DOM 数量）

    // 再次 open 复用同一实例
    handle.open();
    await flush();
    expect(handle.visible.value).toBe(true);
    expect(queryViewers().length).toBeGreaterThan(0);

    handle.unmount();
    await flush();
    expect(queryViewers().length).toBe(0);
  });
});

describe('visible ref 双向控制', () => {
  test('visible.value = true 等价于 open()', async () => {
    const handle = useOutOfScope({ previewList: [DATA_IMG] });
    handle.visible.value = true;
    await flush();
    expect(queryViewers().length).toBeGreaterThan(0);
    handle.unmount();
  });

  test('visible.value = false 等价于 close()（scope 外时直接 unmount）', async () => {
    const handle = useOutOfScope({ previewList: [DATA_IMG] });
    handle.open();
    await flush();
    handle.visible.value = false;
    await flush();
    expect(queryViewers().length).toBe(0);
  });

  test('open 幂等（已打开时 no-op）', async () => {
    const handle = useOutOfScope({ previewList: [DATA_IMG] });
    handle.open();
    handle.open();
    handle.open();
    await flush();
    expect(queryViewers().length).toBe(1);
    handle.unmount();
  });
});

describe('内部关闭触发 onClose', () => {
  test('点击 OLayer 关闭按钮触发 onClose 并移除 DOM', async () => {
    const onClose = vi.fn();
    const { open, unmount } = useOutOfScope({ previewList: [DATA_IMG], onClose });
    open();
    await flush();
    // OImageViewer 默认 buttonClose: true，OLayer 渲染 .o-layer-close 关闭按钮
    const closeBtn = document.querySelector('.o-layer-close') as HTMLButtonElement;
    closeBtn.click();
    await flush();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(queryViewers().length).toBe(0);
    unmount();
  });

  test('按 ESC 触发 onClose 并移除 DOM', async () => {
    const onClose = vi.fn();
    const { open, unmount } = useOutOfScope({ previewList: [DATA_IMG], onClose });
    open();
    await flush();
    const root = queryViewers()[0];
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await flush();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(queryViewers().length).toBe(0);
    unmount();
  });

  test('onClose 回调仅触发一次（update:visible + close 事件去重）', async () => {
    const onClose = vi.fn();
    const { open, unmount } = useOutOfScope({ previewList: [DATA_IMG], onClose });
    open();
    await flush();
    // OImageViewer 默认 buttonClose: true，OLayer 渲染 .o-layer-close 关闭按钮
    const closeBtn = document.querySelector('.o-layer-close') as HTMLButtonElement;
    closeBtn.click();
    await flush();
    expect(onClose).toHaveBeenCalledTimes(1);
    unmount();
  });

  test('手动 close 也触发 onClose 回调', async () => {
    const onClose = vi.fn();
    const { open, close } = useOutOfScope({ previewList: [DATA_IMG], onClose });
    open();
    await flush();
    close();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('layerOptions 默认值', () => {
  test('函数式场景默认渲染遮罩层', async () => {
    const { open, unmount } = useOutOfScope({ previewList: [DATA_IMG] });
    open();
    await flush();
    expect(document.querySelector('.o-layer-mask')).not.toBeNull();
    unmount();
  });

  test('函数式场景默认渲染关闭按钮', async () => {
    const { open, unmount } = useOutOfScope({ previewList: [DATA_IMG] });
    open();
    await flush();
    expect(document.querySelector('.o-layer-close')).not.toBeNull();
    unmount();
  });

  test('用户传入 layerOptions 覆盖默认值', async () => {
    const { open, unmount } = useOutOfScope({
      previewList: [DATA_IMG],
      layerOptions: { mask: false, maskClose: false, buttonClose: false, wrapper: null },
    });
    open();
    await flush();
    expect(document.querySelector('.o-layer-mask')).toBeNull();
    expect(document.querySelector('.o-layer-close')).toBeNull();
    unmount();
  });
});

describe('事件透传', () => {
  test('onSwitch 回调 — 点击下一张触发', async () => {
    const onSwitch = vi.fn();
    const { open, unmount } = useOutOfScope({
      previewList: [DATA_IMG, DATA_IMG_B],
      onSwitch,
    });
    open();
    await flush();
    const nextBtn = document.querySelector('.o-image-viewer-nav-next') as HTMLButtonElement;
    nextBtn.click();
    await flush();
    expect(onSwitch).toHaveBeenCalledWith(1);
    unmount();
  });

  test('onZoomDrag 回调 — 鼠标拖拽后触发', async () => {
    const onZoomDrag = vi.fn();
    const { open, unmount } = useOutOfScope({
      previewList: [DATA_IMG],
      onZoomDrag,
    });
    open();
    await flush();
    const img = document.querySelector('.o-image-viewer-img') as HTMLImageElement | null;
    if (img) {
      img.dispatchEvent(new Event('load'));
      await flush();
    }
    const container = document.querySelector('.o-image-viewer-container') as HTMLElement;
    container.dispatchEvent(createMouseEvent('mousedown', 100, 100, { button: 0, bubbles: true, cancelable: true }));
    await flush();
    document.dispatchEvent(createMouseEvent('mousemove', 150, 150, { bubbles: true, cancelable: true }));
    await flush();
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
    await flush();
    expect(onZoomDrag).toHaveBeenCalled();
    unmount();
  });
});

describe('props 透传', () => {
  test('previewList 传入多图时渲染导航按钮', async () => {
    const { open, unmount } = useOutOfScope({ previewList: [DATA_IMG, DATA_IMG_B] });
    open();
    await flush();
    const navButtons = document.querySelectorAll('.o-image-viewer-nav');
    expect(navButtons.length).toBe(2);
    unmount();
  });

  test('toolbar 自定义只显示指定按钮', async () => {
    const { open, unmount } = useOutOfScope({
      previewList: [DATA_IMG],
      toolbar: ['zoomIn'],
    });
    open();
    await flush();
    const buttons = document.querySelectorAll('.o-image-action-item');
    expect(buttons.length).toBe(1);
    expect(buttons[0].getAttribute('aria-label')).toBe('放大');
    unmount();
  });

  test('toolbar=false 时操作区隐藏', async () => {
    const { open, unmount } = useOutOfScope({
      previewList: [DATA_IMG],
      toolbar: false,
    });
    open();
    await flush();
    const action = document.querySelector('.o-image-viewer-action');
    // v-if 隐藏：元素不存在于 DOM
    expect(action).toBeNull();
    unmount();
  });

  test('showProgress=true 时渲染进度指示器', async () => {
    const { open, unmount } = useOutOfScope({
      previewList: [DATA_IMG, DATA_IMG_B],
      showProgress: true,
    });
    open();
    await flush();
    const progress = document.querySelector('.o-image-viewer-progress');
    expect(progress).not.toBeNull();
    expect(progress?.textContent?.trim()).toBe('1 / 2');
    unmount();
  });
});

describe('响应式更新', () => {
  test('previewList ref 变化后 DOM 同步更新', async () => {
    const list = ref<string[]>([DATA_IMG]);
    const { open, unmount } = useOutOfScope({ previewList: list });
    open();
    await flush();
    // 初始只有 1 张图，无导航按钮
    expect(document.querySelectorAll('.o-image-viewer-nav').length).toBe(0);

    // push 一张新图
    list.value = [DATA_IMG, DATA_IMG_B];
    await flush();
    // 现在应该有 2 个导航按钮
    expect(document.querySelectorAll('.o-image-viewer-nav').length).toBe(2);
    unmount();
  });

  test('getter 形式的 previewList 也响应式更新', async () => {
    const list = ref<string[]>([DATA_IMG]);
    const { open, unmount } = useOutOfScope({ previewList: () => list.value });
    open();
    await flush();
    expect(document.querySelectorAll('.o-image-viewer-nav').length).toBe(0);

    list.value = [DATA_IMG, DATA_IMG_B];
    await flush();
    expect(document.querySelectorAll('.o-image-viewer-nav').length).toBe(2);
    unmount();
  });
});

describe('复用模式（scope 内）', () => {
  test('多次 open/close 复用同一挂载实例（visible ref 切换）', async () => {
    const { handle: handleRef } = renderInScope({ previewList: [DATA_IMG] });
    const handle = handleRef.value!;

    // 首次 open — 懒挂载
    handle.open();
    await flush();
    expect(handle.visible.value).toBe(true);

    // close — 只切 visible，实例保留
    handle.close();
    await flush();
    expect(handle.visible.value).toBe(false);

    // 再次 open — 复用同一实例
    handle.open();
    await flush();
    expect(handle.visible.value).toBe(true);

    // unmount — 彻底销毁
    handle.unmount();
    await flush();
    expect(queryViewers().length).toBe(0);
  });

  test('scope 销毁时自动 unmount', async () => {
    const { handle: handleRef, screen } = renderInScope({ previewList: [DATA_IMG] });
    const handle = handleRef.value!;
    handle.open();
    await flush();
    expect(queryViewers().length).toBeGreaterThan(0);

    // 卸载宿主组件 → 触发 onScopeDispose → 自动 unmount 预览
    screen.unmount();
    await flush();
    expect(queryViewers().length).toBe(0);
  });
});

describe('unmount()', () => {
  test('未挂载时 unmount 幂等', () => {
    const { unmount } = useOutOfScope({ previewList: [DATA_IMG] });
    expect(() => unmount()).not.toThrow();
  });

  test('unmount 后再次 open 重新挂载', async () => {
    const { open, unmount } = useOutOfScope({ previewList: [DATA_IMG] });
    open();
    await flush();
    unmount();
    await flush();
    expect(queryViewers().length).toBe(0);

    open();
    await flush();
    expect(queryViewers().length).toBeGreaterThan(0);
    unmount();
  });
});

describe('一次性模式 watch 暂停', () => {
  test('scope 外 close 后 visible.value = true 不再触发挂载（watch 已暂停）', async () => {
    const handle = useOutOfScope({ previewList: [DATA_IMG] });
    handle.open();
    await flush();
    expect(queryViewers().length).toBeGreaterThan(0);

    handle.close();
    await flush();
    expect(queryViewers().length).toBe(0);

    // close() 应调用 pauseWatch() 暂停内部 watch，
    // 赋值 visible 不再触发 ensureMounted → 无重新挂载
    handle.visible.value = true;
    await flush();
    expect(queryViewers().length).toBe(0);
  });

  test('scope 外 close 后 open() 仍可重新挂载（resume 恢复 watch）', async () => {
    const handle = useOutOfScope({ previewList: [DATA_IMG] });
    handle.open();
    await flush();
    handle.close();
    await flush();

    // open() 调用 ensureMounted() + resumeWatch()，不依赖 watch 是否活跃
    handle.open();
    await flush();
    expect(queryViewers().length).toBeGreaterThan(0);
    handle.unmount();
  });

  test('scope 外：内部关闭（关闭按钮）后 visible.value=true 不再触发挂载（watch 已暂停）', async () => {
    const handle = useOutOfScope({ previewList: [DATA_IMG] });
    handle.open();
    await flush();
    expect(queryViewers().length).toBeGreaterThan(0);

    // 通过 OLayer 关闭按钮触发内部关闭（不经过 handle.close()）
    const closeBtn = document.querySelector('.o-layer-close') as HTMLButtonElement;
    closeBtn.click();
    await flush();
    expect(queryViewers().length).toBe(0);

    // 内部关闭路径也暂停了 watch → 赋值 visible 不再触发重新挂载
    handle.visible.value = true;
    await flush();
    expect(queryViewers().length).toBe(0);

    // open() 恢复 watch + 重新挂载
    handle.open();
    await flush();
    expect(queryViewers().length).toBeGreaterThan(0);
    handle.unmount();
  });
});

describe('autoDestroyOnClose', () => {
  test('scope 内 autoDestroyOnClose=true：close 卸载实例', async () => {
    const { handle: handleRef } = renderInScope({
      previewList: [DATA_IMG],
      autoDestroyOnClose: true,
    });
    const handle = handleRef.value!;

    handle.open();
    await flush();
    expect(queryViewers().length).toBeGreaterThan(0);

    handle.close();
    await flush();
    // autoDestroyOnClose=true → close 卸载底层实例
    expect(queryViewers().length).toBe(0);
  });

  test('scope 内 autoDestroyOnClose=true：visible.value 仍可重新挂载（watch 未停止）', async () => {
    const { handle: handleRef } = renderInScope({
      previewList: [DATA_IMG],
      autoDestroyOnClose: true,
    });
    const handle = handleRef.value!;

    handle.open();
    await flush();
    handle.close();
    await flush();
    expect(queryViewers().length).toBe(0);

    // scope 内 watch 未停止 → 赋值 visible 重新挂载
    handle.visible.value = true;
    await flush();
    expect(queryViewers().length).toBeGreaterThan(0);

    handle.unmount();
    await flush();
    expect(queryViewers().length).toBe(0);
  });

  test('scope 内 autoDestroyOnClose=true：open() 仍可重新挂载', async () => {
    const { handle: handleRef } = renderInScope({
      previewList: [DATA_IMG],
      autoDestroyOnClose: true,
    });
    const handle = handleRef.value!;

    handle.open();
    await flush();
    handle.close();
    await flush();
    expect(queryViewers().length).toBe(0);

    handle.open();
    await flush();
    expect(queryViewers().length).toBeGreaterThan(0);

    handle.unmount();
    await flush();
    expect(queryViewers().length).toBe(0);
  });

  test('scope 外 autoDestroyOnClose=false：close 保留挂载容器', async () => {
    const { open, close, unmount } = useOutOfScope({
      previewList: [DATA_IMG],
      autoDestroyOnClose: false,
    });
    open();
    await flush();
    expect(document.body.children.length).toBeGreaterThan(0);

    close();
    await flush();
    // autoDestroyOnClose=false → close 不卸载容器，OLayer 隐藏但 mountWithCtx 容器仍在 body
    expect(document.body.children.length).toBeGreaterThan(0);

    // 需手动 unmount 释放
    unmount();
    await flush();
    expect(document.body.children.length).toBe(0);
  });

  test('scope 外 autoDestroyOnClose=false：close 后 visible.value=true 重新显示（Wrapper 仍存活）', async () => {
    const handle = useOutOfScope({
      previewList: [DATA_IMG],
      autoDestroyOnClose: false,
    });
    handle.open();
    await flush();
    handle.close();
    await flush();

    // autoDestroyOnClose=false → 实例未销毁 → Wrapper 仍响应 visible 变化
    handle.visible.value = true;
    await flush();
    expect(queryViewers().length).toBeGreaterThan(0);

    handle.unmount();
    await flush();
    expect(queryViewers().length).toBe(0);
  });

  test('scope 外 autoDestroyOnClose=false：open() 仍可重新打开（实例未销毁）', async () => {
    const { open, close, unmount } = useOutOfScope({
      previewList: [DATA_IMG],
      autoDestroyOnClose: false,
    });
    open();
    await flush();
    close();
    await flush();

    // 实例未销毁 → open() 复用同一实例
    open();
    await flush();
    expect(queryViewers().length).toBeGreaterThan(0);

    unmount();
    await flush();
    expect(queryViewers().length).toBe(0);
  });

  test('scope 外 autoDestroyOnClose=false：onClose 每次会话仅触发一次', async () => {
    const onClose = vi.fn();
    const { open, close, unmount } = useOutOfScope({
      previewList: [DATA_IMG],
      autoDestroyOnClose: false,
      onClose,
    });
    open();
    await flush();
    close();
    expect(onClose).toHaveBeenCalledTimes(1);

    // 重新打开再关闭 → 第二次会话
    open();
    await flush();
    close();
    expect(onClose).toHaveBeenCalledTimes(2);

    unmount();
  });
});

describe('重复内部关闭实例泄漏（!hasScope + autoDestroyOnClose 默认 true）', () => {
  test('scope 外：第二次内部关闭（关闭按钮）后 DOM 应被移除', async () => {
    const onClose = vi.fn();
    const { open, unmount } = useOutOfScope({ previewList: [DATA_IMG], onClose });

    // ---- 第一次 open + 内部关闭（关闭按钮）----
    open();
    await flush();
    expect(queryViewers().length).toBeGreaterThan(0);

    let closeBtn = document.querySelector('.o-layer-close') as HTMLButtonElement;
    closeBtn.click();
    await flush();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(queryViewers().length).toBe(0);

    // ---- 第二次 open + 内部关闭（关闭按钮）----
    open();
    await flush();
    expect(queryViewers().length).toBeGreaterThan(0);

    closeBtn = document.querySelector('.o-layer-close') as HTMLButtonElement;
    closeBtn.click();
    await flush();
    // 期望：onClose 第二次触发
    expect(onClose).toHaveBeenCalledTimes(2);
    // 期望：DOM 已移除（autoDestroyOnClose=true 时内部关闭应卸载实例）
    // ⚠️ BUG：watch 已被第一次内部关闭停止，第二次内部关闭不走 watch 路径，
    //         onClose handler 只调 fireOnClose 不调 doUnmount → 实例泄漏
    expect(queryViewers().length).toBe(0);

    unmount();
    await flush();
  });

  test('scope 外：第二次内部关闭（ESC）后 DOM 应被移除', async () => {
    const onClose = vi.fn();
    const { open, unmount } = useOutOfScope({ previewList: [DATA_IMG], onClose });

    // ---- 第一次 open + ESC 关闭 ----
    open();
    await flush();
    queryViewers()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await flush();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(queryViewers().length).toBe(0);

    // ---- 第二次 open + ESC 关闭 ----
    open();
    await flush();
    queryViewers()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await flush();
    expect(onClose).toHaveBeenCalledTimes(2);
    // ⚠️ BUG：同上，watch 已停止导致 doUnmount 未被调用
    expect(queryViewers().length).toBe(0);

    unmount();
    await flush();
  });

  test('scope 外：第二次外部 close 后 DOM 应被移除', async () => {
    const onClose = vi.fn();
    const { open, close, unmount } = useOutOfScope({ previewList: [DATA_IMG], onClose });

    // ---- 第一次 open + 外部 close ----
    open();
    await flush();
    close();
    await flush();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(queryViewers().length).toBe(0);

    // ---- 第二次 open + 外部 close ----
    open();
    await flush();
    close();
    await flush();
    expect(onClose).toHaveBeenCalledTimes(2);
    // 外部 close 直接调 doUnmount（不依赖 watch），不受 bug 影响
    expect(queryViewers().length).toBe(0);

    unmount();
    await flush();
  });
});
