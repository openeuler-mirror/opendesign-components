import _OSkeleton from './OSkeleton.vue';
import _OSkeletonText from './OSkeletonText.vue';
import _OSkeletonAvatar from './OSkeletonAvatar.vue';
import _OSkeletonFigure from './OSkeletonFigure.vue';
import type { App } from 'vue';

export * from './types';

const OSkeleton = Object.assign(_OSkeleton, {
  install(app: App) {
    app.component(_OSkeleton.name, _OSkeleton);
  },
});

const OSkeletonText = Object.assign(_OSkeletonText, {
  install(app: App) {
    app.component(_OSkeletonText.name, _OSkeletonText);
  },
});

const OSkeletonAvatar = Object.assign(_OSkeletonAvatar, {
  install(app: App) {
    app.component(_OSkeletonAvatar.name, _OSkeletonAvatar);
  },
});

const OSkeletonFigure = Object.assign(_OSkeletonFigure, {
  install(app: App) {
    app.component(_OSkeletonFigure.name, _OSkeletonFigure);
  },
});

export { OSkeleton, OSkeletonText, OSkeletonAvatar, OSkeletonFigure };
