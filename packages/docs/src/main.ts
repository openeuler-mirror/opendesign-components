import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'normalize.css';

import '@opensig/opendesign/index.scss';
import '@opensig/opendesign/_styles/light.token.css';
import '@opensig/opendesign/_styles/dark.token.css';
import '@/assets/style/index';

import { router } from '@/router/index';

import App from './App.vue';
import * as Opendesign from '@opensig/opendesign';
import CodeContainer from './components/CodeContainer.vue';
import DemoContainer from './components/DemoContainer.vue';
import DemoUsage from './components/DemoUsage.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.component('CodeContainer', CodeContainer);
app.component('DemoContainer', DemoContainer);
app.component('DemoUsage', DemoUsage);
Object.entries(Opendesign).forEach(([name, value]) => {
  if (typeof value !== 'object' || !value) {
    return;
  }
  // 将所有组件全局注册，以便 md 文件使用
  if (typeof (value as any).install === 'function') {
    app.use(value as any);
  }
  if (name.startsWith('OIcon') && name.length > 5) {
    app.component(name, value as any);
  }
});
// 某些组件有问题，需要手动注册
app.component('OCarouselItem', Opendesign.OCarouselItem);
app.component('OToggle', Opendesign.OToggle);
app.mount('#app');
