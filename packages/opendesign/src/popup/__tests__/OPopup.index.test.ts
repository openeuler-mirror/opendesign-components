/**
 * OPopup 单组件契约测试。
 *
 * OPopup 是 T5 浮层基座组件：触发元素原地渲染（#target 插槽 + OChildOnly），
 * 弹层内容通过 Teleport 挂载到 wrapper（默认 body），由 ClientOnly 包裹保证 SSR 安全。
 *
 * 组织原则（5 维度）：
 *   1. 静态契约：按 types.ts prop 顺序
 *   2. 动态契约：trigger 交互 / v-model / beforeShow、beforeHide、disabled 阻断 / 嵌套 ODialog
 *   3. 视觉契约：--popup-* token 链双主题 wiring
 *   4. 插槽契约：default / target / anchor
 *   5. 定位源契约：元素模式 / targetRect 数据模式 / 模式回退与 null 路径
 *
 * 查询约定：触发元素在组件容器内（screen.container 查询）；
 * 弹层内容 Teleport 到 document.body，且同一测试内多次渲染会留下多个弹层，
 * 统一取 document.body 中**最后一个**匹配元素（最新渲染的实例）。
 *
 * Transition 处理：VTU 默认将 <Transition> stub 为 transition-stub，导致 after-leave
 * 等过渡钩子不触发（unmountOnHide 卸载、v-show 延迟隐藏等行为失真），
 * 因此涉及显隐切换的渲染统一通过 global.stubs 关闭该 stub。
 */
