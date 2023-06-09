import { createApp } from 'vue';
import './assets/fonts/HarmonyOS/harmonyos-hans-fonts.scss';
import './assets/style/style.scss';
import 'normalize.css';

import './assets/theme/a.light.token.css';
import './assets/theme/a.dark.token.css';
import './assets/theme/a.media.token.css';

import './assets/theme/k.light.token.css';
import './assets/theme/k.dark.token.css';
import './assets/theme/k.media.token.css';

import '@opensig/opendesign/src/components/index.scss';

import './assets/theme/index.a.scss';
import './assets/theme/index.k.scss';
import './assets/theme/index.scss';

import { router } from '@/router';

import App from './App.vue';
import TheFrame from './components/TheFrame.vue';

const app = createApp(App);

app.use(router);

app.component('TheFrame', TheFrame);

app.mount('#app');
