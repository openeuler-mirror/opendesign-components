/**
 * OTour 单组件契约测试。
 *
 * 组织原则（5 维度）：
 *   1. 静态契约：按 types.ts prop 顺序（visible / current / position / showArrow / arrowClass /
 *      showClose / mask / spotlightRadius / wrapper / closeOnPressEscape / contentStyle）
 *   2. 动态契约：close 关闭 / ESC 关闭 / 步骤导航（next/prev/键盘）/ change 事件 / closeOnPressEscape 阻断
 *   3. 视觉契约：双主题下卡片背景色 wiring
 *   4. 子配置契约：OTourStep 字段（target / title / detail / img / 各 prop 覆盖 Tour）
 *   5. 插槽契约：title / detail / img / footer / indicators / skip / left
 *
 * OTour 内容通过 Teleport 挂载到 props.wrapper（默认 body），测试用自定义 wrapper 元素收口查询范围。
 * OPopup 内部 wrapper=null → 弹层不二次 teleport，保留在 .o-tour 内。
 */
import { test, expect, describe, vi, afterEach, beforeEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, ref } from 'vue';
import { OTour, OTourStep } from '../index';
import { flush } from '../../../__tests__/_helpers/dom';
import { setViewport } from '../../../__tests__/_helpers/viewport';
import { THEMES, paintThemed, isTransparent } from '../../../__tests__/_helpers/theme';

/** 清理 body 上残留的 Tour 挂载点、目标元素与 o-tour-open 类 */
const cleanup = () => {
  document.body.classList.remove('o-tour-open');
  document.body.querySelectorAll('.tour-test-wrapper, .tour-test-target, .o-tour').forEach((el) => el.remove());
};

/** 创建一个位于视口内的目标元素，供 OTourStep.target 定位 */
const makeTarget = (id: string) => {
  const el = document.createElement('div');
  el.className = `tour-test-target ${id}`;
  el.style.cssText = 'position:fixed; left:300px; top:300px; width:120px; height:80px;';
  document.body.appendChild(el);
  return el;
};

interface MountOptions {
  props?: Record<string, any>;
  slots?: Record<string, any>;
  /** 是否注入一个带 target 的步骤（默认 true） */
  withTargetStep?: boolean;
}

/**
 * 挂载 OTour：创建自定义 wrapper 元素收口 Teleport 内容，可选注入带 target 的步骤。
 * @returns wrapper 元素 + vitest screen
 */
const mountTour = (options: MountOptions = {}) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'tour-test-wrapper';
  document.body.appendChild(wrapper);

  const target = options.withTargetStep === false ? null : makeTarget('t1');
  const slots = {
    default: () =>
      h(OTourStep, {
        target: target ?? undefined,
        title: '步骤标题',
        detail: '步骤详情',
        nextButtonProps: { children: 'Next' },
        prevButtonProps: { children: 'Prev' },
      }),
    ...options.slots,
  };

  const screen = render(OTour, {
    props: { visible: true, wrapper, ...options.props },
    slots,
  });
  return { wrapper, target, screen };
};

