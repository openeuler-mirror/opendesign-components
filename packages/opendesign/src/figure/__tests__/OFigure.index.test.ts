/**
 * OFigure 单组件契约测试。
 *
 * 组织原则：
 *   1. 静态契约：按 types.ts prop 顺序
 *   2. 动态契约：load / error / preview 事件 + 点击交互
 *   3. 视觉契约：双主题 colorful 预色 / error 错误状态
 *   4. 暴露方法：preview(boolean)
 *   5. 插槽契约：default / error / play-icon / content / title / preview / preview-extra
 */
import { test, expect, describe, vi, afterEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, ref } from 'vue';
import OFigure from '../OFigure.vue';
import { THEMES, paintThemed } from '../../../__tests__/_helpers/theme';
import { flush } from '../../../__tests__/_helpers/dom';

/** 结构性测试用的图片地址（无需真正加载） */
const SRC = '/test-image.jpg';
/** 可加载的 1×1 GIF data URI（用于 load 事件测试） */
const VALID_SRC = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
/** 无法加载的图片地址（用于 error 事件测试） */
const INVALID_SRC = '/nonexistent-image-' + Date.now() + '.jpg';

/** 清理 teleport 到 body 的 OLayer 残留 */
afterEach(() => {
  document.body.querySelectorAll('.o-layer').forEach((el) => el.remove());
});

