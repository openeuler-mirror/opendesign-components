/**
 * OImageViewer 交互行为测试。
 *
 * 覆盖：
 *   1. 键盘导航 - 方向键切换/缩放
 *   2. 重置变换 - resetTransform
 *   3. rotate 事件
 *   4. zoom-drag 事件
 *   5. 缩放边界 - minScale / maxScale
 *   6. scale prop 外部控制
 *   7. duration prop - 缩放比例提示持续
 *   8. 触摸滑动切图 - 左右滑切图、缩放后边缘检测切图
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { defineComponent, h, ref } from 'vue';
import OImageViewer from '../OImageViewer.vue';
import { flush, createMouseEvent, createTouchEvent } from '../../../__tests__/_helpers/dom';

/** 1x1 透明 PNG data URL，浏览器中同步加载成功，不触发 error 状态 */
const DATA_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const DATA_IMG_B = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

/** 200×200 蓝色 PNG data URL，尺寸远大于测试视口 → fitScale < 1 → canDrag=false */
const LARGE_IMG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIAQAAAAAAA6JQ8AAAAAQklEQVR42u3BMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO8OQ1UAAP+0ADMIAAAAAElFTkSuQmCC';

/** 获取根元素 */
async function getRoot(screen: ReturnType<typeof render>) {
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

describe('键盘导航', () => {
  test('ArrowRight 切换到下一张', async () => {
    const onSwitch = vi.fn();
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG, DATA_IMG_B] },
      attrs: { onSwitch },
    });
    const root = await getRoot(screen);
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await flush();
    expect(onSwitch).toHaveBeenCalledWith(1);
  });

  test('ArrowLeft 切换到上一张', async () => {
    const onSwitch = vi.fn();
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG, DATA_IMG_B], currentIndex: 1 },
      attrs: { onSwitch },
    });
    const root = await getRoot(screen);
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await flush();
    expect(onSwitch).toHaveBeenCalledWith(0);
  });
});

describe('rotate 事件', () => {
  test('顺时针旋转按钮点击触发 rotate 事件', async () => {
    const onRotate = vi.fn();
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG], toolbar: ['rotateRight'] },
      attrs: { onRotate },
    });
    await ensureLoaded(screen);
    const btn = screen.container.querySelector('.o-image-action-item') as HTMLButtonElement;
    btn.click();
    await flush();
    expect(onRotate).toHaveBeenCalledWith(90);
  });

  test('逆时针旋转按钮点击触发 rotate 事件', async () => {
    const onRotate = vi.fn();
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG], toolbar: ['rotateLeft'] },
      attrs: { onRotate },
    });
    await ensureLoaded(screen);
    const btn = screen.container.querySelector('.o-image-action-item') as HTMLButtonElement;
    btn.click();
    await flush();
    expect(onRotate).toHaveBeenCalledWith(-90);
  });

  test('多次顺时针旋转角度累加', async () => {
    const onRotate = vi.fn();
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG], toolbar: ['rotateRight'] },
      attrs: { onRotate },
    });
    await ensureLoaded(screen);
    const btn = screen.container.querySelector('.o-image-action-item') as HTMLButtonElement;
    btn.click();
    await flush();
    btn.click();
    await flush();
    expect(onRotate).toHaveBeenLastCalledWith(180);
  });
});

describe('resetTransform', () => {
  test('点击 reset 按钮重置变换', async () => {
    const screen = render(OImageViewer, {
      props: {
        previewList: [DATA_IMG],
        toolbar: ['rotateRight', 'reset'],
      },
    });
    await ensureLoaded(screen);
    const buttons = screen.container.querySelectorAll('.o-image-action-item');
    const rotateBtn = buttons[0] as HTMLButtonElement;
    const resetBtn = buttons[1] as HTMLButtonElement;
    rotateBtn.click();
    await flush();
    const afterRotate = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    expect(afterRotate.style.transform).toContain('rotate(90deg)');
    resetBtn.click();
    await flush();
    const afterReset = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    expect(afterReset.style.transform).not.toContain('rotate(90deg)');
  });
});