import { test, expect, describe, beforeEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { userEvent } from 'vitest/browser';
import { h, defineComponent, ref, reactive, PropType } from 'vue';
import OPopup from '../OPopup.vue';
import ODialog from '../../dialog/ODialog.vue';
import { PopupPositionTypes, TargetRect } from '../types';
import { flush } from '../../../__tests__/_helpers/dom';
import { THEMES, paintThemed, isTransparent } from '../../../__tests__/_helpers/theme';

/** 关闭 Transition stub 的渲染选项（保留真实过渡钩子） */
const REAL_TRANSITION = { global: { stubs: { Transition: false } } } as const;

/** OPopup 渲染结果集合：screen + 事件记录 + 常用元素 getter */
interface PopupHarness {
  screen: ReturnType<typeof render>;
  /** 收集 [事件名, 值] 序列，如 ['update:visible', true] */
  events: Array<[string, boolean]>;
  getTarget: () => HTMLElement;
  getPopup: () => HTMLElement | null;
  getWrap: () => HTMLElement | null;
}

/**
 * 取 document.body 中最后一个匹配选择器的元素（同一测试内多次渲染时为最新实例）。
 * @param selector CSS 选择器
 */
function lastBodyEl<T extends HTMLElement>(selector: string): T | null {
  const els = document.body.querySelectorAll(selector);
  return els.length ? (els[els.length - 1] as T) : null;
}

/**
 * 渲染带事件收集的 OPopup 宿主组件。
 * @param props 传给 OPopup 的 props（beforeShow / beforeHide / trigger 等）
 * @param hostStyle 宿主容器行内样式（默认空；传 fixed 定位可构造贴近视口顶部的场景）
 */
function renderPopup(props: Record<string, unknown> = {}, hostStyle = ''): PopupHarness {
  const events: Array<[string, boolean]> = [];
  const Host = defineComponent({
    setup() {
      return () =>
        h('div', { class: 'popup-host', style: hostStyle }, [
          // 弹层与触发元素之外的空白区域，用于模拟外部点击
          h('div', { class: 'outside-area', style: 'width:40px;height:40px;' }),
          h(
            OPopup as any,
            {
              ...props,
              'onUpdate:visible': (v: boolean) => events.push(['update:visible', v]),
              onChange: (v: boolean) => events.push(['change', v]),
            },
            {
              target: () => h('button', { class: 'test-target', style: 'width:120px;' }, '触发元素'),
              default: () => h('div', { class: 'test-content', style: 'width:200px;height:120px;' }, '弹层内容'),
            },
          ),
        ]);
    },
  });
  const screen = render(Host, REAL_TRANSITION);
  return {
    screen,
    events,
    getTarget: () => screen.container.querySelector('.test-target') as HTMLElement,
    getPopup: () => lastBodyEl('.o-popup'),
    getWrap: () => lastBodyEl('.o-popup-wrap'),
  };
}

/** 判断弹层内容当前是否可见（存在且未被 v-show 隐藏） */
function isWrapShown(wrap: HTMLElement | null) {
  return !!wrap && getComputedStyle(wrap).display !== 'none';
}

/**
 * 等待隐藏动画结束：o-zoom-fade 离场动画（var(--o-duration-s)）+
 * checkVisibleState 兜底 debounce（200ms），500ms 足以稳定。
 */
const waitForHideAnim = () => new Promise((r) => setTimeout(r, 500));

beforeEach(() => {
  // 防御性清理：正常情况下 vitest-browser-vue 的自动 cleanup 已移除传送门内容
  document.body.querySelectorAll(':scope > .o-popup, :scope > .o-layer').forEach((el) => el.remove());
});

describe('静态契约（按 types.ts 属性）', () => {
  test('OPopup position - 各枚举值注入 o-popup-pos-{position} 类，默认 top', async () => {
    for (const p of PopupPositionTypes) {
      const hp = renderPopup({ position: p, unmountOnHide: false });
      await flush();
      expect(hp.getPopup()?.classList.contains(`o-popup-pos-${p}`)).toBe(true);
    }
    const def = renderPopup({ unmountOnHide: false });
    await flush();
    expect(def.getPopup()?.classList.contains('o-popup-pos-top')).toBe(true);
  });

  test('OPopup wrapper - 默认挂载到 body，不在组件容器内', async () => {
    const hp = renderPopup({ unmountOnHide: false });
    await flush();
    expect(hp.screen.container.querySelector('.o-popup')).toBeNull();
    expect(document.body.querySelector('.o-popup')).not.toBeNull();
  });

  test('OPopup wrapper - 传入元素时挂载到指定容器', async () => {
    const wrapperEl = document.createElement('div');
    document.body.appendChild(wrapperEl);
    const screen = render(OPopup, {
      props: { wrapper: wrapperEl, unmountOnHide: false },
      slots: {
        target: () => h('button', '触发元素'),
        default: () => h('div', '弹层内容'),
      },
    });
    await flush();
    expect(wrapperEl.querySelector('.o-popup')).not.toBeNull();
    expect(screen.container.querySelector('.o-popup')).toBeNull();
  });

  test('OPopup disabled - 弹层不渲染，触发元素仍渲染', async () => {
    const hp = renderPopup({ disabled: true });
    await flush();
    expect(hp.getTarget()).not.toBeNull();
    expect(document.body.querySelector('.o-popup')).toBeNull();
  });

  test('OPopup edgeOffset - 注入 --popup-edge-offset 内联变量，默认 0px', async () => {
    const hp = renderPopup({ edgeOffset: 12, unmountOnHide: false });
    await flush();
    expect(hp.getPopup()?.style.getPropertyValue('--popup-edge-offset')).toBe('12px');

    const def = renderPopup({ unmountOnHide: false });
    await flush();
    expect(def.getPopup()?.style.getPropertyValue('--popup-edge-offset')).toBe('0px');
  });

  test('OPopup anchor - 默认不渲染锚点，anchor=true 渲染 .o-popup-anchor 并应用 anchorClass', async () => {
    const def = renderPopup({ unmountOnHide: false });
    await flush();
    expect(def.getPopup()?.querySelector('.o-popup-anchor')).toBeNull();

    const hp = renderPopup({ anchor: true, anchorClass: 'test-anchor-class', unmountOnHide: false });
    await flush();
    const anchor = hp.getPopup()?.querySelector('.o-popup-anchor');
    expect(anchor).not.toBeNull();
    expect(anchor?.classList.contains('test-anchor-class')).toBe(true);
  });

  test('OPopup unmountOnHide - 默认 true 时隐藏期间弹层不挂载；false 时挂载但隐藏', async () => {
    const def = renderPopup();
    await flush();
    expect(document.body.querySelector('.o-popup')).toBeNull();

    const keep = renderPopup({ unmountOnHide: false });
    await flush();
    const popup = keep.getPopup();
    expect(popup).not.toBeNull();
    expect(isWrapShown(keep.getWrap())).toBe(false);
  });

  test('OPopup wrapClass / bodyClass - 应用到 .o-popup-wrap 与 .o-popup-body', async () => {
    const hp = renderPopup({ unmountOnHide: false, wrapClass: 'test-wrap-class', bodyClass: 'test-body-class' });
    await flush();
    expect(hp.getWrap()?.classList.contains('test-wrap-class')).toBe(true);
    expect(hp.getPopup()?.querySelector('.o-popup-body')?.classList.contains('test-body-class')).toBe(true);
  });

  test('OPopup adjustMinWidth / adjustWidth - 默认 min-width 取触发元素宽度；仅 adjustWidth 时 width 取触发元素宽度', async () => {
    // 两者默认均为 true，minWidth 优先生效，不设置 width
    const def = renderPopup({ unmountOnHide: false });
    await flush();
    const targetW = def.getTarget().offsetWidth;
    expect(def.getPopup()?.style.minWidth).toBe(`${targetW}px`);
    expect(def.getPopup()?.style.width).toBe('');

    const widthOnly = renderPopup({ unmountOnHide: false, adjustMinWidth: false, adjustWidth: true });
    await flush();
    const targetW2 = widthOnly.getTarget().offsetWidth;
    expect(widthOnly.getPopup()?.style.width).toBe(`${targetW2}px`);
    expect(widthOnly.getPopup()?.style.minWidth).toBe('');
  });

  test('OPopup target prop - 通过属性传入元素时同样绑定触发事件', async () => {
    const events: Array<[string, boolean]> = [];
    const Host = defineComponent({
      setup() {
        const btn = ref<HTMLElement | null>(null);
        return () =>
          h('div', [
            h('button', { ref: btn, class: 'prop-target' }, '属性触发元素'),
            h(
              OPopup as any,
              {
                target: btn.value,
                'onUpdate:visible': (v: boolean) => events.push(['update:visible', v]),
              },
              { default: () => h('div', '弹层内容') },
            ),
          ]);
      },
    });
    const screen = render(Host, REAL_TRANSITION);
    await flush();
    await userEvent.click(screen.container.querySelector('.prop-target') as HTMLElement);
    await flush();
    expect(events).toContainEqual(['update:visible', true]);
    expect(isWrapShown(lastBodyEl('.o-popup-wrap'))).toBe(true);
  });

  test('OPopup target prop - 挂载时即传入元素不抛 TDZ 错误且绑定触发事件', async () => {
    const events: Array<[string, boolean]> = [];
    // 预创建元素：使 target 在 OPopup setup 期间即为非空，
    // 区别于 ref 挂载后才生效的路径（文档站 OPopover 即此形态）
    const preset = document.createElement('button');
    preset.className = 'preset-target';
    preset.textContent = '预设触发元素';
    document.body.appendChild(preset);
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            OPopup as any,
            {
              target: preset,
              'onUpdate:visible': (v: boolean) => events.push(['update:visible', v]),
            },
            { default: () => h('div', '弹层内容') },
          );
      },
    });
    try {
      const screen = render(Host, REAL_TRANSITION);
      await flush();
      await userEvent.click(preset);
      await flush();
      expect(events).toContainEqual(['update:visible', true]);
      expect(isWrapShown(lastBodyEl('.o-popup-wrap'))).toBe(true);
    } finally {
      preset.remove();
    }
  });
});