// ============================================================================
// 静态契约：按 types.ts 的 prop 顺序，每个 prop 一条用例
// ============================================================================
describe('静态契约（按 types.ts 属性）', () => {
  test('OFigure src - 非 background 模式渲染 img 元素且 src 透传', async () => {
    // 使用 data URI 确保图片加载成功，img 元素不被 error 状态移除
    const screen = render(OFigure, { props: { src: VALID_SRC } });
    await flush();
    const img = screen.container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('src')).toBe(VALID_SRC);
  });

  test('OFigure src - background 模式不渲染 img，backgroundImage 写入内联 style', async () => {
    const screen = render(OFigure, { props: { src: SRC, background: true, ratio: 16 / 9 } });
    await flush();
    expect(screen.container.querySelector('img')).toBeNull();
    const el = screen.container.querySelector('.o-figure') as HTMLElement;
    expect(el.style.backgroundImage).toContain(SRC);
  });

  test('OFigure ratio - 设置 --figure-padding-top CSS 变量 + o-figure-no-ratio 类', async () => {
    // ratio = 16/9 → padding-top = (1/(16/9))*100 = 56.25%
    const screen = render(OFigure, { props: { src: SRC, ratio: 16 / 9 } });
    await flush();
    const el = screen.container.querySelector('.o-figure') as HTMLElement;
    expect(el.style.getPropertyValue('--figure-padding-top')).toBe('56.25%');
    expect(el.classList.contains('o-figure-no-ratio')).toBe(false);

    // 未设置 ratio → padding-top 为空，o-figure-no-ratio 类存在
    const noRatio = render(OFigure, { props: { src: SRC } });
    await flush();
    const noRatioEl = noRatio.container.querySelector('.o-figure') as HTMLElement;
    expect(noRatioEl.style.getPropertyValue('--figure-padding-top')).toBe('');
    expect(noRatioEl.classList.contains('o-figure-no-ratio')).toBe(true);
  });

  test('OFigure fit - 写入 --figure-fit 内联样式', async () => {
    for (const f of ['cover', 'contain', 'fill', 'none', 'scale-down']) {
      const screen = render(OFigure, { props: { src: SRC, fit: f } });
      await flush();
      const el = screen.container.querySelector('.o-figure') as HTMLElement;
      expect(el.style.getPropertyValue('--figure-fit')).toBe(f);
    }

    // 未设置 fit → 内联 style 不设 --figure-fit，由 var.scss 默认 cover 兜底
    const def = render(OFigure, { props: { src: SRC } });
    await flush();
    const defEl = def.container.querySelector('.o-figure') as HTMLElement;
    expect(defEl.style.getPropertyValue('--figure-fit')).toBe('');
    expect(getComputedStyle(defEl).getPropertyValue('--figure-fit').trim()).toBe('cover');
  });

  test('OFigure alt - 透传到 img alt 属性', async () => {
    // 使用 data URI 确保 img 元素存在
    const screen = render(OFigure, { props: { src: VALID_SRC, alt: 'A test image' } });
    await flush();
    const img = screen.container.querySelector('img');
    expect(img?.getAttribute('alt')).toBe('A test image');

    // 未设置 alt → img 无 alt 属性
    const def = render(OFigure, { props: { src: VALID_SRC } });
    await flush();
    const defImg = def.container.querySelector('img');
    expect(defImg?.getAttribute('alt')).toBeNull();
  });

  test('OFigure background - 注入 o-figure-bg 类 + 不渲染 img 元素', async () => {
    const screen = render(OFigure, { props: { src: SRC, background: true, ratio: 16 / 9 } });
    await flush();
    const el = screen.container.querySelector('.o-figure') as HTMLElement;
    expect(el.classList.contains('o-figure-bg')).toBe(true);
    // background 模式不渲染 img 元素
    expect(el.querySelector('img')).toBeNull();

    // 非 background 模式不注入 o-figure-bg
    const def = render(OFigure, { props: { src: SRC, ratio: 16 / 9 } });
    await flush();
    const defEl = def.container.querySelector('.o-figure') as HTMLElement;
    expect(defEl.classList.contains('o-figure-bg')).toBe(false);
  });

  test('OFigure hoverable - 注入 o-figure-hoverable 类', async () => {
    const screen = render(OFigure, { props: { src: SRC, hoverable: true } });
    await flush();
    const el = screen.container.querySelector('.o-figure') as HTMLElement;
    expect(el.classList.contains('o-figure-hoverable')).toBe(true);

    // 未设置 hoverable 且无 href/preview/videoPoster → 不注入
    const def = render(OFigure, { props: { src: SRC } });
    await flush();
    const defEl = def.container.querySelector('.o-figure') as HTMLElement;
    expect(defEl.classList.contains('o-figure-hoverable')).toBe(false);
  });

  test('OFigure href - 渲染为 <a> 标签且 href 透传', async () => {
    const screen = render(OFigure, { props: { src: SRC, href: 'https://example.com' } });
    await flush();
    const el = screen.container.querySelector('.o-figure') as HTMLElement;
    expect(el.tagName).toBe('A');
    expect(el.getAttribute('href')).toBe('https://example.com');

    // 未设置 href → 渲染为 <div>
    const def = render(OFigure, { props: { src: SRC } });
    await flush();
    const defEl = def.container.querySelector('.o-figure') as HTMLElement;
    expect(defEl.tagName).toBe('DIV');
  });

  test('OFigure colorful - 注入 is-colorful 类 + --figure-prest-color 非空', async () => {
    const screen = render(OFigure, { props: { src: SRC, colorful: true } });
    await flush();
    const el = screen.container.querySelector('.o-figure') as HTMLElement;
    expect(el.classList.contains('is-colorful')).toBe(true);
    expect(el.style.getPropertyValue('--figure-prest-color')).toBeTruthy();

    // 未设置 colorful → 不注入 is-colorful，--figure-prest-color 为空
    const def = render(OFigure, { props: { src: SRC } });
    await flush();
    const defEl = def.container.querySelector('.o-figure') as HTMLElement;
    expect(defEl.classList.contains('is-colorful')).toBe(false);
    expect(defEl.style.getPropertyValue('--figure-prest-color')).toBe('');
  });

  test('OFigure preview - 注入 o-figure-previewable + o-figure-hoverable 类', async () => {
    const screen = render(OFigure, { props: { src: SRC, preview: true } });
    await flush();
    const el = screen.container.querySelector('.o-figure') as HTMLElement;
    expect(el.classList.contains('o-figure-previewable')).toBe(true);
    expect(el.classList.contains('o-figure-hoverable')).toBe(true);

    // 未设置 preview → 不注入
    const def = render(OFigure, { props: { src: SRC } });
    await flush();
    const defEl = def.container.querySelector('.o-figure') as HTMLElement;
    expect(defEl.classList.contains('o-figure-previewable')).toBe(false);
  });

  test('OFigure lazyPreview - 启用 canPreview，preview() 方法可打开预览', async () => {
    // lazyPreview=true → canPreview=true → preview() 方法可生效
    const onPreview = vi.fn();
    const figureRef = ref<any>(null);
    render({
      setup() {
        return () => h(OFigure, { ref: figureRef, src: SRC, lazyPreview: true, onPreview });
      },
    });
    await flush();
    figureRef.value.preview();
    await flush();
    expect(onPreview).toHaveBeenCalledWith(true);

    // 未设置 lazyPreview 和 preview → canPreview=false → preview() 不生效
    const onPreview2 = vi.fn();
    const figureRef2 = ref<any>(null);
    render({
      setup() {
        return () => h(OFigure, { ref: figureRef2, src: SRC, onPreview: onPreview2 });
      },
    });
    await flush();
    figureRef2.value.preview();
    await flush();
    expect(onPreview2).not.toHaveBeenCalled();
  });

  test('OFigure videoPoster - 注入 o-figure-video-poster + o-figure-hoverable 类 + 播放图标', async () => {
    const screen = render(OFigure, { props: { src: SRC, videoPoster: true } });
    await flush();
    const el = screen.container.querySelector('.o-figure') as HTMLElement;
    expect(el.classList.contains('o-figure-video-poster')).toBe(true);
    expect(el.classList.contains('o-figure-hoverable')).toBe(true);
    // 播放图标区域
    expect(el.querySelector('.o-figure-mask')).not.toBeNull();
    expect(el.querySelector('.o-figure-play-icon')).not.toBeNull();

    // 未设置 videoPoster → 不注入
    const def = render(OFigure, { props: { src: SRC } });
    await flush();
    const defEl = def.container.querySelector('.o-figure') as HTMLElement;
    expect(defEl.classList.contains('o-figure-video-poster')).toBe(false);
    expect(defEl.querySelector('.o-figure-mask')).toBeNull();
  });

  test('OFigure previewClose - 字符串 / 数组 / 默认值控制关闭方式', async () => {
    // 默认（不传 previewClose）→ desktop 下 ['mask', 'button']
    const defScreen = render(OFigure, { props: { src: SRC, preview: true } });
    await flush();
    await defScreen.container.querySelector('.o-figure')!.click();
    await flush();
    expect(document.body.querySelector('.o-layer-close')).not.toBeNull();
    document.body.querySelectorAll('.o-layer').forEach((el) => el.remove());

    // previewClose='none' → 关闭按钮不渲染
    const noneScreen = render(OFigure, { props: { src: SRC, preview: true, previewClose: 'none' } });
    await flush();
    await noneScreen.container.querySelector('.o-figure')!.click();
    await flush();
    expect(document.body.querySelector('.o-layer-close')).toBeNull();
    document.body.querySelectorAll('.o-layer').forEach((el) => el.remove());

    // previewClose=['mask', 'button'] → 关闭按钮渲染
    const arrScreen = render(OFigure, { props: { src: SRC, preview: true, previewClose: ['mask', 'button'] } });
    await flush();
    await arrScreen.container.querySelector('.o-figure')!.click();
    await flush();
    expect(document.body.querySelector('.o-layer-close')).not.toBeNull();
    document.body.querySelectorAll('.o-layer').forEach((el) => el.remove());
  });

  test('OFigure lazy - img loading 属性为 lazy / eager', async () => {
    // 使用 data URI 确保 img 元素存在（loading 属性需在 img 上检查）
    // lazy=true → loading="lazy"
    const lazyScreen = render(OFigure, { props: { src: VALID_SRC, lazy: true } });
    await flush();
    const lazyImg = lazyScreen.container.querySelector('img');
    expect(lazyImg?.getAttribute('loading')).toBe('lazy');

    // lazy=false → loading="eager"
    const eagerScreen = render(OFigure, { props: { src: VALID_SRC, lazy: false } });
    await flush();
    const eagerImg = eagerScreen.container.querySelector('img');
    expect(eagerImg?.getAttribute('loading')).toBe('eager');

    // 未设置 lazy → loading="eager"（undefined !== true → eager）
    const defScreen = render(OFigure, { props: { src: VALID_SRC } });
    await flush();
    const defImg = defScreen.container.querySelector('img');
    expect(defImg?.getAttribute('loading')).toBe('eager');
  });
});

