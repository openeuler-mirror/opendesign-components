import { createApp } from 'vue';
import './assets/style/style.scss';
import 'normalize.css';

import './ak/fonts/HarmonyOS/harmonyos-hans-fonts.scss';

import './ak/theme/a.light.token.css';
import './ak/theme/a.dark.token.css';
import './ak/theme/a.media.token.scss';

import './ak/theme/k.light.token.css';
import './ak/theme/k.dark.token.css';
import './ak/theme/k.media.token.scss';

import '@opendesign-src/index.scss';

import './ak/theme/index.a.scss';
import './ak/theme/index.k.scss';
import './ak/theme/index.scss';

import { router } from '@/router';

import App from './App.vue';
import TheFrame from './components/TheFrame.vue';

const app = createApp(App);

app.use(router);

app.component('TheFrame', TheFrame);

app.mount('#app');
