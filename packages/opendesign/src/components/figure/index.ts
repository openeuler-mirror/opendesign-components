import _OFigure from './OFigure.vue';
import type { App } from 'vue';

const OFigure = Object.assign(_OFigure, {
  install(app: App) {
    app.component(_OFigure.name, _OFigure);
  },
});

export {
  OFigure,
};