// ============================================================================
// 动态契约：用户操作触发的状态变化（emit + 行为）
// ============================================================================
describe('动态契约（用户交互 → 组件响应）', () => {
  test('OFigure load - 非 background 模式图片加载成功时 emit load', async () => {
    const onLoad = vi.fn();
    render({ render: () => h(OFigure, { src: VALID_SRC, onLoad }) });
    await flush();
    // data URI 在 onMounted 中 img.complete 检查通过 → onImgLoaded 被调用
    expect(onLoad).toHaveBeenCalled();
  });

  test('OFigure load - background 模式图片加载成功时 emit load', async () => {
    const onLoad = vi.fn();
    render({ render: () => h(OFigure, { src: VALID_SRC, background: true, ratio: 16 / 9, onLoad }) });
    await flush();
    // requestImage Promise 解析后调用 onImgLoaded
    expect(onLoad).toHaveBeenCalled();
  });

  test('OFigure error - 图片加载失败时 emit error + 注入 is-error 类', async () => {
    const onError = vi.fn();
    const screen = render({ render: () => h(OFigure, { src: INVALID_SRC, ratio: 16 / 9, onError }) });
    // 等待浏览器加载失败触发 @error 事件
    await vi.waitFor(() => {
      expect(screen.container.querySelector('.o-figure')?.classList.contains('is-error')).toBe(true);
    });
    expect(onError).toHaveBeenCalled();
  });

  test('OFigure error - background 模式图片加载失败时 emit error', async () => {
    const onError = vi.fn();
    render({ render: () => h(OFigure, { src: INVALID_SRC, background: true, ratio: 16 / 9, onError }) });
    await vi.waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });
  });

  test('OFigure preview - 点击 preview=true 的 figure 后 emit preview(true)', async () => {
    const onPreview = vi.fn();
    const screen = render({ render: () => h(OFigure, { src: SRC, preview: true, onPreview }) });
    await flush();
    await screen.container.querySelector('.o-figure')!.click();
    await flush();
    expect(onPreview).toHaveBeenCalledWith(true);
  });

  test('OFigure click - 无 preview 属性时点击不 emit preview', async () => {
    const onPreview = vi.fn();
    const screen = render({ render: () => h(OFigure, { src: SRC, onPreview }) });
    await flush();
    await screen.container.querySelector('.o-figure')!.click();
    await flush();
    expect(onPreview).not.toHaveBeenCalled();
  });
});

