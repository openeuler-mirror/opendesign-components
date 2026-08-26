import '../src/index.scss';
// 同时加载 light + dark 两套 token，让测试用例通过 element.setAttribute('data-o-theme', ...)
// 在元素粒度切主题（scope 到该 button 子树），不污染 documentElement 全局状态
import '@opensig/opendesign-token/themes/e.light.token.css';
import '@opensig/opendesign-token/themes/e.dark.token.css';
import { setLogEnabled } from '../src/_utils/log';

// 默认 e.light；测试用例可以在 render 后的 button 上 setAttribute('data-o-theme', 'e.dark') 切到 dark
document.documentElement.setAttribute('data-o-theme', 'e.light');

// 全局开启日志，使 logger.warn / logger.info 等在测试中实际调用 console，
// 配合 vi.spyOn(console, 'warn') 可验证 dev 警告。
// log.test.ts 中测试 setLogEnabled 本身，会自行切换。
setLogEnabled(true);
