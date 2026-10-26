/**
 * OSelect 实例方法测试。
 *
 * 验证 focus / blur / scrollTo 实例方法：
 *   1. focus() — input 获得焦点
 *   2. blur() — input 失去焦点
 *   3. scrollTo(index) 方法存在且不抛错
 *   4. 非 breaking 回归：现有 expose 不受影响
 */
import { test, expect, describe, vi, afterEach, beforeEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h, ref } from 'vue';
import OSelect from '../OSelect.vue';
import OOption from '../../option/OOption.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { setViewport } from '../../../__tests__/_helpers/viewport';

const cleanupBodyPopups = () => {
  document.body.querySelectorAll('.o-options-popup, .o-select-options, [data-v-popper-escaped], .o-popup-content').forEach((el) => el.remove());
};

describe('focus / blur 实例方法', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('focus() — input 获得焦点', async () => {
    const selectInstance = ref<any>(null);
    render({
      components: { OSelect },
      setup() {
        return { selectInstance };
      },
      template: '<OSelect ref="selectInstance" />',
    });
    await flush();
    expect(selectInstance.value).toBeTruthy();
    expect(selectInstance.value.focus).toBeDefined();
    expect(typeof selectInstance.value.focus).toBe('function');

    selectInstance.value.focus();
    await flush();
    const input = document.querySelector('.o-select-input') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(document.activeElement).toBe(input);
  });

  test('blur() — input 失去焦点', async () => {
    const selectInstance = ref<any>(null);
    render({
      components: { OSelect },
      setup() {
        return { selectInstance };
      },
      template: '<OSelect ref="selectInstance" />',
    });
    await flush();

    selectInstance.value.focus();
    await flush();
    const input = document.querySelector('.o-select-input') as HTMLInputElement;
    expect(document.activeElement).toBe(input);

    expect(selectInstance.value.blur).toBeDefined();
    selectInstance.value.blur();
    await flush();
    expect(document.activeElement).not.toBe(input);
  });
});

describe('scrollTo 实例方法', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('scrollTo 方法存在', async () => {
    const selectInstance = ref<any>(null);
    render({
      components: { OSelect },
      setup() {
        return { selectInstance };
      },
      template: '<OSelect ref="selectInstance" />',
    });
    await flush();
    expect(selectInstance.value.scrollTo).toBeDefined();
    expect(typeof selectInstance.value.scrollTo).toBe('function');
  });

  test('scrollTo 不抛错（非虚拟模式）', async () => {
    const selectInstance = ref<any>(null);
    const options = Array.from({ length: 10 }, (_, i) => ({ label: 'Item ' + i, value: i }));
    render({
      components: { OSelect },
      setup() {
        return { selectInstance, options };
      },
      template: '<OSelect ref="selectInstance" :options="options" />',
    });
    await flush();

    const selectEl = document.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();

    expect(() => selectInstance.value.scrollTo(5)).not.toThrow();
  });
});

describe('scrollTo key 模式', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('scrollTo({ key }) 方法存在且不抛错', async () => {
    const selectInstance = ref<any>(null);
    const options = Array.from({ length: 10 }, (_, i) => ({ label: 'Item ' + i, value: i }));
    render({
      components: { OSelect },
      setup() {
        return { selectInstance, options };
      },
      template: '<OSelect ref="selectInstance" :options="options" />',
    });
    await flush();

    const selectEl = document.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();

    expect(() => selectInstance.value.scrollTo({ key: 5 })).not.toThrow();
  });

  test('scrollTo({ key }) 在非虚拟模式下 scrollIntoView 不抛错', async () => {
    const selectInstance = ref<any>(null);
    const options = Array.from({ length: 10 }, (_, i) => ({ label: 'Item ' + i, value: i }));
    render({
      components: { OSelect },
      setup() {
        return { selectInstance, options };
      },
      template: '<OSelect ref="selectInstance" :options="options" />',
    });
    await flush();

    const selectEl = document.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();

    // 不抛错，找不到 key 时静默返回
    expect(() => selectInstance.value.scrollTo({ key: 999 })).not.toThrow();
  });

  test('scrollTo({ index, key }) 同时传时不抛错', async () => {
    const selectInstance = ref<any>(null);
    const options = Array.from({ length: 10 }, (_, i) => ({ label: 'Item ' + i, value: i }));
    render({
      components: { OSelect },
      setup() {
        return { selectInstance, options };
      },
      template: '<OSelect ref="selectInstance" :options="options" />',
    });
    await flush();

    const selectEl = document.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();

    // 同时传 index 和 key 时不抛错（dev warn + 以 key 为准）
    expect(() => selectInstance.value.scrollTo({ index: 0, key: 5 })).not.toThrow();
  });
});

