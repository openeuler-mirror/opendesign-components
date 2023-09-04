import { createApp } from 'vue';
import './assets/style/style.scss';
import 'normalize.css';

import '@opensig/opendesign/src/_styles/light.token.css';
import '@opensig/opendesign/src/_styles/dark.token.css';

import './assets/style/a.light.token.css';
import './assets/style/a.dark.token.css';
import './assets/style/a.media.token.css';

import './assets/style/k.light.token.css';
import './assets/style/k.dark.token.css';
import './assets/style/k.media.token.css';

import { router } from '@/router';

import App from './App.vue';

const app = createApp(App);

app.use(router);

app.mount('#app');
