import { createApp } from 'vue';
import './style.scss';
import 'opendesign/shared/token.css';
import 'opendesign/shared/base.scss';

// import { initSize, SizeT } from 'opendesign/config';
import { router } from '@/router';

import App from './App.vue';

// initSize(SizeT.LARGE);

const app = createApp(App);

app.use(router);

app.mount('#app');