describe('动态契约（用户交互 → 组件响应）', () => {
  test('OPopup trigger=click - 点击触发元素显示弹层并 emit update:visible / change(true)', async () => {
    const hp = renderPopup();
    await flush();
    await userEvent.click(hp.getTarget());
    await flush();
    expect(isWrapShown(hp.getWrap())).toBe(true);
    expect(hp.events).toContainEqual(['update:visible', true]);
    expect(hp.events).toContainEqual(['change', true]);
  });

  test('OPopup trigger=click - 再次点击触发元素切换隐藏弹层', async () => {
    const hp = renderPopup();
    await flush();
    await userEvent.click(hp.getTarget());
    await flush();
    await userEvent.click(hp.getTarget());
    await waitForHideAnim();
    expect(isWrapShown(hp.getWrap())).toBe(false);
  });

  test('OPopup trigger=click - 再次点击隐藏时 emit update:visible / change(false)', async () => {
    const hp = renderPopup();
    await flush();
    await userEvent.click(hp.getTarget());
    await flush();
    await userEvent.click(hp.getTarget());
    await flush();
    expect(hp.events).toContainEqual(['update:visible', false]);
    expect(hp.events).toContainEqual(['change', false]);
  });

  test('OPopup autoHide - 点击弹层与触发元素之外的区域时隐藏弹层', async () => {
    const hp = renderPopup();
    await flush();
    await userEvent.click(hp.getTarget());
    await flush();
    const outside = hp.screen.container.querySelector('.outside-area') as HTMLElement;
    await userEvent.click(outside);
    await waitForHideAnim();
    expect(isWrapShown(hp.getWrap())).toBe(false);
  });

  test('OPopup autoHide - 外部点击隐藏时 emit update:visible(false)', async () => {
    const hp = renderPopup();
    await flush();
    await userEvent.click(hp.getTarget());
    await flush();
    const outside = hp.screen.container.querySelector('.outside-area') as HTMLElement;
    await userEvent.click(outside);
    await flush();
    expect(hp.events).toContainEqual(['update:visible', false]);
  });

  test('OPopup autoHide - 点击弹层内容本身时不隐藏', async () => {
    const hp = renderPopup();
    await flush();
    await userEvent.click(hp.getTarget());
    await waitForHideAnim(); // 等待入场动画结束，避免点击落在动画元素上
    const content = document.body.querySelector('.o-popup .test-content') as HTMLElement;
    await userEvent.click(content);
    await flush();
    expect(hp.events).not.toContainEqual(['update:visible', false]);
    expect(isWrapShown(hp.getWrap())).toBe(true);
  });

  test('OPopup disabled - 点击触发元素不显示弹层、不 emit 事件', async () => {
    const hp = renderPopup({ disabled: true });
    await flush();
    await userEvent.click(hp.getTarget());
    await flush();
    expect(hp.events).toHaveLength(0);
    expect(document.body.querySelector('.o-popup-wrap')).toBeNull();
  });

  test('OPopup beforeShow - 返回 false 时阻止显示', async () => {
    const hp = renderPopup({ beforeShow: () => false });
    await flush();
    await userEvent.click(hp.getTarget());
    await flush();
    expect(hp.events).toHaveLength(0);
    expect(document.body.querySelector('.o-popup-wrap')).toBeNull();
  });

  test('OPopup beforeHide - 返回 false 时阻止隐藏', async () => {
    const hp = renderPopup({ beforeShow: () => true, beforeHide: () => false });
    await flush();
    await userEvent.click(hp.getTarget());
    await flush();
    await userEvent.click(hp.getTarget());
    await waitForHideAnim();
    expect(hp.events).not.toContainEqual(['update:visible', false]);
    expect(isWrapShown(hp.getWrap())).toBe(true);
  });

  test('OPopup trigger=none - 点击触发元素不切换显隐，仅受 visible 受控', async () => {
    const hp = renderPopup({ trigger: 'none', visible: true });
    await flush();
    expect(isWrapShown(hp.getWrap())).toBe(true);
    await userEvent.click(hp.getTarget());
    await flush();
    expect(hp.events).toHaveLength(0);
    expect(isWrapShown(hp.getWrap())).toBe(true);
  });

  test('OPopup trigger=hover - 移入触发元素显示、移出隐藏', async () => {
    const hp = renderPopup({ trigger: 'hover', hoverDelay: 0 });
    await flush();
    await userEvent.hover(hp.getTarget());
    await flush();
    expect(isWrapShown(hp.getWrap())).toBe(true);
    expect(hp.events).toContainEqual(['update:visible', true]);

    hp.getTarget().dispatchEvent(new MouseEvent('mouseleave', { cancelable: true }));
    await waitForHideAnim();
    expect(isWrapShown(hp.getWrap())).toBe(false);
  });

  test('OPopup trigger=focus - 聚焦显示、失焦隐藏', async () => {
    const hp = renderPopup({ trigger: 'focus' });
    await flush();
    hp.getTarget().focus();
    await flush();
    expect(isWrapShown(hp.getWrap())).toBe(true);
    expect(hp.events).toContainEqual(['update:visible', true]);

    hp.getTarget().blur();
    await waitForHideAnim();
    expect(isWrapShown(hp.getWrap())).toBe(false);
  });

  test('OPopup trigger=contextmenu - 右键显示并阻止默认菜单，点击外部隐藏', async () => {
    const hp = renderPopup({ trigger: 'contextmenu' });
    await flush();
    const evt = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    hp.getTarget().dispatchEvent(evt);
    await flush();
    expect(evt.defaultPrevented).toBe(true);
    expect(isWrapShown(hp.getWrap())).toBe(true);

    const outside = hp.screen.container.querySelector('.outside-area') as HTMLElement;
    await userEvent.click(outside);
    await waitForHideAnim();
    expect(isWrapShown(hp.getWrap())).toBe(false);
  });

  test('OPopup visible - 受控切换显隐', async () => {
    const screen = render(OPopup, {
      props: { visible: false },
      slots: {
        target: () => h('button', '触发元素'),
        default: () => h('div', '弹层内容'),
      },
      ...REAL_TRANSITION,
    });
    await flush();
    expect(document.body.querySelector('.o-popup-wrap')).toBeNull();

    await screen.rerender({ visible: true });
    await flush();
    expect(isWrapShown(lastBodyEl('.o-popup-wrap'))).toBe(true);

    await screen.rerender({ visible: false });
    await waitForHideAnim();
    expect(isWrapShown(lastBodyEl('.o-popup-wrap'))).toBe(false);
  });

  test('OPopup 显示时 - z-index 注入 --popup-z-index 且高于基准层级', async () => {
    const hp = renderPopup();
    await flush();
    await userEvent.click(hp.getTarget());
    await flush();
    const popupEl = hp.getPopup() as HTMLElement;
    // createTopZIndex 从 100 起递增，弹层显示时取顶层值
    expect(popupEl.style.getPropertyValue('--popup-z-index')).not.toBe('');
    expect(parseInt(getComputedStyle(popupEl).zIndex, 10)).toBeGreaterThanOrEqual(100);
  });

  test('OPopup 多实例 - 后显示的弹层 z-index 高于先显示的弹层', async () => {
    const first = renderPopup({ trigger: 'none', visible: true });
    await flush();
    const second = renderPopup({ trigger: 'none', visible: true });
    await flush();

    const popups = document.body.querySelectorAll('.o-popup');
    expect(popups.length).toBe(2);
    const zFirst = parseInt(getComputedStyle(popups[0]).zIndex, 10);
    const zSecond = parseInt(getComputedStyle(popups[1]).zIndex, 10);
    expect(zSecond).toBeGreaterThan(zFirst);
  });

  test('OPopup adaptive - 触发元素贴近视口顶部时 position=top 自动翻转为 bottom', async () => {
    // 宿主固定在视口左上角，构造 target 上方无空间的场景
    const hp = renderPopup({ position: 'top' }, 'position:fixed;top:0;left:0;');
    await flush();
    await userEvent.click(hp.getTarget());
    await flush();
    expect(hp.getPopup()?.classList.contains('o-popup-pos-bottom')).toBe(true);
  });

  test('OPopup trigger=hover + #target 插槽 - 弹层定位跟随触发元素而非停留视口左上角（#199 回归）', async () => {
    // 宿主远离原点固定：若定位丢失（回归路径），弹层将停留在视口 (0,0)，与触发元素坐标明显可分辨
    const hp = renderPopup({ trigger: 'hover', hoverDelay: 0, position: 'bl' }, 'position:fixed;top:200px;left:150px;');
    await flush();
    await userEvent.hover(hp.getTarget());
    await flush();
    const tRect = hp.getTarget().getBoundingClientRect();
    const pRect = (hp.getPopup() as HTMLElement).getBoundingClientRect();
    // position=bl（左下）且 offset=0：弹层顶边贴合触发元素底边、左边缘对齐
    expect(Math.abs(pRect.top - tRect.bottom)).toBeLessThan(1);
    expect(Math.abs(pRect.left - tRect.left)).toBeLessThan(1);
  });

  test('OPopup unmountOnHide 显示 - 弹层立即定位，无未定位帧闪现', async () => {
    // 默认 unmountOnHide=true：显示后首个可观察时刻弹层已贴合交互元素，
    // 而非先出现在 (0,0) 再跳位
    const hp = renderPopup({ trigger: 'click', position: 'bl' }, 'position:fixed;top:200px;left:150px;');
    await flush();
    await userEvent.click(hp.getTarget());
    await flush();
    const tRect = hp.getTarget().getBoundingClientRect();
    const pRect = (hp.getPopup() as HTMLElement).getBoundingClientRect();
    expect(Math.abs(pRect.top - tRect.bottom)).toBeLessThan(1);
    expect(Math.abs(pRect.left - tRect.left)).toBeLessThan(1);
    expect(pRect.top).toBeGreaterThan(100); // 未停留在视口原点
  });

  test('OPopup unmountOnHide=true - 隐藏过渡结束后弹层从 DOM 卸载', async () => {
    const hp = renderPopup();
    await flush();
    await userEvent.click(hp.getTarget());
    await flush();
    expect(document.body.querySelector('.o-popup')).not.toBeNull();

    await userEvent.click(hp.getTarget());
    // 等待离场动画结束（after-leave 触发卸载）+ checkVisibleState 兜底 debounce（200ms）
    await new Promise((r) => setTimeout(r, 700));
    expect(document.body.querySelector('.o-popup')).toBeNull();
  });

  test('OPopup unmountOnHide=false - 隐藏后弹层保留在 DOM 中', async () => {
    const hp = renderPopup({ unmountOnHide: false });
    await flush();
    await userEvent.click(hp.getTarget());
    await flush();
    await userEvent.click(hp.getTarget());
    await waitForHideAnim();
    expect(document.body.querySelector('.o-popup')).not.toBeNull();
    expect(isWrapShown(hp.getWrap())).toBe(false);
  });
});

