import _OCard from './OCard.vue';
import type { App } from 'vue';

const OCard = Object.assign(_OCard, {
  install(app: App) {
    app.component(_OCard.name, _OCard);
  },
});

export {
  OCard,
};
