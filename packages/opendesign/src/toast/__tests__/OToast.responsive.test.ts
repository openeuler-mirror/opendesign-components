/**
 * OToast 响应式契约测试。
 *
 * 视口按 media.scss 实际声明的断点选取：
 *   - @<=pad_v：.o-toast-list 最大宽度被覆写为视口 75%
 *   - @phone  ：.o-toast-list 最大宽度覆写为 100%，级联对比
 *
 * 布局契约：toast 容器应随文字宽度撑开（不换行），仅当文字真实超过
 * 断点定义的最大宽度时才换行收缩。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, ref } from 'vue';
import OToastList from '../OToastList.vue';
import { setViewport } from '../../../__tests__/_helpers/viewport';
import { flush } from '../../../__tests__/_helpers/dom';

/**
 * 在指定断点渲染 OToastList 并新增一条消息，返回渲染出的 .o-toast 元素。
 * @param bp 断点名称
 * @param content 消息内容
 * @returns 渲染出的 .o-toast 根元素
 */
async function renderToastAt(bp: 'pad_v' | 'phone', content: string) {
  await setViewport(bp);
  const listRef = ref<any>(null);
  const screen = render({
    setup() {
      return () => h(OToastList as any, { ref: listRef, position: 'top' });
    },
  });
  listRef.value?.add({ content });
  await flush();
  return screen.container.querySelector('.o-toast') as HTMLElement;
}

/**
 * 断言 toast 当前渲染为单行（高度 ≈ line-height + 上下 padding）。
 * @param toast .o-toast 根元素
 */
function expectSingleLine(toast: HTMLElement) {
  expect(toast).toBeTruthy();
  const cs = getComputedStyle(toast);
  const singleLineHeight = parseFloat(cs.lineHeight) + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
  expect(toast.clientHeight).toBeCloseTo(singleLineHeight, 0);
}

/**
 * 计算 toast 单行高度（line-height + 上下 padding），用于多行判断。
 * @param toast .o-toast 根元素
 * @returns 单行高度 px
 */
function getSingleLineHeight(toast: HTMLElement) {
  const cs = getComputedStyle(toast);
  return parseFloat(cs.lineHeight) + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
}

describe('响应式契约（断点矩阵）', () => {
  test('OToast @pad_v - 中等长度消息单行显示，容器随文字撑开', async () => {
    const toast = await renderToastAt('pad_v', '这是一条中等长度的即时反馈提示消息，用于验证容器是否随文字撑开');
    expectSingleLine(toast);
  });

  test('OToast @pad_v - 超长消息受视口 75% 上限约束，正常换行而非无限撑开', async () => {
    const toast = await renderToastAt(
      'pad_v',
      '这是一条非常非常长的即时反馈消息，用于验证pad_v断点下消息宽度上限仍然生效，当文字宽度超过视口百分之七十五时应当自动换行而不是无限撑开导致溢出屏幕',
    );
    expect(toast.clientHeight).toBeGreaterThan(getSingleLineHeight(toast) + 1);
  });

  test('OToast @phone - 短消息单行显示，容器随文字撑开', async () => {
    const toast = await renderToastAt('phone', '这是一条短消息');
    expectSingleLine(toast);
  });
});
