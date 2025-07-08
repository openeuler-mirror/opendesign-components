import { createApp } from 'vue';
import { createPinia } from 'pinia'
import 'normalize.css';

import '@opensig/opendesign/es/index.css';
import '@opensig/opendesign/es/_styles/light.token.css';
import '@opensig/opendesign/es/_styles/dark.token.css';
import './assets/style/style.scss';

import './assets/style/a.light.token.css';
import './assets/style/a.dark.token.css';

import './assets/style/k.light.token.css';
import './assets/style/k.dark.token.css';

import { router } from '@/router/index';

import App from './App.vue';
import { OPopover, OTag, OIconInfo } from '@opensig/opendesign';
import CodeContainer from './components/CodeContainer.vue';
import DemoContainer from './components/DemoContainer.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(OPopover);
app.use(OTag);
app.component('CodeContainer', CodeContainer);
app.component('DemoContainer', DemoContainer);
app.component('OIconInfo', OIconInfo);

app.mount('#app');
