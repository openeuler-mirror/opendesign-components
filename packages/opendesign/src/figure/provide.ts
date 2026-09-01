import { InjectionKey } from 'vue';

export const figureInjectKey: InjectionKey<{
  updateDraggingStatus: (isDragging: boolean) => void;
}> = Symbol('provide-figure');