describe('缩放边界', () => {
  test('zoomIn 不超过 maxScale', async () => {
    const screen = render(OImageViewer, {
      props: {
        previewList: [DATA_IMG],
        zoomRate: 2,
        maxScale: 3,
        toolbar: ['zoomIn'],
      },
    });
    await ensureLoaded(screen);
    const zoomInBtn = screen.container.querySelector('.o-image-action-item') as HTMLButtonElement;
    // 1x1 图片 fitScale=2，zoomIn: 2*2=4 但 clamp 到 maxScale=3
    zoomInBtn.click();
    await flush();
    // 再 zoomIn: 已在 maxScale=3，不放大
    zoomInBtn.click();
    await flush();
    const container = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    expect(container.style.transform).toMatch(/scale\(3\)/);
  });

  test('zoomOut 不低于 minScale', async () => {
    const screen = render(OImageViewer, {
      props: {
        previewList: [DATA_IMG],
        zoomRate: 2,
        minScale: 0.5,
        scale: 0.8,
        toolbar: ['zoomOut'],
      },
    });
    await ensureLoaded(screen);
    const zoomOutBtn = screen.container.querySelector('.o-image-action-item') as HTMLButtonElement;
    // 父组件传入 scale=0.8，跳过适屏；zoomOut: 0.8/2=0.4，clamp 到 minScale=0.5
    zoomOutBtn.click();
    await flush();
    // 再 zoomOut: 1/2=0.5，clamp 到 minScale=0.5
    zoomOutBtn.click();
    await flush();
    const container = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    expect(container.style.transform).toMatch(/scale\(0\.5\)/);
  });
});

describe('scale prop 外部控制', () => {
  test('scale prop 变化后 transform 同步更新', async () => {
    const screen = render(OImageViewer, {
      props: {
        previewList: [DATA_IMG],
      },
    });
    await ensureLoaded(screen);
    // 加载后 fitScale=2（1x1 图片，200% 目标不超屏幕）
    const before = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    expect(before.style.transform).toMatch(/scale\(2\)/);

    // 外部设置 scale=3，通过 v-model watcher 同步到 transform
    await screen.rerender({ scale: 3 });
    await flush();
    const after = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    expect(after.style.transform).toMatch(/scale\(3\)/);
  });

  test('scale prop 被 clamp 到 maxScale 范围', async () => {
    const screen = render(OImageViewer, {
      props: {
        previewList: [DATA_IMG],
        maxScale: 5,
        minScale: 0.1,
      },
    });
    await ensureLoaded(screen);
    // 加载后 fitScale=2（1x1 图片）
    const container = () => screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    expect(container().style.transform).toMatch(/scale\(2\)/);

    // 外部设置 scale=100，通过 v-model watcher clamp 到 maxScale=5
    await screen.rerender({ scale: 100 });
    await flush();
    expect(container().style.transform).toMatch(/scale\(5\)/);
  });
});

describe('zoom-drag 事件', () => {
  test('鼠标拖拽后触发 zoom-drag 事件', async () => {
    // 验证 mousedown → mouseup 流程触发 zoom-drag 事件
    // 注：useThrottleFn 包装的 mousemove 在合成事件环境中可能不触发，
    // 因此 value 可能为 false（未检测到位移），重点验证事件已被触发
    const onZoomDrag = vi.fn();
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG] },
      attrs: { onZoomDrag },
    });
    await ensureLoaded(screen);
    const container = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    container.dispatchEvent(createMouseEvent('mousedown', 100, 100, { button: 0, bubbles: true, cancelable: true }));
    await flush();
    document.dispatchEvent(createMouseEvent('mousemove', 150, 150, { bubbles: true, cancelable: true }));
    await flush();
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
    await flush();
    expect(onZoomDrag).toHaveBeenCalled();
  });

  test('无位移的点击触发 zoom-drag（value=false 表示仅为点击）', async () => {
    const onZoomDrag = vi.fn();
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG] },
      attrs: { onZoomDrag },
    });
    await ensureLoaded(screen);
    const container = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    container.dispatchEvent(createMouseEvent('mousedown', 100, 100, { button: 0, bubbles: true }));
    document.dispatchEvent(new MouseEvent('mouseup'));
    await flush();
    expect(onZoomDrag).toHaveBeenCalledWith(false);
  });
});

