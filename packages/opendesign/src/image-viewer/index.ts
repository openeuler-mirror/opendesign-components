import _OImageViewer from './OImageViewer.vue';
import type { App } from 'vue';

const OImageViewer = Object.assign(_OImageViewer, {
  install(app: App) {
    app.component('OImageViewer', _OImageViewer);
  },
});

export { OImageViewer };
export { useImageViewer } from './use-image-viewer';
export type { UseImageViewerOptions, ImageViewerHandle, ImageViewerCallbacks } from './use-image-viewer';
export * from './types';