// ============================================================================
// 视觉契约（双主题 light / dark）
// ============================================================================
describe('视觉契约（双主题 light / dark）', () => {
  for (const theme of THEMES) {
    test(`OFigure colorful @${theme} - 注入 is-colorful 类 + --figure-prest-color 非空`, async () => {
      const screen = render(OFigure, { props: { src: SRC, colorful: true } });
      await flush();
      const el = screen.container.querySelector('.o-figure') as HTMLElement;
      paintThemed(screen.container, theme, el);
      // colorful=true → is-colorful 类 + --figure-prest-color 内联样式
      expect(el.classList.contains('is-colorful')).toBe(true);
      expect(el.style.getPropertyValue('--figure-prest-color')).toBeTruthy();
    });
  }

  for (const theme of THEMES) {
    test(`OFigure error @${theme} - 注入 is-error 类 + 渲染错误提示区域`, async () => {
      const screen = render(OFigure, { props: { src: INVALID_SRC, ratio: 16 / 9 } });
      await vi.waitFor(() => {
        expect(screen.container.querySelector('.o-figure')?.classList.contains('is-error')).toBe(true);
      });
      const el = screen.container.querySelector('.o-figure') as HTMLElement;
      paintThemed(screen.container, theme, el);
      // is-error → background-color: var(--figure-error-bk) + 渲染 .o-figure-error-wrap
      expect(el.classList.contains('is-error')).toBe(true);
      expect(el.querySelector('.o-figure-error-wrap')).not.toBeNull();
    });
  }
});

