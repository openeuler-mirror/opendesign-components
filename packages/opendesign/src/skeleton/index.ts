import _OSkeleton from './OSkeleton.vue';
import OSkeletonText from './OSkeletonText.vue';
import OSkeletonAvatar from './OSkeletonAvatar.vue';
import OSkeletonFigure from './OSkeletonFigure.vue';
import type { App } from 'vue';

export * from './types';

const OSkeleton = Object.assign(_OSkeleton, {
  OSkeletonText,
  OSkeletonAvatar,
  OSkeletonFigure,
  install(app: App) {
    app.component(_OSkeleton.name, _OSkeleton);
    app.component(OSkeletonText.name, OSkeletonText);
    app.component(OSkeletonAvatar.name, OSkeletonAvatar);
    app.component(OSkeletonFigure.name, OSkeletonFigure);
  },
});

export { OSkeleton, OSkeletonText, OSkeletonAvatar, OSkeletonFigure };