describe('视觉契约（双主题 light / dark）', () => {
  for (const theme of THEMES) {
    test(`OPopup wrap @${theme} - --popup-bg-color / --popup-shadow token 链解析为可见样式`, async () => {
      const hp = renderPopup({ unmountOnHide: false });
      await flush();
      const wrap = hp.getWrap() as HTMLElement;
      // 消费方（如 OPopover）通过 --popup-* 定制弹层外观，此处验证 style.scss 的 token 链路
      wrap.style.setProperty('--popup-bg-color', 'var(--o-color-fill2)');
      wrap.style.setProperty('--popup-shadow', 'var(--o-shadow-1)');
      paintThemed(hp.screen.container, theme, wrap);
      expect(isTransparent(getComputedStyle(wrap).backgroundColor)).toBe(false);
      expect(getComputedStyle(wrap).boxShadow).not.toBe('none');
    });
  }

  test('OPopup wrap - light / dark 下 --popup-bg-color 解析值不同', async () => {
    const light = renderPopup({ unmountOnHide: false });
    await flush();
    // 先取 light 实例的弹层引用，再渲染 dark 实例（getter 取 body 中最后一个弹层）
    const wrapLight = light.getWrap() as HTMLElement;
    const dark = renderPopup({ unmountOnHide: false });
    await flush();
    const wrapDark = dark.getWrap() as HTMLElement;
    wrapLight.style.setProperty('--popup-bg-color', 'var(--o-color-fill2)');
    wrapDark.style.setProperty('--popup-bg-color', 'var(--o-color-fill2)');
    paintThemed(light.screen.container, 'e.light', wrapLight);
    paintThemed(dark.screen.container, 'e.dark', wrapDark);
    expect(getComputedStyle(wrapLight).backgroundColor).not.toBe(getComputedStyle(wrapDark).backgroundColor);
  });
});

