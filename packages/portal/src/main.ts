import { createApp } from 'vue';
import './style.scss';
import 'normalize.css';
import '@opensig/opendesign/src/components/style/token.css';
import '@opensig/opendesign/src/components/style';

// import { initSize } from 'opendesign/config';
import { router } from '@/router';

import App from './App.vue';

// initSize(SizeT.LARGE);

const app = createApp(App);

app.use(router);

app.mount('#app');

