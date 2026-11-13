/**
 * OScrollbar ARIA 无障碍契约测试。
 *
 * 覆盖：滚动条轨道 role=scrollbar 与方向/位置值镜像（读屏与读
 * 无障碍树的 AI 代理可感知滚动位置与方向）。
 *
 * 说明：rail 渲染依赖父容器溢出检测（hasX/hasY），集成路径已在
 * index 测试覆盖；此处直接渲染 ScrollbarRail 断言 ARIA 契约。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import ScrollbarRail from '../ScrollbarRail.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { addLocale, useLocale } from '../../locale';
import enUS from '../../locale/lang/en-us';
import OScrollbar from '../OScrollbar.vue';
import OScroller from '../OScroller.vue';

const renderRail = (direction: 'x' | 'y', offsetRate = 0.25, thumbRate = 0.4) =>
  render(ScrollbarRail, { props: { direction, offsetRate, thumbRate, notStepJump: true } });

describe('ARIA — OScrollbar', () => {
  test('轨道设 role="scrollbar"，纵向镜像 aria-orientation="vertical"', async () => {
    const screen = renderRail('y');
    await flush();
    const rail = screen.container.querySelector('.o-scrollbar-rail[role="scrollbar"]') as HTMLElement;
    expect(rail).toBeTruthy();
    expect(rail.getAttribute('aria-orientation')).toBe('vertical');
  });

  test('横向轨道镜像 aria-orientation="horizontal"', async () => {
    const screen = renderRail('x');
    await flush();
    const rail = screen.container.querySelector('.o-scrollbar-rail[role="scrollbar"]') as HTMLElement;
    expect(rail.getAttribute('aria-orientation')).toBe('horizontal');
  });

  test('镜像 aria-valuenow（offsetRate 百分比）与值域 0~100', async () => {
    const screen = renderRail('y', 0.25, 0.4);
    await flush();
    const rail = screen.container.querySelector('.o-scrollbar-rail[role="scrollbar"]') as HTMLElement;
    expect(rail.getAttribute('aria-valuemin')).toBe('0');
    expect(rail.getAttribute('aria-valuemax')).toBe('100');
    expect(rail.getAttribute('aria-valuenow')).toBe('25');
  });

  test('轨道带可访问名称（读屏可区分纵横轨道）', async () => {
    const y = renderRail('y');
    await flush();
    expect((y.container.querySelector('.o-scrollbar-rail') as HTMLElement).getAttribute('aria-label')).toBe('垂直滚动条');
    const x = renderRail('x');
    await flush();
    expect((x.container.querySelector('.o-scrollbar-rail') as HTMLElement).getAttribute('aria-label')).toBe('水平滚动条');
  });
});

describe('ARIA — OScrollbar i18n 与控件关联', () => {
  test('轨道可访问名称走 i18n 词条，en-US 语言包下读屏读到英文', async () => {
    // 消费方注册并切换 en-US（与文档站 addLocale + useLocale 同构）
    addLocale(enUS);
    useLocale('en-US');
    try {
      const y = renderRail('y');
      await flush();
      expect((y.container.querySelector('.o-scrollbar-rail') as HTMLElement).getAttribute('aria-label')).toBe('Vertical scrollbar');
      const x = renderRail('x');
      await flush();
      expect((x.container.querySelector('.o-scrollbar-rail') as HTMLElement).getAttribute('aria-label')).toBe('Horizontal scrollbar');
    } finally {
      useLocale('zh-CN');
    }
  });

  test('轨道 aria-controls 指向被控滚动内容容器（读屏可定位滚动区域）', async () => {
    // 经 OScroller 真实消费路径：OScrollbar 的 target 即 .o-scroller-container
    const screen = render({
      render: () =>
        h(
          OScroller,
          { showType: 'always', style: 'height:200px;' },
          {
            default: () => h('div', { style: 'height:600px;' }, 'Content'),
          },
        ),
    });
    await flush();
    const rail = screen.container.querySelector('.o-scrollbar-rail');
    // rail 未渲染时，失败消息携带容器结构辅助定位
    expect(rail ?? 'HTML:' + screen.container.innerHTML.slice(0, 700)).toBeTruthy();
    const controlsId = (rail as HTMLElement).getAttribute('aria-controls');
    expect(controlsId).toBeTruthy();
    // 被控元素即发生滚动的容器本身
    const scrollContainer = screen.container.querySelector('.o-scroller-container') as HTMLElement;
    expect(scrollContainer.id).toBe(controlsId);
  });
});
