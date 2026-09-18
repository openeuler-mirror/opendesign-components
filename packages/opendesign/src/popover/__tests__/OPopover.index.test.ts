/**
 * OPopover 定位行为锁定测试（#200 重构安全网）。
 *
 * OPopover 是 OPopup 的薄封装（默认 trigger=hover / anchor=true / offset=8），
 * 也是 #199 定位回归的实际爆发组件。本文件锁定「弹层相对触发元素定位」这一
 * 消费方契约，作为 OPopup 定位模型重构（定位源 / 交互元素正交分离）期间
 * 「不应变化」的判据；静态契约全量覆盖（按 types.ts 属性）待后续单独补齐。
 *
 * 查询约定：触发元素在组件容器内（screen.container 查询）；
 * 弹层内容 Teleport 到 document.body，取其中最后一个匹配元素（最新实例）。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { userEvent } from 'vitest/browser';
import { h, defineComponent } from 'vue';
import OPopover from '../OPopover.vue';
import { flush } from '../../../__tests__/_helpers/dom';

/** 关闭 Transition stub 的渲染选项（保留真实过渡钩子，v-show 切换行为不失真） */
const REAL_TRANSITION = { global: { stubs: { Transition: false } } } as const;

/**
 * 取 document.body 中最后一个匹配选择器的元素（同一测试内多次渲染时为最新实例）。
 * @param selector CSS 选择器
 */
function lastBodyEl<T extends HTMLElement>(selector: string): T | null {
  const els = document.body.querySelectorAll(selector);
  return els.length ? (els[els.length - 1] as T) : null;
}

/**
 * 渲染带宿主定位的 OPopover。
 * @param props 传给 OPopover 的 props
 * @param hostStyle 宿主容器行内样式（fixed 定位可控制触发元素在视口中的位置，
 *                  为 position=top 预留上方空间、避免 adaptive 翻转干扰断言）
 */
function renderPopover(props: Record<string, unknown> = {}, hostStyle = 'position:fixed;top:300px;left:150px;') {
  const Host = defineComponent({
    setup() {
      return () =>
        h('div', { class: 'popover-host', style: hostStyle }, [
          h(
            OPopover as any,
            { ...props },
            {
              target: () => h('button', { class: 'test-target', style: 'width:120px;' }, '触发元素'),
              default: () => h('div', { class: 'test-content', style: 'width:200px;height:100px;' }, '弹层内容'),
            },
          ),
        ]);
    },
  });
  const screen = render(Host, REAL_TRANSITION);
  return {
    screen,
    getTarget: () => screen.container.querySelector('.test-target') as HTMLElement,
    getPopover: () => lastBodyEl('.o-popup.o-popover'),
  };
}

describe('动态契约（用户交互 → 组件响应）', () => {
  test('OPopover trigger=hover - 移入触发元素显示弹层、移出隐藏', async () => {
    const hp = renderPopover({ hoverDelay: 0 });
    await flush();
    await userEvent.hover(hp.getTarget());
    await flush();
    const wrap = lastBodyEl('.o-popup-wrap');
    expect(wrap).not.toBeNull();
    expect(getComputedStyle(wrap as HTMLElement).display).not.toBe('none');

    hp.getTarget().dispatchEvent(new MouseEvent('mouseleave', { cancelable: true }));
    await new Promise((r) => setTimeout(r, 700));
    // 默认 unmountOnHide=true：离场过渡结束后弹层从 DOM 卸载
    expect(lastBodyEl('.o-popup-wrap')).toBeNull();
  });

  test('OPopover position=bl - 弹层顶边贴合触发元素底边偏移 offset（默认 8px）', async () => {
    const hp = renderPopover({ position: 'bl', hoverDelay: 0 });
    await flush();
    await userEvent.hover(hp.getTarget());
    await flush();
    const tRect = hp.getTarget().getBoundingClientRect();
    const pRect = (hp.getPopover() as HTMLElement).getBoundingClientRect();
    expect(Math.abs(pRect.top - (tRect.bottom + 8))).toBeLessThan(1);
    expect(Math.abs(pRect.left - tRect.left)).toBeLessThan(1);
  });

  test('OPopover 默认 position=top - 弹层底边贴合触发元素顶边偏移 offset', async () => {
    // 宿主固定 top:300px 保证触发元素上方有足够空间，不触发 adaptive 翻转
    const hp = renderPopover({ hoverDelay: 0 });
    await flush();
    await userEvent.hover(hp.getTarget());
    await flush();
    const tRect = hp.getTarget().getBoundingClientRect();
    const pRect = (hp.getPopover() as HTMLElement).getBoundingClientRect();
    // position=top 为水平居中定位，断言垂直边贴合与水平中心对齐
    expect(Math.abs(pRect.bottom - (tRect.top - 8))).toBeLessThan(1);
    expect(Math.abs(pRect.left + pRect.width / 2 - (tRect.left + tRect.width / 2))).toBeLessThan(1);
  });

  test('OPopover adjustMinWidth - 弹层 min-width 跟随触发元素宽度（默认开启）', async () => {
    const hp = renderPopover({ position: 'bl', hoverDelay: 0 });
    await flush();
    await userEvent.hover(hp.getTarget());
    await flush();
    const popover = hp.getPopover() as HTMLElement;
    expect(popover.style.minWidth).toBe(`${hp.getTarget().offsetWidth}px`);
  });
});
