import _OSlides from './OSlides.vue';
import OSlideItem from './OSlideItem.vue';
import type { App } from 'vue';

const OSlides = Object.assign(_OSlides, {
  OSlideItem,
  install(app: App) {
    app.component(_OSlides.name, _OSlides);
  },
});

export {
  OSlides,
  OSlideItem
};