// ============================================================================
// 暴露方法：defineExpose 暴露的 preview(visible) 方法
// ============================================================================
describe('暴露方法', () => {
  test('OFigure preview() - 调用后打开预览，emit preview(true)', async () => {
    const onPreview = vi.fn();
    const figureRef = ref<any>(null);
    render({
      setup() {
        return () => h(OFigure, { ref: figureRef, src: SRC, lazyPreview: true, onPreview });
      },
    });
    await flush();
    figureRef.value.preview();
    await flush();
    expect(onPreview).toHaveBeenCalledWith(true);
  });

  test('OFigure preview(false) - 调用后关闭预览，emit preview(false)', async () => {
    const onPreview = vi.fn();
    const figureRef = ref<any>(null);
    render({
      setup() {
        return () => h(OFigure, { ref: figureRef, src: SRC, lazyPreview: true, onPreview });
      },
    });
    await flush();
    // 先打开
    figureRef.value.preview();
    await flush();
    // 再关闭
    figureRef.value.preview(false);
    await flush();
    expect(onPreview).toHaveBeenCalledWith(false);
  });

  test('OFigure preview() - 无 preview/lazyPreview 时不生效', async () => {
    const onPreview = vi.fn();
    const figureRef = ref<any>(null);
    render({
      setup() {
        return () => h(OFigure, { ref: figureRef, src: SRC, onPreview });
      },
    });
    await flush();
    figureRef.value.preview();
    await flush();
    expect(onPreview).not.toHaveBeenCalled();
  });
});

// ============================================================================
// 插槽契约：具名插槽渲染替换
// ============================================================================
describe('插槽契约（具名插槽）', () => {
  test('OFigure slot=default - 渲染在 o-figure-main 内', async () => {
    const screen = render(OFigure, {
      props: { src: SRC },
      slots: { default: () => h('div', { class: 'custom-default' }, 'Default') },
    });
    await flush();
    const main = screen.container.querySelector('.o-figure-main');
    expect(main).not.toBeNull();
    expect(main?.querySelector('.custom-default')).not.toBeNull();
  });

  test('OFigure slot=error - 替换默认错误图标', async () => {
    const screen = render(OFigure, {
      props: { src: INVALID_SRC, ratio: 16 / 9 },
      slots: { error: () => h('div', { class: 'custom-error' }, 'Error!') },
    });
    await vi.waitFor(() => {
      expect(screen.container.querySelector('.o-figure')?.classList.contains('is-error')).toBe(true);
    });
    expect(screen.container.querySelector('.custom-error')).not.toBeNull();
  });

  test('OFigure slot=play-icon - 替换默认播放图标', async () => {
    const screen = render(OFigure, {
      props: { src: SRC, videoPoster: true },
      slots: { 'play-icon': () => h('div', { class: 'custom-play' }, 'Play') },
    });
    await flush();
    expect(screen.container.querySelector('.o-figure-mask .custom-play')).not.toBeNull();
  });

  test('OFigure slot=content - 替换 o-figure-content 区域', async () => {
    const screen = render(OFigure, {
      props: { src: SRC },
      slots: { content: () => h('div', { class: 'custom-content' }, 'Content') },
    });
    await flush();
    const content = screen.container.querySelector('.o-figure-content');
    expect(content).not.toBeNull();
    expect(content?.querySelector('.custom-content')).not.toBeNull();
    // 使用 content slot 时不渲染 .o-figure-title
    expect(content?.querySelector('.o-figure-title')).toBeNull();
  });

  test('OFigure slot=title - 渲染在 o-figure-title 内', async () => {
    const screen = render(OFigure, {
      props: { src: SRC },
      slots: { title: () => h('span', { class: 'custom-title' }, 'Title') },
    });
    await flush();
    const titleWrap = screen.container.querySelector('.o-figure-title');
    expect(titleWrap).not.toBeNull();
    expect(titleWrap?.querySelector('.custom-title')).not.toBeNull();
  });

  test('OFigure slot=preview - 替换预览图片内容', async () => {
    const screen = render(OFigure, {
      props: { src: SRC, preview: true },
      slots: { preview: () => h('div', { class: 'custom-preview' }, 'Preview') },
    });
    await flush();
    await screen.container.querySelector('.o-figure')!.click();
    await flush();
    expect(document.body.querySelector('.custom-preview')).not.toBeNull();
  });

  test('OFigure slot=preview-extra - 渲染预览区域额外内容', async () => {
    const screen = render(OFigure, {
      props: { src: SRC, preview: true },
      slots: { 'preview-extra': () => h('div', { class: 'custom-extra' }, 'Extra') },
    });
    await flush();
    await screen.container.querySelector('.o-figure')!.click();
    await flush();
    expect(document.body.querySelector('.custom-extra')).not.toBeNull();
  });
});