describe('静态契约（按 types.ts 属性）', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanup);

  test('OTour visible=false - 不渲染 .o-tour 根元素', async () => {
    const screen = render(OTour, { props: { visible: false } });
    await flush();
    expect(document.querySelector('.o-tour')).toBeNull();
    // screen.container 本身也无 Tour 内容（Teleport 未触发）
    expect(screen.container.querySelector('.o-tour')).toBeNull();
  });

  test('OTour visible=true - 渲染 .o-tour 根元素到 wrapper', async () => {
    const { wrapper } = mountTour({ withTargetStep: true });
    await flush();
    const tour = wrapper.querySelector('.o-tour');
    expect(tour).not.toBeNull();
  });

  test('OTour current - 未传时默认从第 0 步开始（指示器 1/2）', async () => {
    const { wrapper } = mountTour({
      props: {},
      slots: {
        default: () => [
          h(OTourStep, { title: 'A', nextButtonProps: { children: 'Next' } }),
          h(OTourStep, { title: 'B', nextButtonProps: { children: 'Next' } }),
        ],
      },
      withTargetStep: false,
    });
    await flush();
    const indicators = wrapper.querySelector('.o-tour-indicators');
    expect(indicators?.textContent?.replace(/\s+/g, '')).toBe('1/2');
  });

  test('OTour current - 受控模式下渲染指定步骤', async () => {
    const { wrapper } = mountTour({
      props: { current: 1 },
      slots: {
        default: () => [h(OTourStep, { title: 'A' }), h(OTourStep, { title: 'B' })],
      },
      withTargetStep: false,
    });
    await flush();
    const title = wrapper.querySelector('.o-tour-title');
    expect(title?.textContent).toBe('B');
  });

  test('OTour position - 各枚举值被接受且不抛错', async () => {
    for (const p of ['top', 'tl', 'tr', 'bottom', 'bl', 'br', 'left', 'lt', 'lb', 'right', 'rt', 'rb'] as const) {
      const { wrapper } = mountTour({ props: { position: p } });
      await flush();
      expect(wrapper.querySelector('.o-tour')).not.toBeNull();
    }
  });

  test('OTour position=bottom（默认）- 注入 o-popup-pos-bottom 类', async () => {
    const { wrapper } = mountTour({ props: {} });
    await flush();
    const popup = wrapper.querySelector('.o-popup');
    expect(popup?.classList.contains('o-popup-pos-bottom')).toBe(true);
  });

  test('OTour showArrow=true（默认）- 有 target 时渲染箭头元素', async () => {
    const { wrapper } = mountTour({});
    await flush();
    expect(wrapper.querySelector('.o-popup-anchor')).not.toBeNull();
  });

  test('OTour showArrow=false - 不渲染箭头元素', async () => {
    const { wrapper } = mountTour({ props: { showArrow: false } });
    await flush();
    expect(wrapper.querySelector('.o-popup-anchor')).toBeNull();
  });

  test('OTour arrowClass - 追加到箭头元素 class', async () => {
    const { wrapper } = mountTour({ props: { arrowClass: 'custom-arrow' } });
    await flush();
    const arrow = wrapper.querySelector('.o-popover-anchor');
    expect(arrow?.classList.contains('custom-arrow')).toBe(true);
  });

  test('OTour showClose=true（默认）- 渲染关闭按钮', async () => {
    const { wrapper } = mountTour({ withTargetStep: false, slots: { default: () => h(OTourStep, { title: 'A' }) } });
    await flush();
    expect(wrapper.querySelector('.o-tour-close')).not.toBeNull();
  });

  test('OTour showClose=false - 不渲染关闭按钮', async () => {
    const { wrapper } = mountTour({ props: { showClose: false } });
    await flush();
    expect(wrapper.querySelector('.o-tour-close')).toBeNull();
  });

  test('OTour mask=true（默认）- 渲染遮罩镂空 SVG', async () => {
    const { wrapper } = mountTour({});
    await flush();
    expect(wrapper.querySelector('.o-tour-mask')).not.toBeNull();
    expect(wrapper.querySelector('.o-tour-mask-hollow')).not.toBeNull();
  });

  test('OTour o-tour-open - visible 由 false 切到 true 时加 o-tour-open，关闭时移除', async () => {
    const target = makeTarget('t-open');
    const screen = render(OTour, {
      props: { visible: false, 'onUpdate:visible': (v: boolean) => screen.rerender({ visible: v }) },
      slots: { default: () => h(OTourStep, { target, title: 'A' }) },
    });
    await flush();
    // 初始 visible=false，无 o-tour-open
    expect(document.body.classList.contains('o-tour-open')).toBe(false);
    await screen.rerender({ visible: true });
    await flush();
    // 切到 true 后加 o-tour-open 锁滚动
    expect(document.body.classList.contains('o-tour-open')).toBe(true);
  });

  test('OTour mask=false - 注入 o-tour-not-mask 类且不渲染遮罩', async () => {
    const { wrapper } = mountTour({ props: { mask: false } });
    await flush();
    const tour = wrapper.querySelector('.o-tour');
    expect(tour?.classList.contains('o-tour-not-mask')).toBe(true);
    expect(wrapper.querySelector('.o-tour-mask')).toBeNull();
    // 无遮罩不加 o-tour-open
    expect(document.body.classList.contains('o-tour-open')).toBe(false);
  });

  test('OTour spotlightRadius - 支持 8px 与 pill', async () => {
    // 8px：解析为像素圆角，路径包含对应的圆弧命令
    const { wrapper: w8 } = mountTour({ props: { spotlightRadius: '8px' } });
    await flush();
    const path8 = w8.querySelector('.o-tour-mask-hollow');
    expect(path8).not.toBeNull();
    expect(path8?.getAttribute('d') || '').toContain('a8,8 0 0 1');

    // pill：解析为胶囊形，圆角为镂空短边一半（目标 120x80 + 间隙 12*2 => 144x104 => 52）
    const { wrapper: wPill } = mountTour({ props: { spotlightRadius: 'pill' } });
    await flush();
    const pathPill = wPill.querySelector('.o-tour-mask-hollow');
    expect(pathPill).not.toBeNull();
    expect(pathPill?.getAttribute('d') || '').toContain('a52,52 0 0 1');
  });

  test('OTour 居中 - 滚动后居中卡片在视口垂直居中，不受滚动影响', async () => {
    // 撑高文档使其可滚动，并向下滚动一段距离
    const spacer = document.createElement('div');
    spacer.style.height = '2000px';
    document.body.appendChild(spacer);
    window.scrollTo(0, 500);
    try {
      const { wrapper } = mountTour({
        withTargetStep: false,
        slots: { default: () => h(OTourStep, { title: '居中步骤' }) },
      });
      await flush();
      const popup = wrapper.querySelector('.o-popup') as HTMLElement;
      expect(popup).not.toBeNull();
      const rect = popup.getBoundingClientRect();
      const vh = window.innerHeight;
      const cardCenter = rect.top + rect.height / 2;
      // 居中模式下卡片中心应贴近视口中线（容差 10px），不受页面滚动影响
      expect(Math.abs(cardCenter - vh / 2)).toBeLessThan(10);
    } finally {
      window.scrollTo(0, 0);
      spacer.remove();
    }
  });

  test('OTour 单步 - 默认不渲染步骤指示器（1/1 无意义）', async () => {
    const { wrapper } = mountTour({
      withTargetStep: false,
      slots: { default: () => h(OTourStep, { title: '单步' }) },
    });
    await flush();
    expect(wrapper.querySelector('.o-tour-indicators')).toBeNull();
  });

  test('OTour wrapper - 自定义元素作为挂载容器', async () => {
    const custom = document.createElement('div');
    custom.className = 'tour-test-wrapper custom-wrapper';
    document.body.appendChild(custom);
    const target = makeTarget('t1');
    render(OTour, {
      props: { visible: true, wrapper: custom },
      slots: { default: () => h(OTourStep, { target, title: 'A' }) },
    });
    await flush();
    expect(custom.querySelector('.o-tour')).not.toBeNull();
  });

  test('OTour contentStyle - 应用到 .o-tour-content 内联样式', async () => {
    const { wrapper } = mountTour({ props: { contentStyle: { '--custom': '42px' } } });
    await flush();
    const content = wrapper.querySelector('.o-tour-content') as HTMLElement;
    expect(content.style.getPropertyValue('--custom')).toBe('42px');
  });

  test('OTour 无 target 步骤 - 注入 o-tour-center 居中类', async () => {
    const { wrapper } = mountTour({
      withTargetStep: false,
      slots: { default: () => h(OTourStep, { title: '居中' }) },
    });
    await flush();
    expect(wrapper.querySelector('.o-tour')?.classList.contains('o-tour-center')).toBe(true);
  });
});

