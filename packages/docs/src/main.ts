import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'normalize.css';

import '@/assets/style/index';

import { router } from '@/router/index';

import App from './App.vue';
import * as Opendesign from '@opensig/opendesign';
import * as DocIcons from '@/icon-components';
import CodeContainer from './components/CodeContainer.vue';
import DemoContainer from './components/DemoContainer.vue';
import DemoUsage from './components/DemoUsage.vue';
import DocLink from './components/DocLink.vue';

import '@opensig/opendesign-token/themes/a.dark.token.css';
import '@opensig/opendesign-token/themes/a.light.token.css';
import '@opensig/opendesign-token/themes/e.dark.token.css';
import '@opensig/opendesign-token/themes/e.light.token.css';
import '@opensig/opendesign-token/themes/k.dark.token.css';
import '@opensig/opendesign-token/themes/k.light.token.css';
import '@opensig/opendesign-token/themes/g.dark.token.css';
import '@opensig/opendesign-token/themes/g.light.token.css';
import '@opensig/opendesign-token/themes/u.dark.token.css';
import '@opensig/opendesign-token/themes/u.light.token.css';
import '@opensig/opendesign-token/themes/m.dark.token.css';
import '@opensig/opendesign-token/themes/m.light.token.css';

import '@opensig/opendesign-token/fonts/font-harmony.css';



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
Object.entries(DocIcons).forEach(([name, value]) => {
  app.component(name, value as any);
});
// 某些组件有问题，需要手动注册
app.component('OCarouselItem', Opendesign.OCarouselItem);
app.component('DocLink', DocLink);
app.mount('#app');