describe('定位源契约（元素模式 / targetRect 数据模式 / 模式回退）', () => {
  /** 定位场景默认 props：trigger=none + 受控 visible，屏蔽交互干扰只验定位 */
  const POSITIONING_PROPS: Record<string, unknown> = { trigger: 'none', visible: true, unmountOnHide: false, position: 'bl' };

  /** 定位场景默认内容：固定尺寸避免自适应干扰 */
  const positioningSlots = {
    default: () => h('div', { class: 'test-content', style: 'width:200px;height:120px;' }, '弹层内容'),
  };

  /**
   * 渲染纯定位场景（trigger=none + 受控 visible）。
   * @param props OPopup props（targetRect / position 等）
   * @param withTargetSlot 是否通过 #target 插槽提供交互元素（模式回退场景需要）
   */
  function renderPositioning(props: Record<string, unknown> = {}, withTargetSlot = false) {
    const screen = render(OPopup, {
      props: { ...POSITIONING_PROPS, ...props },
      slots: {
        ...positioningSlots,
        ...(withTargetSlot ? { target: () => h('button', { class: 'test-target', style: 'width:120px;height:40px;' }, '触发元素') } : {}),
      },
      ...REAL_TRANSITION,
    });
    return {
      screen,
      getPopup: () => lastBodyEl('.o-popup'),
      getTarget: () => screen.container.querySelector('.test-target') as HTMLElement | null,
    };
  }

  test('OPopup targetRect 数据模式 - 传入纯数据快照时弹层定位到矩形（无需 DOM target）', async () => {
    const hp = renderPositioning({ targetRect: { left: 300, top: 200, width: 100, height: 40 } });
    await flush();
    const pRect = (hp.getPopup() as HTMLElement).getBoundingClientRect();
    // position=bl、offset=0：弹层顶边贴合矩形底边、左边缘对齐
    expect(Math.abs(pRect.top - 240)).toBeLessThan(1);
    expect(Math.abs(pRect.left - 300)).toBeLessThan(1);
  });

  test('OPopup targetRect 数据模式 - 整体替换快照对象时弹层重新定位', async () => {
    const hp = renderPositioning({ targetRect: { left: 300, top: 200, width: 100, height: 40 } });
    await flush();
    await hp.screen.rerender({ targetRect: { left: 500, top: 100, width: 100, height: 40 } });
    await flush();
    const pRect = (hp.getPopup() as HTMLElement).getBoundingClientRect();
    expect(Math.abs(pRect.top - 140)).toBeLessThan(1);
    expect(Math.abs(pRect.left - 500)).toBeLessThan(1);
  });

  test('OPopup targetRect 数据模式 - 响应式对象原地修改坐标时弹层跟随更新', async () => {
    const rect = reactive({ left: 300, top: 200, width: 100, height: 40 });
    const Host = defineComponent({
      setup() {
        return () => h(OPopup as any, { ...POSITIONING_PROPS, targetRect: rect }, positioningSlots);
      },
    });
    render(Host, REAL_TRANSITION);
    await flush();
    // 原地修改坐标（deep 监听契约）
    rect.left = 600;
    rect.top = 80;
    await flush();
    const pRect = (lastBodyEl('.o-popup') as HTMLElement).getBoundingClientRect();
    expect(Math.abs(pRect.top - 120)).toBeLessThan(1);
    expect(Math.abs(pRect.left - 600)).toBeLessThan(1);
  });

  test('OPopup targetRect 数据模式 - 普通对象原地修改不触发重算（快照契约的文档化行为）', async () => {
    const rect = { left: 300, top: 200, width: 100, height: 40 };
    const Host = defineComponent({
      setup() {
        return () => h(OPopup as any, { ...POSITIONING_PROPS, targetRect: rect }, positioningSlots);
      },
    });
    render(Host, REAL_TRANSITION);
    await flush();
    const before = (lastBodyEl('.o-popup') as HTMLElement).getBoundingClientRect();
    // 普通对象无响应性，原地修改不触发重算，弹层停留在原定位
    rect.left = 600;
    rect.top = 80;
    await flush();
    const after = (lastBodyEl('.o-popup') as HTMLElement).getBoundingClientRect();
    expect(after.left).toBe(before.left);
    expect(after.top).toBe(before.top);
  });

  test('OPopup targetRect 清空且存在交互元素 - 定位回退到元素实时矩形', async () => {
    const hp = renderPositioning({ targetRect: { left: 400, top: 100, width: 100, height: 40 } }, true);
    await flush();
    const before = (hp.getPopup() as HTMLElement).getBoundingClientRect();
    expect(Math.abs(before.left - 400)).toBeLessThan(1);

    await hp.screen.rerender({ targetRect: null });
    await flush();
    const pRect = (hp.getPopup() as HTMLElement).getBoundingClientRect();
    const tRect = (hp.getTarget() as HTMLElement).getBoundingClientRect();
    // 回退元素模式：position=bl 贴合交互元素
    expect(Math.abs(pRect.top - tRect.bottom)).toBeLessThan(1);
    expect(Math.abs(pRect.left - tRect.left)).toBeLessThan(1);
  });

  test('OPopup targetRect 清空且无交互元素 - 清除定位样式回归父级布局', async () => {
    const hp = renderPositioning({ targetRect: { left: 400, top: 100, width: 100, height: 40 } });
    await flush();
    expect((hp.getPopup() as HTMLElement).style.transform).not.toBe('');

    await hp.screen.rerender({ targetRect: null });
    await flush();
    expect((hp.getPopup() as HTMLElement).style.transform).toBe('');
  });

  test('OPopup targetRect 数据模式 - 弹层 min-width 镜像矩形宽度（adjustMinWidth 默认开启）', async () => {
    const hp = renderPositioning({ targetRect: { left: 300, top: 200, width: 260, height: 40 } });
    await flush();
    expect((hp.getPopup() as HTMLElement).style.minWidth).toBe('260px');
  });

  test('OPopup targetRect 数据模式 - 仅 adjustWidth 时 width 镜像矩形宽度', async () => {
    const hp = renderPositioning({ targetRect: { left: 300, top: 200, width: 260, height: 40 }, adjustMinWidth: false, adjustWidth: true });
    await flush();
    expect((hp.getPopup() as HTMLElement).style.width).toBe('260px');
  });

  test('OPopup targetRect 清空且 target 为 prop 传入 - 定位回退到元素实时矩形', async () => {
    // target prop 与 targetRect 同传（warning 场景）：清空 targetRect 后应回退 target 元素定位，
    // 而非因绑定被跳过走向居中
    const Host = defineComponent({
      props: { targetRect: { type: Object as PropType<TargetRect | null>, default: null } },
      setup(hostProps) {
        const btn = ref<HTMLElement | null>(null);
        return () =>
          h('div', [
            h('button', { ref: btn, class: 'prop-target', style: 'position:fixed;left:250px;top:300px;width:120px;height:40px;' }, '属性触发元素'),
            h(OPopup as any, { ...POSITIONING_PROPS, target: btn.value, targetRect: hostProps.targetRect }, positioningSlots),
          ]);
      },
    });
    const screen = render(Host, { props: { targetRect: { left: 500, top: 100, width: 100, height: 40 } as TargetRect | null }, ...REAL_TRANSITION });
    await flush();
    const popup = lastBodyEl('.o-popup') as HTMLElement;
    expect(Math.abs(popup.getBoundingClientRect().left - 500)).toBeLessThan(1); // 先锁定 rect 模式定位

    await screen.rerender({ targetRect: null });
    await flush();
    const tRect = (screen.container.querySelector('.prop-target') as HTMLElement).getBoundingClientRect();
    const pRect = popup.getBoundingClientRect();
    expect(Math.abs(pRect.top - tRect.bottom)).toBeLessThan(1);
    expect(Math.abs(pRect.left - tRect.left)).toBeLessThan(1);
  });

  test('OPopup 元素模式 - 滚动容器后弹层在两个 rAF 内跟随交互元素（不滞后超过一帧）', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h('div', { class: 'scroll-host', style: 'height:150px;overflow:auto;' }, [
            h('div', { style: 'height:600px;padding-top:50px;' }, [
              h(
                OPopup as any,
                { ...POSITIONING_PROPS },
                {
                  target: () => h('button', { class: 'test-target', style: 'width:120px;height:40px;' }, '触发元素'),
                  ...positioningSlots,
                },
              ),
            ]),
          ]);
      },
    });
    const screen = render(Host, REAL_TRANSITION);
    await flush();
    const scroller = screen.container.querySelector('.scroll-host') as HTMLElement;
    const before = (lastBodyEl('.o-popup') as HTMLElement).getBoundingClientRect();

    scroller.scrollTop = 40; // 交互元素视口位置上移 40px（保持可见，不触发边缘钳制）
    // 滚动事件异步派发（帧内晚于 rAF 注册），允许一帧延迟：两个 rAF 内必须完成重算
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(null))));

    const after = (lastBodyEl('.o-popup') as HTMLElement).getBoundingClientRect();
    expect(Math.abs(before.top - after.top - 40)).toBeLessThan(1);
  });
});

