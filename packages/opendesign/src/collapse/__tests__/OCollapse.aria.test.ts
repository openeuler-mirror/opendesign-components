/**
 * OCollapse ARIA 无障碍契约测试。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, ref } from 'vue';
import OCollapse from '../OCollapse.vue';
import OCollapseItem from '../OCollapseItem.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('ARIA — 折叠面板', () => {
  test('header 设 role="button" 并镜像 aria-expanded', async () => {
    const screen = render(OCollapse, {
      props: { modelValue: ['1'] },
      slots: { default: () => h(OCollapseItem, { value: '1', title: 'T' }) },
    });
    await flush();
    const header = screen.container.querySelector('.o-collapse-item-header') as HTMLElement;
    expect(header.getAttribute('role')).toBe('button');
    expect(header.getAttribute('aria-expanded')).toBe('true');
  });

  test('body 设 role="region"', async () => {
    const screen = render(OCollapse, {
      props: { modelValue: ['1'] },
      slots: { default: () => h(OCollapseItem, { value: '1', title: 'T' }) },
    });
    await flush();
    const body = screen.container.querySelector('.o-collapse-item-body') as HTMLElement;
    expect(body.getAttribute('role')).toBe('region');
  });

  test('收起时镜像 aria-expanded="false"，点击 header 展开后镜像翻转', async () => {
    // 通过 v-model 驱动展开集合，验证 aria-expanded 与展开集合同构镜像
    const expanded = ref<Array<string>>([]);
    const screen = render({
      setup() {
        return () =>
          h(OCollapse as any, {
            modelValue: expanded.value,
            'onUpdate:modelValue': (v: Array<string>) => {
              expanded.value = v;
            },
            default: () => h(OCollapseItem, { value: '1', title: 'T' }),
          });
      },
    });
    await flush();
    const header = screen.container.querySelector('.o-collapse-item-header') as HTMLElement;
    // 初始收起：镜像值为 false（而非缺失）
    expect(header.getAttribute('aria-expanded')).toBe('false');
    // 用户点击 header 展开
    header.click();
    await flush();
    expect(header.getAttribute('aria-expanded')).toBe('true');
    // v-model 展开集合同步包含该项
    expect(expanded.value).toEqual(['1']);
    // 再次点击收起，镜像回到 false
    header.click();
    await flush();
    expect(header.getAttribute('aria-expanded')).toBe('false');
  });
});

describe('ARIA — 折叠面板关联', () => {
  test('body 的 aria-labelledby 指向 header 的 DOM id（APG accordion 模式）', async () => {
    const screen = render(OCollapseItem, { props: { title: 'H' } });
    await flush();
    const header = screen.container.querySelector('.o-collapse-item-header') as HTMLElement;
    const body = screen.container.querySelector('.o-collapse-item-body') as HTMLElement;
    const labelledBy = body.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    expect(header.getAttribute('id')).toBe(labelledBy);
  });
});
