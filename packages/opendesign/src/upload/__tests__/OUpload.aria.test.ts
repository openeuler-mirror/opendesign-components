/**
 * OUpload ARIA 无障碍契约测试。
 *
 * 覆盖：上传进度条 role=progressbar 与值镜像、文件状态提示的
 * alert/status 角色（上传结果对读屏与代理可感知）。
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import UploadItem from '../UploadItem.vue';
import { flush } from '../../../__tests__/_helpers/dom';

/** 渲染一个文件条目（卡片与行两种形态）。 */
const renderUploading = (listType: 'picture-card' | 'text') =>
  render(UploadItem, {
    props: {
      file: { id: 'f1', name: 'a.png', status: 'uploading', percent: 45 },
      showProgress: true,
      listType,
    },
  });

describe('ARIA — OUpload', () => {
  test('上传中进度条设 role="progressbar" 并镜像 aria-valuenow', async () => {
    for (const listType of ['picture-card', 'text'] as const) {
      const screen = renderUploading(listType);
      await flush();
      const bar = screen.container.querySelector('.o-upload-progress[role="progressbar"]') as HTMLElement;
      expect(bar).toBeTruthy();
      expect(bar.getAttribute('aria-valuenow')).toBe('45');
      expect(bar.getAttribute('aria-valuemin')).toBe('0');
      expect(bar.getAttribute('aria-valuemax')).toBe('100');
      expect(bar.getAttribute('aria-label')).toBeTruthy();
    }
  });

  test('失败状态提示设 role="alert"，普通提示设 role="status"', async () => {
    const failed = render(UploadItem, {
      props: { file: { id: 'f1', name: 'a.png', status: 'failed', message: '上传失败' }, listType: 'text' },
    });
    await flush();
    const alert = failed.container.querySelector('.o-upload-item-tip[role="alert"]');
    expect(alert).toBeTruthy();

    const normal = render(UploadItem, {
      props: { file: { id: 'f2', name: 'b.png', status: 'finished', message: '上传完成' }, listType: 'text' },
    });
    await flush();
    const status = normal.container.querySelector('.o-upload-item-tip[role="status"]');
    expect(status).toBeTruthy();
  });

  test('无文件消息时不渲染提示节点', async () => {
    const screen = render(UploadItem, {
      props: { file: { id: 'f3', name: 'c.png', status: 'finished' }, listType: 'text' },
    });
    await flush();
    expect(screen.container.querySelector('.o-upload-item-tip')).toBeNull();
  });
});
