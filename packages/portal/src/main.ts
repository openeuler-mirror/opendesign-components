import { createApp } from 'vue';
import './assets/style/style.scss';
import 'normalize.css';

import '@opendesign-src/theme/opendesign/common/light.token.css';
import '@opendesign-src/theme/opendesign/common/dark.token.css';
import '@opendesign-src/theme/ascend/common/a.dark.token.css';
import '@opendesign-src/theme/ascend/common/a.light.token.css';
import '@opendesign-src/theme/kunpeng/common/k.dark.token.css';
import '@opendesign-src/theme/kunpeng/common/k.light.token.css';
import './assets/style/media.token.scss';

import { router } from '@/router';
import './analytics';

import App from './App.vue';

const app = createApp(App);

app.use(router);

app.mount('#app');
