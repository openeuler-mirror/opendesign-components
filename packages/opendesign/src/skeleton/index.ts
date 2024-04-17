import _OSkeleton from './OSkeleton.vue';
import OSkeletonText from './OSkeletonText.vue';
import OSkeletonAvatar from './OSkeletonAvatar.vue';
import OSkeletonFigure from './OSkeletonFigure.vue';
import type { App } from 'vue';

const OSkeleton = Object.assign(_OSkeleton, {
  OSkeletonText,
  OSkeletonAvatar,
  OSkeletonFigure,
  install(app: App) {
    app.component('OSkeleton', _OSkeleton);
    app.component('OSkeletonText', OSkeletonText);
    app.component('OSkeletonAvatar', OSkeletonAvatar);
    app.component('OSkeletonFigure', OSkeletonFigure);
  },
});

export { OSkeleton, OSkeletonText, OSkeletonAvatar, OSkeletonFigure };
export * from './types';
