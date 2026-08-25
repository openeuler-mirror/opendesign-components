/**
 * OUpload 单组件契约测试。
 *
 * 本文件重点验证「插槽透传链路」——即 useSlots → defineSlots 重构后
 * filterSlots 和 slots['select-extra'] 条件渲染是否仍正确工作。
 *
 * 组织原则：
 *   1. 静态契约：按 types.ts prop 顺序
 *   2. 插槽契约：select-extra / select-add / select-add-label / default / item 透传
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OUpload from '../OUpload.vue';
import OForm from '../../form/OForm.vue';
import OFormItem from '../../form/OFormItem.vue';
import { flush } from '../../../__tests__/_helpers/dom';

describe('静态契约（按 types.ts 属性）', () => {
  test('OUpload 根元素 class 包含 o-upload', async () => {
    const screen = render(OUpload);
    await flush();
    expect(screen.container.querySelector('.o-upload')).not.toBeNull();
  });

  test('OUpload disabled - 不影响渲染', async () => {
    const screen = render(OUpload, { props: { disabled: true } });
    await flush();
    expect(screen.container.querySelector('.o-upload')).not.toBeNull();
  });

  test('OUpload size/round - 继承自 OForm/OFormItem 透传至触发按钮', async () => {
    const screen = render({
      render: () =>
        h(
          OForm,
          { model: {}, size: 'small', round: '4px' },
          {
            default: () => h(OFormItem, { label: 'file', field: 'file' }, { default: () => h(OUpload, { listType: 'text' }) }),
          },
        ),
    });
    await flush();
    const btn = screen.container.querySelector('.o-upload-select .o-btn') as HTMLElement;
    expect(btn).not.toBeNull();
    expect(btn.classList.contains('o-btn-small')).toBe(true);
    expect(btn.style.getPropertyValue('--btn-radius')).toBe('4px');
  });

  test('OUpload listType=text - 渲染 .o-upload-select-wrap', async () => {
    const screen = render(OUpload, { props: { listType: 'text' } });
    await flush();
    expect(screen.container.querySelector('.o-upload-select-wrap')).not.toBeNull();
  });

  test('OUpload listType=picture - 渲染 .o-upload-select-wrap', async () => {
    const screen = render(OUpload, { props: { listType: 'picture' } });
    await flush();
    expect(screen.container.querySelector('.o-upload-select-wrap')).not.toBeNull();
  });

  test('OUpload listType=picture-card - 渲染 .o-upload-card-list', async () => {
    const screen = render(OUpload, { props: { listType: 'picture-card' } });
    await flush();
    expect(screen.container.querySelector('.o-upload-card-list')).not.toBeNull();
  });

  test('OUpload draggable - 注入 o-upload-draggable 类', async () => {
    const screen = render(OUpload, { props: { draggable: true } });
    await flush();
    expect((screen.container.querySelector('.o-upload') as HTMLElement).classList.contains('o-upload-draggable')).toBe(true);
  });

  test('OUpload btnLabel - 透传至上传按钮文本', async () => {
    const screen = render(OUpload, { props: { btnLabel: '上传文件' } });
    await flush();
    // btnLabel 在 UploadSelect 或 picture-card 模式中渲染
    expect(screen.container.textContent).toContain('上传文件');
  });

  test('OUpload defaultFileList - 渲染已存在的文件列表', async () => {
    const screen = render(OUpload, {
      props: {
        defaultFileList: [
          { id: 1, name: 'test.txt', status: 'finished' },
          { id: 2, name: 'demo.txt', status: 'finished' },
        ],
      },
    });
    await flush();
    const items = screen.container.querySelectorAll('.o-upload-item');
    expect(items.length).toBe(2);
  });
});

// ============================================================================
// 插槽契约：验证 defineSlots 重构后插槽渲染与 filterSlots 透传不受影响
//
// OUpload 提供 default / item / select-drag / select-drag-extra /
// select-extra / select-add / select-add-label 插槽。
// 其中 default / item / select-drag / select-drag-extra 通过 filterSlots 透传。
// select-extra 通过 slots['select-extra'] 条件渲染。
// ============================================================================

describe('插槽契约（具名插槽）', () => {
  test('OUpload slot=select-extra - 渲染 .o-upload-select-extra 容器及 slot 内容', async () => {
    const screen = render(OUpload, {
      slots: {
        'select-extra': () => h('div', { class: 'custom-select-extra' }, '额外内容'),
      },
    });
    await flush();
    const extraWrap = screen.container.querySelector('.o-upload-select-extra');
    expect(extraWrap).not.toBeNull();
    expect(extraWrap?.querySelector('.custom-select-extra')?.textContent).toBe('额外内容');
  });

  test('OUpload - 未传 select-extra 时不渲染 .o-upload-select-extra 容器', async () => {
    const screen = render(OUpload);
    await flush();
    expect(screen.container.querySelector('.o-upload-select-extra')).toBeNull();
  });

  test('OUpload slot=select-add - picture-card 模式下替换添加按钮区域', async () => {
    const screen = render(OUpload, {
      props: { listType: 'picture-card' },
      slots: {
        'select-add': () => h('div', { class: 'custom-select-add' }, '自定义添加'),
      },
    });
    await flush();
    const addEl = screen.container.querySelector('.o-upload-card-add .custom-select-add');
    expect(addEl).not.toBeNull();
    expect(addEl?.textContent).toBe('自定义添加');
  });

  test('OUpload slot=select-add-label - picture-card 模式下替换添加按钮文字', async () => {
    const screen = render(OUpload, {
      props: { listType: 'picture-card' },
      slots: {
        'select-add-label': () => h('span', { class: 'custom-add-label' }, '点我上传'),
      },
    });
    await flush();
    const labelEl = screen.container.querySelector('.custom-add-label');
    expect(labelEl).not.toBeNull();
    expect(labelEl?.textContent).toBe('点我上传');
  });

  test('OUpload slot=default - 默认插槽透传至 UploadSelect', async () => {
    const screen = render(OUpload, {
      slots: {
        default: () => h('div', { class: 'custom-default-slot' }, '自定义选择区'),
      },
    });
    await flush();
    // default slot 通过 filterSlots 透传至 UploadSelect
    const slotEl = screen.container.querySelector('.custom-default-slot');
    expect(slotEl).not.toBeNull();
  });

  test('OUpload slot=item - item 插槽透传至 UploadItem，可获取文件信息', async () => {
    const screen = render(OUpload, {
      props: {
        defaultFileList: [{ id: 1, name: 'file.txt', status: 'finished' }],
      },
      slots: {
        item: (props: Record<string, any>) => h('div', { class: 'custom-item-slot' }, `文件:${props?.item?.name || ''}`),
      },
    });
    await flush();
    const slotEl = screen.container.querySelector('.custom-item-slot');
    expect(slotEl).not.toBeNull();
    expect(slotEl?.textContent).toContain('file.txt');
  });
});