describe('动态契约（用户交互 → 组件响应）', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanup);

  test('OTour close - 点击关闭按钮 emit update:visible(false) + close', async () => {
    const onUpdateVisible = vi.fn();
    const onClose = vi.fn();
    const { wrapper } = mountTour({
      props: { 'onUpdate:visible': onUpdateVisible, onClose },
    });
    await flush();
    const closeEl = wrapper.querySelector('.o-tour-close') as HTMLElement;
    await closeEl.click();
    expect(onUpdateVisible).toHaveBeenCalledWith(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('OTour ESC - 按下 Escape emit update:visible(false) + close', async () => {
    const onUpdateVisible = vi.fn();
    const onClose = vi.fn();
    mountTour({ props: { 'onUpdate:visible': onUpdateVisible, onClose } });
    await flush();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onUpdateVisible).toHaveBeenCalledWith(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('OTour closeOnPressEscape=false - ESC 不触发关闭', async () => {
    const onUpdateVisible = vi.fn();
    const onClose = vi.fn();
    mountTour({ props: { closeOnPressEscape: false, 'onUpdate:visible': onUpdateVisible, onClose } });
    await flush();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onUpdateVisible).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  test('OTour next - 点击下一步推进 current 并 emit update:current + change', async () => {
    const onUpdateCurrent = vi.fn();
    const onChange = vi.fn();
    const { wrapper } = mountTour({
      props: { 'onUpdate:current': onUpdateCurrent, onChange },
      slots: {
        default: () => [
          h(OTourStep, { title: 'A', nextButtonProps: { children: 'Next' } }),
          h(OTourStep, { title: 'B', nextButtonProps: { children: 'Next' } }),
        ],
      },
      withTargetStep: false,
    });
    await flush();
    const nextBtn = wrapper.querySelector('.o-tour-buttons .o-btn') as HTMLElement;
    expect(nextBtn).not.toBeNull();
    await nextBtn.click();
    await flush();
    expect(onUpdateCurrent).toHaveBeenCalledWith(1);
    expect(onChange).toHaveBeenCalledWith(1);
  });

  test('OTour next - 最后一步点击下一步 emit finish + update:visible(false)', async () => {
    const onFinish = vi.fn();
    const onUpdateVisible = vi.fn();
    const { wrapper } = mountTour({
      props: { current: 1, onFinish, 'onUpdate:visible': onUpdateVisible },
      slots: {
        default: () => [
          h(OTourStep, { title: 'A', nextButtonProps: { children: 'Next' } }),
          h(OTourStep, { title: 'B', nextButtonProps: { children: 'Finish' } }),
        ],
      },
      withTargetStep: false,
    });
    await flush();
    const nextBtn = wrapper.querySelector('.o-tour-buttons .o-btn:last-child') as HTMLElement;
    await nextBtn.click();
    await flush();
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(onUpdateVisible).toHaveBeenCalledWith(false);
  });

  test('OTour 键盘 ArrowRight - 等效于下一步', async () => {
    const onUpdateCurrent = vi.fn();
    const { wrapper } = mountTour({
      props: { 'onUpdate:current': onUpdateCurrent },
      slots: {
        default: () => [h(OTourStep, { title: 'A' }), h(OTourStep, { title: 'B' })],
      },
      withTargetStep: false,
    });
    await flush();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    await flush();
    expect(onUpdateCurrent).toHaveBeenCalledWith(1);
    // 指示器更新为 2/2
    expect(wrapper.querySelector('.o-tour-indicators')?.textContent?.replace(/\s+/g, '')).toBe('2/2');
  });

  test('OTour 键盘 ArrowLeft - 在第 1 步回退到第 0 步', async () => {
    const onUpdateCurrent = vi.fn();
    const { wrapper } = mountTour({
      props: { current: 1, 'onUpdate:current': onUpdateCurrent },
      slots: {
        default: () => [h(OTourStep, { title: 'A' }), h(OTourStep, { title: 'B' })],
      },
      withTargetStep: false,
    });
    await flush();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    await flush();
    expect(onUpdateCurrent).toHaveBeenCalledWith(0);
  });

  test('OTour close - 关闭后 visible=false 时移除 o-tour-open', async () => {
    const target = makeTarget('t-close');
    const screen = render(OTour, {
      props: { visible: false, 'onUpdate:visible': (v: boolean) => screen.rerender({ visible: v }) },
      slots: { default: () => h(OTourStep, { target, title: 'A' }) },
    });
    await flush();
    await screen.rerender({ visible: true });
    await flush();
    expect(document.body.classList.contains('o-tour-open')).toBe(true);
    const closeEl = document.querySelector('.o-tour-close') as HTMLElement;
    await closeEl.click();
    await flush();
    expect(document.body.classList.contains('o-tour-open')).toBe(false);
  });
});

describe('视觉契约（双主题 light / dark）', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanup);

  for (const theme of THEMES) {
    test(`OTour 卡片背景色 @${theme} - 解析为非透明色`, async () => {
      const { wrapper } = mountTour({ withTargetStep: false, slots: { default: () => h(OTourStep, { title: 'A' }) } });
      await flush();
      const content = wrapper.querySelector('.o-tour-content') as HTMLElement;
      paintThemed(wrapper, theme, content);
      const bg = getComputedStyle(content).backgroundColor;
      expect(isTransparent(bg)).toBe(false);
    });
  }

  test('OTour 卡片背景色 - light / dark 下解析值不同', async () => {
    const w1 = document.createElement('div');
    w1.className = 'tour-test-wrapper';
    document.body.appendChild(w1);
    render(OTour, {
      props: { visible: true, wrapper: w1 },
      slots: { default: () => h(OTourStep, { title: 'A' }) },
    });
    await flush();
    const c1 = w1.querySelector('.o-tour-content') as HTMLElement;
    paintThemed(w1, 'e.light', c1);
    const bg1 = getComputedStyle(c1).backgroundColor;

    const w2 = document.createElement('div');
    w2.className = 'tour-test-wrapper';
    document.body.appendChild(w2);
    render(OTour, {
      props: { visible: true, wrapper: w2 },
      slots: { default: () => h(OTourStep, { title: 'A' }) },
    });
    await flush();
    const c2 = w2.querySelector('.o-tour-content') as HTMLElement;
    paintThemed(w2, 'e.dark', c2);
    const bg2 = getComputedStyle(c2).backgroundColor;

    expect(bg1).not.toBe(bg2);
  });
});

describe('子配置契约（按 OTourStep 字段）', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanup);

  test('OTourStep target - 字符串选择器定位目标', async () => {
    const target = makeTarget('by-selector');
    target.id = 'tour-target-selector';
    const { wrapper } = mountTour({
      props: {},
      slots: { default: () => h(OTourStep, { target: '#tour-target-selector', title: 'A' }) },
      withTargetStep: false,
    });
    await flush();
    // 有 target 时不走 center 模式
    expect(wrapper.querySelector('.o-tour')?.classList.contains('o-tour-center')).toBe(false);
    expect(wrapper.querySelector('.o-popup-anchor')).not.toBeNull();
  });

  test('OTourStep target - 函数返回 HTMLElement 定位', async () => {
    const target = makeTarget('by-fn');
    // 稳定函数引用：避免每次渲染生成新函数引用触发 watch(props)→currentStep 循环
    const targetFn = () => target;
    const { wrapper } = mountTour({
      slots: { default: () => h(OTourStep, { target: targetFn, title: 'A' }) },
      withTargetStep: false,
    });
    await flush();
    expect(wrapper.querySelector('.o-tour')?.classList.contains('o-tour-center')).toBe(false);
  });

  test('OTourStep title - 渲染标题文本', async () => {
    const { wrapper } = mountTour({ withTargetStep: false, slots: { default: () => h(OTourStep, { title: '标题文本' }) } });
    await flush();
    expect(wrapper.querySelector('.o-tour-title')?.textContent).toBe('标题文本');
  });

  test('OTourStep detail - 渲染详情文本', async () => {
    const { wrapper } = mountTour({ withTargetStep: false, slots: { default: () => h(OTourStep, { detail: '详情文本' }) } });
    await flush();
    expect(wrapper.querySelector('.o-tour-detail')?.textContent).toBe('详情文本');
  });

  test('OTourStep img - 渲染 .o-tour-img 图片', async () => {
    const { wrapper } = mountTour({
      withTargetStep: false,
      slots: { default: () => h(OTourStep, { title: 'A', img: 'https://example.com/x.png' }) },
    });
    await flush();
    const img = wrapper.querySelector('.o-tour-img') as HTMLImageElement;
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toBe('https://example.com/x.png');
  });

  test('OTourStep.showArrow - 覆盖 Tour 的 showArrow=false', async () => {
    const target = makeTarget('override-arrow');
    const { wrapper } = mountTour({
      props: { showArrow: true },
      slots: { default: () => h(OTourStep, { target, showArrow: false, title: 'A' }) },
      withTargetStep: false,
    });
    await flush();
    expect(wrapper.querySelector('.o-popup-anchor')).toBeNull();
  });

  test('OTourStep.showClose - 覆盖 Tour 的 showClose=false', async () => {
    const { wrapper } = mountTour({
      props: { showClose: false },
      slots: { default: () => h(OTourStep, { showClose: true, title: 'A' }) },
      withTargetStep: false,
    });
    await flush();
    expect(wrapper.querySelector('.o-tour-close')).not.toBeNull();
  });

  test('OTourStep.mask - 覆盖 Tour 的 mask=false', async () => {
    const { wrapper } = mountTour({
      props: { mask: false },
      slots: { default: () => h(OTourStep, { mask: true, title: 'A' }) },
      withTargetStep: false,
    });
    await flush();
    // step.mask=true 覆盖后应渲染遮罩
    expect(wrapper.querySelector('.o-tour-mask')).not.toBeNull();
  });

  test('OTourStep.contentStyle - 覆盖 Tour 的 contentStyle', async () => {
    // 稳定对象引用：避免每次渲染生成新对象触发 watch(props)→currentStyle 循环
    const tourStyleObj = { '--custom': 'tour' };
    const stepStyleObj = { '--custom': 'step' };
    const { wrapper } = mountTour({
      props: { contentStyle: tourStyleObj },
      slots: { default: () => h(OTourStep, { contentStyle: stepStyleObj, title: 'A' }) },
      withTargetStep: false,
    });
    await flush();
    const content = wrapper.querySelector('.o-tour-content') as HTMLElement;
    expect(content.style.getPropertyValue('--custom')).toBe('step');
  });

  test('OTourStep.prevButtonProps.children - 渲染自定义上一步文案', async () => {
    const { wrapper } = mountTour({
      props: { current: 1 },
      slots: {
        default: () => [
          h(OTourStep, { title: 'A', prevButtonProps: { children: '上一步' } }),
          h(OTourStep, { title: 'B', prevButtonProps: { children: '上一步' } }),
        ],
      },
      withTargetStep: false,
    });
    await flush();
    const prevBtn = wrapper.querySelector('.o-tour-buttons .o-btn') as HTMLElement;
    expect(prevBtn?.textContent).toBe('上一步');
  });
});

