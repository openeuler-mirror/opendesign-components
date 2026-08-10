import { beforeAll } from 'vitest';
import { page } from 'vitest/browser';
import '../src/index.scss';
// 同时加载 light + dark 两套 token，让测试用例通过 element.setAttribute('data-o-theme', ...)
// 在元素粒度切主题（scope 到该 button 子树），不污染 documentElement 全局状态
import '@opensig/opendesign-token/themes/e.light.token.css';
import '@opensig/opendesign-token/themes/e.dark.token.css';

// 默认 e.light；测试用例可以在 render 后的 button 上 setAttribute('data-o-theme', 'e.dark') 切到 dark
document.documentElement.setAttribute('data-o-theme', 'e.light');

// 设置默认桌面视口（1920×1080），避免 Playwright 默认 414px 移动端视口
// 导致 useScreen 的 lePadV / isPhonePad 判断为 true 而隐藏 UI 元素
// 需要特定视口的测试（如 responsive.test.ts）可通过 setViewport 覆盖
beforeAll(async () => {
  await page.viewport(1920, 1080);
});
