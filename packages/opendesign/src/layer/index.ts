import _OLayer from './OLayer.vue';
import type { App } from 'vue';

const OLayer = Object.assign(_OLayer, {
  install(app: App) {
    app.component(_OLayer.name, _OLayer);
  },
});

export { OLayer };
