import { createApp } from 'vue';
import './assets/style/style.scss';
import 'normalize.css';

import '@opendesign-src/theme/opendesign/light.token.css';
import '@opendesign-src/theme/opendesign/dark.token.css';
import '@opendesign-src/theme/ascend/a.dark.token.css';
import '@opendesign-src/theme/ascend/a.light.token.css';
import '@opendesign-src/theme/kunpeng/k.dark.token.css';
import '@opendesign-src/theme/kunpeng/k.light.token.css';
import './assets/style/media.token.scss';

import { router } from '@/router';
import './analytics';

import App from './App.vue';

const app = createApp(App);

app.use(router);

app.mount('#app');