describe('插槽契约（具名插槽）', () => {
  test('OPopup slot=default - 内容渲染在 .o-popup-body 内', async () => {
    const hp = renderPopup({ unmountOnHide: false });
    await flush();
    const body = hp.getPopup()?.querySelector('.o-popup-body');
    expect(body?.querySelector('.test-content')?.textContent).toBe('弹层内容');
  });

  test('OPopup slot=target - 原地渲染且仅渲染首个子元素', async () => {
    const screen = render(OPopup, {
      slots: {
        target: () => [h('button', { class: 'first-target' }, '第一个'), h('button', { class: 'second-target' }, '第二个')],
        default: () => h('div', '弹层内容'),
      },
    });
    await flush();
    expect(screen.container.querySelector('.first-target')).not.toBeNull();
    expect(screen.container.querySelector('.second-target')).toBeNull();
  });

  test('OPopup slot=anchor - 内容渲染在 .o-popup-anchor 内', async () => {
    const screen = render(OPopup, {
      props: { anchor: true, unmountOnHide: false },
      slots: {
        target: () => h('button', '触发元素'),
        default: () => h('div', '弹层内容'),
        anchor: () => h('span', { class: 'custom-anchor' }, '锚点'),
      },
    });
    await flush();
    const anchor = document.body.querySelector('.o-popup-anchor');
    expect(anchor?.querySelector('.custom-anchor')?.textContent).toBe('锚点');
  });
});

