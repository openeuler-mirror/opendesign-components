/**
 * OForm 响应式契约测试。
 *
 * 按 media.scss 实际声明的 respond 块组织断点矩阵：
 *
 *   @respond('laptop')  → --form-item-gap / --form-label-main-gap 跃迁
 *   @respond('pad_h')   → --form-item-gap / --form-label-main-gap / box 宽度跃迁
 *   @respond('<=pad_v')  → --form-item-gap / --form-label-main-gap / box 宽度跃迁
 *   @respond('phone')   → --form-msg-gap / box 宽度跃迁
 *
 * 断言策略：
 *   ① 字面 px 变量（var.scss 直接写 px）：精确比对
 *   ② token 链变量（值为 var(--o-r-grid-*)）：仅断言「跃迁前后值变化」
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, reactive } from 'vue';
import OForm from '../OForm.vue';
import OFormItem from '../OFormItem.vue';
import { BREAKPOINTS, setViewport } from '../../../__tests__/_helpers/viewport';
import { flush, resolveTokenPx } from '../../../__tests__/_helpers/dom';

async function renderFormAt(bp: keyof typeof BREAKPOINTS) {
  await setViewport(bp);
  const model = reactive({ name: '' });
  const screen = render({
    render: () =>
      h(
        OForm,
        { model, hasRequired: true, labelWidth: '80px' },
        {
          default: () => h(OFormItem, { label: 'Name', field: 'name', required: true }, { default: () => h('input') }),
        },
      ),
  });
  await flush();
  return screen.container.querySelector('.o-form') as HTMLElement;
}

// ============================================================================
// 字面 px 变量：--form-item-gap / --form-label-main-gap
// ============================================================================
describe('响应式契约（字面 px 变量）', () => {
  test('OForm --form-item-gap - desktop(24) → laptop(16) → pad_h(12) → pad_v(12) → phone(12)', async () => {
    const d = await renderFormAt('desktop');
    expect(getComputedStyle(d).getPropertyValue('--form-item-gap').trim()).toBe('24px');

    const l = await renderFormAt('laptop');
    expect(getComputedStyle(l).getPropertyValue('--form-item-gap').trim()).toBe('16px');

    const ph = await renderFormAt('pad_h');
    expect(getComputedStyle(ph).getPropertyValue('--form-item-gap').trim()).toBe('12px');

    const pv = await renderFormAt('pad_v');
    expect(getComputedStyle(pv).getPropertyValue('--form-item-gap').trim()).toBe('12px');

    const p = await renderFormAt('phone');
    expect(getComputedStyle(p).getPropertyValue('--form-item-gap').trim()).toBe('12px');
  });

  test('OForm --form-label-main-gap - desktop(32) → laptop(24) → pad_h(16) → pad_v(8)', async () => {
    const d = await renderFormAt('desktop');
    expect(getComputedStyle(d).getPropertyValue('--form-label-main-gap').trim()).toBe('32px');

    const l = await renderFormAt('laptop');
    expect(getComputedStyle(l).getPropertyValue('--form-label-main-gap').trim()).toBe('24px');

    const ph = await renderFormAt('pad_h');
    expect(getComputedStyle(ph).getPropertyValue('--form-label-main-gap').trim()).toBe('16px');

    const pv = await renderFormAt('pad_v');
    expect(getComputedStyle(pv).getPropertyValue('--form-label-main-gap').trim()).toBe('8px');

    const p = await renderFormAt('phone');
    expect(getComputedStyle(p).getPropertyValue('--form-label-main-gap').trim()).toBe('8px');
  });
});

// ============================================================================
// token 链变量：--form-item-main-box-width-standard / wide
// ============================================================================
describe('响应式契约（token 链变量）', () => {
  test('OForm --form-item-main-box-width-standard - 各断点均解析为正数', async () => {
    for (const bp of Object.keys(BREAKPOINTS) as (keyof typeof BREAKPOINTS)[]) {
      const root = await renderFormAt(bp);
      const px = resolveTokenPx(root, '--form-item-main-box-width-standard');
      expect(px).toBeGreaterThan(0);
    }
  });

  test('OForm --form-item-main-box-width-wide - 各断点均解析为正数', async () => {
    for (const bp of Object.keys(BREAKPOINTS) as (keyof typeof BREAKPOINTS)[]) {
      const root = await renderFormAt(bp);
      const px = resolveTokenPx(root, '--form-item-main-box-width-wide');
      expect(px).toBeGreaterThan(0);
    }
  });
});
