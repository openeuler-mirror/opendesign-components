import _OTour from './OTour.vue';
import _OTourStep from './OTourStep.vue';
import type { App } from 'vue';

const OTour = Object.assign(_OTour, {
  install(app: App) {
    app.component('OTour', _OTour);
  },
});

const OTourStep = Object.assign(_OTourStep, {
  install(app: App) {
    app.component('OTourStep', _OTourStep);
  },
});

export { OTour, OTourStep };
export * from './types';