describe('嵌套契约（ODialog 中嵌套）', () => {
  test('OPopup 嵌套 ODialog - 对话框内触发弹层，弹层渲染在对话框之上', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            ODialog as any,
            { visible: true },
            {
              default: () =>
                h('div', [
                  h('p', '对话框内容'),
                  h(
                    OPopup as any,
                    { position: 'bottom', trigger: 'click' },
                    {
                      target: () => h('button', { class: 'nested-target' }, '对话框内触发'),
                      default: () => h('div', { class: 'nested-content' }, '嵌套弹层内容'),
                    },
                  ),
                ]),
              header: () => '嵌套弹层对话框',
            },
          );
      },
    });
    render(Host, REAL_TRANSITION);
    await flush();

    const target = document.body.querySelector('.nested-target') as HTMLElement;
    expect(target).not.toBeNull();
    await userEvent.click(target);
    await flush();

    const wrap = document.body.querySelector('.o-popup-wrap') as HTMLElement;
    expect(isWrapShown(wrap)).toBe(true);
    // 对话框先获取顶层 z-index，弹层后显示应更高，保证渲染在对话框蒙层之上
    const layerEl = document.body.querySelector('.o-layer') as HTMLElement;
    const popupEl = document.body.querySelector('.o-popup') as HTMLElement;
    expect(parseInt(getComputedStyle(popupEl).zIndex, 10)).toBeGreaterThan(parseInt(getComputedStyle(layerEl).zIndex, 10));
  });
});
