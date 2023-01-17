import { createApp } from 'vue';
import './style.scss';
import 'normalize.css';
import '@opensig/opendesign/src/components/style/default-light.token.css';
import '@opensig/opendesign/src/components/style';


import { router } from '@/router';

import App from './App.vue';

const app = createApp(App);

app.use(router);

app.mount('#app');