describe('非 breaking 回归', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('不调用 focus/blur/scrollTo — 行为与旧版一致', async () => {
    const screen = render(OSelect, {
      props: { modelValue: 'b' },
      slots: {
        default: () => [h(OOption, { value: 'a', label: 'A' }), h(OOption, { value: 'b', label: 'B' })],
      },
    });
    await flush();
    const input = screen.container.querySelector('.o-select-input') as HTMLInputElement;
    expect(input.value).toBe('B');

    const selectEl = screen.container.querySelector('.o-select') as HTMLElement;
    await selectEl.click();
    await flush();
    const options = document.querySelectorAll('.o-option');
    const optionA = Array.from(options).find((o) => o.textContent?.includes('A')) as HTMLElement;
    await optionA.click();
    await flush();
    expect(input.value).toBe('A');
  });

  test('现有 expose selectRef / isSelecting 不受影响', async () => {
    const selectInstance = ref<any>(null);
    render({
      components: { OSelect },
      setup() {
        return { selectInstance };
      },
      template: '<OSelect ref="selectInstance" />',
    });
    await flush();
    expect(selectInstance.value.selectRef).toBeDefined();
    expect(selectInstance.value.isSelecting).toBeDefined();
    expect(selectInstance.value.focus).toBeDefined();
    expect(selectInstance.value.blur).toBeDefined();
    expect(selectInstance.value.scrollTo).toBeDefined();
  });
});

// ============================================================================
// Bug fix: 展开下拉时 scrollIntoView 不应滚动 window
// 根因：watch(isSelecting) 的 nextTick 中调用 scrollTo → scrollIntoView，
// 但此时 OPopup 尚未通过 ResizeObserver 完成定位，option 元素位于页面顶部，
// scrollIntoView({block:'nearest'}) 滚动 window 导致页面跳转到顶部。
// 修复策略：scrollTo 改为手动滚动 popup 内部可滚动容器，不触发 window 滚动。
// ============================================================================
describe('展开下拉时 scrollIntoView 不应滚动 window', () => {
  beforeEach(async () => {
    await setViewport('desktop');
  });
  afterEach(cleanupBodyPopups);

  test('已选值时展开下拉 — window 滚动位置不变', async () => {
    const options = Array.from({ length: 5 }, (_, i) => ({ label: `Option ${i}`, value: i }));
    render({
      components: { OSelect },
      setup() {
        return { options };
      },
      template: `
        <div>
          <div style="height: 2000px"></div>
          <OSelect :options="options" :model-value="2" />
        </div>
      `,
    });
    await flush();

    // 滚动到 select 附近，使页面有明显的滚动偏移
    const selectEl = document.querySelector('.o-select') as HTMLElement;
    selectEl.scrollIntoView({ block: 'center' });
    await flush();

    const scrollBefore = window.scrollY;
    expect(scrollBefore).toBeGreaterThan(100);

    // 点击展开下拉，触发 watch(isSelecting) → nextTick → scrollTo → scrollIntoView
    await selectEl.click();
    await flush();

    // 验证：window 滚动位置不应跳到顶部
    const scrollAfter = window.scrollY;
    expect(scrollAfter).toBe(scrollBefore);
  });
});
