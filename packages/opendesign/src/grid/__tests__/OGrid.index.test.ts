/**
 * ORow / OCol 栅格布局组件测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import ORow from '../ORow.vue';
import OCol from '../OCol.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('ORow 静态契约', () => {
  test('ORow 根元素 class 包含 o-row', async () => {
    const screen = render(ORow, { slots: { default: () => 'Content' } });
    await flush();
    expect(screen.container.querySelector('.o-row')).not.toBeNull();
  });

  test('ORow wrap - 默认 wrap', async () => {
    const screen = render(ORow, { slots: { default: () => 'C' } });
    await flush();
    const el = screen.container.querySelector('.o-row') as HTMLElement;
    expect(el.style.flexWrap).toBe('wrap');
  });

  test('ORow gap - 设置 gap 样式', async () => {
    const screen = render(ORow, { props: { gap: '20px' }, slots: { default: () => 'C' } });
    await flush();
    const el = screen.container.querySelector('.o-row') as HTMLElement;
    expect(el.style.gap).toBe('20px');
  });

  test('ORow align - 设置 align-items', async () => {
    const screen = render(ORow, { props: { align: 'center' }, slots: { default: () => 'C' } });
    await flush();
    const el = screen.container.querySelector('.o-row') as HTMLElement;
    expect(el.style.alignItems).toBe('center');
  });

  test('ORow justify - 设置 justify-content', async () => {
    const screen = render(ORow, { props: { justify: 'space-between' }, slots: { default: () => 'C' } });
    await flush();
    const el = screen.container.querySelector('.o-row') as HTMLElement;
    expect(el.style.justifyContent).toBe('space-between');
  });

  test('ORow direction - 设置 flex-direction', async () => {
    const screen = render(ORow, { props: { direction: 'column' }, slots: { default: () => 'C' } });
    await flush();
    const el = screen.container.querySelector('.o-row') as HTMLElement;
    expect(el.style.flexDirection).toBe('column');
  });

  test('ORow inline - 设置 display=inline-flex', async () => {
    const screen = render(ORow, { props: { inline: true }, slots: { default: () => 'C' } });
    await flush();
    const el = screen.container.querySelector('.o-row') as HTMLElement;
    expect(el.style.display).toBe('inline-flex');
  });

  test('ORow slot=default - 渲染子元素', async () => {
    const screen = render(ORow, {
      slots: { default: () => [h(OCol, {}, () => 'Col1'), h(OCol, {}, () => 'Col2')] },
    });
    await flush();
    const cols = screen.container.querySelectorAll('.o-col');
    expect(cols.length).toBe(2);
  });
});

describe('OCol 静态契约', () => {
  test('OCol 根元素 class 包含 o-col', async () => {
    const screen = render(OCol, { slots: { default: () => 'C' } });
    await flush();
    expect(screen.container.querySelector('.o-col')).not.toBeNull();
  });

  test('OCol flex - 默认 1 0 auto', async () => {
    const screen = render(OCol, { slots: { default: () => 'C' } });
    await flush();
    const el = screen.container.querySelector('.o-col') as HTMLElement;
    expect(el.style.flex).toBe('1 0 auto');
  });

  test('OCol flex - 自定义值', async () => {
    const screen = render(OCol, { props: { flex: '2 1 50%' }, slots: { default: () => 'C' } });
    await flush();
    const el = screen.container.querySelector('.o-col') as HTMLElement;
    expect(el.style.flex).toBe('2 1 50%');
  });

  test('OCol align - 设置 align-self', async () => {
    const screen = render(OCol, { props: { align: 'flex-start' }, slots: { default: () => 'C' } });
    await flush();
    const el = screen.container.querySelector('.o-col') as HTMLElement;
    expect(el.style.alignSelf).toBe('flex-start');
  });
});

describe('SSR 契约', () => {
  test('ORow SSR - renderToString 不抛出错误', async () => {
    await expect(renderSSR(ORow, {}, 'Content')).resolves.toEqual(expect.any(String));
  });

  test('ORow hydration - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(ORow, {}, 'Hi');
    expect(result.hasMismatch).toBe(false);
    if (result.root) result.root.remove();
  });

  test('OCol SSR - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OCol, {}, 'Col')).resolves.toEqual(expect.any(String));
  });
});
