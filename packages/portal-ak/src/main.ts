import { createApp } from 'vue';
import './assets/style/style.scss';
import 'normalize.css';

import './assets/theme/a.light.token.css';
import './assets/theme/a.dark.token.css';

import './assets/theme/k.light.token.css';
import './assets/theme/k.dark.token.css';

import '@opensig/opendesign/src/components/index.scss';

import { router } from '@/router';

import App from './App.vue';

const app = createApp(App);

app.use(router);

app.mount('#app');
