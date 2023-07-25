import _OCarousel from './OCarousel.vue';
import OCarouselItem from './OCarouselItem.vue';
import type { App } from 'vue';

const OCarousel = Object.assign(_OCarousel, {
  OCarouselItem,
  install(app: App) {
    app.component(_OCarousel.name, _OCarousel);
  },
});

export { OCarousel, OCarouselItem };

export * from './types';