describe('插槽契约（具名插槽）', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanup);

  test('OTourStep slot=title - 替换默认标题', async () => {
    const { wrapper } = mountTour({
      withTargetStep: false,
      slots: {
        default: () => h(OTourStep, { title: '占位标题' }, { title: () => h('span', { class: 'custom-title' }, '自定义标题') }),
      },
    });
    await flush();
    const title = wrapper.querySelector('.o-tour-title .custom-title');
    expect(title?.textContent).toBe('自定义标题');
  });

  test('OTourStep slot=detail - 替换默认详情', async () => {
    const { wrapper } = mountTour({
      withTargetStep: false,
      slots: {
        default: () => h(OTourStep, { detail: '占位详情' }, { detail: () => h('span', { class: 'custom-detail' }, '自定义详情') }),
      },
    });
    await flush();
    expect(wrapper.querySelector('.o-tour-detail .custom-detail')?.textContent).toBe('自定义详情');
  });

  test('OTourStep slot=img - 替换默认图片', async () => {
    const { wrapper } = mountTour({
      withTargetStep: false,
      slots: { default: () => h(OTourStep, { title: 'A' }, { img: () => h('div', { class: 'custom-img' }, 'PIC') }) },
    });
    await flush();
    expect(wrapper.querySelector('.custom-img')?.textContent).toBe('PIC');
    // 未传 img prop 时默认 <img> 不渲染
    expect(wrapper.querySelector('.o-tour-img')).toBeNull();
  });

  test('OTourStep slot=indicators - 接收 current / total 作用域参数', async () => {
    const { wrapper } = mountTour({
      withTargetStep: false,
      slots: {
        default: () =>
          h(
            OTourStep,
            { title: 'A' },
            {
              indicators: ({ current, total }: { current: number; total: number }) => h('span', { class: 'custom-indicators' }, `${current}/${total}`),
            },
          ),
      },
    });
    await flush();
    expect(wrapper.querySelector('.custom-indicators')?.textContent).toBe('0/1');
  });

  test('OTourStep slot=footer - 接收 current/total/onPrev/onNext 作用域参数', async () => {
    const onUpdateCurrent = vi.fn();
    const { wrapper } = mountTour({
      props: { 'onUpdate:current': onUpdateCurrent },
      withTargetStep: false,
      slots: {
        default: () => [
          h(
            OTourStep,
            { title: 'A' },
            {
              footer: ({ onNext }: { onNext: () => void }) => h('button', { class: 'custom-next', onClick: onNext }, 'go'),
            },
          ),
          h(OTourStep, { title: 'B' }),
        ],
      },
    });
    await flush();
    const btn = wrapper.querySelector('.custom-next') as HTMLElement;
    await btn.click();
    await flush();
    // 第 0 步点击 onNext → current 推进到 1，emit update:current
    expect(onUpdateCurrent).toHaveBeenCalledWith(1);
  });

  test('OTourStep slot=skip - 渲染跳过 slot 内容', async () => {
    const { wrapper } = mountTour({
      withTargetStep: false,
      slots: {
        default: () => h(OTourStep, { title: 'A' }, { skip: () => h('span', { class: 'custom-skip' }, '跳过') }),
      },
    });
    await flush();
    expect(wrapper.querySelector('.o-tour-skip .custom-skip')?.textContent).toBe('跳过');
  });

  test('OTourStep slot=left - 渲染左侧 slot 内容', async () => {
    const { wrapper } = mountTour({
      withTargetStep: false,
      slots: {
        default: () => h(OTourStep, { title: 'A' }, { left: () => h('div', { class: 'custom-left' }, 'LEFT') }),
      },
    });
    await flush();
    expect(wrapper.querySelector('.custom-left')?.textContent).toBe('LEFT');
  });
});