describe('duration prop', () => {
  test('缩放后缩放比例提示短暂显示', async () => {
    const screen = render(OImageViewer, {
      props: {
        previewList: [DATA_IMG],
        showZoomRatio: true,
        duration: 500,
        toolbar: ['zoomIn'],
      },
    });
    await ensureLoaded(screen);
    // 加载后初始展示缩放比例提示（200% 默认缩放），等待自动隐藏
    await new Promise((r) => setTimeout(r, 600));
    await flush();
    const ratioBefore = screen.container.querySelector('.o-image-zoom-ratio') as HTMLElement;
    expect(ratioBefore.style.display).toBe('none');
    const zoomInBtn = screen.container.querySelector('.o-image-action-item') as HTMLButtonElement;
    zoomInBtn.click();
    await flush();
    const ratioAfter = screen.container.querySelector('.o-image-zoom-ratio') as HTMLElement;
    expect(ratioAfter.style.display).not.toBe('none');
  });
});

describe('duration prop 响应式', () => {
  test('duration prop 变化后新触发的缩放提示使用新持续时间', async () => {
    // 初始 duration 需足够长以避免在 flush() 期间触发（flush 含 2 次 RAF ≈ 33–60ms）
    const duration = ref(150);
    const Wrapper = defineComponent({
      setup() {
        return () =>
          h(OImageViewer, {
            previewList: [DATA_IMG],
            showZoomRatio: true,
            duration: duration.value,
            toolbar: ['zoomIn'],
          });
      },
    });
    const screen = render(Wrapper);
    await ensureLoaded(screen);

    const getRatio = () => screen.container.querySelector('.o-image-zoom-ratio') as HTMLElement;
    const zoomInBtn = screen.container.querySelector('.o-image-action-item') as HTMLButtonElement;

    // 加载后初始提示已自动隐藏（duration=150ms）
    await new Promise((r) => setTimeout(r, 300));
    await flush();
    expect(getRatio().style.display).toBe('none');

    // 触发缩放 → 提示显示
    zoomInBtn.click();
    await flush();
    expect(getRatio().style.display).not.toBe('none');

    // 等待超过旧 duration(150ms) → 提示隐藏
    await new Promise((r) => setTimeout(r, 300));
    await flush();
    expect(getRatio().style.display).toBe('none');

    // 更改 duration 为较长值
    duration.value = 5000;
    await flush();

    // 再次触发缩放 → 提示显示
    zoomInBtn.click();
    await flush();
    expect(getRatio().style.display).not.toBe('none');

    // 等待 300ms（小于新 duration 5000ms）→ 提示应仍可见
    await new Promise((r) => setTimeout(r, 300));
    await flush();
    // Bug: 使用旧值 150ms，提示已隐藏；修复后：使用新值 5000ms，提示仍可见
    expect(getRatio().style.display).not.toBe('none');
  });
});

describe('比例指示器显示时机', () => {
  test('旋转操作不显示比例指示器', async () => {
    const screen = render(OImageViewer, {
      props: {
        previewList: [DATA_IMG],
        showZoomRatio: true,
        duration: 5000,
        toolbar: ['rotateRight'],
      },
    });
    await ensureLoaded(screen);
    const getRatio = () => screen.container.querySelector('.o-image-zoom-ratio') as HTMLElement;
    // 加载后初始提示显示（200% 缩放），等待自动隐藏
    await new Promise((r) => setTimeout(r, 200));
    await flush();
    // duration=5000ms，提示仍可见（加载时触发）
    // 等待提示隐藏需超过 5000ms，这里先验证旋转不额外触发
    // 先等待足够长时间让初始提示隐藏
    await new Promise((r) => setTimeout(r, 5500));
    await flush();
    expect(getRatio().style.display).toBe('none');

    const rotateBtn = screen.container.querySelector('.o-image-action-item') as HTMLButtonElement;
    rotateBtn.click();
    await flush();
    // 旋转不改变缩放比例，指示器应保持隐藏
    expect(getRatio().style.display).toBe('none');
  });

  test('缩放达上限后再次放大不显示比例指示器', async () => {
    const screen = render(OImageViewer, {
      props: {
        previewList: [DATA_IMG],
        showZoomRatio: true,
        duration: 150,
        zoomRate: 2,
        maxScale: 2,
        toolbar: ['zoomIn'],
      },
    });
    await ensureLoaded(screen);
    const getRatio = () => screen.container.querySelector('.o-image-zoom-ratio') as HTMLElement;
    const zoomInBtn = screen.container.querySelector('.o-image-action-item') as HTMLButtonElement;

    // 1x1 图片 fitScale=2=maxScale，zoomIn 不改变 scale
    // 但加载时已触发提示，等待自动隐藏（duration=150ms）
    await new Promise((r) => setTimeout(r, 300));
    await flush();
    expect(getRatio().style.display).toBe('none');

    // zoomIn：已在 maxScale=2，scale 不变，指示器不应显示
    zoomInBtn.click();
    await flush();
    expect(getRatio().style.display).toBe('none');
  });

  test('reset 未改变缩放比例时不显示比例指示器', async () => {
    const screen = render(OImageViewer, {
      props: {
        previewList: [DATA_IMG],
        showZoomRatio: true,
        duration: 5000,
        toolbar: ['reset'],
      },
    });
    await ensureLoaded(screen);
    const getRatio = () => screen.container.querySelector('.o-image-zoom-ratio') as HTMLElement;
    // 加载后初始提示显示（200% 缩放），等待自动隐藏
    await new Promise((r) => setTimeout(r, 5500));
    await flush();
    expect(getRatio().style.display).toBe('none');

    // 图片加载后 scale=fitScale=2，reset 不改变 scale，指示器不应显示
    const resetBtn = screen.container.querySelector('.o-image-action-item') as HTMLButtonElement;
    resetBtn.click();
    await flush();
    expect(getRatio().style.display).toBe('none');
  });
});

