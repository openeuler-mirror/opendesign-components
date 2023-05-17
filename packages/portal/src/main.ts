import { createApp } from 'vue';
import './style.scss';
import 'normalize.css';

import '@opensig/opendesign/src/components/style/default-light.token.css';
import '@opensig/opendesign/src/components/style/dark.token.css';

import '@opensig/opendesign/src/components/style/a-light.token.css';
import '@opensig/opendesign/src/components/style/a-dark.token.css';

import '@opensig/opendesign/src/components/style/k-light.token.css';
import '@opensig/opendesign/src/components/style/k-dark.token.css';

import { router } from '@/router';

import App from './App.vue';

const app = createApp(App);

app.use(router);

app.mount('#app');
