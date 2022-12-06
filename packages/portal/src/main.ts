import { createApp } from 'vue';
import './style.scss';
import '@opensig/opendesign/components/_shared/token.css';
import '@opensig/opendesign/components/_shared/base.scss';

// import { initSize, SizeT } from 'opendesign/config';
import { router } from '@/router';

import App from './App.vue';

// initSize(SizeT.LARGE);

const app = createApp(App);

app.use(router);

app.mount('#app');