describe('exposed 方法（间接验证）', () => {
  test('handleActions 执行缩放操作', async () => {
    const screen = render(OImageViewer, {
      props: {
        previewList: [DATA_IMG],
        zoomRate: 1.2,
        maxScale: 8,
      },
    });
    await ensureLoaded(screen);
    const before = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    expect(before.style.transform).toMatch(/scale\(2\)/);
    const buttons = screen.container.querySelectorAll('.o-image-action-item');
    const zoomInBtn = Array.from(buttons).find((b) => b.getAttribute('aria-label') === '放大') as HTMLButtonElement;
    zoomInBtn.click();
    await flush();
    const after = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    expect(after.style.transform).toMatch(/scale\(2\.4\)/);
  });

  test('resetTransform 重置缩放和旋转', async () => {
    const screen = render(OImageViewer, {
      props: {
        previewList: [DATA_IMG],
        zoomRate: 1.2,
        toolbar: ['zoomIn', 'rotateRight', 'reset'],
      },
    });
    await ensureLoaded(screen);
    const buttons = screen.container.querySelectorAll('.o-image-action-item');
    const zoomInBtn = buttons[0] as HTMLButtonElement;
    const rotateBtn = buttons[1] as HTMLButtonElement;
    const resetBtn = buttons[2] as HTMLButtonElement;
    zoomInBtn.click();
    rotateBtn.click();
    await flush();
    const changed = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    expect(changed.style.transform).toMatch(/scale\(2\.4\)/);
    expect(changed.style.transform).toContain('rotate(90deg)');
    resetBtn.click();
    await flush();
    const reset = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    expect(reset.style.transform).toMatch(/scale\(2\)/);
    expect(reset.style.transform).not.toContain('rotate(90deg)');
  });

  test('prev / next 通过导航按钮切换图片', async () => {
    const onSwitch = vi.fn();
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG, DATA_IMG_B], currentIndex: 0 },
      attrs: { onSwitch },
    });
    await flush();
    const nextBtn = screen.container.querySelector('.o-image-viewer-nav-next') as HTMLButtonElement;
    nextBtn.click();
    await flush();
    expect(onSwitch).toHaveBeenCalledWith(1);
  });
});

// ─── 触摸滑动切图（缺陷 1 + 缺陷 2 修复验证） ───

/**
 * 模拟单指触摸滑动序列：touchstart → touchmove → touchend。
 * @param container 图片容器元素
 * @param startX 起始 X 坐标
 * @param endX 结束 X 坐标
 * @param startY 起始 Y 坐标（默认与结束相同，纯水平滑动）
 * @param endY 结束 Y 坐标
 */
