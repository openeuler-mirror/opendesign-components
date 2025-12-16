import { createApp } from 'vue';
import './assets/style/style.scss';

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

import './assets/style/media.token.scss';

import { router } from '@/router';
import './analytics';

import App from './App.vue';

const app = createApp(App);

app.use(router);

app.mount('#app');