/**
 * 业务功能测试：导航流 / Step 级配置 / 边界场景 / 组合流程
 *
 * 覆盖跨 prop 交互与隐式行为：
 *   - 导航流：prev 按钮、onClick 调用时序、首末步边界、关闭后重置
 *   - Step 级配置：position 覆盖、mask 切换 → body class 同步
 *   - 边界场景：输入控件方向键排除、卸载清理
 *   - 组合流程：open → next → prev → close → reopen 全链路
 */
describe('业务功能（导航流 / Step 级配置 / 边界 / 组合）', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanup);

  // ── 导航流 ──

  test('OTour prev - 点击上一步回退 current 并 emit update:current', async () => {
    const onUpdateCurrent = vi.fn();
    const { wrapper } = mountTour({
      props: { current: 1, 'onUpdate:current': onUpdateCurrent },
      slots: {
        default: () => [
          h(OTourStep, { title: 'A', prevButtonProps: { children: 'Prev' } }),
          h(OTourStep, { title: 'B', prevButtonProps: { children: 'Prev' } }),
        ],
      },
      withTargetStep: false,
    });
    await flush();
    const prevBtn = wrapper.querySelector('.o-tour-buttons .o-btn') as HTMLElement;
    expect(prevBtn).not.toBeNull();
    await prevBtn.click();
    await flush();
    expect(onUpdateCurrent).toHaveBeenCalledWith(0);
  });

  test('OTour prevButtonProps.onClick - 在 current 减 1 后调用', async () => {
    const onClickPrev = vi.fn();
    const { wrapper } = mountTour({
      props: { current: 1 },
      slots: {
        default: () => [
          h(OTourStep, { title: 'A', prevButtonProps: { children: 'Prev', onClick: onClickPrev } }),
          h(OTourStep, { title: 'B', prevButtonProps: { children: 'Prev', onClick: onClickPrev } }),
        ],
      },
      withTargetStep: false,
    });
    await flush();
    const prevBtn = wrapper.querySelector('.o-tour-buttons .o-btn') as HTMLElement;
    await prevBtn.click();
    await flush();
    expect(onClickPrev).toHaveBeenCalledTimes(1);
    // onClick 在步骤切换后调用，此时指示器已变为 1/2（回到第 0 步）
    expect(wrapper.querySelector('.o-tour-indicators')?.textContent?.replace(/\s+/g, '')).toBe('1/2');
  });

  test('OTour nextButtonProps.onClick - 在 current 加 1 后调用', async () => {
    const onClickNext = vi.fn();
    const { wrapper } = mountTour({
      slots: {
        default: () => [
          h(OTourStep, { title: 'A', nextButtonProps: { children: 'Next', onClick: onClickNext } }),
          h(OTourStep, { title: 'B', nextButtonProps: { children: 'Next', onClick: onClickNext } }),
        ],
      },
      withTargetStep: false,
    });
    await flush();
    const nextBtn = wrapper.querySelector('.o-tour-buttons .o-btn:last-child') as HTMLElement;
    await nextBtn.click();
    await flush();
    expect(onClickNext).toHaveBeenCalledTimes(1);
    // onClick 在步骤切换后调用，此时指示器已变为 2/2
    expect(wrapper.querySelector('.o-tour-indicators')?.textContent?.replace(/\s+/g, '')).toBe('2/2');
  });

  test('OTour ArrowLeft - 第 0 步时不回退（边界）', async () => {
    const onUpdateCurrent = vi.fn();
    mountTour({
      props: { 'onUpdate:current': onUpdateCurrent },
      slots: { default: () => [h(OTourStep, { title: 'A' }), h(OTourStep, { title: 'B' })] },
      withTargetStep: false,
    });
    await flush();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    await flush();
    expect(onUpdateCurrent).not.toHaveBeenCalled();
  });

  test('OTour ArrowRight - 最后一步时触发 finish + 关闭（边界）', async () => {
    const onFinish = vi.fn();
    const onUpdateVisible = vi.fn();
    mountTour({
      props: { current: 1, onFinish, 'onUpdate:visible': onUpdateVisible },
      slots: { default: () => [h(OTourStep, { title: 'A' }), h(OTourStep, { title: 'B' })] },
      withTargetStep: false,
    });
    await flush();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    await flush();
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(onUpdateVisible).toHaveBeenCalledWith(false);
  });

  test('OTour 关闭后重置 - close 后 current 回 0，reopen 从第 0 步开始', async () => {
    const { wrapper, screen } = mountTour({
      props: {
        current: 1,
        'onUpdate:visible': (v: boolean) => screen.rerender({ visible: v }),
        'onUpdate:current': (v: number) => screen.rerender({ current: v }),
      },
      slots: { default: () => [h(OTourStep, { title: 'A' }), h(OTourStep, { title: 'B' })] },
      withTargetStep: false,
    });
    await flush();
    expect(wrapper.querySelector('.o-tour-title')?.textContent).toBe('B');
    // 关闭（watch 重置 current 为 0，emit update:current(0) → rerender current=0）
    screen.rerender({ visible: false });
    await flush();
    // 重开
    screen.rerender({ visible: true });
    await flush();
    expect(wrapper.querySelector('.o-tour-title')?.textContent).toBe('A');
  });

  // ── Step 级配置 ──

  test('OTourStep.position - 覆盖 Tour 的 position', async () => {
    const target = makeTarget('pos-override');
    const { wrapper } = mountTour({
      props: { position: 'bottom' },
      slots: { default: () => h(OTourStep, { target, position: 'top', title: 'A' }) },
      withTargetStep: false,
    });
    await flush();
    const popup = wrapper.querySelector('.o-popup');
    expect(popup?.classList.contains('o-popup-pos-top')).toBe(true);
    expect(popup?.classList.contains('o-popup-pos-bottom')).toBe(false);
  });

  test('OTourStep.nextButtonProps.children - 渲染自定义下一步文案', async () => {
    const { wrapper } = mountTour({
      slots: {
        default: () => [h(OTourStep, { title: 'A', nextButtonProps: { children: '前进' } })],
      },
      withTargetStep: false,
    });
    await flush();
    const nextBtn = wrapper.querySelector('.o-tour-buttons .o-btn:last-child') as HTMLElement;
    expect(nextBtn?.textContent).toBe('前进');
  });

  test('OTour step mask 切换 - mask=true→mask=false 时移除 o-tour-open', async () => {
    const { wrapper, screen } = mountTour({
      props: {
        visible: false,
        'onUpdate:current': (v: number) => screen.rerender({ current: v }),
        'onUpdate:visible': (v: boolean) => screen.rerender({ visible: v }),
      },
      slots: {
        default: () => [h(OTourStep, { title: 'A', mask: true }), h(OTourStep, { title: 'B', mask: false })],
      },
      withTargetStep: false,
    });
    await flush();
    // 开启 → 第 0 步 mask=true → o-tour-open 存在
    await screen.rerender({ visible: true });
    await flush();
    expect(document.body.classList.contains('o-tour-open')).toBe(true);
    // 点击下一步 → 切到第 1 步（mask=false）
    const nextBtn = wrapper.querySelector('.o-tour-buttons .o-btn:last-child') as HTMLElement;
    await nextBtn.click();
    await flush();
    // mask=false → o-tour-open 移除
    expect(document.body.classList.contains('o-tour-open')).toBe(false);
  });

  // ── 边界场景 ──

  test('OTour 键盘导航 - input 焦点内方向键不切换步骤', async () => {
    const onUpdateCurrent = vi.fn();
    const { wrapper } = mountTour({
      props: { 'onUpdate:current': onUpdateCurrent },
      slots: { default: () => [h(OTourStep, { title: 'A' }), h(OTourStep, { title: 'B' })] },
      withTargetStep: false,
    });
    await flush();
    // 在 Tour 内创建 input 并聚焦
    const input = document.createElement('input');
    wrapper.querySelector('.o-tour-content')?.appendChild(input);
    input.focus();
    // 事件从 input 冒泡到 window，e.target=input → 排除判断命中
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await flush();
    expect(onUpdateCurrent).not.toHaveBeenCalled();
  });

  test('OTour unmount - 移除 o-tour-open body class', async () => {
    const { screen } = mountTour({
      props: {
        visible: false,
        'onUpdate:visible': (v: boolean) => screen.rerender({ visible: v }),
      },
    });
    await flush();
    await screen.rerender({ visible: true });
    await flush();
    expect(document.body.classList.contains('o-tour-open')).toBe(true);
    screen.unmount();
    expect(document.body.classList.contains('o-tour-open')).toBe(false);
  });

  // ── 组合流程 ──

  test('OTour 完整导航流 - open → next → prev → close → reopen 从第 0 步开始', async () => {
    const { wrapper, screen } = mountTour({
      props: {
        'onUpdate:visible': (v: boolean) => screen.rerender({ visible: v }),
        'onUpdate:current': (v: number) => screen.rerender({ current: v }),
      },
      slots: {
        default: () => [
          h(OTourStep, { title: 'A', nextButtonProps: { children: 'Next' }, prevButtonProps: { children: 'Prev' } }),
          h(OTourStep, { title: 'B', nextButtonProps: { children: 'Next' }, prevButtonProps: { children: 'Prev' } }),
        ],
      },
      withTargetStep: false,
    });
    await flush();
    // 初始第 0 步（A）
    expect(wrapper.querySelector('.o-tour-title')?.textContent).toBe('A');
    // next → 第 1 步（B）
    const nextBtn = wrapper.querySelector('.o-tour-buttons .o-btn:last-child') as HTMLElement;
    await nextBtn.click();
    await flush();
    expect(wrapper.querySelector('.o-tour-title')?.textContent).toBe('B');
    // prev → 第 0 步（A）
    const prevBtn = wrapper.querySelector('.o-tour-buttons .o-btn') as HTMLElement;
    await prevBtn.click();
    await flush();
    expect(wrapper.querySelector('.o-tour-title')?.textContent).toBe('A');
    // close → reopen → 从第 0 步开始
    screen.rerender({ visible: false });
    await flush();
    screen.rerender({ visible: true });
    await flush();
    expect(wrapper.querySelector('.o-tour-title')?.textContent).toBe('A');
  });
});