async function simulateSwipe(container: HTMLElement, startX: number, endX: number, startY = 200, endY = 200) {
  container.dispatchEvent(createTouchEvent('touchstart', [{ clientX: startX, clientY: startY }]));
  await flush();
  // 分多步 touchmove，模拟真实滑动（useSwipe 需 touchmove 更新 coordsEnd）
  const steps = 5;
  for (let i = 1; i <= steps; i++) {
    const x = startX + ((endX - startX) * i) / steps;
    const y = startY + ((endY - startY) * i) / steps;
    container.dispatchEvent(createTouchEvent('touchmove', [{ clientX: x, clientY: y }]));
    await flush();
  }
  container.dispatchEvent(createTouchEvent('touchend', [{ clientX: endX, clientY: endY }]));
  await flush();
}

describe('触摸滑动切图（未缩放）', () => {
  // 缺陷 1：右滑切图失效。未缩放状态下 useSwipe 应正确检测左右方向。
  // 使用大图 data URL 确保 fitScale ≤ 1（canDrag=false），排除缺陷 2 的干扰。

  test('未缩放左滑切换到下一张', async () => {
    const onSwitch = vi.fn();
    const screen = render(OImageViewer, {
      props: { previewList: [LARGE_IMG, DATA_IMG_B] },
      attrs: { onSwitch },
    });
    await ensureLoaded(screen);
    const container = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    // 左滑：手指从右向左移动 120px
    await simulateSwipe(container, 300, 180);
    expect(onSwitch).toHaveBeenCalledWith(1);
  });

  test('未缩放右滑切换到上一张', async () => {
    const onSwitch = vi.fn();
    const screen = render(OImageViewer, {
      props: { previewList: [LARGE_IMG, DATA_IMG_B], currentIndex: 1 },
      attrs: { onSwitch },
    });
    await ensureLoaded(screen);
    const container = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    // 右滑：手指从左向右移动 120px
    await simulateSwipe(container, 180, 300);
    expect(onSwitch).toHaveBeenCalledWith(0);
  });
});

describe('缩放后边缘检测切图（缺陷 2）', () => {
  // 缺陷 2：缩放后到达边缘继续同方向滑动应触发切图。
  // 使用 1×1 小图 → fitScale=2（200%），canDrag=true。
  // 需要在 onTouchStart 时模拟图片已在边缘（offset 已达 maxPan）。

  test('缩放后在左边缘继续左滑切换到下一张', async () => {
    const onSwitch = vi.fn();
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG, DATA_IMG_B], scale: 3 },
      attrs: { onSwitch },
    });
    await ensureLoaded(screen);
    const container = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    // scale=3 的 1×1 图片，渲染尺寸 3×3，容器远大于此 → maxPan=0
    // 图片始终在"边缘"（maxPan=0），任何水平滑动都应触发切图
    await simulateSwipe(container, 300, 180);
    expect(onSwitch).toHaveBeenCalledWith(1);
  });

  test('缩放后在右边缘继续右滑切换到上一张', async () => {
    const onSwitch = vi.fn();
    const screen = render(OImageViewer, {
      props: { previewList: [DATA_IMG, DATA_IMG_B], currentIndex: 1, scale: 3 },
      attrs: { onSwitch },
    });
    await ensureLoaded(screen);
    const container = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    await simulateSwipe(container, 180, 300);
    expect(onSwitch).toHaveBeenCalledWith(0);
  });

  test('缩放后短距离滑动不触发切图（平移）', async () => {
    // 1×1 图片 scale=3，maxPan=0，任何滑动都超出边界 → 会切图
    // 此用例验证：当 maxPan > 0（图片大于容器）时，在边界内的短滑动不切图
    // 使用大图 + 高 scale 确保 maxPan > 0
    const onSwitch = vi.fn();
    const screen = render(OImageViewer, {
      props: { previewList: [LARGE_IMG, DATA_IMG_B], scale: 10 },
      attrs: { onSwitch },
    });
    await ensureLoaded(screen);
    const container = screen.container.querySelector('.o-image-viewer-container') as HTMLElement;
    // 200×200 × scale=10 = 2000×2000 渲染尺寸，容器约 1920×1080
    // maxPan ≈ (2000-1920)/2 = 40px，短距离滑动（10px）在范围内
    await simulateSwipe(container, 200, 210);
    // 未到达边缘，不应切图
    expect(onSwitch).not.toHaveBeenCalled();
  });
});
