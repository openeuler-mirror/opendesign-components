import type { PointT, PointMoveT } from './types';

interface TouchOptionsT {
  onStart?: (pos: PointT, e: TouchEvent) => void;
  onMove?: (pos: PointMoveT, e: TouchEvent) => void;
  onEnd?: (pos: PointMoveT, e: TouchEvent) => void;
}
function noop() {}
export class OPointer {
  private el: HTMLElement;
  private x1: number;
  private y1: number;
  private onStart: (position: PointT, e: TouchEvent) => void;
  private onMove: (position: PointMoveT, e: TouchEvent) => void;
  private onEnd: (position: PointMoveT, e: TouchEvent) => void;
  private removeListener: (() => void) | null;
  constructor(el: HTMLElement, options: TouchOptionsT) {
    this.el = el;
    this.x1 = 0;
    this.y1 = 0;

    this.bind();

    this.onStart = options.onStart || noop;
    this.onMove = options.onMove || noop;
    this.onEnd = options.onEnd || noop;

    this.removeListener = null;
  }
  private bind() {
    this.el.addEventListener('touchstart', (e: TouchEvent) => {
      const { pageX: x, pageY: y } = e.touches[0];
      this.x1 = x;
      this.y1 = y;

      const moveFn = this.onPointerMove.bind(this);
      const upFn = this.onPointerUp.bind(this);
      window.addEventListener('touchmove', moveFn, { passive: false });
      window.addEventListener('touchend', upFn);
      window.addEventListener('touchcancel', upFn);
      this.removeListener = () => {
        window.removeEventListener('touchmove', moveFn);
        window.removeEventListener('touchend', upFn);
        window.removeEventListener('touchcancel', upFn);
      };
      this.onStart(
        {
          x,
          y,
        },
        e
      );
    });
  }
  private onPointerMove(e: TouchEvent) {
    const { pageX: x, pageY: y } = e.touches[0];
    let dx = x - this.x1;
    let dy = y - this.y1;
    this.onMove(
      {
        x,
        y,
        dx,
        dy,
      },
      e
    );
  }
  private onPointerUp(e: TouchEvent) {
    const { pageX: x, pageY: y } = e.changedTouches[0];
    let dx = x - this.x1;
    let dy = y - this.y1;
    this.onEnd(
      {
        x,
        y,
        dx,
        dy,
      },
      e
    );
    if (this.removeListener) {
      this.removeListener();
    }
  }
}
