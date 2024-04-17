import _OCard from './OCard.vue';
import type { App } from 'vue';

const OCard = Object.assign(_OCard, {
  install(app: App) {
    app.component('OCard', _OCard);
  },
});

export { OCard };
export * from './types';
